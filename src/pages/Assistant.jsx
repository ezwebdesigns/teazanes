import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import ChatAssistant from "@/components/chat/ChatAssistant";

export default function Assistant() {
  const [closed, setClosed] = useState(false);

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

  return (
    <div className="fixed inset-0 flex items-end justify-end sm:p-4">
      <div className="h-full w-full overflow-hidden bg-white sm:h-[calc(100%-32px)] sm:max-h-[680px] sm:w-[400px] sm:rounded-3xl sm:shadow-2xl sm:shadow-emerald-900/25">
        <ChatAssistant fullHeight onClose={handleClose} />
      </div>
    </div>
  );
}