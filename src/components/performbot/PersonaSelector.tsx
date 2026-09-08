"use client";

export function PersonaSelector({
  onEscolher,
}: {
  onEscolher: (persona: "gestor" | "colaborador") => void;
}) {
  return (
    <div className="flex h-full min-h-screen items-center justify-center bg-[#fdfdfc] px-6">
      <div className="w-full max-w-xl">
        <h1
          className="mb-2 text-2xl text-[#1a1a1a]"
          style={{ fontFamily: "var(--font-serif-report)" }}
        >
          PerformBot
        </h1>
        <p className="mb-10 text-sm text-[#6b6a63]">
          Protótipo navegável — escolha de qual ponto de vista explorar o produto.
        </p>

        <button
          onClick={() => onEscolher("gestor")}
          className="block w-full border-t border-[#e2e0da] py-6 text-left transition-colors hover:bg-[#1a1a1a]/[0.02]"
        >
          <p className="text-lg text-[#1a1a1a]" style={{ fontFamily: "var(--font-serif-report)" }}>
            Jornada gestor
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[#6b6a63]">
            A leitura quinzenal da Gabi sobre o time — sinal do time inteiro, decisões
            estruturais e individuais, evidência por trás de cada uma.
          </p>
        </button>

        <button
          onClick={() => onEscolher("colaborador")}
          className="block w-full border-t border-b border-[#e2e0da] py-6 text-left transition-colors hover:bg-[#1a1a1a]/[0.02]"
        >
          <p className="text-lg text-[#1a1a1a]" style={{ fontFamily: "var(--font-serif-report)" }}>
            Jornada colaborador
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[#6b6a63]">
            A visão do Carlos sobre o próprio desempenho — comparação anônima com pares,
            evidência do próprio gap, e ações de desenvolvimento que ele mesmo escolhe.
          </p>
        </button>
      </div>
    </div>
  );
}
