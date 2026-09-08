"use client";

import { createContext, useContext, useMemo, useState } from "react";

type StatusDecisao = "pendente" | "resolvido";

interface PerformBotState {
  estruturalStatus: StatusDecisao;
  carlosStatus: StatusDecisao;
  carlosResolucaoTexto: string;
  pendingCount: number;
  aceitarEstrutural: () => void;
  resolverCarlos: (texto: string) => void;
}

const PerformBotContext = createContext<PerformBotState | null>(null);

export function PerformBotProvider({ children }: { children: React.ReactNode }) {
  const [estruturalStatus, setEstruturalStatus] = useState<StatusDecisao>("pendente");
  const [carlosStatus, setCarlosStatus] = useState<StatusDecisao>("pendente");
  const [carlosResolucaoTexto, setCarlosResolucaoTexto] = useState("");

  const pendingCount =
    (estruturalStatus === "pendente" ? 1 : 0) + (carlosStatus === "pendente" ? 1 : 0);

  const value = useMemo<PerformBotState>(
    () => ({
      estruturalStatus,
      carlosStatus,
      carlosResolucaoTexto,
      pendingCount,
      aceitarEstrutural: () => setEstruturalStatus("resolvido"),
      resolverCarlos: (texto: string) => {
        setCarlosResolucaoTexto(texto);
        setCarlosStatus("resolvido");
      },
    }),
    [estruturalStatus, carlosStatus, carlosResolucaoTexto, pendingCount]
  );

  return <PerformBotContext.Provider value={value}>{children}</PerformBotContext.Provider>;
}

export function usePerformBot() {
  const ctx = useContext(PerformBotContext);
  if (!ctx) throw new Error("usePerformBot deve ser usado dentro de PerformBotProvider");
  return ctx;
}
