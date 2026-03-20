"use client";

import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        className="min-h-screen bg-background text-foreground antialiased"
        style={{ fontFamily: "Geom" }}
      >
        <main className="relative flex flex-col min-h-screen items-center justify-center overflow-hidden px-6 py-12">
          <Image src="/full-logo.png" height={150} width={150} alt="Full logo" className="mb-10"/>
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_45%)]" />
          <Card className="relative z-10 w-full max-w-xl border-border/60 bg-card/95 backdrop-blur-sm">
            <CardHeader className="items-center text-center">
              <div className="mb-2 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <AlertTriangle className="h-7 w-7" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl">
                Something went wrong
              </CardTitle>
              <CardDescription className="max-w-md text-sm sm:text-base">
                We hit an unexpected error while loading this page. You can try
                again or head back home.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-xl border border-border/60 bg-muted/40 p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Scanzie hit a snag.</p>
                <p className="mt-1 wrap-break-words">
                  {error.message || "An unexpected application error occurred."}
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={reset} className="w-full sm:w-auto">
                <RotateCcw className="h-4 w-4" />
                Try again
              </Button>

              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/">
                  <Home className="h-4 w-4" />
                  Go home
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </main>
      </body>
    </html>
  );
}
