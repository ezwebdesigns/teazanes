import React, { useMemo, useState } from "react";
import moment from "moment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCheck,
  Download,
  Loader2,
  Mail,
  Package,
  Phone,
  Send,
  Trash2,
  Trophy,
  XCircle,
} from "lucide-react";
import { buildQuoteEmail } from "@/lib/quoteEmail";
import { downloadQuotePdf } from "@/lib/quotePdf";
import { BLENDS } from "@/data/knowledgeBase";

const serviceLabel = {
  private_label_in_house: "Marque privée / Private label",
  private_label_custom: "Mélange personnalisé / Custom blend",
  general: "Général / General",
};
const categoryLabel = { pyramid: "Sachets pyramides / Pyramid bags", loose_leaf: "Vrac / Loose leaf" };

export default function QuoteDetailDialog({
  record,
  open,
  onClose,
  onSendQuote,
  onSetStatus,
  onDelete,
  sending,
  logoUrl,
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const quote = useMemo(
    () => (record ? buildQuoteEmail(record, logoUrl) : null),
    [record, logoUrl]
  );

  if (!record) return null;
  const sent = !!record.quote_sent_date;
  const blends = (record.blends || []).map((id) => BLENDS.find((b) => b.id === id)).filter(Boolean);

  const infoRow = (label, value) => (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-stone-400">{label}</p>
      <p className="text-sm text-stone-700">{value || "—"}</p>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {record.business_name}
            {sent && <CheckCheck className="h-4 w-4 text-emerald-600" />}
          </DialogTitle>
          <DialogDescription>
            Demande reçue {moment(record.created_date).format("LLL")} · {record.full_name}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
          {infoRow("Contact", record.full_name)}
          {infoRow("Entreprise", record.business_name)}
          {infoRow("Service", serviceLabel[record.service_type] || "—")}
          {infoRow("Format", record.category ? categoryLabel[record.category] : "—")}
          {infoRow(
            "Courriel",
            <a
              href={`mailto:${record.email}`}
              className="inline-flex items-center gap-1 text-emerald-800 underline-offset-2 hover:underline"
            >
              <Mail className="h-3.5 w-3.5" />
              {record.email}
            </a>
          )}
          {infoRow(
            "Téléphone",
            record.phone ? (
              <span className="inline-flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                {record.phone}
              </span>
            ) : "—"
          )}
          {infoRow("Quantité estimée", record.estimated_quantity)}
        </div>

        {blends.length > 0 && (
          <div>
            <p className="mb-1.5 text-[11px] uppercase tracking-wide text-stone-400">Mélanges / Blends</p>
            <div className="flex flex-wrap gap-1.5">
              {blends.map((b) => (
                <span
                  key={b.id}
                  className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs text-emerald-800"
                >
                  <Package className="h-3 w-3" />
                  {b.fr} · {b.en}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="mb-1.5 text-[11px] uppercase tracking-wide text-stone-400">
            Aperçu de la soumission / Quote preview
          </p>
          <iframe
            title="Aperçu de la soumission"
            srcDoc={quote?.html}
            className="h-80 w-full rounded-lg border border-stone-200 bg-stone-50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-stone-100 pt-4">
          <button
            onClick={() => onSendQuote(record)}
            disabled={sending || sent}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-800 disabled:opacity-50"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {sent ? `Envoyée ${moment(record.quote_sent_date).fromNow()}` : "Valider & envoyer la soumission"}
          </button>
          <button
            onClick={() => downloadQuotePdf(record)}
            className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 px-3.5 py-2 text-xs text-stone-600 transition hover:border-emerald-600 hover:text-emerald-800"
          >
            <Download className="h-3.5 w-3.5" />
            Télécharger / Download
          </button>
          {record.status !== "new" && (
            <>
              <button
                onClick={() => onSetStatus(record, "won")}
                className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 px-3.5 py-2 text-xs text-stone-600 transition hover:border-sky-400 hover:text-sky-700"
              >
                <Trophy className="h-3.5 w-3.5" />
                Gagnée
              </button>
              <button
                onClick={() => onSetStatus(record, "lost")}
                className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 px-3.5 py-2 text-xs text-stone-600 transition hover:border-rose-400 hover:text-rose-700"
              >
                <XCircle className="h-3.5 w-3.5" />
                Perdue
              </button>
            </>
          )}
          <button
            onClick={() => {
              if (!confirmDelete) {
                setConfirmDelete(true);
                return;
              }
              onDelete(record);
            }}
            onBlur={() => setConfirmDelete(false)}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs text-stone-400 transition hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {confirmDelete ? "Confirmer la suppression ?" : "Supprimer"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}