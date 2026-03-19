"use client";

interface Props {
  output: string;
  isGenerating: boolean;
}

export function PainelOutput({ output, isGenerating }: Props) {
  if (isGenerating) {
    return (
      <div className="flex-1 bg-[#f9f9f7] flex items-center justify-center">
        <p className="text-sm text-gray-400">Gerando...</p>
      </div>
    );
  }

  if (!output) {
    return (
      <div className="flex-1 bg-[#f9f9f7] flex items-center justify-center">
        <div className="text-center max-w-xs">
          <div className="text-3xl mb-3">✦</div>
          <p className="text-sm font-medium text-gray-500">Pronto para gerar</p>
          <p className="text-xs text-gray-300 mt-1">
            Selecione os parâmetros no painel e clique em Gerar conteúdo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#f9f9f7] overflow-y-auto p-8">
      <div className="max-w-[680px] mx-auto">
        <div
          className="bg-white rounded-[10px] border border-[#e8e8e4] p-8"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Briefing gerado
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
  );
}
