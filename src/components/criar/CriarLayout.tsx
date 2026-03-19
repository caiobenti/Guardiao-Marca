"use client";
import { useState } from "react";
import { PainelInputs } from "./PainelInputs";
import { PainelOutput } from "./PainelOutput";
import { ICPArchetype, BrandParameters } from "@/lib/types";

interface Props {
  icps: ICPArchetype[];
  brandParams?: Partial<BrandParameters>;
}

export function CriarLayout({ icps, brandParams }: Props) {
  const [output, setOutput] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="flex h-full overflow-hidden">
      <PainelInputs
        icps={icps}
        brandParams={brandParams}
        onGerar={(prompt) => {
          setIsGenerating(true);
          setOutput(prompt);
          setTimeout(() => setIsGenerating(false), 300);
        }}
      />
      <PainelOutput output={output} isGenerating={isGenerating} />
    </div>
  );
}
