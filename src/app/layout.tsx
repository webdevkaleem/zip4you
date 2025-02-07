import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import MainLayout from "@/components/main-layout";
import NavBar from "@/components/nav-bar";
import { env } from "@/env";
import { cn } from "@/lib/utils";
import { TRPCReactProvider } from "@/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";

import { Toaster } from "@/components/ui/toaster";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Zip4You",
  description:
    "This is an open-source file distributor designed to facilitate file sharing among users without requiring account creation. It’s a simple solution for distributing files quickly and efficiently. ",
  icons: [{ rel: "icon", url: "/favicon.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body
          className={cn("text-lg font-light", {
            "debug-screens": env.NODE_ENV === "development",
          })}
        >
          <SpeedInsights />
          <Analytics />
          <NextSSRPlugin
            /**
             * The `extractRouterConfig` will extract **only** the route configs
             * from the router to prevent additional information from being
             * leaked to the client. The data passed to the client is the same
             * as if you were to fetch `/api/uploadthing` directly.
             */
            routerConfig={extractRouterConfig(ourFileRouter)}
          />
          <TRPCReactProvider>
            <Toaster />
            <MainLayout className="flex flex-col gap-16">
              <NavBar />
              {children}
            </MainLayout>
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
