"use client";
import { useState } from "react";
import { ICPArchetype, BrandParameters } from "@/lib/types";
import { buildPrompt } from "@/lib/prompts";

const CANAL_OPTIONS = ["Instagram", "LinkedIn", "Email", "WhatsApp"];
const FORMATOS: Record<string, string[]> = {
  Instagram: ["Post", "Carrossel", "Story", "Reels"],
  LinkedIn: ["Post", "Artigo", "Carrossel"],
  Email: ["E-mail único", "Sequência"],
  WhatsApp: ["Mensagem única", "Sequência"],
};
const ESTILO_OPTIONS = ["Só texto", "Só imagem", "Texto e imagem"];

interface Props {
  icps: ICPArchetype[];
  brandParams?: Partial<BrandParameters>;
  onGerar: (prompt: string) => void;
}

export function PainelInputs({ icps, brandParams, onGerar }: Props) {
  const [personaId, setPersonaId] = useState<string>("");
  const [canal, setCanal] = useState("");
  const [formato, setFormato] = useState("");
  const [estilo, setEstilo] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [tema, setTema] = useState("");

  function handleCanalChange(c: string) {
    setCanal(c === canal ? "" : c);
    setFormato(""); // reset formato on canal change
  }

  function handleGerar() {
    const persona = icps.find(i => i.id === personaId) ?? null;
    const prompt = buildPrompt({ persona, canal, formato, estilo, objetivo, tema, brandParams });
    onGerar(prompt);
  }

  const canGenerate = canal.trim() !== "" && tema.trim() !== "";

  return (
    <aside className="w-[320px] shrink-0 h-full flex flex-col bg-white border-r border-[#e8e8e4]">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">

        {/* Persona */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Persona</label>
          {icps.length === 0 ? (
            <p className="text-xs text-gray-300">Nenhuma persona ativa em Parâmetros.</p>
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
            {CANAL_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => handleCanalChange(opt)}
                className={`px-3 py-1.5 rounded-[8px] text-sm border transition ${
                  canal === opt
                    ? "border-[#1a6b5a] bg-[#f0f7f5] text-[#1a6b5a] font-medium"
                    : "border-[#e8e8e4] text-gray-500 hover:bg-gray-50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Formato — só aparece se canal selecionado */}
        {canal && (
          <>
            <div className="border-t border-[#e8e8e4]" />
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Formato</label>
              <div className="flex flex-wrap gap-1.5">
                {(FORMATOS[canal] ?? []).map(opt => (
                  <button
                    key={opt}
                    onClick={() => setFormato(opt === formato ? "" : opt)}
                    className={`px-3 py-1.5 rounded-[8px] text-sm border transition ${
                      formato === opt
                        ? "border-[#1a6b5a] bg-[#f0f7f5] text-[#1a6b5a] font-medium"
                        : "border-[#e8e8e4] text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="border-t border-[#e8e8e4]" />

        {/* Estilo */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Estilo</label>
          <div className="flex flex-wrap gap-1.5">
            {ESTILO_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => setEstilo(opt === estilo ? "" : opt)}
                className={`px-3 py-1.5 rounded-[8px] text-sm border transition ${
                  estilo === opt
                    ? "border-[#1a6b5a] bg-[#f0f7f5] text-[#1a6b5a] font-medium"
                    : "border-[#e8e8e4] text-gray-500 hover:bg-gray-50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-[#e8e8e4]" />

        {/* Objetivo */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Objetivo</label>
          <textarea
            value={objetivo}
            onChange={e => setObjetivo(e.target.value)}
            rows={3}
            placeholder="Ex: gerar leads qualificados, nutrir base, converter trial..."
            className="w-full rounded-[8px] border border-[#e8e8e4] px-3 py-2 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-[#1a6b5a]/30 focus:border-[#1a6b5a] transition placeholder:text-gray-300"
          />
        </div>

        <div className="border-t border-[#e8e8e4]" />

        {/* Tema */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Tema / Assunto</label>
          <textarea
            value={tema}
            onChange={e => setTema(e.target.value)}
            rows={3}
            placeholder="Ex: lançamento da funcionalidade X, relatório de mercado Q1..."
            className="w-full rounded-[8px] border border-[#e8e8e4] px-3 py-2 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-[#1a6b5a]/30 focus:border-[#1a6b5a] transition placeholder:text-gray-300"
          />
        </div>

      </div>

      {/* Sticky Gerar button */}
      <div className="px-5 py-4 border-t border-[#e8e8e4] bg-white">
        <button
          onClick={handleGerar}
          disabled={!canGenerate}
          className="w-full py-2.5 rounded-[8px] bg-[#1a6b5a] text-white text-sm font-medium hover:bg-[#155a4a] transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Gerar conteúdo
        </button>
        {!canGenerate && (
          <p className="text-xs text-gray-300 text-center mt-2">Selecione canal e preencha o tema</p>
        )}
      </div>
    </aside>
  );
}
