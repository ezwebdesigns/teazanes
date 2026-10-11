import { jsPDF } from "jspdf";
import { BLENDS, PACKAGING_OPTIONS, SERVICES, COMPANY, LEAD_TIMES, TERMS } from "@/data/knowledgeBase";

const money = (n) => `$${Number(n).toFixed(2)}`;

const DICT = {
  fr: {
    headerSub: "SOUMISSION B2B",
    quoteTitle: "Votre soumission",
    preparedFor: "Soumission préparée pour",
    greeting: (name) => `Bonjour ${name}, merci de votre intérêt ! Voici les informations demandées pour votre projet.`,
    products: "Produits sélectionnés",
    unitTeaBag: "sachet",
    unitNote: "Prix unitaires — MOQ par mélange.",
    customHead: "Mélange personnalisé",
    formulation: "Formulation de recette",
    formulationDesc: "ouverture de compte, recherche d'ingrédients, formulation, mélange, échantillonnage",
    customMoq: "MOQ : 5 kg en vrac ou 2 000 sachets pyramides par mélange.",
    customCost: "Le coût de production dépend de la recette — une soumission personnalisée suivra après révision.",
    packaging: "Options d'emballage",
    services: "Services",
    design: (fee) => `Design d'emballage : ${fee} par visuel (variations incluses) — ou votre propre visuel sans frais, gabarit fourni.`,
    samples: (fee) => `Échantillons : ${fee} — jusqu'à 8 mélanges.`,
    copacking: "Co-packing (votre propre emballage) : sans frais additionnels.",
    lead: "Délais",
    terms: "Conditions",
    cta: "Prêt à commencer ? Répondez simplement à ce courriel ou contactez-nous à info@tisanes.ca.",
    filePrefix: "Soumission-Tisanes",
  },
  en: {
    headerSub: "B2B QUOTE",
    quoteTitle: "Your quote",
    preparedFor: "Quote prepared for",
    greeting: (name) => `Hi ${name}, thank you for your interest! Here is the information you requested for your project.`,
    products: "Selected products",
    unitTeaBag: "tea bag",
    unitNote: "Unit prices — MOQ per blend.",
    customHead: "Custom blend",
    formulation: "Recipe formulation",
    formulationDesc: "account opening, sourcing, formulation, blending, sampling",
    customMoq: "MOQ: 5 kg loose or 2,000 pyramid tea bags per blend.",
    customCost: "Production cost depends on the recipe — a customized quote will follow once we review it.",
    packaging: "Packaging options",
    services: "Services",
    design: (fee) => `Packaging design: ${fee} per artwork (variations included) — or your own artwork at no cost, template provided.`,
    samples: (fee) => `Samples: ${fee} — up to 8 blends.`,
    copacking: "Co-packing (your own packaging): no additional cost.",
    lead: "Lead times",
    terms: "Terms",
    cta: "Ready to get started? Just reply to this email or contact us at info@tisanes.ca.",
    filePrefix: "Quote-Tisanes",
  },
};

export function downloadQuotePdf(record) {
  const fr = record.language !== "en";
  const t = fr ? DICT.fr : DICT.en;
  const isCustom = record.service_type === "private_label_custom";
  const isPyramid = record.category === "pyramid";
  const blends = (record.blends || []).map((id) => BLENDS.find((b) => b.id === id)).filter(Boolean);

  const doc = new jsPDF();
  const W = doc.internal.pageSize.getWidth();
  const M = 16;
  let y = 0;

  // Bandeau d'entête
  doc.setFillColor(12, 59, 46);
  doc.rect(0, 0, W, 38, "F");
  doc.setTextColor(236, 253, 245);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.text("TISANES\u2122", M, 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("STAY ACTIVE \u00b7 DRINK HEALTHY", M, 22);
  doc.setFontSize(9);
  doc.text(t.headerSub, M, 30);
  y = 50;

  const para = (text, { size = 10, bold = false, color = [28, 25, 23], gap = 4 } = {}) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, W - 2 * M);
    if (y + lines.length * size * 0.42 + gap > 282) {
      doc.addPage();
      y = 22;
    }
    doc.text(lines, M, y);
    y += lines.length * size * 0.42 + gap;
  };

  const head = (text) => para(text, { size: 12, bold: true, color: [12, 59, 46], gap: 5 });

  const row = (left, right) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(28, 25, 23);
    const leftLines = doc.splitTextToSize(left, W - 2 * M - 45);
    if (y + Math.max(leftLines.length, 1) * 4.4 + 2 > 282) {
      doc.addPage();
      y = 22;
    }
    doc.text(leftLines, M, y);
    doc.setFont("helvetica", "bold");
    doc.text(right, W - M, y, { align: "right" });
    y += Math.max(leftLines.length, 1) * 4.4 + 2;
  };

  head(t.quoteTitle);
  para(`${t.preparedFor} ${record.business_name || ""}`, { size: 9, color: [120, 113, 108], gap: 8 });
  para(t.greeting(record.full_name || ""), { gap: 8 });

  if (blends.length) {
    head(t.products);
    blends.forEach((b) => {
      const p = isPyramid ? b.pyramid : b.loose;
      const unit = isPyramid ? t.unitTeaBag : "kg";
      const moq = isPyramid ? `${p.moq}` : `${p.moq} kg`;
      const name = fr ? b.fr : b.en;
      row(`${name} \u2014 MOQ ${moq}`, `${money(p.price)} / ${unit}`);
    });
    para(t.unitNote, { size: 9, color: [120, 113, 108], gap: 8 });
  }

  if (isCustom) {
    head(t.customHead);
    para(`\u2022 ${t.formulation} : ${money(SERVICES.formulationFee)} (${t.formulationDesc})`);
    para(`\u2022 ${t.customMoq}`);
    para(`\u2022 ${t.customCost}`, { gap: 8 });
  }

  head(t.packaging);
  PACKAGING_OPTIONS.forEach((p) => {
    row(fr ? p.fr : p.en, `${money(p.price)} / ${fr ? p.unit.fr : p.unit.en}`);
  });
  y += 4;

  head(t.services);
  para(`\u2022 ${t.design(money(SERVICES.designFee))}`);
  para(`\u2022 ${t.samples(money(SERVICES.sampleFee))}`);
  para(`\u2022 ${t.copacking}`, { gap: 8 });

  head(t.lead);
  para(fr ? LEAD_TIMES.fr : LEAD_TIMES.en, { gap: 8 });

  head(t.terms);
  para(fr ? TERMS.fr : TERMS.en, { gap: 8 });

  para(t.cta, { bold: true, gap: 14 });
  para(`Tisanes Canada\u2122 \u00b7 ${COMPANY.address} \u00b7 ${COMPANY.email}`, { size: 9, color: [120, 113, 108] });

  const safeName = (record.business_name || "client").replace(/[^\w-]+/g, "-");
  doc.save(`${t.filePrefix}-${safeName}.pdf`);
}