"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Group, Image as KonvaImage, Layer, Rect, Stage, Text, Transformer } from "react-konva";
import type Konva from "konva";

interface OutputSlide {
  index: number;
  imageUrl: string;
}

interface EditableTextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  fontSize: number;
  textColor: string;
  bgColor: string;
  bgOpacity: number;
  paddingX: number;
  paddingY: number;
  radius: number;
  opacity: number;
  locked: boolean;
}

interface Props {
  objetivo: string;    setObjetivo: (v: string) => void;
  tema: string;        setTema: (v: string) => void;
  outputTexto: string;
  outputImagem: string;
  outputSlides: OutputSlide[];
  loadingTexto: boolean;
  loadingImagem: boolean;
  erroTexto: string;
  erroImagem: string;
  estilo: string;
  showPromptDebug: boolean;
  setShowPromptDebug: (v: boolean) => void;
  promptTextoDebug: string;
  promptImagemDebug: string;
  promptImagemDebugBySlide: Record<number, string>;
  brandColorShortcuts: string[];
}

function estimateTextHeight(text: string, width: number, fontSize: number): number {
  if (typeof window === "undefined") return Math.ceil(fontSize * 1.25);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return Math.ceil(fontSize * 1.25);

  ctx.font = `${fontSize}px Inter, sans-serif`;
  const safeWidth = Math.max(1, width);
  const paragraphs = (text || "").split("\n");
  let lines = 0;

  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines += 1;
      continue;
    }
    let current = words[0];
    for (let i = 1; i < words.length; i += 1) {
      const candidate = `${current} ${words[i]}`;
      if (ctx.measureText(candidate).width <= safeWidth) {
        current = candidate;
      } else {
        lines += 1;
        current = words[i];
      }
    }
    lines += 1;
  }

  const lineHeight = fontSize * 1.25;
  return Math.ceil(Math.max(1, lines) * lineHeight);
}

export function PainelOutput({
  objetivo,
  setObjetivo,
  tema,
  setTema,
  outputTexto,
  outputImagem,
  outputSlides,
  loadingTexto,
  loadingImagem,
  erroTexto,
  erroImagem,
  estilo,
  showPromptDebug,
  setShowPromptDebug,
  promptTextoDebug,
  promptImagemDebug,
  promptImagemDebugBySlide,
  brandColorShortcuts,
}: Props) {
  const [editingSlideIndex, setEditingSlideIndex] = useState(1);
  const [savedLayersBySlide, setSavedLayersBySlide] = useState<
    Record<number, EditableTextLayer[]>
  >({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [saveMsg, setSaveMsg] = useState("");
  const stageRef = useRef<Konva.Stage>(null);
  const groupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const displaySlides = outputSlides.length > 0
    ? outputSlides
    : outputImagem
      ? [{ index: 1, imageUrl: outputImagem }]
      : [];
  const currentSlide = useMemo(
    () => displaySlides.find((s) => s.index === editingSlideIndex) ?? displaySlides[0],
    [displaySlides, editingSlideIndex]
  );
  const baseWidth = bgImage?.naturalWidth ?? 1024;
  const baseHeight = bgImage?.naturalHeight ?? 1024;
  const fitScale = Math.min(520 / baseWidth, 520 / baseHeight, 1);
  const stageBoxWidth = Math.round(baseWidth * fitScale);
  const stageBoxHeight = Math.round(baseHeight * fitScale);
  const currentLayers = savedLayersBySlide[currentSlide?.index ?? 1] ?? [];
  const activeSavedLayers = currentLayers;
  const activeImagePromptDebug =
    currentSlide && promptImagemDebugBySlide[currentSlide.index]
      ? promptImagemDebugBySlide[currentSlide.index]
      : promptImagemDebug;

  // Seleciona o primeiro slide assim que as imagens chegarem.
  useEffect(() => {
    if (displaySlides.length > 0) {
      setEditingSlideIndex(displaySlides[0].index);
    }
  }, [displaySlides]);

  useEffect(() => {
    if (!currentSlide) return;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = currentSlide.imageUrl;
    img.onload = () => setBgImage(img);
  }, [currentSlide?.imageUrl]);

  useEffect(() => {
    if (!selectedId || !groupRef.current || !transformerRef.current) return;
    transformerRef.current.nodes([groupRef.current]);
    transformerRef.current.getLayer()?.batchDraw();
  }, [selectedId, currentLayers]);

  function setCurrentLayers(
    updater: (current: EditableTextLayer[]) => EditableTextLayer[]
  ) {
    const slideIndex = currentSlide?.index ?? 1;
    setSavedLayersBySlide((prev) => ({
      ...prev,
      [slideIndex]: updater(prev[slideIndex] ?? []),
    }));
  }

  function addTextLayer() {
    const id = `text-${Date.now()}`;
    setCurrentLayers((prev) => [
      ...prev,
      {
        id,
        text: "Seu texto aqui",
        x: 120,
        y: 120,
        width: 360,
        fontSize: 54,
        textColor: "#ffffff",
        bgColor: "#1a6b5a",
        bgOpacity: 0.85,
        paddingX: 26,
        paddingY: 16,
        radius: 16,
        opacity: 1,
        locked: false,
      },
    ]);
    setSelectedId(id);
  }

  const selectedLayer = currentLayers.find((l) => l.id === selectedId) ?? null;

  function updateSelected(patch: Partial<EditableTextLayer>) {
    if (!selectedId) return;
    setCurrentLayers((prev) => prev.map((l) => (l.id === selectedId ? { ...l, ...patch } : l)));
  }

  function deleteSelected() {
    if (!selectedId) return;
    setCurrentLayers((prev) => prev.filter((l) => l.id !== selectedId));
    setSelectedId(null);
  }

  function duplicateSelected() {
    if (!selectedLayer) return;
    const id = `text-${Date.now()}`;
    setCurrentLayers((prev) => [
      ...prev,
      { ...selectedLayer, id, x: selectedLayer.x + 30, y: selectedLayer.y + 30 },
    ]);
    setSelectedId(id);
  }

  function moveSelected(direction: "up" | "down") {
    if (!selectedId) return;
    setCurrentLayers((prev) => {
      const idx = prev.findIndex((l) => l.id === selectedId);
      if (idx < 0) return prev;
      if (direction === "up" && idx === prev.length - 1) return prev;
      if (direction === "down" && idx === 0) return prev;
      const swapWith = direction === "up" ? idx + 1 : idx - 1;
      const next = [...prev];
      [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
      return next;
    });
  }

  function saveEdition() {
    setSaveMsg("Edição salva");
    window.setTimeout(() => setSaveMsg(""), 1800);
  }

  function exportPng() {
    const uri = stageRef.current?.toDataURL({ pixelRatio: 2 });
    if (!uri || !currentSlide) return;
    const link = document.createElement("a");
    link.download = `slide-${currentSlide.index}-final.png`;
    link.href = uri;
    link.click();
  }

  function prevSlide() {
    const idx = displaySlides.findIndex((s) => s.index === (currentSlide?.index ?? 1));
    if (idx > 0) setEditingSlideIndex(displaySlides[idx - 1].index);
  }
  function nextSlide() {
    const idx = displaySlides.findIndex((s) => s.index === (currentSlide?.index ?? 1));
    if (idx >= 0 && idx < displaySlides.length - 1) {
      setEditingSlideIndex(displaySlides[idx + 1].index);
    }
  }

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
        {!loadingTexto && !loadingImagem && !outputTexto && !outputImagem && displaySlides.length === 0 && !erroTexto && !erroImagem && (
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
        {(loadingTexto || loadingImagem || outputTexto || outputImagem || displaySlides.length > 0 || erroTexto || erroImagem) && (
          <div className={`p-8 grid gap-6 ${estilo === "Texto e imagem" ? "lg:grid-cols-3" : "lg:grid-cols-2"} max-w-[1500px] mx-auto`}>

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
                  <div className="flex items-center gap-3">
                    {currentSlide && (
                      <a
                        href={currentSlide.imageUrl}
                        download={`slide-${currentSlide.index}-bruta.png`}
                        className="text-xs text-[#1a6b5a] hover:underline"
                      >
                        Baixar imagem bruta
                      </a>
                    )}
                    {displaySlides.length > 0 && (
                      <button
                        type="button"
                        onClick={exportPng}
                        className="text-xs text-[#1a6b5a] hover:underline"
                      >
                        Baixar imagem com edição
                      </button>
                    )}
                  </div>
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
                {!loadingImagem && displaySlides.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-stone-500 font-medium">
                        {currentSlide ? `Slide ${currentSlide.index}` : "Slide"}
                      </span>
                      {displaySlides.length > 1 && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={prevSlide}
                            className="px-2 py-1 text-xs border border-stone-300 rounded"
                          >
                            Anterior
                          </button>
                          <button
                            type="button"
                            onClick={nextSlide}
                            className="px-2 py-1 text-xs border border-stone-300 rounded"
                          >
                            Próximo
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="rounded-lg border border-stone-200 bg-stone-100 p-2 overflow-auto">
                      <div className="w-full flex justify-center">
                        <div
                          className="border border-stone-300 bg-white origin-top-left overflow-hidden"
                          style={{ width: stageBoxWidth, height: stageBoxHeight }}
                        >
                          <div
                            style={{
                              transform: `scale(${fitScale})`,
                              transformOrigin: "top left",
                              width: baseWidth,
                              height: baseHeight,
                            }}
                          >
                            <Stage
                              ref={stageRef}
                              width={baseWidth}
                              height={baseHeight}
                              onMouseDown={(e) => {
                                if (e.target === e.target.getStage()) setSelectedId(null);
                              }}
                            >
                              <Layer>
                                {bgImage && (
                                  <KonvaImage image={bgImage} width={baseWidth} height={baseHeight} />
                                )}
                              </Layer>
                              <Layer>
                                {currentLayers.map((layer) => {
                                  const isSelected = layer.id === selectedId;
                                  const textHeight = estimateTextHeight(layer.text, layer.width, layer.fontSize);
                                  const boxHeight = textHeight + layer.paddingY * 2;
                                  return (
                                    <Group
                                      key={layer.id}
                                      ref={isSelected ? groupRef : undefined}
                                      x={layer.x}
                                      y={layer.y}
                                      draggable={!layer.locked}
                                      opacity={layer.opacity}
                                      onClick={() => setSelectedId(layer.id)}
                                      onTap={() => setSelectedId(layer.id)}
                                      onDragEnd={(e) => {
                                        setCurrentLayers((prev) =>
                                          prev.map((l) =>
                                            l.id === layer.id ? { ...l, x: e.target.x(), y: e.target.y() } : l
                                          )
                                        );
                                      }}
                                      onTransformEnd={(e) => {
                                        const node = e.target as Konva.Group;
                                        const scaleX = node.scaleX();
                                        const scaleY = node.scaleY();
                                        node.scaleX(1);
                                        node.scaleY(1);
                                        setCurrentLayers((prev) =>
                                          prev.map((l) =>
                                            l.id === layer.id
                                              ? {
                                                  ...l,
                                                  x: node.x(),
                                                  y: node.y(),
                                                  width: Math.max(120, l.width * scaleX),
                                                  fontSize: Math.max(14, Math.round(l.fontSize * scaleY)),
                                                }
                                              : l
                                          )
                                        );
                                      }}
                                    >
                                      <Rect
                                        x={0}
                                        y={0}
                                        width={layer.width + layer.paddingX * 2}
                                        height={boxHeight}
                                        cornerRadius={layer.radius}
                                        fill={layer.bgColor}
                                        opacity={layer.bgOpacity}
                                      />
                                      <Text
                                        text={layer.text}
                                        x={layer.paddingX}
                                        y={layer.paddingY}
                                        width={layer.width}
                                        fontSize={layer.fontSize}
                                        fill={layer.textColor}
                                        fontFamily="Inter, sans-serif"
                                      />
                                    </Group>
                                  );
                                })}
                                {selectedId && (
                                  <Transformer
                                    ref={transformerRef}
                                    rotateEnabled={false}
                                    enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
                                  />
                                )}
                              </Layer>
                            </Stage>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {showPromptDebug && activeImagePromptDebug && (
                  <details className="mt-6">
                    <summary className="text-xs text-gray-500 cursor-pointer">
                      {currentSlide
                        ? `Prompt enviado para imagem - Slide ${currentSlide.index}`
                        : "Prompt enviado para imagem"}
                    </summary>
                    <pre className="mt-3 text-xs text-gray-600 whitespace-pre-wrap font-mono bg-stone-50 border border-stone-200 rounded-lg p-3">
                      {activeImagePromptDebug}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {(estilo === "Só imagem" || estilo === "Texto e imagem") && (
              <div className="bg-white rounded-[10px] border border-[#e8e8e4] p-8" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Editor de IMG</span>
                </div>
                {displaySlides.length === 0 ? (
                  <p className="text-xs text-stone-400">Gere uma imagem para começar a editar.</p>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={addTextLayer}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1a6b5a] text-white"
                      >
                        + Texto
                      </button>
                      <button
                        type="button"
                        onClick={duplicateSelected}
                        disabled={!selectedLayer}
                        className="px-3 py-1.5 rounded-lg text-xs border border-stone-300 disabled:opacity-40"
                      >
                        Duplicar
                      </button>
                      <button
                        type="button"
                        onClick={deleteSelected}
                        disabled={!selectedLayer}
                        className="px-3 py-1.5 rounded-lg text-xs border border-stone-300 disabled:opacity-40"
                      >
                        Remover
                      </button>
                    </div>

                    {selectedLayer && (
                      <div className="space-y-3">
                        <label className="block text-xs text-stone-500">
                          Conteúdo
                          <textarea
                            value={selectedLayer.text}
                            onChange={(e) => updateSelected({ text: e.target.value })}
                            rows={3}
                            className="mt-1 w-full text-sm border border-stone-300 rounded-lg p-2"
                          />
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <label className="text-xs text-stone-500">
                            Tamanho
                            <input
                              type="number"
                              min={12}
                              max={200}
                              value={selectedLayer.fontSize}
                              onChange={(e) => updateSelected({ fontSize: Number(e.target.value) || 12 })}
                              className="mt-1 w-full border border-stone-300 rounded-lg px-2 py-1.5 text-sm"
                            />
                          </label>
                          <label className="text-xs text-stone-500">
                            Cor do texto
                            <input
                              type="color"
                              value={selectedLayer.textColor}
                              onChange={(e) => updateSelected({ textColor: e.target.value })}
                              className="mt-1 w-full h-9 border border-stone-300 rounded-lg"
                            />
                          </label>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <label className="text-xs text-stone-500">
                            Fundo
                            <input
                              type="color"
                              value={selectedLayer.bgColor}
                              onChange={(e) => updateSelected({ bgColor: e.target.value })}
                              className="mt-1 w-full h-9 border border-stone-300 rounded-lg"
                            />
                          </label>
                          <label className="text-xs text-stone-500">
                            Opacidade fundo
                            <input
                              type="range"
                              min={0}
                              max={1}
                              step={0.05}
                              value={selectedLayer.bgOpacity}
                              onChange={(e) => updateSelected({ bgOpacity: Number(e.target.value) })}
                              className="mt-2 w-full accent-[#1a6b5a]"
                            />
                          </label>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <label className="text-xs text-stone-500">
                            Padding X
                            <input
                              type="number"
                              min={0}
                              max={120}
                              value={selectedLayer.paddingX}
                              onChange={(e) => updateSelected({ paddingX: Number(e.target.value) || 0 })}
                              className="mt-1 w-full border border-stone-300 rounded-lg px-2 py-1.5 text-sm"
                            />
                          </label>
                          <label className="text-xs text-stone-500">
                            Padding Y
                            <input
                              type="number"
                              min={0}
                              max={120}
                              value={selectedLayer.paddingY}
                              onChange={(e) => updateSelected({ paddingY: Number(e.target.value) || 0 })}
                              className="mt-1 w-full border border-stone-300 rounded-lg px-2 py-1.5 text-sm"
                            />
                          </label>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <label className="text-xs text-stone-500">
                            Arredondamento
                            <input
                              type="number"
                              min={0}
                              max={120}
                              value={selectedLayer.radius}
                              onChange={(e) => updateSelected({ radius: Number(e.target.value) || 0 })}
                              className="mt-1 w-full border border-stone-300 rounded-lg px-2 py-1.5 text-sm"
                            />
                          </label>
                          <label className="text-xs text-stone-500">
                            Opacidade camada
                            <input
                              type="range"
                              min={0.1}
                              max={1}
                              step={0.05}
                              value={selectedLayer.opacity}
                              onChange={(e) => updateSelected({ opacity: Number(e.target.value) })}
                              className="mt-2 w-full accent-[#1a6b5a]"
                            />
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() => updateSelected({ locked: !selectedLayer.locked })}
                          className="px-2 py-1.5 text-xs border border-stone-300 rounded-lg"
                        >
                          {selectedLayer.locked ? "Desbloquear camada" : "Bloquear camada"}
                        </button>
                        {brandColorShortcuts.length > 0 && (
                          <div>
                            <p className="text-xs text-stone-500 mb-1">Atalhos de cor da marca</p>
                            <div className="flex flex-wrap gap-2">
                              {brandColorShortcuts.map((color) => (
                                <button
                                  key={color}
                                  type="button"
                                  onClick={() => updateSelected({ bgColor: color })}
                                  title={color}
                                  className="w-7 h-7 rounded-full border border-stone-300"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => moveSelected("up")}
                            className="px-2 py-1.5 text-xs border border-stone-300 rounded-lg"
                          >
                            Trazer frente
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSelected("down")}
                            className="px-2 py-1.5 text-xs border border-stone-300 rounded-lg"
                          >
                            Enviar trás
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="pt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={saveEdition}
                        className="px-3 py-2 rounded-lg text-xs font-medium border border-[#1a6b5a] text-[#1a6b5a]"
                      >
                        Salvar edição
                      </button>
                    </div>
                    {saveMsg && <p className="text-xs text-[#1a6b5a] font-medium">{saveMsg}</p>}
                  </div>
                )}
                {activeSavedLayers.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-stone-500 font-medium">
                      Textos salvos no slide {editingSlideIndex}
                    </p>
                    <div className="max-h-36 overflow-auto border border-stone-200 rounded-lg p-2">
                      {activeSavedLayers.map((l) => (
                        <p key={l.id} className="text-xs text-stone-600 py-1 border-b last:border-b-0 border-stone-100">
                          {l.text || "(sem texto)"}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
