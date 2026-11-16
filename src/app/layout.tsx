import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Lucrix — Sua Operação no Lucro",
  description: "Software de Gestão Empresarial, Vendas, Estoque e Finanças para Empreendedores e Revendedores.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Lucrix",
  },
};

export const viewport: Viewport = {
  themeColor: "#080B11",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-screen bg-dark-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-dark-950">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
