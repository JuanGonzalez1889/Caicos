import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import NavigationLoader from "@/components/NavigationLoader";
import PageTransition from "@/components/PageTransition";
import { Suspense } from "react";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], display: "swap", variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: "CAICOS Multieventos | Tu evento, nuestra especialidad",
  description: "Descubrí las experiencias de CAICOS Multieventos y consultá una fecha para tu próximo evento.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-AR" className={montserrat.variable}><body><NavigationLoader>{children}</NavigationLoader><Suspense fallback={null}><PageTransition /></Suspense></body></html>;
}
