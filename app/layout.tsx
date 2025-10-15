import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { clsx } from "clsx";
import React from "react";
import { StyleRegistry } from "@/lib";
import "./globals.scss";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "component-copilot",
  description: "component-copilot",
};

const RootLayout: React.FC<Readonly<React.PropsWithChildren>> = props => {
  const { children } = props;
  return (
    <html lang="en">
      <body className={clsx(geistSans.variable, geistMono.variable, "antialiased")}>
        <StyleRegistry>{children}</StyleRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
