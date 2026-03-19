"use client";
import { useState } from "react";
import { PainelInputs } from "./PainelInputs";
import { PainelOutput } from "./PainelOutput";
import { ICPArchetype, BrandParameters } from "@/lib/types";

interface Props {
  icps: ICPArchetype[];
  brandParams?: Partial<BrandParameters>;
}

export function CriarLayout({ icps, brandParams }: Props) {
  // ── Seleções do painel esquerdo ──────────────────────────────────────────
  const [personaId, setPersonaId] = useState("");
  const [canal, setCanal]         = useState("");
  const [formato, setFormato]     = useState("");
  const [estilo, setEstilo]       = useState("");

  // ── Inputs do painel direito ─────────────────────────────────────────────
  const [objetivo, setObjetivo]   = useState("");
  const [tema, setTema]           = useState("");

  // ── Output ──────────────────────────────────────────────────────────────
  const [output, setOutput]           = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError]         = useState("");

  const canGenerate = canal.trim() !== "" && tema.trim() !== "";

  async function handleGerar() {
    if (!canGenerate || isGenerating) return;
    setIsGenerating(true);
    setOutput("");
    setGenError("");

    const persona = icps.find(i => i.id === personaId) ?? null;

    const res = await fetch("/api/gerar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ persona, canal, formato, estilo, objetivo, tema, brandParams }),
    });

    const data = await res.json();
    setIsGenerating(false);

    if (!res.ok || data.error) {
      setGenError(data.error ?? "Erro desconhecido.");
    } else {
      setOutput(data.content ?? "");
    }
  }

  return (
    <div className="flex h-full overflow-hidden">
      <PainelInputs
        icps={icps}
        personaId={personaId}   setPersonaId={setPersonaId}
        canal={canal}           setCanal={(c) => { setCanal(c); setFormato(""); }}
        formato={formato}       setFormato={setFormato}
        estilo={estilo}         setEstilo={setEstilo}
        canGenerate={canGenerate}
        onGerar={handleGerar}
        isGenerating={isGenerating}
      />
      <PainelOutput
        objetivo={objetivo}     setObjetivo={setObjetivo}
        tema={tema}             setTema={setTema}
        output={output}
        isGenerating={isGenerating}
        error={genError}
      />
    </div>
  );
}
