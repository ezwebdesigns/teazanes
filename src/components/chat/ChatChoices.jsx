import React from "react";
import { cn } from "@/lib/utils";

export default function ChatChoices({ choices, onChoice, disabled, multi, selectedIds, onToggle, onContinue, continueLabel }) {
  return (
    <div className="flex flex-wrap gap-2">
      {choices.map((c) =>
        multi ? (
          <button
            key={c.id}
            type="button"
            disabled={disabled}
            onClick={() => onToggle(c.id)}
            className={cn(
              "rounded-xl border-2 px-4 py-2.5 text-left text-xs font-medium transition-all sm:text-sm",
              selectedIds?.includes(c.id)
                ? "border-emerald-900 bg-emerald-900 text-white shadow-sm"
                : "border-emerald-700/70 bg-emerald-50/40 text-emerald-900 hover:bg-emerald-50"
            )}
          >
            {c.label}
          </button>
        ) : (
          <button
            key={c.id}
            type="button"
            disabled={disabled}
            onClick={() => onChoice(c)}
            className="rounded-xl border-2 border-emerald-700/70 bg-emerald-50/40 px-4 py-2.5 text-left text-xs font-medium text-emerald-900 transition-all hover:bg-emerald-50 hover:shadow-sm sm:text-sm"
          >
            {c.label}
          </button>
        )
      )}
      {multi && (
        <button
          type="button"
          disabled={!selectedIds?.length || disabled}
          onClick={onContinue}
          className="rounded-xl bg-emerald-800 px-4 py-2.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
        >
          {continueLabel}
        </button>
      )}
    </div>
  );
}