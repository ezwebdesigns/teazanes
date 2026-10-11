import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Lock } from "lucide-react";
import ChatAssistant from "@/components/chat/ChatAssistant";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/70 via-stone-50 to-stone-50">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 pt-8 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-900 shadow-sm">
            <Leaf className="h-5 w-5 text-emerald-50" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold tracking-[0.18em] text-emerald-950">TISANES™</p>
            <p className="text-[10px] uppercase tracking-[0.28em] text-emerald-700/70">Stay active · Drink healthy</p>
          </div>
        </div>
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white/70 px-3.5 py-2 text-xs text-stone-500 transition-colors hover:border-emerald-300 hover:text-emerald-800"
        >
          <Lock className="h-3.5 w-3.5" />
          Espace admin
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-16 pt-10 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-emerald-950 sm:text-4xl">
            Assistant soumissions B2B
          </h1>
          <p className="mt-2.5 text-sm text-stone-500">
            Marque privée & mélanges personnalisés — Private label & custom blends
          </p>
        </div>

        <ChatAssistant />

        <footer className="mt-10 space-y-1.5 text-center text-xs leading-relaxed text-stone-400">
          <p>© 2026 Tisanes Canada™ — 115-101 Omer-Deserres, Blainville (QC) — info@tisanes.ca</p>
          <p>
            Les prix détaillés sont transmis par courriel aux entreprises validées.
            <br />
            Detailed pricing is sent by email to verified businesses.
          </p>
        </footer>
      </main>
    </div>
  );
}