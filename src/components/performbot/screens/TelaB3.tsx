"use client";

import { BotMessage, ChatBackdrop } from "../ChatShell";
import { PillButton } from "../ui";

export function TelaB3({
  mensagem,
  onContinuar,
  onReiniciar,
}: {
  mensagem: string;
  onContinuar?: () => void;
  onReiniciar: () => void;
}) {
  return (
    <ChatBackdrop>
      <BotMessage>
        <p className="whitespace-pre-line">{mensagem}</p>
        <div className="mt-5 flex gap-3">
          {onContinuar && (
            <PillButton variant="primary" onClick={onContinuar}>
              Ver check-in (15 dias depois)
            </PillButton>
          )}
          <PillButton variant="ghost" onClick={onReiniciar}>
            Reiniciar protótipo
          </PillButton>
        </div>
      </BotMessage>
    </ChatBackdrop>
  );
}
