import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Décrypter l'Assemblée",
  description: "Explorez les votes et les positions des députés français à l'Assemblée nationale (16e et 17e législature).",
  icons: { icon: "/bourbon.svg" },
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
