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
  const [outputTexto, setOutputTexto]     = useState("");
  const [outputImagem, setOutputImagem]   = useState(""); // base64 data URL
  const [loadingTexto, setLoadingTexto]   = useState(false);
  const [loadingImagem, setLoadingImagem] = useState(false);
  const [erroTexto, setErroTexto]         = useState("");
  const [erroImagem, setErroImagem]       = useState("");

  const canGenerate = canal.trim() !== "" && tema.trim() !== "";
  const isGenerating = loadingTexto || loadingImagem;

  async function handleGerar() {
    if (!canGenerate || isGenerating) return;
    setOutputTexto(""); setOutputImagem(""); setErroTexto(""); setErroImagem("");

    const persona = icps.find(i => i.id === personaId) ?? null;
    const gerarTexto = estilo !== "Só imagem";
    const gerarImagem = estilo === "Só imagem" || estilo === "Texto e imagem";

    if (gerarTexto) {
      setLoadingTexto(true);
      fetch("/api/gerar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona, canal, formato, estilo, objetivo, tema, brandParams }),
      })
        .then(r => r.json())
        .then(data => {
          if (data.error) setErroTexto(data.error);
          else setOutputTexto(data.content ?? "");
        })
        .catch(e => setErroTexto(e.message))
        .finally(() => setLoadingTexto(false));
    }

    if (gerarImagem) {
      setLoadingImagem(true);
      fetch("/api/gerar-imagem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ canal, tema, objetivo, persona, brandParams }),
      })
        .then(r => r.json())
        .then(data => {
          if (data.error) setErroImagem(data.error);
          else setOutputImagem(data.imageUrl ?? "");
        })
        .catch(e => setErroImagem(e.message))
        .finally(() => setLoadingImagem(false));
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
        outputTexto={outputTexto}
        outputImagem={outputImagem}
        loadingTexto={loadingTexto}
        loadingImagem={loadingImagem}
        erroTexto={erroTexto}
        erroImagem={erroImagem}
        estilo={estilo}
      />
    </div>
  );
}
