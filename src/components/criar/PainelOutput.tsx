"use client";

interface Props {
  objetivo: string;    setObjetivo: (v: string) => void;
  tema: string;        setTema: (v: string) => void;
  output: string;
  isGenerating: boolean;
  error: string;
}

export function PainelOutput({ objetivo, setObjetivo, tema, setTema, output, isGenerating, error }: Props) {
  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden bg-[#f9f9f7]">

      {/* ── Linha de inputs: Objetivo + Tema ──────────────────────────────── */}
      <div className="shrink-0 flex gap-4 px-6 py-4 bg-white border-b border-[#e8e8e4]">
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Objetivo da mensagem
          </label>
          <textarea
            value={objetivo}
            onChange={e => setObjetivo(e.target.value)}
            rows={3}
            placeholder="Ex: gerar leads qualificados, nutrir base, converter trial..."
            className="w-full rounded-[8px] border border-[#e8e8e4] px-3 py-2 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-[#1a6b5a]/30 focus:border-[#1a6b5a] transition placeholder:text-gray-300 bg-[#f9f9f7]"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Tema / Assunto <span className="text-[#1a6b5a]">*</span>
          </label>
          <textarea
            value={tema}
            onChange={e => setTema(e.target.value)}
            rows={3}
            placeholder="Ex: lançamento da funcionalidade X, relatório de mercado Q1..."
            className="w-full rounded-[8px] border border-[#e8e8e4] px-3 py-2 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-[#1a6b5a]/30 focus:border-[#1a6b5a] transition placeholder:text-gray-300 bg-[#f9f9f7]"
          />
        </div>
      </div>

      {/* ── Área de output ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {isGenerating && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block w-5 h-5 border-2 border-[#1a6b5a] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm text-gray-400">Gerando conteúdo...</p>
            </div>
          </div>
        )}

        {!isGenerating && error && (
          <div className="h-full flex items-center justify-center px-8">
            <div className="bg-white border border-red-100 rounded-[10px] p-6 text-center max-w-sm" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <p className="text-sm font-medium text-red-500 mb-1">Erro ao gerar</p>
              <p className="text-xs text-gray-400">{error}</p>
            </div>
          </div>
        )}

        {!isGenerating && !error && !output && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-xs">
              <div className="text-3xl mb-3">✦</div>
              <p className="text-sm font-medium text-gray-500">Pronto para gerar</p>
              <p className="text-xs text-gray-300 mt-1">
                Selecione os parâmetros no painel e clique em Gerar conteúdo.
              </p>
            </div>
          </div>
        )}

        {!isGenerating && !error && output && (
          <div className="p-8">
            <div className="max-w-[680px] mx-auto">
              <div
                className="bg-white rounded-[10px] border border-[#e8e8e4] p-8"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                    Conteúdo gerado
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(output)}
                    className="text-xs text-[#1a6b5a] hover:underline"
                  >
                    Copiar
                  </button>
                </div>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {output}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
