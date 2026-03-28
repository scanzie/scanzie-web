"use client";

import Image from "next/image";
import Link from "next/link";
import { Github, Menu } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

const navLinks = [
  { href: "/support", label: "Support" },
  { href: "/terms", label: "Terms" },
];

const githubLink = {
  href: "https://github.com/scanzie",
  label: "Github",
};

const Header = () => {
  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-gray-300/50 bg-white/70 backdrop-blur-xl">
      <div className="app-container flex h-[72px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/favicon.png" alt="Logo" height={25} width={25} />
          <span className="text-lg font-bold sm:text-xl">Scanzie</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <Link
            href={githubLink.href}
            target="_blank"
            className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-200"
          >
            <Github className="h-5 w-5" />
            <span>{githubLink.label}</span>
          </Link>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-200"
            >
              {link.label}
            </Link>
          ))}

          <Link href="/login">
            <Button className="px-5">Get started</Button>
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Link href="/login">
            <Button size="sm" className="px-4">
              Get started
            </Button>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm transition-colors hover:bg-slate-50"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[88%] border-l border-slate-300 bg-white px-0 sm:max-w-sm"
            >
              <SheetHeader className="border-b border-slate-300 px-6 py-5 text-left">
                <div className="flex items-center gap-3">
                  <Image src="/favicon.png" alt="Logo" height={28} width={28} />
                  <SheetTitle className="text-xl font-bold text-slate-950">
                    Scanzie
                  </SheetTitle>
                </div>
                <SheetDescription className="text-sm text-slate-700">
                  SEO tools built to help you audit faster and act with clarity.
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-1 flex-col px-4 py-5">
                <div className="space-y-2">
                  <SheetClose asChild>
                    <Link
                      href={githubLink.href}
                      target="_blank"
                      className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 text-base font-semibold text-slate-950 transition-colors hover:border-slate-300 hover:bg-slate-100"
                    >
                      <span className="flex items-center gap-3">
                        <Github className="h-5 w-5 text-slate-900" />
                        {githubLink.label}
                      </span>
                      <span className="text-sm font-medium text-slate-600">
                        External
                      </span>
                    </Link>
                  </SheetClose>

                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center rounded-2xl border border-slate-200 px-4 py-4 text-base font-semibold text-slate-950 transition-colors hover:border-slate-300 hover:bg-slate-100"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </div>

                <div className="mt-auto px-2 pt-6">
                  <SheetClose asChild>
                    <Link href="/login" className="block">
                      <Button className="w-full">Get started</Button>
                    </Link>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
