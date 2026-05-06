import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import RefreshHandler from "./components/RefreshHandler";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "RecipeGenie",
  description: "Generate delicious recipes using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${poppins.className} min-h-full flex flex-col`}>
        <RefreshHandler/>
        {children}
      </body>
    </html>
  );
}