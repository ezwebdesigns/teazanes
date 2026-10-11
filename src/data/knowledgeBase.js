// Base de connaissances Tisanes Canada™
// Source : documents « Service de marque privée » (FR-EN) et « Products & Pricing » B2B.
// PUBLIC_KB_TEXT est injecté dans le prompt du LLM : il ne contient JAMAIS les prix
// unitaires des produits (par sachet / par kg) — ceux-ci ne sont transmis que par courriel.

export const COMPANY = {
  name: "Tisanes Canada™",
  email: "info@tisanes.ca",
  address: "115-101 Omer-Deserres, Blainville, QC, J7C 0C9",
};

export const BLENDS = [
  {
    id: "rooibos",
    fr: "Tisane Rooibos",
    en: "Rooibos Herbal Tea",
    ingredients: "Organic red bush + organic cinnamon + organic cardamom pods + organic cloves",
    pyramid: { moq: 500, price: 0.41 },
    loose: { moq: 1, price: 57 },
  },
  {
    id: "relaxing",
    fr: "Tisane Relaxante",
    en: "Relaxing herbal tea",
    ingredients: "Organic chamomile, organic cinnamon, organic lavender, natural essences",
    pyramid: { moq: 500, price: 0.48 },
    loose: { moq: 1, price: 58 },
  },
  {
    id: "uplifting",
    fr: "Tisane Énergisante / Adaptogène",
    en: "Uplifting / Adaptogenic herbal tea",
    ingredients:
      "Organic turmeric root + organic cinnamon + organic ginger root + organic cardamom pods + organic black pepper + organic lemongrass",
    pyramid: { moq: 500, price: 0.52 },
    loose: { moq: 1, price: 51 },
  },
  {
    id: "digestion",
    fr: "Tisane Digestion",
    en: "Gut health / Digestion herbal tea",
    ingredients:
      "Organic lemon balm + organic peppermint + organic ginger root + organic anise + organic chamomile + organic fennel + safflower",
    pyramid: { moq: 500, price: 0.46 },
    loose: { moq: 1, price: 68 },
  },
  {
    id: "teatox",
    fr: "Tisane Détox / Teatox",
    en: "Cleansing / Teatox herbal tea",
    ingredients:
      "Organic dandelion leaf + organic lemongrass + organic burdock + organic schisandra berries + organic yellow dock + organic red clover + natural essences",
    pyramid: { moq: 500, price: 0.52 },
    loose: { moq: 1, price: 82 },
  },
  {
    id: "balance",
    fr: "Tisane Équilibre / Réconfort",
    en: "Balance / Comforting herbal tea",
    ingredients:
      "Organic holy basil + organic dandelion leaf + sage + organic St. John's wort + organic shatavari root + organic nettle + organic red clover + organic lemon balm + organic elderflowers",
    pyramid: { moq: 500, price: 0.48 },
    loose: { moq: 1, price: 51 },
  },
  {
    id: "immune",
    fr: "Tisane Immunité",
    en: "Immune boost herbal tea",
    ingredients: "Organic moringa + organic hibiscus + organic cinnamon + organic rosehips",
    pyramid: { moq: 500, price: 0.46 },
    loose: { moq: 1, price: 62 },
  },
  {
    id: "fruit",
    fr: "Tisane de fruits",
    en: "Herbal fruit tea",
    ingredients:
      "Organic hibiscus + organic goji berries + organic green rooibos + organic rooibos + organic black currants + organic elderberries + natural essences",
    pyramid: { moq: 500, price: 0.43 },
    loose: { moq: 1, price: 88 },
  },
];

export const blendLabel = (b) => `${b.fr} / ${b.en}`;

export const PACKAGING_OPTIONS = [
  {
    id: "printed_zipper",
    fr: "Sachets zip entièrement imprimés",
    en: "Custom printed zipper bags (full print)",
    price: 2.0,
    unit: { fr: "sac", en: "bag" },
  },
  {
    id: "labeled_zipper",
    fr: "Sachets zip avec étiquettes personnalisées (Kraft, Noir, Blanc)",
    en: "Zipper bags with custom labels (Kraft, Black, White)",
    price: 1.8,
    unit: { fr: "sac", en: "bag" },
  },
  {
    id: "tins",
    fr: "Boîtes métalliques (Noir, Blanc, Argent, Or)",
    en: "Metal tins (Black, White, Silver, Gold)",
    price: 3.5,
    unit: { fr: "boîte", en: "tin" },
  },
];

export const SERVICES = {
  designFee: 350,
  sampleFee: 50,
  formulationFee: 350,
  customLooseMoqKg: 5,
  customPyramidMoq: 2000,
};

export const LEAD_TIMES = {
  fr: "7 à 14 jours ouvrables pour les commandes de moins de 50 kg ; 3 à 4 semaines au-delà (100 kg et plus : estimation personnalisée). Conception d'emballage : 2 à 3 jours ouvrables. Production : 3 à 4 jours ouvrables. Emballage et expédition : 1 à 2 jours ouvrables.",
  en: "7 to 14 business days for orders under 50 kg; 3 to 4 weeks above that (100 kg and over: personalized estimate). Packaging design: 2–3 business days. Production: 3–4 business days. Packing & shipping: 1–2 business days.",
};

export const TERMS = {
  fr: "Un numéro d'entreprise (BN) peut être demandé pour vérifier la légitimité de votre entreprise. Le montant total de la commande est payable avant la production. Prix valides 30 jours, sujets aux fluctuations du marché.",
  en: "A valid business number (BN) may be requested to verify the legitimacy of your business. 100% of the order amount is due before production. Prices valid for 30 days, subject to market fluctuations.",
};

export const PUBLIC_KB_TEXT = `TISANES CANADA — B2B SERVICES (PRIVATE LABEL & CUSTOM BLENDS)
Company: Tisanes Canada™, Blainville, QC, Canada. Contact: info@tisanes.ca, 115-101 Omer-Deserres, Blainville, QC, J7C 0C9.

PRIVATE LABEL SERVICE (in-house blends — turn-key):
- 8 in-house blends: (1) Rooibos herbal tea [organic red bush + organic cinnamon + organic cardamom pods + organic cloves]; (2) Relaxing [organic chamomile, organic cinnamon, organic lavender, natural essences]; (3) Uplifting/Adaptogenic [organic turmeric root + organic cinnamon + organic ginger root + organic cardamom pods + organic black pepper + organic lemongrass]; (4) Gut health/Digestion [organic lemon balm + organic peppermint + organic ginger root + organic anise + organic chamomile + organic fennel + safflower]; (5) Cleansing/Teatox [organic dandelion leaf + organic lemongrass + organic burdock + organic schisandra berries + organic yellow dock + organic red clover + natural essences]; (6) Balance/Comforting [organic holy basil + organic dandelion leaf + sage + organic St. John's wort + organic shatavari root + organic nettle + organic red clover + organic lemon balm + organic elderflowers]; (7) Immune boost [organic moringa + organic hibiscus + organic cinnamon + organic rosehips]; (8) Herbal fruit tea [organic hibiscus + organic goji berries + organic green rooibos + organic rooibos + organic black currants + organic elderberries + natural essences].
- MOQ: under 50 kg: 1 kg per flavor (loose) or 500 pyramid tea bags per blend; 50 kg and over: 12 cases per flavor (10–40 units per case).
- Packaging options: custom printed zipper bags; zipper bags with custom labels (Kraft, Black, White); metal tins (Black, White, Silver, Gold); co-packing with the customer's own ready-to-use packaging (no extra cost). Detailed packaging pricing is shared in the official quote email only.
- Packaging design: the customer provides their own artwork (free — we provide templates) or our in-house design service costs $350 per artwork (includes all flavor/blend/color variations as long as the base layout is unchanged).
- Clients have total control over packaging design and are free to rename the blends.
- Samples: private label — up to 8 samples, $50 fee (lets you validate taste and functionality before moving forward).

CUSTOM BLENDS (built to your spec):
- Recipe formulation: $350 (account opening, sourcing, formulation, blending, sampling). 1 sample per blend + 2 revisions included; additional revisions charged.
- MOQ: 5 kg loose or 2,000 pyramid tea bags per blend.
- Production cost depends on the recipe — a customized quote is provided after the recipe is reviewed. There is no fixed price for this service.

QUALITY: Most ingredients are certified Organic (Ecocert); non-organic ingredients are GMO-free. All blends are caffeine-free, vegan, with no artificial flavors. Ingredient lists are clearly identified for each blend. Pyramid tea bags are plant-based, compostable and non-GMO.

LEAD TIMES: 7–14 business days for orders under 50 kg; 3–4 weeks over 50 kg (100 kg and over: personalized estimate). Packaging design 2–3 business days; production 3–4 business days; packing & shipping 1–2 business days. A custom brand of herbal teas can be set up in as little as 3 weeks. Delivery 3–5 business days depending on carrier. Orders ship within 24 business hours of completion with tracking.

PROCESS: (1) account creation (an online client portal is created for future orders), (2) optional sample request, (3) packaging design (template provided, or our design service), (4) production — blending, packing, labeling, final quality check, (5) shipping.

TERMS: A valid business number (BN) may be requested to verify legitimacy (preferential rates apply to businesses only). 100% of the order amount is due before production. Prices valid for 30 days and subject to change with market fluctuations.`;