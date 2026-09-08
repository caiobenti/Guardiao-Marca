import { AlertTriangle, Check, User } from "lucide-react";
import { Button } from "./ui";

type Variant = "estrutural" | "individual";

const VARIANT_ICON: Record<Variant, typeof AlertTriangle> = {
  estrutural: AlertTriangle,
  individual: User,
};

export interface DecisaoAction {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export function DecisaoPendenteCard({
  variant,
  title,
  description,
  actions,
  status,
  resolvedText,
}: {
  variant: Variant;
  title: string;
  description: string;
  actions: DecisaoAction[];
  status: "pendente" | "resolvido";
  resolvedText: string;
}) {
  const Icon = status === "resolvido" ? Check : VARIANT_ICON[variant];

  return (
    <div className="flex gap-3 border-t border-[#e2e0da] py-4 first:border-t-0 first:pt-0">
      <Icon size={16} className="mt-0.5 shrink-0 text-[#1a1a1a]" strokeWidth={1.5} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#1a1a1a]">{title}</p>
        {status === "pendente" ? (
          <>
            <p className="mt-1 text-sm leading-relaxed text-[#6b6a63]">{description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {actions.map((action) => (
                <Button
                  key={action.label}
                  onClick={action.onClick}
                  variant={action.variant === "secondary" ? "secondary" : "primary"}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-1 text-sm leading-relaxed text-[#6b6a63]">{resolvedText}</p>
        )}
      </div>
    </div>
  );
}
