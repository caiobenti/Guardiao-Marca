"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Layer, Stage, Image as KonvaImage, Text, Transformer } from "react-konva";
import type Konva from "konva";

interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  fontSize: number;
  fill: string;
}

interface Props {
  imageUrl: string;
  slideIndex: number;
  onClose: () => void;
}

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 1024;

export function SlideLayerEditor({ imageUrl, slideIndex, onClose }: Props) {
  const stageRef = useRef<Konva.Stage>(null);
  const textRef = useRef<Konva.Text>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [layers, setLayers] = useState<TextLayer[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => setBgImage(img);
  }, [imageUrl]);

  useEffect(() => {
    if (!selectedId || !textRef.current || !transformerRef.current) return;
    transformerRef.current.nodes([textRef.current]);
    transformerRef.current.getLayer()?.batchDraw();
  }, [selectedId]);

  const selectedLayer = useMemo(
    () => layers.find((l) => l.id === selectedId) ?? null,
    [layers, selectedId]
  );

  function addTextLayer() {
    const id = `text-${Date.now()}`;
    setLayers((prev) => [
      ...prev,
      {
        id,
        text: "Seu texto aqui",
        x: 120,
        y: 120,
        width: 420,
        fontSize: 52,
        fill: "#ffffff",
      },
    ]);
    setSelectedId(id);
  }

  function updateSelected(patch: Partial<TextLayer>) {
    if (!selectedId) return;
    setLayers((prev) => prev.map((l) => (l.id === selectedId ? { ...l, ...patch } : l)));
  }

  function deleteSelected() {
    if (!selectedId) return;
    setLayers((prev) => prev.filter((l) => l.id !== selectedId));
    setSelectedId(null);
  }

  function moveSelected(direction: "up" | "down") {
    if (!selectedId) return;
    setLayers((prev) => {
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
    link.download = `slide-${slideIndex}-final.png`;
    link.href = uri;
    link.click();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6">
      <div className="w-full max-w-7xl max-h-[95vh] bg-white rounded-xl border border-stone-200 overflow-hidden grid grid-cols-[300px_1fr]">
        <aside className="border-r border-stone-200 p-4 flex flex-col gap-4 overflow-y-auto">
          <div>
            <h3 className="text-sm font-semibold text-stone-800">Editor do Slide {slideIndex}</h3>
            <p className="text-xs text-stone-500 mt-1">Adicione camadas de texto e exporte PNG unificado.</p>
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
                  Cor
                  <input
                    type="color"
                    value={selectedLayer.fill}
                    onChange={(e) => updateSelected({ fill: e.target.value })}
                    className="mt-1 w-full h-9 border border-stone-300 rounded-lg"
                  />
                </label>
              </div>
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
          <div className="mt-auto flex gap-2">
            <button
              type="button"
              onClick={exportPng}
              className="px-3 py-2 rounded-lg text-xs font-medium bg-[#1a6b5a] text-white"
            >
              Exportar PNG
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg text-xs border border-stone-300"
            >
              Fechar
            </button>
          </div>
        </aside>
        <div className="p-4 overflow-auto bg-stone-100">
          <div className="mx-auto w-max">
            <Stage
              ref={stageRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              onMouseDown={(e) => {
                if (e.target === e.target.getStage()) setSelectedId(null);
              }}
              className="bg-white border border-stone-300"
            >
              <Layer>
                {bgImage && (
                  <KonvaImage image={bgImage} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
                )}
              </Layer>
              <Layer>
                {layers.map((layer) => (
                  <Text
                    key={layer.id}
                    ref={layer.id === selectedId ? textRef : undefined}
                    text={layer.text}
                    x={layer.x}
                    y={layer.y}
                    width={layer.width}
                    fontSize={layer.fontSize}
                    fill={layer.fill}
                    fontFamily="Inter, sans-serif"
                    draggable
                    onClick={() => setSelectedId(layer.id)}
                    onTap={() => setSelectedId(layer.id)}
                    onDragEnd={(e) => {
                      setLayers((prev) =>
                        prev.map((l) =>
                          l.id === layer.id ? { ...l, x: e.target.x(), y: e.target.y() } : l
                        )
                      );
                    }}
                    onTransformEnd={(e) => {
                      const node = e.target as Konva.Text;
                      const scaleX = node.scaleX();
                      node.scaleX(1);
                      setLayers((prev) =>
                        prev.map((l) =>
                          l.id === layer.id
                            ? {
                                ...l,
                                x: node.x(),
                                y: node.y(),
                                width: Math.max(80, node.width() * scaleX),
                              }
                            : l
                        )
                      );
                    }}
                  />
                ))}
                {selectedId && (
                  <Transformer
                    ref={transformerRef}
                    rotateEnabled={false}
                    enabledAnchors={["middle-left", "middle-right"]}
                  />
                )}
              </Layer>
            </Stage>
          </div>
        </div>
      </div>
    </div>
  );
}
