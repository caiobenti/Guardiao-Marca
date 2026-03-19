"use client";
import { ICPArchetype } from "@/lib/types";

const CANAL_OPTIONS = ["Instagram", "LinkedIn", "Email", "WhatsApp"];
const FORMATOS: Record<string, string[]> = {
  Instagram: ["Post", "Carrossel", "Story", "Reels"],
  LinkedIn:  ["Post", "Artigo", "Carrossel"],
  Email:     ["E-mail único", "Sequência"],
  WhatsApp:  ["Mensagem única", "Sequência"],
};
const ESTILO_OPTIONS = ["Só texto", "Só imagem", "Texto e imagem"];

interface Props {
  icps: ICPArchetype[];
  personaId: string;    setPersonaId: (v: string) => void;
  canal: string;        setCanal: (v: string) => void;
  formato: string;      setFormato: (v: string) => void;
  estilo: string;       setEstilo: (v: string) => void;
  canGenerate: boolean;
  onGerar: () => void;
  isGenerating: boolean;
}

export function PainelInputs({
  icps, personaId, setPersonaId,
  canal, setCanal, formato, setFormato, estilo, setEstilo,
  canGenerate, onGerar, isGenerating,
}: Props) {

  function pill(label: string, active: boolean, onClick: () => void) {
    return (
      <button
        key={label}
        onClick={onClick}
        className={`px-3 py-1.5 rounded-[8px] text-sm border transition ${
          active
            ? "border-[#1a6b5a] bg-[#f0f7f5] text-[#1a6b5a] font-medium"
            : "border-[#e8e8e4] text-gray-500 hover:bg-gray-50"
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <aside className="w-[272px] shrink-0 h-full flex flex-col bg-white border-r border-[#e8e8e4]">
      {/* Scrollable selections */}
      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">

        {/* Persona */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Persona</label>
          {icps.length === 0 ? (
            <p className="text-xs text-gray-300 leading-relaxed">
              Nenhuma persona ativa.<br />Cadastre em Parâmetros.
            </p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {icps.map(icp => (
                <button
                  key={icp.id}
                  onClick={() => setPersonaId(icp.id === personaId ? "" : icp.id)}
                  className={`px-3 py-2 rounded-[8px] text-sm text-left border transition ${
                    personaId === icp.id
                      ? "border-[#1a6b5a] bg-[#f0f7f5] text-[#1a6b5a] font-medium"
                      : "border-[#e8e8e4] text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {icp.icp_name ?? "Sem nome"}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-[#e8e8e4]" />

        {/* Canal */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Canal</label>
          <div className="flex flex-wrap gap-1.5">
            {CANAL_OPTIONS.map(opt =>
              pill(opt, canal === opt, () => setCanal(canal === opt ? "" : opt))
            )}
          </div>
        </div>

        {/* Formato — só se canal selecionado */}
        {canal && (
          <>
            <div className="border-t border-[#e8e8e4]" />
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Formato</label>
              <div className="flex flex-wrap gap-1.5">
                {(FORMATOS[canal] ?? []).map(opt =>
                  pill(opt, formato === opt, () => setFormato(formato === opt ? "" : opt))
                )}
              </div>
            </div>
          </>
        )}

        <div className="border-t border-[#e8e8e4]" />

        {/* Estilo */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Estilo</label>
          <div className="flex flex-wrap gap-1.5">
            {ESTILO_OPTIONS.map(opt =>
              pill(opt, estilo === opt, () => setEstilo(estilo === opt ? "" : opt))
            )}
          </div>
        </div>

      </div>

      {/* Gerar — fixo na base */}
      <div className="px-5 py-4 border-t border-[#e8e8e4] bg-white shrink-0">
        <button
          onClick={onGerar}
          disabled={!canGenerate || isGenerating}
          className="w-full py-2.5 rounded-[8px] bg-[#1a6b5a] text-white text-sm font-medium hover:bg-[#155a4a] transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isGenerating ? "Gerando..." : "Gerar conteúdo"}
        </button>
        {!canGenerate && !isGenerating && (
          <p className="text-xs text-gray-300 text-center mt-2">Selecione canal e preencha o tema</p>
        )}
      </div>
    </aside>
  );
}
