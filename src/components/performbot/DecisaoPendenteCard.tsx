import { AlertTriangle, CheckCircle2, User } from "lucide-react";

type Variant = "estrutural" | "individual";

const VARIANT_STYLE: Record<Variant, { iconBg: string; iconColor: string; Icon: typeof AlertTriangle }> = {
  estrutural: { iconBg: "bg-orange-100", iconColor: "text-orange-600", Icon: AlertTriangle },
  individual: { iconBg: "bg-blue-100", iconColor: "text-blue-600", Icon: User },
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
  const { iconBg, iconColor, Icon } = VARIANT_STYLE[variant];

  return (
    <div className="flex gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          status === "resolvido" ? "bg-emerald-100" : iconBg
        }`}
      >
        {status === "resolvido" ? (
          <CheckCircle2 size={18} className="text-emerald-600" />
        ) : (
          <Icon size={18} className={iconColor} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        {status === "pendente" ? (
          <>
            <p className="mt-0.5 text-sm leading-relaxed text-gray-600">{description}</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {actions.map((action) => (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className={
                    action.variant === "secondary"
                      ? "rounded-lg border border-gray-300 px-3.5 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                      : "rounded-lg bg-[#4f46e5] px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#4338ca]"
                  }
                >
                  {action.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-0.5 text-sm leading-relaxed text-emerald-700">{resolvedText}</p>
        )}
      </div>
    </div>
  );
}
