"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

type NavItem = {
  label: string;
  href: string;
};

const navItens: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Consulta", href: "/consulta" },
  { label: "Contato", href: "/contato" },
];

export function Header() {
    const [open, setOpen] = useState(false);

    //Logica para sheet automatico;
    useEffect(() => {
        const handleResize = () => {
            if(window.innerWidth >= 768){
                setOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-background shadow-sm">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center h-8 w-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-black">
            <Image
              src="/images/Prancheta 1GUERRAGRUPO.png"
              alt="Logo"
              width={32}
              height={32}
              className="h-5 w-5 sm:h-7 sm:w-7 md:h-9 md:w-9 object-contain"
            />
          </div>

          <span className="text-lg sm:text-xl md:text-2x1 font-bold">
            {" "}
            NomeSite
          </span>
        </Link>

        {/* Menu para Desktop */}
        <div className="hidden md:flex space-x-4">
          {navItens.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                // condicional para página ativa se quiser
                item.href === "/" ? "text-primary" : "text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Menu para Mobile */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-1/2 sm:w-1/4">
              <div className="flex flex-col items-center justify-center mt-8">
                {navItens.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-3 py-2 rounded-md text-lg font-medium hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
