"use client";

type Persona = "gestor" | "colaborador";

export function PersonaSelector({
  onEscolher,
  carregando,
}: {
  onEscolher: (persona: Persona) => void;
  carregando: Persona | null;
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
          disabled={carregando !== null}
          className="block w-full border-t border-[#e2e0da] py-6 text-left transition-colors hover:bg-[#1a1a1a]/[0.02] disabled:pointer-events-none"
        >
          <p className="flex items-center gap-2 text-lg text-[#1a1a1a]" style={{ fontFamily: "var(--font-serif-report)" }}>
            Jornada gestor
            {carregando === "gestor" && (
              <span className="font-sans text-xs text-[#6b6a63]">Carregando…</span>
            )}
          </p>
          <p
            className={`mt-1 text-sm leading-relaxed text-[#6b6a63] transition-opacity ${
              carregando === "gestor" ? "opacity-40" : ""
            }`}
          >
            A leitura quinzenal da Gabi sobre o time — sinal do time inteiro, decisões
            estruturais e individuais, evidência por trás de cada uma.
          </p>
        </button>

        <button
          onClick={() => onEscolher("colaborador")}
          disabled={carregando !== null}
          className="block w-full border-t border-b border-[#e2e0da] py-6 text-left transition-colors hover:bg-[#1a1a1a]/[0.02] disabled:pointer-events-none"
        >
          <p className="flex items-center gap-2 text-lg text-[#1a1a1a]" style={{ fontFamily: "var(--font-serif-report)" }}>
            Jornada colaborador
            {carregando === "colaborador" && (
              <span className="font-sans text-xs text-[#6b6a63]">Carregando…</span>
            )}
          </p>
          <p
            className={`mt-1 text-sm leading-relaxed text-[#6b6a63] transition-opacity ${
              carregando === "colaborador" ? "opacity-40" : ""
            }`}
          >
            A visão do Carlos sobre o próprio desempenho — comparação anônima com pares,
            evidência do próprio gap, e ações de desenvolvimento que ele mesmo escolhe.
          </p>
        </button>
      </div>
    </div>
  );
}
