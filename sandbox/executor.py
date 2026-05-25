"""
Exécuteur de code Python dans le sandbox Docker.
Expose execute(code, timeout) -> dict{stdout, stderr, error}.

Les variables `conn` (sqlite3.Connection) et `query(sql, params)` sont
disponibles dans le code exécuté sans import.
"""

import io
import signal
import sqlite3
import traceback
from contextlib import redirect_stderr, redirect_stdout

DB_PATH = "/data/an.db"


def make_globals() -> dict:
    conn = sqlite3.connect(f"file:{DB_PATH}?mode=ro", uri=True)
    conn.row_factory = sqlite3.Row

    def query(sql: str, params: tuple = ()) -> list[dict]:
        return [dict(r) for r in conn.execute(sql, params).fetchall()]

    return {
        "sqlite3": sqlite3,
        "conn": conn,
        "query": query,
        "__builtins__": __builtins__,
    }


class _Timeout(Exception):
    pass


def _timeout_handler(signum, frame):
    raise _Timeout("Timeout dépassé")


def execute(code: str, timeout: int = 30) -> dict:
    stdout_buf = io.StringIO()
    stderr_buf = io.StringIO()

    signal.signal(signal.SIGALRM, _timeout_handler)
    signal.alarm(timeout)

    try:
        globs = make_globals()
        with redirect_stdout(stdout_buf), redirect_stderr(stderr_buf):
            exec(code, globs)  # noqa: S102
        signal.alarm(0)
        return {"stdout": stdout_buf.getvalue(), "stderr": stderr_buf.getvalue(), "error": None}
    except _Timeout as e:
        return {"stdout": stdout_buf.getvalue(), "stderr": "", "error": f"TimeoutError: {e}"}
    except Exception:
        signal.alarm(0)
        return {
            "stdout": stdout_buf.getvalue(),
            "stderr": stderr_buf.getvalue(),
            "error": traceback.format_exc(),
        }
