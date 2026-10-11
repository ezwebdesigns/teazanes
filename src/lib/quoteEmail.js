import { BLENDS, PACKAGING_OPTIONS, SERVICES, COMPANY, LEAD_TIMES, TERMS } from "@/data/knowledgeBase";

function escapeHtml(value = "") {
  return String(value).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

const money = (n) => `$${Number(n).toFixed(2)}`;

const DICT = {
  fr: {
    subject: (biz) => `Votre soumission Tisanes Canada™ — ${biz}`,
    quoteTitle: "Votre soumission",
    preparedFor: "Soumission B2B préparée pour",
    greeting: (name) => `Bonjour ${name}, merci de votre intérêt ! Voici les informations demandées pour votre projet.`,
    products: "Produits sélectionnés",
    tableBlend: "Mélange",
    tablePrice: "Prix",
    unitTeaBag: "sachet",
    unitNote: "Prix unitaires — MOQ par mélange.",
    customHead: "Mélange personnalisé",
    formulation: "Formulation de recette",
    formulationDesc: "ouverture de compte, recherche d'ingrédients, formulation, mélange, échantillonnage",
    customMoq: "MOQ : 5 kg en vrac ou 2 000 sachets pyramides par mélange.",
    customCost: "Le coût de production dépend de la recette — une soumission personnalisée suivra après révision.",
    packaging: "Options d'emballage",
    services: "Services",
    design: "Design d'emballage",
    designDesc: "par visuel (variations de saveurs / couleurs incluses) — ou votre propre visuel sans frais, gabarit fourni.",
    samples: "Échantillons",
    samplesDesc: "jusqu'à 8 mélanges.",
    copacking: "Co-packing (votre propre emballage) : sans frais additionnels.",
    lead: "Délais",
    terms: "Conditions",
    cta: "Prêt à commencer ? Répondez simplement à ce courriel.",
  },
  en: {
    subject: (biz) => `Your Tisanes Canada™ quote — ${biz}`,
    quoteTitle: "Your quote",
    preparedFor: "B2B quote prepared for",
    greeting: (name) => `Hi ${name}, thank you for your interest! Here is the information you requested for your project.`,
    products: "Selected products",
    tableBlend: "Blend",
    tablePrice: "Price",
    unitTeaBag: "tea bag",
    unitNote: "Unit prices — MOQ per blend.",
    customHead: "Custom blend",
    formulation: "Recipe formulation",
    formulationDesc: "account opening, sourcing, formulation, blending, sampling",
    customMoq: "MOQ: 5 kg loose or 2,000 pyramid tea bags per blend.",
    customCost: "Production cost depends on the recipe — a customized quote will follow once we review it.",
    packaging: "Packaging options",
    services: "Services",
    design: "Packaging design",
    designDesc: "per artwork (flavor / color variations included) — or your own artwork at no cost, template provided.",
    samples: "Samples",
    samplesDesc: "up to 8 blends.",
    copacking: "Co-packing (your own packaging): no additional cost.",
    lead: "Lead times",
    terms: "Terms",
    cta: "Ready to get started? Just reply to this email.",
  },
};

const th = (label, extra = "") =>
  `<th style="padding:10px 12px;background:#0c3b2e;color:#ecfdf5;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;text-align:left;${extra}">${label}</th>`;

const td = (html, extra = "") =>
  `<td style="padding:10px 12px;border-bottom:1px solid #eee;font-size:14px;color:#1c1917;${extra}">${html}</td>`;

const h2 = (label) =>
  `<h2 style="margin:26px 0 10px;font-size:15px;color:#0c3b2e;letter-spacing:0.02em;">${label}</h2>`;

export function buildQuoteEmail(record, logoUrl = "") {
  const fr = record.language !== "en";
  const t = fr ? DICT.fr : DICT.en;
  const name = escapeHtml(record.full_name || "");
  const business = escapeHtml(record.business_name || "");
  const isCustom = record.service_type === "private_label_custom";
  const isPyramid = record.category === "pyramid";
  const blends = (record.blends || []).map((id) => BLENDS.find((b) => b.id === id)).filter(Boolean);

  const headerInner = logoUrl
    ? `<img src="${escapeHtml(logoUrl)}" alt="Tisanes Canada™" style="height:40px;display:block;" />`
    : `<p style="margin:0;color:#ecfdf5;font-size:20px;font-weight:700;letter-spacing:0.22em;">TISANES™</p>`;

  const productTable = blends.length
    ? `${h2(t.products)}
    <table style="width:100%;border-collapse:collapse;border:1px solid #eee;">
      <tr>${th(t.tableBlend)}${th("MOQ", "text-align:center;")}${th(t.tablePrice, "text-align:right;")}</tr>
      ${blends
        .map((b) => {
          const p = isPyramid ? b.pyramid : b.loose;
          const unit = isPyramid ? t.unitTeaBag : "kg";
          const moq = isPyramid ? `${p.moq}` : `${p.moq} kg`;
          const primary = escapeHtml(fr ? b.fr : b.en);
          const secondary = escapeHtml(fr ? b.en : b.fr);
          return `<tr>${td(
            `<strong>${primary}</strong><br><span style="color:#78716c;font-size:12px;">${secondary}</span>`
          )}${td(moq, "text-align:center;")}${td(`<strong>${money(p.price)}</strong> / ${unit}`, "text-align:right;")}</tr>`;
        })
        .join("")}
    </table>
    <p style="color:#78716c;font-size:12px;margin:8px 0 0;">${t.unitNote}</p>`
    : "";

  const customBlock = isCustom
    ? `${h2(t.customHead)}
    <ul style="margin:0;padding-left:20px;font-size:14px;color:#1c1917;line-height:1.7;">
      <li>${t.formulation} : <strong>${money(SERVICES.formulationFee)}</strong> (${t.formulationDesc})</li>
      <li>${t.customMoq}</li>
      <li>${t.customCost}</li>
    </ul>`
    : "";

  const packTable = `${h2(t.packaging)}
    <table style="width:100%;border-collapse:collapse;border:1px solid #eee;">
      <tr>${th(t.packaging)}${th(t.tablePrice, "text-align:right;")}</tr>
      ${PACKAGING_OPTIONS.map((p) => {
        const primary = escapeHtml(fr ? p.fr : p.en);
        const secondary = escapeHtml(fr ? p.en : p.fr);
        return `<tr>${td(
          `<strong>${primary}</strong><br><span style="color:#78716c;font-size:12px;">${secondary}</span>`
        )}${td(`<strong>${money(p.price)}</strong> / ${fr ? p.unit.fr : p.unit.en}`, "text-align:right;")}</tr>`;
      }).join("")}
    </table>`;

  const servicesBlock = `${h2(t.services)}
    <ul style="margin:0;padding-left:20px;font-size:14px;color:#1c1917;line-height:1.7;">
      <li>${t.design} : <strong>${money(SERVICES.designFee)}</strong> ${t.designDesc}</li>
      <li>${t.samples} : <strong>${money(SERVICES.sampleFee)}</strong> — ${t.samplesDesc}</li>
      <li>${t.copacking}</li>
    </ul>`;

  const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background-color:#f6f6f4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f6f4;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e7e5e4;">
        <tr>
          <td style="background:#0c3b2e;padding:26px 32px;">
            ${headerInner}
            <p style="margin:10px 0 0;color:#a7f3d0;font-size:11px;letter-spacing:0.3em;">STAY ACTIVE · DRINK HEALTHY</p>
          </td>
        </tr>
        <tr><td style="padding:32px;">
          <h1 style="margin:0 0 4px;font-size:22px;color:#1c1917;">${t.quoteTitle}</h1>
          <p style="margin:0 0 20px;color:#78716c;font-size:13px;">${t.preparedFor} <strong>${business}</strong></p>
          <p style="margin:0 0 8px;font-size:15px;color:#1c1917;line-height:1.6;">${t.greeting(name)}</p>
          ${productTable}
          ${customBlock}
          ${packTable}
          ${servicesBlock}
          ${h2(t.lead)}
          <p style="margin:0;font-size:14px;color:#44403c;line-height:1.6;">${fr ? LEAD_TIMES.fr : LEAD_TIMES.en}</p>
          ${h2(t.terms)}
          <p style="margin:0;font-size:14px;color:#44403c;line-height:1.6;">${fr ? TERMS.fr : TERMS.en}</p>
          <p style="margin:20px 0 0;font-size:15px;color:#1c1917;line-height:1.6;">${t.cta}</p>
        </td></tr>
        <tr><td style="padding:20px 32px;background:#f8f7f5;border-top:1px solid #eee;">
          <p style="margin:0;font-size:13px;color:#57534e;line-height:1.6;">Tisanes Canada™ · ${COMPANY.address}<br><a href="mailto:${COMPANY.email}" style="color:#0c3b2e;">${COMPANY.email}</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return {
    subject: t.subject(record.business_name || ""),
    html,
  };
}