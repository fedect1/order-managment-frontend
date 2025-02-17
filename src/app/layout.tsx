import type { Metadata } from "next";
import { Noto_Sans_Display } from "next/font/google";
import "./globals.css";

const noto = Noto_Sans_Display({
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Dashboard Order Manager | Inno Plast",
  description: "Application for the management of orders and materials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${noto.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
