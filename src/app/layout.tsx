import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import StoreProvider from "@/redux/StoreProvider";
import { NextProvider } from "./NextUIProvider";
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
      <body>
        <NextProvider>
          <StoreProvider>
            <NavBar />
            {children}
            <Footer />
          </StoreProvider>
        </NextProvider>
      </body>
    </html>
  );
}
