import { Bot } from "lucide-react";

export function BotAvatar({ size = 36 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-lg bg-[#4f46e5] text-white shadow-sm"
      style={{ width: size, height: size }}
    >
      <Bot size={Math.round(size * 0.6)} />
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
    <div className="flex items-start gap-3">
      <BotAvatar />
      <div className="min-w-0 flex-1">
        <p className="mb-1 flex items-center gap-2 text-sm">
          <span className="font-bold text-gray-900">PerformBot</span>
          <span className="text-xs text-gray-400">{timestamp}</span>
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
            APP
          </span>
        </p>
        <div className="text-[15px] leading-relaxed text-gray-800">{children}</div>
      </div>
    </div>
  );
}

export function DateDivider({ label }: { label: string }) {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-500">
        {label}
      </span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}
