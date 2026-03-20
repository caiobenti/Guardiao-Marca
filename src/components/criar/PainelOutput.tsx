"use client";

interface Props {
  objetivo: string;    setObjetivo: (v: string) => void;
  tema: string;        setTema: (v: string) => void;
  outputTexto: string;
  outputImagem: string;
  loadingTexto: boolean;
  loadingImagem: boolean;
  erroTexto: string;
  erroImagem: string;
  estilo: string;
  showPromptDebug: boolean;
  setShowPromptDebug: (v: boolean) => void;
  promptTextoDebug: string;
  promptImagemDebug: string;
}

export function PainelOutput({
  objetivo,
  setObjetivo,
  tema,
  setTema,
  outputTexto,
  outputImagem,
  loadingTexto,
  loadingImagem,
  erroTexto,
  erroImagem,
  estilo,
  showPromptDebug,
  setShowPromptDebug,
  promptTextoDebug,
  promptImagemDebug,
}: Props) {
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
      <div className="shrink-0 px-6 py-2 bg-white border-b border-[#e8e8e4]">
        <label className="inline-flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
          <input
            type="checkbox"
            checked={showPromptDebug}
            onChange={(e) => setShowPromptDebug(e.target.checked)}
            className="accent-[#1a6b5a]"
          />
          Mostrar prompt enviado (debug temporário)
        </label>
      </div>

      {/* ── Área de output ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {/* Empty state */}
        {!loadingTexto && !loadingImagem && !outputTexto && !outputImagem && !erroTexto && !erroImagem && (
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

        {/* Content area */}
        {(loadingTexto || loadingImagem || outputTexto || outputImagem || erroTexto || erroImagem) && (
          <div className="p-8 flex flex-col gap-6 max-w-[680px] mx-auto">

            {/* TEXT block */}
            {(estilo !== "Só imagem") && (
              <div className="bg-white rounded-[10px] border border-[#e8e8e4] p-8" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Texto</span>
                  {outputTexto && (
                    <button onClick={() => navigator.clipboard.writeText(outputTexto)} className="text-xs text-[#1a6b5a] hover:underline">
                      Copiar
                    </button>
                  )}
                </div>
                {loadingTexto && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="w-4 h-4 border-2 border-[#1a6b5a] border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Gerando texto...</span>
                  </div>
                )}
                {!loadingTexto && erroTexto && (
                  <p className="text-sm text-red-500">{erroTexto}</p>
                )}
                {!loadingTexto && outputTexto && (
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{outputTexto}</pre>
                )}
                {showPromptDebug && promptTextoDebug && (
                  <details className="mt-6">
                    <summary className="text-xs text-gray-500 cursor-pointer">Prompt enviado para texto</summary>
                    <pre className="mt-3 text-xs text-gray-600 whitespace-pre-wrap font-mono bg-stone-50 border border-stone-200 rounded-lg p-3">
                      {promptTextoDebug}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* IMAGE block */}
            {(estilo === "Só imagem" || estilo === "Texto e imagem") && (
              <div className="bg-white rounded-[10px] border border-[#e8e8e4] p-8" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Imagem</span>
                  {outputImagem && (
                    <a
                      href={outputImagem}
                      download="imagem-gerada.png"
                      className="text-xs text-[#1a6b5a] hover:underline"
                    >
                      Baixar
                    </a>
                  )}
                </div>
                {loadingImagem && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="w-4 h-4 border-2 border-[#1a6b5a] border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Gerando imagem...</span>
                  </div>
                )}
                {!loadingImagem && erroImagem && (
                  <p className="text-sm text-red-500">{erroImagem}</p>
                )}
                {!loadingImagem && outputImagem && (
                  <img
                    src={outputImagem}
                    alt="Imagem gerada"
                    className="w-full rounded-lg"
                  />
                )}
                {showPromptDebug && promptImagemDebug && (
                  <details className="mt-6">
                    <summary className="text-xs text-gray-500 cursor-pointer">Prompt enviado para imagem</summary>
                    <pre className="mt-3 text-xs text-gray-600 whitespace-pre-wrap font-mono bg-stone-50 border border-stone-200 rounded-lg p-3">
                      {promptImagemDebug}
                    </pre>
                  </details>
                )}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
