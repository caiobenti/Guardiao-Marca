import type { Tendencia } from "./data";

const TREND_ARROW: Record<Tendencia, string> = {
  subindo: "↗",
  estavel: "→",
  caindo: "↘",
};

const TREND_COLOR: Record<Tendencia, string> = {
  subindo: "text-emerald-600",
  estavel: "text-gray-400",
  caindo: "text-red-600",
};

export function TrendArrow({
  tendencia,
  mixed,
}: {
  tendencia: Tendencia;
  mixed?: boolean;
}) {
  return (
    <span className={`text-base font-semibold ${TREND_COLOR[tendencia]}`}>
      {TREND_ARROW[tendencia]}
      {mixed && <sup className="ml-0.5 text-xs text-amber-600">*</sup>}
    </span>
  );
}

export function PillButton({
  children,
  onClick,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
}) {
  const base = "rounded-full px-4 py-2 text-sm font-medium transition-colors";
  const variants: Record<string, string> = {
    primary: "bg-[#4338ca] text-white hover:bg-[#372da3]",
    secondary: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "text-[#4338ca] hover:bg-[#eef0fc]",
    danger: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
