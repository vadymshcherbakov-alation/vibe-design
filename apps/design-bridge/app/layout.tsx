import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import "./globals.css";
import { ClientLayout } from "./client-layout";

export const metadata: Metadata = {
  title: "MUI Morpheus Showcase",
  description: "Component showcase using the Alation Morpheus design system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ClientLayout>{children}</ClientLayout>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
