export function BotAvatar() {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4338ca] text-lg text-white shadow-sm">
      🤖
    </div>
  );
}

export function BotMessage({
  children,
  caption,
}: {
  children: React.ReactNode;
  caption?: string;
}) {
  return (
    <div>
      {caption && (
        <p className="mb-2 ml-[52px] text-xs font-medium uppercase tracking-wide text-gray-400">
          {caption}
        </p>
      )}
      <div className="flex items-start gap-3">
        <BotAvatar />
        <div className="min-w-0 flex-1">
          <p className="mb-1.5 text-sm font-semibold text-gray-900">PerformBot</p>
          <div className="rounded-2xl rounded-tl-sm border border-gray-200 bg-white px-5 py-4 text-[15px] leading-relaxed text-gray-800 shadow-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChatBackdrop({
  children,
  wide,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="h-full overflow-y-auto bg-[#eef0f4] px-6 py-8 sm:px-10">
      <div className={`mx-auto ${wide ? "max-w-4xl" : "max-w-2xl"}`}>{children}</div>
    </div>
  );
}
