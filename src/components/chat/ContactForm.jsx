import React, { useState } from "react";
import { Loader2, Send } from "lucide-react";

const EMPTY = { full_name: "", business_name: "", email: "", phone: "", estimated_quantity: "" };

const L = {
  fr: {
    fullName: "Nom complet *",
    business: "Entreprise *",
    email: "Courriel *",
    phone: "Téléphone (optionnel)",
    quantity: "Quantité estimée (optionnel)",
    submit: "Recevoir ma soumission",
    error: "Merci de compléter le nom, l'entreprise et un courriel valide.",
    qtyPlaceholder: "ex. 1 000 sachets par mélange",
  },
  en: {
    fullName: "Full name *",
    business: "Business name *",
    email: "Email *",
    phone: "Phone (optional)",
    quantity: "Estimated quantity (optional)",
    submit: "Get my quote",
    error: "Please complete your name, business name and a valid email.",
    qtyPlaceholder: "e.g. 1,000 bags per blend",
  },
};

export default function ContactForm({ onSubmit, busy, lang }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const t = lang === "en" ? L.en : L.fr;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.business_name.trim() || !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError(t.error);
      return;
    }
    setError("");
    onSubmit({ ...form, email: form.email.trim() });
  };

  const inputClass =
    "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-700/25";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-600">{t.fullName}</label>
          <input className={inputClass} value={form.full_name} onChange={set("full_name")} placeholder="John Doe" disabled={busy} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-600">{t.business}</label>
          <input className={inputClass} value={form.business_name} onChange={set("business_name")} placeholder="JD Teas Inc." disabled={busy} />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-600">{t.email}</label>
          <input className={inputClass} type="email" value={form.email} onChange={set("email")} placeholder="jd@email.com" disabled={busy} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-600">{t.phone}</label>
          <input className={inputClass} value={form.phone} onChange={set("phone")} placeholder="+1 ..." disabled={busy} />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-stone-600">{t.quantity}</label>
        <input className={inputClass} value={form.estimated_quantity} onChange={set("estimated_quantity")} placeholder={t.qtyPlaceholder} disabled={busy} />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-800 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-emerald-900 disabled:opacity-50 sm:w-auto"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {t.submit}
      </button>
    </form>
  );
}