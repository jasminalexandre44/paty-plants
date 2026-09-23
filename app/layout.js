import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Paty Plants — Katalog Tanaman",
  description:
    "Katalog tanaman digital dengan QR code — pindai untuk mengenal setiap tanaman.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body
        className={`${fraunces.variable} ${inter.variable} font-body bg-parchment text-bark antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
