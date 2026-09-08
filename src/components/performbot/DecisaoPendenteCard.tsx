import { AlertTriangle, CheckCircle2, User } from "lucide-react";

type Variant = "estrutural" | "individual";

const VARIANT_STYLE: Record<Variant, { iconBg: string; iconColor: string; Icon: typeof AlertTriangle }> = {
  estrutural: { iconBg: "bg-orange-100", iconColor: "text-orange-600", Icon: AlertTriangle },
  individual: { iconBg: "bg-blue-100", iconColor: "text-blue-600", Icon: User },
};

export function DecisaoPendenteCard({
  variant,
  title,
  description,
  actionLabel,
  onAction,
  status,
  resolvedText,
}: {
  variant: Variant;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
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
            <button
              onClick={onAction}
              className="mt-2.5 rounded-lg border border-[#4f46e5] px-3.5 py-1.5 text-sm font-medium text-[#4f46e5] transition-colors hover:bg-[#eef0fd]"
            >
              {actionLabel}
            </button>
          </>
        ) : (
          <p className="mt-0.5 text-sm leading-relaxed text-emerald-700">{resolvedText}</p>
        )}
      </div>
    </div>
  );
}
