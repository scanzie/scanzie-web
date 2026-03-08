"use client";

import Link from "next/link";
import { Compass, Home, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12 text-foreground antialiased">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_45%)] " />

      <Card className="relative z-10 w-full max-w-xl border-border/60 bg-card/95 backdrop-blur-sm">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-blue-500">
            <Compass className="h-7 w-7" />
          </div>
          <p className="text-sm font-semibold tracking-[0.2em] text-muted-foreground">
            404 ERROR
          </p>
          <CardTitle className="text-2xl sm:text-3xl">
            Page not found
          </CardTitle>
          <CardDescription className="max-w-md text-sm sm:text-base">
            The page you&apos;re looking for doesn&apos;t exist, may have moved,
            or is no longer available.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-xl border border-border/60 bg-muted/40 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Let&apos;s get you back on track.</p>
            <p className="mt-1">
              Try returning home or starting a fresh search from the dashboard.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/">
              <Home className="h-4 w-4" />
              Go home
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/dashboard">
              <Search className="h-4 w-4" />
              Open dashboard
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
