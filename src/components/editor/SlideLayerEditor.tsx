"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Group, Layer, Rect, Stage, Image as KonvaImage, Text, Transformer } from "react-konva";
import type Konva from "konva";

interface SlideItem {
  index: number;
  imageUrl: string;
}

export interface EditableTextLayer {
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
  slides: SlideItem[];
  currentSlideIndex: number;
  onChangeSlide: (index: number) => void;
  brandColorShortcuts: string[];
  initialLayersBySlide?: Record<number, EditableTextLayer[]>;
  onSave?: (layersBySlide: Record<number, EditableTextLayer[]>) => void;
  onClose: () => void;
  showCloseButton?: boolean;
}

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 1024;

export function SlideLayerEditor({
  slides,
  currentSlideIndex,
  onChangeSlide,
  brandColorShortcuts,
  initialLayersBySlide,
  onSave,
  onClose,
  showCloseButton = true,
}: Props) {
  const stageRef = useRef<Konva.Stage>(null);
  const groupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [layersBySlide, setLayersBySlide] = useState<Record<number, EditableTextLayer[]>>(
    initialLayersBySlide ?? {}
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState("");
  const currentSlide = useMemo(
    () => slides.find((s) => s.index === currentSlideIndex) ?? slides[0],
    [slides, currentSlideIndex]
  );
  const layers = layersBySlide[currentSlide.index] ?? [];

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = currentSlide.imageUrl;
    img.onload = () => setBgImage(img);
  }, [currentSlide.imageUrl]);

  useEffect(() => {
    setSelectedId(null);
  }, [currentSlide.index]);

  useEffect(() => {
    if (!selectedId || !groupRef.current || !transformerRef.current) return;
    transformerRef.current.nodes([groupRef.current]);
    transformerRef.current.getLayer()?.batchDraw();
  }, [selectedId, layers]);

  const selectedLayer = useMemo(
    () => layers.find((l) => l.id === selectedId) ?? null,
    [layers, selectedId]
  );

  useEffect(() => {
    if (initialLayersBySlide) {
      setLayersBySlide(initialLayersBySlide);
    }
  }, [initialLayersBySlide]);

  function setCurrentLayers(updater: (current: EditableTextLayer[]) => EditableTextLayer[]) {
    setLayersBySlide((prev) => ({
      ...prev,
      [currentSlide.index]: updater(prev[currentSlide.index] ?? []),
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

  function updateSelected(patch: Partial<EditableTextLayer>) {
    if (!selectedId) return;
    setCurrentLayers((prev) => prev.map((l) => (l.id === selectedId ? { ...l, ...patch } : l)));
  }

  function saveEdition() {
    onSave?.(layersBySlide);
    setSaveMsg("Edição salva");
    window.setTimeout(() => setSaveMsg(""), 2000);
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

  function exportPng() {
    const uri = stageRef.current?.toDataURL({ pixelRatio: 2 });
    if (!uri) return;
    const link = document.createElement("a");
    link.download = `slide-${currentSlide.index}-final.png`;
    link.href = uri;
    link.click();
  }

  function prevSlide() {
    const idx = slides.findIndex((s) => s.index === currentSlide.index);
    if (idx > 0) onChangeSlide(slides[idx - 1].index);
  }

  function nextSlide() {
    const idx = slides.findIndex((s) => s.index === currentSlide.index);
    if (idx >= 0 && idx < slides.length - 1) onChangeSlide(slides[idx + 1].index);
  }

  return (
    <div className="h-full min-h-0 flex flex-col gap-3">
      <div className="rounded-lg border border-stone-200 bg-stone-100 p-2 overflow-auto">
        <div className="w-full flex justify-center">
          <Stage
            ref={stageRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            scaleX={0.26}
            scaleY={0.26}
            onMouseDown={(e) => {
              if (e.target === e.target.getStage()) setSelectedId(null);
            }}
            className="bg-white border border-stone-300 origin-top"
          >
            <Layer>
              {bgImage && (
                <KonvaImage image={bgImage} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
              )}
            </Layer>
            <Layer>
              {layers.map((layer) => {
                const isSelected = layer.id === selectedId;
                const textHeight = Math.ceil(layer.fontSize * 1.25);
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

      <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">Editor do Slide {currentSlide.index}</h3>
          <p className="text-xs text-stone-500 mt-1">Edite camadas e salve sem sair da tela.</p>
        </div>
        <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevSlide}
              className="px-2 py-1.5 text-xs border border-stone-300 rounded-lg disabled:opacity-40"
              disabled={slides.findIndex((s) => s.index === currentSlide.index) <= 0}
            >
              Slide anterior
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="px-2 py-1.5 text-xs border border-stone-300 rounded-lg disabled:opacity-40"
              disabled={slides.findIndex((s) => s.index === currentSlide.index) >= slides.length - 1}
            >
              Próximo slide
            </button>
        </div>
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
                  rows={4}
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
            <button
              type="button"
              onClick={exportPng}
              className="px-3 py-2 rounded-lg text-xs font-medium bg-[#1a6b5a] text-white"
            >
              Exportar PNG
            </button>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-lg text-xs border border-stone-300"
              >
                Fechar
              </button>
            )}
        </div>
        {saveMsg && <p className="text-xs text-[#1a6b5a] font-medium">{saveMsg}</p>}
      </div>
    </div>
  );
}
