import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import "./globals.css";
import { ClientLayout } from "./client-layout";

export const metadata = {
  title: "Alation Design Playground",
  description: "Prototype and explore Alation design system components",
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
