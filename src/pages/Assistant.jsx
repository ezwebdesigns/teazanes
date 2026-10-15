import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import ChatAssistant from "@/components/chat/ChatAssistant";

function useEmbedMode() {
  try {
    return new URLSearchParams(window.location.search).get("embed");
  } catch {
    return null;
  }
}

export default function Assistant() {
  const [closed, setClosed] = useState(false);
  const embed = useEmbedMode();

  const handleClose = () => {
    if (window.parent !== window) {
      window.parent.postMessage({ type: "tisanes:close" }, "*");
    }
    setClosed(true);
  };

  if (closed) {
    return (
      <div className="fixed inset-0 flex items-end justify-end p-4">
        <button
          type="button"
          onClick={() => setClosed(false)}
          className="flex items-center gap-2 rounded-full bg-emerald-900 px-5 py-3 text-sm font-medium text-emerald-50 shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-800"
        >
          <MessageCircle className="h-4 w-4" />
          Réouvrir le chat · Reopen chat
        </button>
      </div>
    );
  }

  // Mode "panel" : panneau chat large autonome pour l'embed WordPress
  // (le parent fournit juste un conteneur plein écran, sans chrome).
  if (embed === "panel") {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-stone-950/60 sm:p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <div className="h-full max-h-[100dvh] w-full overflow-hidden bg-white shadow-2xl sm:max-h-[680px] sm:max-w-[960px] sm:rounded-3xl">
          <ChatAssistant fullHeight onClose={handleClose} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-end justify-end sm:p-4">
      <div className="h-full w-full overflow-hidden bg-white sm:h-[calc(100%-32px)] sm:max-h-[680px] sm:w-[400px] sm:rounded-3xl sm:shadow-2xl sm:shadow-emerald-900/25">
        <ChatAssistant fullHeight onClose={handleClose} />
      </div>
    </div>
  );
}
