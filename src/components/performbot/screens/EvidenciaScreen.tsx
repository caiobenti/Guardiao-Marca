"use client";

import { VoltarHeader } from "../ChatShell";
import { EvidenciaLogTable, LIGACOES, REFERENCIA_TIME_QUEBRADAS, contarQuebradas } from "../EvidenciaLog";
import { Button } from "../ui";
import { STATUS_COLOR } from "../theme";

export function EvidenciaScreen({
  onVoltar,
  onAceitar,
  onAjustar,
}: {
  onVoltar: () => void;
  onAceitar: () => void;
  onAjustar: () => void;
}) {
  const quebradas = contarQuebradas();

  return (
    <div className="h-full overflow-y-auto">
      <VoltarHeader label="Voltar" onVoltar={onVoltar} />
      <div className="mx-auto max-w-2xl px-6 py-8 sm:px-10">
        <h1
          className="mb-1 flex items-center gap-2 text-xl text-[#1a1a1a]"
          style={{ fontFamily: "var(--font-serif-report)" }}
        >
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: STATUS_COLOR.abaixo }}
          />
          Carlos — Quebra de objeção
        </h1>
        <p className="mb-8 text-sm text-[#6b6a63]">Fora da faixa esperada há 3 quinzenas.</p>

        <div className="border-t border-[#e2e0da] pt-5">
          <p className="mb-3 text-sm text-[#1a1a1a]">
            Carlos só conseguiu quebrar a objeção em{" "}
            <span className="font-mono">{quebradas}</span> das{" "}
            <span className="font-mono">{LIGACOES.length}</span> últimas reuniões.
          </p>
          <EvidenciaLogTable />
        </div>

        <div className="border-t border-[#e2e0da] pt-5">
          <p className="text-sm text-[#1a1a1a]">
            Carlos: <span className="font-mono">{quebradas}</span> de{" "}
            <span className="font-mono">{LIGACOES.length}</span> quebradas · Referência do time:{" "}
            <span className="font-mono">{REFERENCIA_TIME_QUEBRADAS}</span> de{" "}
            <span className="font-mono">{LIGACOES.length}</span> quebradas
          </p>
          <p className="mt-2 text-sm text-[#1a1a1a]">
            Carlos é o único fora da faixa nessa dimensão essa quinzena.
          </p>
        </div>

        <div className="border-t border-[#e2e0da] pt-5">
          <p className="mb-1 text-sm text-[#1a1a1a]">Plano sugerido</p>
          <p className="text-[15px] leading-relaxed text-[#1a1a1a]">
            Sessão de role-play 1:1 com você (Gabi), usando 2 exemplos reais das próprias
            ligações do Carlos.
          </p>
        </div>

        <div className="flex gap-2 border-t border-[#e2e0da] pt-5">
          <Button onClick={onAceitar}>Aceitar plano</Button>
          <Button variant="secondary" onClick={onAjustar}>
            Ajustar plano
          </Button>
        </div>
      </div>
    </div>
  );
}
