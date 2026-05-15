import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Décrypter l'Assemblée",
  description: "Explorez les votes, les débats et les positions des députés français de la 16e législature.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
