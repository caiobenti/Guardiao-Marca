"use client";

import { usePerformBot } from "./context";
import { DecisaoPendenteCard } from "./DecisaoPendenteCard";

export function DecisoesPendentesSection({ onRevisarCarlos }: { onRevisarCarlos: () => void }) {
  const { estruturalStatus, carlosStatus, carlosResolucaoTexto, pendingCount, aceitarEstrutural } =
    usePerformBot();

  return (
    <div>
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Decisões pendentes ({pendingCount})
      </p>
      <div className="space-y-2.5">
        <DecisaoPendenteCard
          variant="estrutural"
          title="Pesquisa prévia do cliente caiu para o time inteiro"
          description="Possível causa: fonte da lista de leads sem dado de contato. Sugestão: aguardar a próxima safra de leads (fonte já em correção) e reavaliar essa dimensão na próxima leitura, antes de agir individualmente com alguém do time."
          actionLabel="Aceitar sugestão"
          onAction={aceitarEstrutural}
          status={estruturalStatus}
          resolvedText="Aceito. Vou avisar você se a dimensão não recuperar na próxima leitura."
        />
        <DecisaoPendenteCard
          variant="individual"
          title="Carlos — abaixo do esperado em quebra de objeção"
          description="Há 3 quinzenas seguidas. Plano sugerido, aguardando sua decisão."
          actionLabel="Revisar"
          onAction={onRevisarCarlos}
          status={carlosStatus}
          resolvedText={carlosResolucaoTexto}
        />
      </div>
    </div>
  );
}
