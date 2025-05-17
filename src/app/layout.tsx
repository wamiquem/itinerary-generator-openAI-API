import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Itinerary Generator",
  description: "Generate Itinerary with prompts (OpenAI API to generate)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
