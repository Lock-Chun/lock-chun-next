import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ChatWidgetContainer from "./components/ChatWidgetContainer"; // Import the new container
//import GoogleAnalytics from "./components/GoogleAnalytics";

const font = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lock Chun Chinese Cuisine", // Update title
  description: "Family-owned Chinese-American restaurant in Santa Clara, CA.", // Update description
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
        <ChatWidgetContainer />
      </body>
    </html>
  );
}
