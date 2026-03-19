import { PainelInputs } from "@/components/criar/PainelInputs";
import { PainelOutput } from "@/components/criar/PainelOutput";

export default function CriarPage() {
  return (
    <div className="flex h-full min-h-screen">
      <PainelInputs />
      <PainelOutput />
    </div>
  );
}
