import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Premium Auth System | Next.js + Strapi",
  description: "A state-of-the-art authentication system built with Next.js and Strapi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
