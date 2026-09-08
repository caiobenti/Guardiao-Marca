import type { Tendencia } from "./data";

const TREND_ARROW: Record<Tendencia, string> = {
  subindo: "↑",
  estavel: "→",
  caindo: "↓",
};

export function TrendArrow({
  tendencia,
  mixed,
}: {
  tendencia: Tendencia;
  mixed?: boolean;
}) {
  return (
    <span className="font-mono text-sm text-[#1a1a1a]">
      {TREND_ARROW[tendencia]}
      {mixed && <sup className="ml-0.5 text-[10px]">*</sup>}
    </span>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const base = "rounded-sm px-4 py-2 text-sm transition-colors";
  const variants: Record<string, string> = {
    primary: "bg-[#1a1a1a] text-[#fdfdfc] hover:bg-[#333]",
    secondary: "border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a]/5",
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
