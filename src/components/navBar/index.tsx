"use client";

import { ModeToggle } from "@/components/mode-toggle";
import AdminLink from "@/components/navBar/adminLink";
import NormalLink from "@/components/navBar/items/link/normal";
import NavBarSearch from "@/components/navBar/search";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, type FC } from "react";
import MobileLink from "./items/link/mobile";

const NavBar: FC = () => {
  const pathname = usePathname().toLowerCase();

  if (pathname.startsWith("/admin")) return null;

  // is month June
  const logo = new Date().getMonth() === 5 ? "/logo-pride.png" : "/logo.png";

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-muted/40 px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Image
            src={logo}
            alt="Games Recaped Logo"
            width={50}
            height={50}
            className="size-14 object-contain"
          />
          <span className="sr-only">Games Recaped</span>
        </Link>

        <NormalLink title="Home" href="/" pathname={pathname} />

        <Suspense>
          <AdminLink pathname={pathname} />
        </Suspense>
        {/* <Link
          href="/faq"
          className={cn([
            "text-muted-foreground transition-colors hover:text-foreground",
            {
              "text-foreground": pathname === "/faq",
            },
          ])}
        >
          FAQ
        </Link> */}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Image
                src={logo}
                alt="Games Recaped Logo"
                width={50}
                height={50}
                className="size-12 object-contain"
              />
              <span className="sr-only">Games Recaped</span>
            </Link>
            <MobileLink title="Home" href="/" pathname={pathname} />

            <Suspense>
              <AdminLink pathname={pathname} />
            </Suspense>
            {/* <Link
              href="/faq"
              className={cn([
                "text-muted-foreground hover:text-foreground",
                {
                  "text-foreground": pathname === "/faq",
                },
              ])}
            >
              FAQ
            </Link> */}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <Suspense fallback={null}>
          <NavBarSearch />
        </Suspense>

        <ModeToggle />
      </div>
    </header>
  );
};

export default NavBar;
