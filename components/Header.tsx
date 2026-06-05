"use client";

import { useState } from "react";

type HeaderVariant = "home" | "back";

export default function Header({ variant = "home" }: { variant?: HeaderVariant }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-0.01em", color: "#111" }}>
            Décrypter l&apos;Assemblée
          </div>
          <div style={{ fontSize: "0.62rem", color: "#aaa", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>
            16e &amp; 17e législature · 2022–aujourd&apos;hui
          </div>
        </a>

        {/* Desktop nav */}
        {variant === "home" ? (
          <nav className="header-nav-desktop">
            <a href="#investigations" className="nav-link">Investigations</a>
            <a href="/faq" className="nav-link">FAQ</a>
            <a href="/contact" className="nav-link">Contact</a>
            <a href="#chat" className="nav-link nav-link-cta">Poser une question</a>
          </nav>
        ) : (
          <nav className="header-nav-desktop">
            <a href="/faq" className="nav-link">FAQ</a>
            <a href="/contact" className="nav-link">Contact</a>
            <a href="/" className="nav-link">← Toutes les investigations</a>
          </nav>
        )}

        {/* Hamburger button (mobile only) */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`hamburger-line ${menuOpen ? "open-1" : ""}`} />
          <span className={`hamburger-line ${menuOpen ? "open-2" : ""}`} />
          <span className={`hamburger-line ${menuOpen ? "open-3" : ""}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="mobile-menu">
          {variant === "home" ? (
            <>
              <a href="#investigations" className="mobile-link" onClick={() => setMenuOpen(false)}>Investigations</a>
              <a href="/faq" className="mobile-link" onClick={() => setMenuOpen(false)}>FAQ</a>
              <a href="/contact" className="mobile-link" onClick={() => setMenuOpen(false)}>Contact</a>
              <a href="#chat" className="mobile-link mobile-link-cta" onClick={() => setMenuOpen(false)}>Poser une question</a>
            </>
          ) : (
            <>
              <a href="/faq" className="mobile-link" onClick={() => setMenuOpen(false)}>FAQ</a>
              <a href="/contact" className="mobile-link" onClick={() => setMenuOpen(false)}>Contact</a>
              <a href="/" className="mobile-link" onClick={() => setMenuOpen(false)}>← Toutes les investigations</a>
            </>
          )}
        </div>
      )}
    </header>
  );
}
