import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
//import GoogleAnalytics from "./components/GoogleAnalytics";

const font = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta
        className="viewport"
        content="width=device-width, initial-scale=1.0"></meta>
      <body className={`${font.className} antialiased`}>
        {/* <GoogleAnalytics /> */}
        {children}
      </body>
    </html>
  );
}
