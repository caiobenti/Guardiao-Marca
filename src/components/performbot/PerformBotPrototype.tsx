"use client";

import { useState } from "react";
import { SlackShell } from "./SlackShell";
import { PersonaSelector } from "./PersonaSelector";
import { PerformBotProvider, usePerformBot } from "./context";
import { ChatScreen } from "./screens/ChatScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import { EvidenciaScreen } from "./screens/EvidenciaScreen";
import { AjustePlanoScreen } from "./screens/AjustePlanoScreen";
import { CarlosJourney } from "./screens/CarlosJourney";

type Screen = "chat" | "dashboard" | "evidencia" | "ajuste";

const MSG_BUDDY =
  "Ajuste registrado. Vou acompanhar as trocas entre Carlos e Beatriz ao longo da quinzena e ficar de olho em qualquer impacto do foco extra no Carlos sobre o resultado dela. Retorno com uma leitura em 15 dias.";
const CARD_BUDDY = "Plano combinado: Beatriz como buddy do Carlos. Leitura em 15 dias.";

const MSG_ROLEPLAY =
  "Combinado! Vou acompanhar as sessões de role-play com você e volto com uma leitura em 15 dias.";
const CARD_ROLEPLAY = "Plano aceito: role-play 1:1 com você. Leitura em 15 dias.";

const MSG_DIAGNOSTICO =
  "Entendido. Vou reavaliar o diagnóstico com base no que você trouxe e ajusto a leitura da próxima quinzena.";
const CARD_DIAGNOSTICO = "Diagnóstico em reavaliação com base no seu retorno.";

function PerformBotApp() {
  const { resolverCarlos } = usePerformBot();
  const [screen, setScreen] = useState<Screen>("chat");
  const [previousScreen, setPreviousScreen] = useState<"chat" | "dashboard">("chat");
  const [conversationStage, setConversationStage] = useState<0 | 1>(0);
  const [mensagemCombinado, setMensagemCombinado] = useState(MSG_BUDDY);
  const [mostrarCheckIn, setMostrarCheckIn] = useState(true);

  function irParaEvidencia(origem: "chat" | "dashboard") {
    setPreviousScreen(origem);
    setScreen("evidencia");
  }

  function aceitarPlanoOriginal() {
    resolverCarlos(CARD_ROLEPLAY);
    setMensagemCombinado(MSG_ROLEPLAY);
    setMostrarCheckIn(false);
    setConversationStage(1);
    setScreen("chat");
  }

  function confirmarAjuste(_texto: string, motivo: "diagnostico" | "outra_acao") {
    if (motivo === "outra_acao") {
      resolverCarlos(CARD_BUDDY);
      setMensagemCombinado(MSG_BUDDY);
      setMostrarCheckIn(true);
    } else {
      resolverCarlos(CARD_DIAGNOSTICO);
      setMensagemCombinado(MSG_DIAGNOSTICO);
      setMostrarCheckIn(false);
    }
    setConversationStage(1);
    setScreen("chat");
  }

  return (
    <SlackShell>
      {screen === "chat" && (
        <ChatScreen
          onVerVisaoGeral={() => setScreen("dashboard")}
          conversationStage={conversationStage}
          mensagemCombinado={mensagemCombinado}
          mostrarCheckIn={mostrarCheckIn}
        />
      )}
      {screen === "dashboard" && (
        <DashboardScreen
          onVoltarMensagem={() => setScreen("chat")}
          onVerEvidenciaCarlos={() => irParaEvidencia("dashboard")}
        />
      )}
      {screen === "evidencia" && (
        <EvidenciaScreen
          onVoltar={() => setScreen(previousScreen)}
          onAceitar={aceitarPlanoOriginal}
          onAjustar={() => setScreen("ajuste")}
        />
      )}
      {screen === "ajuste" && (
        <AjustePlanoScreen onVoltar={() => setScreen("evidencia")} onConfirmar={confirmarAjuste} />
      )}
    </SlackShell>
  );
}

export function PerformBotPrototype() {
  const [persona, setPersona] = useState<"escolher" | "gestor" | "colaborador">("escolher");

  if (persona === "escolher") {
    return <PersonaSelector onEscolher={setPersona} />;
  }

  if (persona === "colaborador") {
    return (
      <SlackShell>
        <CarlosJourney />
      </SlackShell>
    );
  }

  return (
    <PerformBotProvider>
      <PerformBotApp />
    </PerformBotProvider>
  );
}
