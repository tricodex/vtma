import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Roboto } from "next/font/google";
import "./globals.css";

// Professional medical fonts based on industry research
const medicalSans = Inter({
  variable: "--font-medical-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: 'swap',
});

const medicalMono = JetBrains_Mono({
  variable: "--font-medical-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: 'swap',
});

// Backup font for enhanced readability
const robotoSans = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "VTMA - Veterinaire Thermografie Medische Administratie",
  description: "AI-gestuurde administratie-app voor veterinaire thermografie die de werkdruk van dierenartsen vermindert",
  keywords: ["veterinaire thermografie", "medische administratie", "dierenarts", "AI", "thermogram analyse"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${medicalSans.variable} ${medicalMono.variable} ${robotoSans.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
