import Link from "next/link";
import {cn} from "@/lib/utils"
import Image from "next/image";

type NavItem = {
  label: string;
  href: string;
};

const navItens: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Consulta", href: "/precos" },
  { label: "Contato", href: "/contato" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background shadow-sm">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-black">
            <Image
              src="/images/Prancheta 1GUERRAGRUPO.png"
              alt="Logo"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
          </div>

          <span className="text-xl font-bold"> NomeSite</span>
        </Link>

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
      </nav>
    </header>
  );
}
