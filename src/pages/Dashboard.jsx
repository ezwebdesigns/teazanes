import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DragDropContext } from "@hello-pangea/dnd";
import { useToast } from "@/components/ui/use-toast";
import { useAdminAuth } from "@/lib/AdminAuthContext";
import { Leaf, Loader2, LogOut, MessageSquare, RefreshCw, Settings2 } from "lucide-react";
import KanbanColumn from "@/components/dashboard/KanbanColumn";
import QuoteDetailDialog from "@/components/dashboard/QuoteDetailDialog";
import SettingsDialog from "@/components/dashboard/SettingsDialog";
import { getCompanySettings } from "@/lib/companySettings";

const COLUMNS = [
  { status: "new", title: "Nouveau", subtitle: "Aucune nouvelle demande", accent: "bg-amber-400" },
  { status: "validated", title: "Validée", subtitle: "Aucune soumission validée", accent: "bg-emerald-500" },
  { status: "won", title: "Gagnée", subtitle: "Aucune commande gagnée", accent: "bg-sky-500" },
  { status: "lost", title: "Perdue", subtitle: "Aucune demande perdue", accent: "bg-stone-400" },
];

async function fetchQuotes() {
  const res = await fetch('/api/quotes', { credentials: 'include' });
  if (!res.ok) throw new Error('Erreur chargement');
  return res.json();
}

async function updateQuote(id, data) {
  const res = await fetch(`/api/quotes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erreur mise à jour');
  return res.json();
}

async function deleteQuote(id) {
  const res = await fetch(`/api/quotes/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erreur suppression');
}

async function sendQuoteApi(id) {
  const res = await fetch('/api/send-quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error('Erreur envoi');
}

export default function Dashboard() {
  const { toast } = useToast();
  const { logout } = useAdminAuth();
  const [records, setRecords] = useState(null);
  const [selected, setSelected] = useState(null);
  const [sending, setSending] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");

  const load = useCallback(async () => {
    try {
      const all = await fetchQuotes();
      setRecords(all);
    } catch (err) {
      setRecords([]);
      toast({ title: "Erreur de chargement", description: "Impossible de charger les demandes.", variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    getCompanySettings()
      .then((s) => setLogoUrl(s?.logo_url || ""))
      .catch(() => {});
  }, []);

  const onDragEnd = async (result) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    const newStatus = destination.droppableId;
    const rec = (records || []).find((r) => r.id === draggableId);
    if (!rec || rec.status === newStatus) return;
    try {
      await updateQuote(draggableId, { status: newStatus });
      setRecords((rs) => rs.map((r) => (r.id === draggableId ? { ...r, status: newStatus } : r)));
      if (newStatus === "validated" && !rec.quote_sent_date) {
        toast({
          title: "Demande déplacée dans « Validée »",
          description: "Ouvrez la carte et cliquez « Valider & envoyer » pour envoyer la soumission par courriel.",
        });
      }
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible de déplacer la demande.", variant: "destructive" });
    }
  };

  const sendQuote = async (record) => {
    setSending(true);
    try {
      await sendQuoteApi(record.id);
      toast({ title: "Soumission envoyée ✓", description: `Courriel transmis à ${record.email}.` });
      setSelected(null);
      load();
    } catch (err) {
      toast({
        title: "Échec de l'envoi",
        description: String(err?.message || err),
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const setStatus = async (record, status) => {
    try {
      await updateQuote(record.id, { status });
      setSelected(null);
      load();
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible de mettre à jour la demande.", variant: "destructive" });
    }
  };

  const deleteRecord = async (record) => {
    try {
      await deleteQuote(record.id);
      toast({ title: "Demande supprimée", description: record.business_name });
      setSelected(null);
      load();
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible de supprimer la demande.", variant: "destructive" });
    }
  };

  const newCount = (records || []).filter((r) => r.status === "new").length;

  return (
    <div className="min-h-screen bg-stone-100/60">
      <header className="sticky top-0 z-10 border-b border-stone-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-900">
              <Leaf className="h-5 w-5 text-emerald-50" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-emerald-950">TISANES™ · Soumissions B2B</p>
              <p className="text-[11px] text-stone-500">
                {records?.length ?? 0} demandes · {newCount} à traiter
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Link
              to="/"
              className="flex items-center gap-1.5 rounded-full border border-stone-200 px-3 py-1.5 text-xs text-stone-600 transition hover:border-emerald-300 hover:text-emerald-800"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Assistant
            </Link>
            <button
              onClick={() => setShowSettings(true)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition hover:border-emerald-300 hover:text-emerald-800"
              title="Paramètres — logo"
            >
              <Settings2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={load}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition hover:border-emerald-300 hover:text-emerald-800"
              title="Rafraîchir"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => logout()}
              className="flex items-center gap-1.5 rounded-full border border-stone-200 px-3 py-1.5 text-xs text-stone-600 transition hover:border-rose-300 hover:text-rose-700"
            >
              <LogOut className="h-3.5 w-3.5" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {records === null ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-emerald-800" />
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {COLUMNS.map((col) => (
                <KanbanColumn
                  key={col.status}
                  status={col.status}
                  title={col.title}
                  subtitle={col.subtitle}
                  accent={col.accent}
                  records={records.filter((r) => r.status === col.status)}
                  onOpen={setSelected}
                />
              ))}
            </div>
          </DragDropContext>
        )}
      </main>

      <QuoteDetailDialog
        record={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onSendQuote={sendQuote}
        onSetStatus={setStatus}
        onDelete={deleteRecord}
        sending={sending}
        logoUrl={logoUrl}
      />

      <SettingsDialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        onSaved={setLogoUrl}
      />
    </div>
  );
}