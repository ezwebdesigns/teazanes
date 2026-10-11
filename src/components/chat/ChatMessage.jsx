import React from "react";
import ReactMarkdown from "react-markdown";
import { Leaf } from "lucide-react";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";

export default function ChatMessage({ message, logoUrl }) {
  const isBot = message.from === "bot";
  return (
    <div className={cn("mb-4 flex w-full gap-2.5", isBot ? "justify-start" : "justify-end")}>
      {isBot &&
        (logoUrl ? (
          <Image
            src={logoUrl}
            alt="Tisanes"
            className="h-8 w-8 shrink-0 rounded-full shadow-sm"
            fittingType="fill"
          />
        ) : (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-900 shadow-sm">
            <Leaf className="h-4 w-4 text-emerald-50" />
          </div>
        ))}
      <div className="max-w-[85%] md:max-w-[78%]">
        <div
          className={cn(
            "inline-block rounded-2xl px-4 py-3 text-left text-sm leading-relaxed shadow-sm",
            isBot
              ? "rounded-tl-sm border border-stone-200/80 bg-white text-stone-700"
              : "rounded-tr-sm whitespace-pre-line bg-emerald-900 text-emerald-50"
          )}
        >
          {isBot ? (
            <ReactMarkdown
              breaks
              components={{
                strong: ({ children }) => <strong className="font-semibold text-stone-800">{children}</strong>,
                em: ({ children }) => <em className="text-xs italic leading-snug text-stone-500">{children}</em>,
              }}
            >
              {message.text}
            </ReactMarkdown>
          ) : (
            message.text
          )}
        </div>
      </div>
    </div>
  );
}