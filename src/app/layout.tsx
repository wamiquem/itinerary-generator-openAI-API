import type { Metadata } from "next";
import { Toolbar } from "@mui/material";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Itinerary Generator",
  description: "Generate Itinerary from descriptive text",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <Toolbar />
        {children}
      </body>
    </html>
  );
}
