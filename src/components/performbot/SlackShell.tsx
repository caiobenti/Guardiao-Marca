"use client";

import {
  AtSign,
  Bell,
  Bookmark,
  Hash,
  HelpCircle,
  Home,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  SquarePen,
  Users,
} from "lucide-react";
import { BotAvatar } from "./ChatShell";

const CANAIS = ["geral", "time-sdr", "comercial", "produto", "pessoas", "anúncios", "aleatório"];

const PESSOAS = [
  { nome: "Gabi", cor: "#f97362" },
  { nome: "Rafael", cor: "#0ea5e9" },
  { nome: "Luísa", cor: "#a855f7" },
  { nome: "Pedro", cor: "#22c55e" },
];

function NavItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-[13px] font-medium text-gray-300 hover:bg-white/5">
      {icon}
      {label}
    </button>
  );
}

function PersonAvatar({ nome, cor, size = 28 }: { nome: string; cor: string; size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-md text-xs font-semibold text-white"
      style={{ width: size, height: size, backgroundColor: cor }}
    >
      {nome[0]}
    </span>
  );
}

function Sidebar() {
  return (
    <div className="flex h-full w-64 shrink-0 flex-col bg-[#171526] text-gray-300">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#4f46e5] text-sm font-bold text-white">
          A
        </span>
        <span className="flex-1 truncate text-[15px] font-bold text-white">Acme Corp ⌄</span>
        <SquarePen size={17} className="text-gray-400" />
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className="mb-4 space-y-0.5">
          <NavItem icon={<Home size={17} />} label="Início" />
          <NavItem icon={<MessageSquare size={17} />} label="Mensagens diretas" />
          <NavItem icon={<AtSign size={17} />} label="Menções" />
          <NavItem icon={<Bookmark size={17} />} label="Favoritos" />
          <NavItem icon={<MoreHorizontal size={17} />} label="Mais" />
        </div>

        <div className="mb-1 flex items-center justify-between px-2 py-1">
          <span className="text-[13px] font-semibold text-gray-400">Canais</span>
          <Plus size={15} className="text-gray-400" />
        </div>
        <div className="mb-4 space-y-0.5">
          {CANAIS.map((c) => (
            <button
              key={c}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-gray-300 hover:bg-white/5"
            >
              <Hash size={14} className="text-gray-500" />
              {c}
            </button>
          ))}
        </div>

        <div className="mb-1 flex items-center justify-between px-2 py-1">
          <span className="text-[13px] font-semibold text-gray-400">Mensagens diretas</span>
          <Plus size={15} className="text-gray-400" />
        </div>
        <div className="space-y-0.5">
          <button className="flex w-full items-center gap-2.5 rounded-md bg-[#4f46e5]/25 px-2 py-1.5 text-[13px] font-medium text-white">
            <BotAvatar size={26} />
            PerformBot
          </button>
          {PESSOAS.map((p) => (
            <button
              key={p.nome}
              className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] text-gray-300 hover:bg-white/5"
            >
              <PersonAvatar nome={p.nome} cor={p.cor} />
              {p.nome}
            </button>
          ))}
          <button className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] text-gray-300 hover:bg-white/5">
            <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md bg-gray-600">
              <Users size={14} />
            </span>
            Time de Vendas
          </button>
          <button className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] text-gray-400 hover:bg-white/5">
            <Plus size={15} />
            Adicionar pessoas
          </button>
        </div>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <div className="flex h-14 shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-5">
      <div className="flex flex-1 items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-500">
        <Search size={16} />
        Buscar mensagens, pessoas ou canais...
      </div>
      <HelpCircle size={19} className="shrink-0 text-gray-400" />
      <Bell size={19} className="shrink-0 text-gray-400" />
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f97362] text-xs font-semibold text-white">
        G
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
      </span>
    </div>
  );
}

export function SlackShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full min-h-screen bg-white">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
