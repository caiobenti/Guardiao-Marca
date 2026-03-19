"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/criar", label: "Criar Conteúdo" },
  { href: "/parametros", label: "Parâmetros" },
  { href: "/parametro-ia", label: "Parâmetro IA" },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="h-14 bg-white border-b border-[#e8e8e4] flex items-center px-6 gap-8 sticky top-0 z-20">
      <span className="text-sm font-bold text-gray-900 tracking-tight shrink-0">
        Guardião da Marca
      </span>
      <nav className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-[8px] text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#f0f7f5] text-[#1a6b5a]"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
