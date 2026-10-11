import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Image } from "@/components/ui/image";
import { Leaf, Loader2, Upload } from "lucide-react";
import { getCompanySettings, saveLogoUrl } from "@/lib/companySettings";

export default function SettingsDialog({ open, onClose, onSaved }) {
  const { toast } = useToast();
  const [logoUrl, setLogoUrl] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      getCompanySettings()
        .then((s) => setLogoUrl(s?.logo_url || ""))
        .catch(() => {});
    }
  }, [open]);

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
      reader.onerror = () => reject(new Error('read error'));
      reader.readAsDataURL(file);
    });

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Erreur", description: "Fichier trop volumineux (max 5MB).", variant: "destructive" });
      e.target.value = "";
      return;
    }
    setBusy(true);
    try {
      const base64 = await fileToBase64(file);
      const res = await fetch('/api/upload-logo', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type, data: base64 }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.detail || payload.error || "Erreur upload");
      }
      const data = await res.json();
      const url = data.file_url;
      if (!url) throw new Error("no url");
      await saveLogoUrl(url);
      setLogoUrl(url);
      onSaved(url);
      toast({
        title: "Logo enregistré ✓",
        description: "Il apparaît maintenant dans l'assistant et dans l'entête de la soumission.",
      });
    } catch (err) {
      toast({ title: "Erreur", description: err?.message || "Impossible d'enregistrer le logo.", variant: "destructive" });
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Paramètres — Logo de la compagnie</DialogTitle>
          <DialogDescription>
            Logo utilisé comme avatar de l'assistant et dans l'entête de la soumission (courriel et PDF).
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-5 py-2">
          {logoUrl ? (
            <Image src={logoUrl} alt="Logo" className="h-20 w-20 rounded-2xl border border-stone-200" fittingType="fill" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-stone-50">
              <Leaf className="h-7 w-7 text-stone-300" />
            </div>
          )}
          <div className="flex-1">
            <p className="mb-3 text-xs text-stone-500">PNG ou JPG carré recommandé (affichage en cercle dans le chat).</p>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-emerald-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-800">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {busy ? "Enregistrement…" : logoUrl ? "Remplacer le logo" : "Choisir un logo"}
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={busy} />
            </label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}