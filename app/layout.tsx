import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Generador de Propuestas Comerciales",
  description:
    "Genera propuestas comerciales premium en HTML interactivo. Diseño minimalista negro + naranja.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
