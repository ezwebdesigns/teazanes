import React from "react";
import { Leaf } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function TypingIndicator({ logoUrl }) {
  return (
    <div className="mb-4 flex w-full items-end gap-2.5">
      {logoUrl ? (
        <Image src={logoUrl} alt="Tisanes" className="h-8 w-8 shrink-0 rounded-full shadow-sm" fittingType="fill" />
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-900 shadow-sm">
          <Leaf className="h-4 w-4 text-emerald-50" />
        </div>
      )}
      <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-stone-200/80 bg-white px-4 py-3.5 shadow-sm">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400" />
      </div>
    </div>
  );
}