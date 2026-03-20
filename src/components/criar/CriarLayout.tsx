"use client";
import { useState } from "react";
import { PainelInputs } from "./PainelInputs";
import { PainelOutput } from "./PainelOutput";
import { ICPArchetype, BrandParameters } from "@/lib/types";

interface OutputSlide {
  index: number;
  imageUrl: string;
}

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
  const [outputImagem, setOutputImagem]   = useState(""); // legado (só imagem)
  const [outputSlides, setOutputSlides]   = useState<OutputSlide[]>([]);
  const [loadingTexto, setLoadingTexto]   = useState(false);
  const [loadingImagem, setLoadingImagem] = useState(false);
  const [erroTexto, setErroTexto]         = useState("");
  const [erroImagem, setErroImagem]       = useState("");
  const [promptTextoDebug, setPromptTextoDebug] = useState("");
  const [promptImagemDebug, setPromptImagemDebug] = useState("");
  const [showPromptDebug, setShowPromptDebug] = useState(false);

  const canGenerate = canal.trim() !== "" && tema.trim() !== "";
  const isGenerating = loadingTexto || loadingImagem;

  async function handleGerar() {
    if (!canGenerate || isGenerating) return;
    setOutputTexto(""); setOutputImagem(""); setErroTexto(""); setErroImagem("");
    setOutputSlides([]);
    setPromptTextoDebug(""); setPromptImagemDebug("");

    const persona = icps.find(i => i.id === personaId) ?? null;
    const gerarTexto = estilo !== "Só imagem";
    const gerarImagem = estilo === "Só imagem" || estilo === "Texto e imagem";

    const imageBodyBase = {
      canal,
      tema,
      objetivo,
      persona,
      brandParams: brandParams ?? null,
      formato,
      estilo,
    };

    if (gerarTexto && gerarImagem) {
      setLoadingTexto(true);
      let imagePhase = false;
      try {
        const rText = await fetch("/api/gerar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            persona,
            canal,
            formato,
            estilo,
            objetivo,
            tema,
            brandParams,
          }),
        });
        const dataText = await rText.json();
        if (dataText.error) {
          setErroTexto(dataText.error);
          return;
        }
        const content = dataText.content ?? "";
        setPromptTextoDebug(
          dataText.promptDebug
            ? `MODEL: ${dataText.promptDebug.model}\nTEMPERATURE: ${dataText.promptDebug.temperature}\nMAX_TOKENS: ${dataText.promptDebug.maxTokens}\n\n=== SYSTEM ===\n${dataText.promptDebug.system ?? ""}\n\n=== USER ===\n${dataText.promptDebug.user ?? ""}`
            : ""
        );
        setOutputTexto(content);
        const slides = Array.isArray(dataText.slides) ? dataText.slides : [];
        if (slides.length === 0) {
          setErroTexto("A IA não retornou slides para geração de imagem.");
          return;
        }

        imagePhase = true;
        setLoadingImagem(true);
        const rImg = await fetch("/api/gerar-imagem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...imageBodyBase,
            copyGerada: content,
            slides,
          }),
        });
        const dataImg = await rImg.json();
        if (dataImg.error) setErroImagem(dataImg.error);
        else {
          if (Array.isArray(dataImg.images)) {
            setOutputSlides(
              dataImg.images
                .filter((img: { index?: number; imageUrl?: string }) =>
                  Number.isFinite(img?.index) && Boolean(img?.imageUrl)
                )
                .map((img: { index: number; imageUrl: string }) => ({
                  index: img.index,
                  imageUrl: img.imageUrl,
                }))
            );
          } else {
            setOutputImagem(dataImg.imageUrl ?? "");
          }
          setPromptImagemDebug(
            Array.isArray(dataImg.images)
              ? dataImg.images
                  .map(
                    (img: { index: number; promptDebug?: { final?: string } }) =>
                      `--- Slide ${img.index} ---\n${img.promptDebug?.final ?? ""}`
                  )
                  .join("\n\n")
              : (dataImg.promptDebug?.final ?? "")
          );
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (imagePhase) setErroImagem(msg);
        else setErroTexto(msg);
      } finally {
        setLoadingTexto(false);
        setLoadingImagem(false);
      }
      return;
    }

    if (gerarTexto) {
      setLoadingTexto(true);
      try {
        const r = await fetch("/api/gerar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            persona,
            canal,
            formato,
            estilo,
            objetivo,
            tema,
            brandParams,
          }),
        });
        const data = await r.json();
        if (data.error) setErroTexto(data.error);
        else {
          setOutputTexto(data.content ?? "");
          setPromptTextoDebug(
            data.promptDebug
              ? `MODEL: ${data.promptDebug.model}\nTEMPERATURE: ${data.promptDebug.temperature}\nMAX_TOKENS: ${data.promptDebug.maxTokens}\n\n=== SYSTEM ===\n${data.promptDebug.system ?? ""}\n\n=== USER ===\n${data.promptDebug.user ?? ""}`
              : ""
          );
        }
      } catch (e) {
        setErroTexto(e instanceof Error ? e.message : String(e));
      } finally {
        setLoadingTexto(false);
      }
      return;
    }

    if (gerarImagem) {
      setLoadingImagem(true);
      try {
        const r = await fetch("/api/gerar-imagem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(imageBodyBase),
        });
        const data = await r.json();
        if (data.error) setErroImagem(data.error);
        else {
          setOutputImagem(data.imageUrl ?? "");
          setPromptImagemDebug(data.promptDebug?.final ?? "");
        }
      } catch (e) {
        setErroImagem(e instanceof Error ? e.message : String(e));
      } finally {
        setLoadingImagem(false);
      }
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
        outputSlides={outputSlides}
        loadingTexto={loadingTexto}
        loadingImagem={loadingImagem}
        erroTexto={erroTexto}
        erroImagem={erroImagem}
        estilo={estilo}
        showPromptDebug={showPromptDebug}
        setShowPromptDebug={setShowPromptDebug}
        promptTextoDebug={promptTextoDebug}
        promptImagemDebug={promptImagemDebug}
      />
    </div>
  );
}
