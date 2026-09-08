import { Bot } from "lucide-react";

export function BotAvatar({ size = 36 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-sm border border-[#1a1a1a] text-[#1a1a1a]"
      style={{ width: size, height: size }}
    >
      <Bot size={Math.round(size * 0.55)} strokeWidth={1.5} />
    </div>
  );
}

export function SlackMessage({
  timestamp,
  children,
}: {
  timestamp: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 border-t border-[#e2e0da] py-6 first:border-t-0 first:pt-0">
      <BotAvatar />
      <div className="min-w-0 flex-1">
        <p className="mb-2 flex items-center gap-2 text-sm">
          <span className="font-semibold text-[#1a1a1a]">PerformBot</span>
          <span className="font-mono text-xs text-[#6b6a63]">{timestamp}</span>
          <span className="border border-[#e2e0da] px-1 text-[10px] text-[#6b6a63]">APP</span>
        </p>
        <div className="text-[15px] leading-relaxed text-[#1a1a1a]">{children}</div>
      </div>
    </div>
  );
}

export function DateDivider({ label }: { label: string }) {
  return (
    <div className="my-2 flex items-center gap-3 py-4">
      <div className="h-px flex-1 bg-[#e2e0da]" />
      <span className="font-mono text-xs text-[#6b6a63]">{label}</span>
      <div className="h-px flex-1 bg-[#e2e0da]" />
    </div>
  );
}
