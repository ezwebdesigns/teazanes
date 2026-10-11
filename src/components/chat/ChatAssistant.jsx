import React, { useEffect, useReducer, useRef, useState } from "react";
import { Leaf, X } from "lucide-react";
import { Image } from "@/components/ui/image";
import ChatMessage from "./ChatMessage";
import ChatChoices from "./ChatChoices";
import ContactForm from "./ContactForm";
import TypingIndicator from "./TypingIndicator";
import { getCompanySettings } from "@/lib/companySettings";
import { BLENDS } from "@/data/knowledgeBase";

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const initialState = {
  messages: [],
  data: { service_type: null, category: null, blends: [], language: "fr" },
  mode: "none",
  choices: [],
  selectedBlends: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "push_user":
      return { ...state, messages: [...state.messages, { id: uid(), from: "user", text: action.text }] };
    case "push_bot":
      return { ...state, messages: [...state.messages, { id: uid(), from: "bot", text: action.text }] };
    case "patch_data":
      return { ...state, data: { ...state.data, ...action.patch } };
    case "set_mode":
      return {
        ...state,
        mode: action.mode,
        choices: action.choices || [],
        ...(action.mode === "multi" ? { selectedBlends: [] } : {}),
      };
    case "toggle_blend":
      return {
        ...state,
        selectedBlends: state.selectedBlends.includes(action.id)
          ? state.selectedBlends.filter((x) => x !== action.id)
          : [...state.selectedBlends, action.id],
      };
    case "reset":
      return { ...initialState, data: { ...initialState.data, language: state.data.language } };
    default:
      return state;
  }
}

function getStep(step, data) {
  const fr = data.language !== "en";
  switch (step) {
    case "lang":
      return {
        texts: ["Bonjour, hi !\n\nChoisissez votre langue · Choose your language:"],
        mode: "choices",
        choices: [
          { id: "fr", label: "Français", next: "welcome", patch: { language: "fr" } },
          { id: "en", label: "English", next: "welcome", patch: { language: "en" } },
        ],
      };
    case "welcome":
      return {
        texts: [
          fr
            ? "Bienvenue chez Tisanes Canada™ — je suis l'assistant B2B. Je peux répondre à vos questions et préparer votre demande de soumission pour notre service de marque privée ou de mélanges personnalisés.\n\nComment puis-je vous aider ?"
            : "Welcome to Tisanes Canada™ — I'm the B2B assistant. I can answer your questions and get your quote request ready for our private label or custom blend service.\n\nHow may I help you?",
        ],
        mode: "choices",
        choices: fr
          ? [
              { id: "pl", label: "Marque privée — mélanges maison", next: "pl_category", patch: { service_type: "private_label_in_house" } },
              { id: "custom", label: "Mélange personnalisé sur mesure", next: "custom_info", patch: { service_type: "private_label_custom" } },
              { id: "info", label: "Autre question", next: "info" },
            ]
          : [
              { id: "pl", label: "Private label — in-house blends", next: "pl_category", patch: { service_type: "private_label_in_house" } },
              { id: "custom", label: "Custom blend", next: "custom_info", patch: { service_type: "private_label_custom" } },
              { id: "info", label: "Other question", next: "info" },
            ],
      };
    case "pl_category":
      return {
        texts: [
          fr
            ? "Parfait ! Notre service de marque privée clé en main couvre nos 8 mélanges maison. Vous gardez le contrôle total sur l'emballage et vous êtes libre de renommer les mélanges.\n\nQuel format vous intéresse ?"
            : "Great! Our turn-key private label service covers our 8 in-house blends. You keep total control over the packaging design and are free to rename the blends.\n\nWhich format are you interested in?",
        ],
        mode: "choices",
        choices: fr
          ? [
              { id: "pyramid", label: "Sachets pyramides", next: "pl_info", patch: { category: "pyramid" } },
              { id: "loose", label: "Feuilles en vrac", next: "pl_info", patch: { category: "loose_leaf" } },
            ]
          : [
              { id: "pyramid", label: "Pyramid tea bags", next: "pl_info", patch: { category: "pyramid" } },
              { id: "loose", label: "Loose leaf", next: "pl_info", patch: { category: "loose_leaf" } },
            ],
      };
    case "pl_info": {
      const pyr = data.category === "pyramid";
      const moq = fr
        ? pyr
          ? "500 sachets pyramides par mélange"
          : "1 kg par saveur"
        : pyr
          ? "500 pyramid tea bags per blend"
          : "1 kg per flavor";
      return {
        texts: [
          fr
            ? `Voici l'essentiel pour ce format :\n\n- **MOQ :** ${moq}\n- **Emballage :** sachets zip imprimés, sachets zip avec étiquettes (Kraft, Noir, Blanc), boîtes métalliques (Noir, Blanc, Argent, Or) — ou co-packing avec votre propre emballage, sans frais.\n- **Design :** votre propre visuel (gratuit, gabarit fourni) ou notre service de conception à 350 $ par visuel.\n- **Délais :** 7 à 14 jours ouvrables sous 50 kg, 3 à 4 semaines au-delà.\n- **Échantillons :** trousse à 50 $ incluant jusqu'à 8 mélanges.`
            : `Here are the key points for this format:\n\n- **MOQ:** ${moq}\n- **Packaging:** custom printed zipper bags, zipper bags with labels (Kraft, Black, White), metal tins (Black, White, Silver, Gold) — or co-packing with your own packaging at no extra cost.\n- **Design:** your own artwork (free, template provided) or our design service at $350 per artwork.\n- **Lead time:** 7–14 business days under 50 kg, 3–4 weeks above.\n- **Samples:** sample pack at $50 including up to 8 blends.`,
          fr
            ? `Nos 8 mélanges maison :\n\n${BLENDS.map((b, i) => `**${i + 1}. ${b.fr}**\n*${b.ingredients}*`).join("\n\n")}\n\nLesquels vous intéressent ?`
            : `Our 8 in-house blends:\n\n${BLENDS.map((b, i) => `**${i + 1}. ${b.en}**\n*${b.ingredients}*`).join("\n\n")}\n\nWhich ones interest you?`,
        ],
        mode: "multi",
        choices: BLENDS.map((b) => ({ id: b.id, label: fr ? b.fr : b.en })),
      };
    }
    case "custom_info":
      return {
        texts: [
          fr
            ? "Notre service de mélange personnalisé est clé en main : ouverture de compte, recherche d'ingrédients, formulation, mélange et échantillonnage — 350 $ par recette.\n\n- **MOQ :** 5 kg en vrac ou 2 000 sachets pyramides par mélange.\n- **Coût de production :** dépend de votre recette — nous fournissons une soumission personnalisée après révision de celle-ci.\n\nSouhaitez-vous laisser vos coordonnées pour recevoir votre soumission, ou avez-vous d'autres questions ?"
            : "Our custom blend service is turn-key: account opening, sourcing, formulation, blending and sampling — $350 per recipe.\n\n- **MOQ:** 5 kg loose or 2,000 pyramid tea bags per blend.\n- **Production cost:** depends on your recipe — we provide a customized quote once we've reviewed it.\n\nWould you like to leave your details to receive your quote, or do you have other questions?",
        ],
        mode: "choices",
        choices: fr
          ? [
              { id: "contact", label: "Laisser mes coordonnées", next: "pre_contact" },
              { id: "info", label: "Autre question", next: "info" },
            ]
          : [
              { id: "contact", label: "Leave my details", next: "pre_contact" },
              { id: "info", label: "Another question", next: "info" },
            ],
      };
    case "pre_contact": {
      const n = (data.blends || []).length;
      const intro = n > 0 ? (fr ? `${n} mélange${n > 1 ? "s" : ""} sélectionné${n > 1 ? "s" : ""} — excellent choix !\n\n` : `${n} blend${n > 1 ? "s" : ""} selected — great choice!\n\n`) : "";
      return {
        texts: [
          intro +
            (fr
              ? "Puisque nos tarifs préférentiels sont réservés aux entreprises, la soumission détaillée (incluant les prix) vous sera envoyée par courriel après validation de votre demande.\n\nJ'ai juste besoin de quelques coordonnées : votre nom complet, votre entreprise et votre courriel."
              : "Since our preferential pricing is intended for businesses only, the detailed quote (including pricing) will be sent to you by email once your request is validated.\n\nI just need a few details: your full name, business name and email address."),
        ],
        mode: "contact",
      };
    }
    case "done": {
      const first = (data.full_name || "").split(" ")[0] || "";
      const email = data.email || "";
      return {
        texts: [
          fr
            ? `Merci ${first} ! Votre demande a bien été enregistrée. Notre équipe l'examinera et vous recevrez votre soumission détaillée (incluant les prix) à l'adresse ${email}.\n\nEn attendant, n'hésitez pas si vous avez d'autres questions !`
            : `Thank you ${first}! Your request has been recorded. Our team will review it and you'll receive your detailed quote (including pricing) at ${email}.\n\nIn the meantime, feel free to ask anything else!`,
        ],
        mode: "choices",
        choices: fr
          ? [
              { id: "info", label: "Autre question", next: "info" },
              { id: "reset", label: "Nouvelle demande", next: "welcome_reset" },
            ]
          : [
              { id: "info", label: "Another question", next: "info" },
              { id: "reset", label: "New request", next: "welcome_reset" },
            ],
      };
    }
    case "info": {
      return {
        texts: [
          fr
            ? `Pour toute autre question, n'hésitez pas à nous contacter directement :\n\n📧 **info@tisanes.ca**\n📍 115-101 Omer-Deserres, Blainville, QC J7C 0C9\n\nNotre équipe vous répondra dans les meilleurs délais.`
            : `For any other questions, feel free to contact us directly:\n\n📧 **info@tisanes.ca**\n📍 115-101 Omer-Deserres, Blainville, QC J7C 0C9\n\nOur team will get back to you as soon as possible.`,
        ],
        mode: "choices",
        choices: fr
          ? [
              { id: "pl", label: "Marque privée — mélanges maison", next: "pl_category", patch: { service_type: "private_label_in_house" } },
              { id: "custom", label: "Mélange personnalisé", next: "custom_info", patch: { service_type: "private_label_custom" } },
              { id: "reset", label: "Nouvelle demande", next: "welcome_reset" },
            ]
          : [
              { id: "pl", label: "Private label — in-house blends", next: "pl_category", patch: { service_type: "private_label_in_house" } },
              { id: "custom", label: "Custom blend", next: "custom_info", patch: { service_type: "private_label_custom" } },
              { id: "reset", label: "New request", next: "welcome_reset" },
            ],
      };
    }
    default:
      return { texts: [], mode: "none" };
  }
}

export default function ChatAssistant({ fullHeight = false, onClose }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [typing, setTyping] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);
  const dataRef = useRef(state.data);
  dataRef.current = state.data;
  const scrollRef = useRef(null);
  const startedRef = useRef(false);
  const fr = state.data.language !== "en";

  useEffect(() => {
    getCompanySettings()
      .then((s) => setLogoUrl(s?.logo_url || null))
      .catch(() => {});
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [state.messages.length, typing, state.mode]);

  async function runStep(step, data) {
    const content = getStep(step, data);
    for (const text of content.texts) {
      setTyping(true);
      await sleep(text.length > 300 ? 900 : 600);
      setTyping(false);
      dispatch({ type: "push_bot", text });
      await sleep(150);
    }
    dispatch({ type: "set_mode", mode: content.mode, choices: content.choices || [] });
  }

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    runStep("lang", initialState.data);
  }, []);

  const handleChoice = async (choice) => {
    if (typing) return;
    if (choice.next === "welcome_reset") {
      const lang = dataRef.current.language;
      dispatch({ type: "reset" });
      runStep("welcome", { language: lang });
      return;
    }
    dispatch({ type: "push_user", text: choice.label });
    if (choice.patch) dispatch({ type: "patch_data", patch: choice.patch });
    runStep(choice.next, { ...dataRef.current, ...(choice.patch || {}) });
  };

  const handleBlendContinue = async () => {
    const ids = state.selectedBlends;
    if (!ids.length || typing) return;
    const labels = ids.map((id) => {
      const b = BLENDS.find((x) => x.id === id);
      return fr ? b.fr : b.en;
    });
    dispatch({ type: "push_user", text: labels.join(", ") });
    dispatch({ type: "patch_data", patch: { blends: ids } });
    runStep("pre_contact", { ...dataRef.current, blends: ids });
  };

  const handleContactSubmit = async (payload) => {
    dispatch({
      type: "push_user",
      text: `${payload.full_name} · ${payload.business_name} · ${payload.email}`,
    });
    setTyping(true);
    try {
      const record = {
        full_name: payload.full_name,
        business_name: payload.business_name,
        email: payload.email,
        phone: payload.phone || "",
        estimated_quantity: payload.estimated_quantity || "",
        service_type: dataRef.current.service_type || "private_label_in_house",
        blends: dataRef.current.blends || [],
        language: dataRef.current.language || "fr",
        status: "new",
      };
      if (dataRef.current.category) record.category = dataRef.current.category;

      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(record),
      });
      if (!res.ok) throw new Error('Erreur serveur');

      setTyping(false);
      const patch = { full_name: payload.full_name, email: payload.email };
      dispatch({ type: "patch_data", patch });
      runStep("done", { ...dataRef.current, ...patch });
    } catch (err) {
      setTyping(false);
      dispatch({
        type: "push_bot",
        text: fr
          ? "Désolé, une erreur est survenue lors de l'enregistrement. Merci de réessayer."
          : "Sorry, something went wrong while saving. Please try again.",
      });
      dispatch({ type: "set_mode", mode: "contact" });
    }
  };

  const Avatar = () =>
    logoUrl ? (
      <Image src={logoUrl} alt="Tisanes" className="h-9 w-9 rounded-full" fittingType="fill" />
    ) : (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-800">
        <Leaf className="h-4 w-4 text-emerald-50" />
      </div>
    );

  return (
    <div
      className={
        fullHeight
          ? "flex h-full flex-col overflow-hidden bg-white"
          : "overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-xl shadow-emerald-900/5"
      }
    >
      <div className="flex items-center justify-between gap-3 border-b border-emerald-900/20 bg-emerald-900 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-emerald-900 bg-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-50">Assistant Tisanes</p>
            <p className="text-[11px] text-emerald-200/80">{fr ? "En ligne — français" : "Online — English"}</p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label={fr ? "Fermer le chat" : "Close chat"}
            className="shrink-0 rounded-full p-2 text-emerald-100/80 transition hover:bg-emerald-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div
        ref={scrollRef}
        className={
          fullHeight
            ? "flex-1 min-h-0 overflow-y-auto bg-stone-50/80 px-4 py-5"
            : "h-[55vh] min-h-[420px] overflow-y-auto bg-stone-50/80 px-4 py-5 sm:px-5"
        }
      >
        {state.messages.map((m) => (
          <ChatMessage key={m.id} message={m} logoUrl={logoUrl} />
        ))}
        {typing && <TypingIndicator logoUrl={logoUrl} />}
        {(state.mode === "choices" || state.mode === "multi") && (
          <div className="mb-4 ml-10">
            <ChatChoices
              choices={state.choices}
              onChoice={handleChoice}
              disabled={typing}
              multi={state.mode === "multi"}
              selectedIds={state.selectedBlends}
              onToggle={(id) => dispatch({ type: "toggle_blend", id })}
              onContinue={handleBlendContinue}
              continueLabel={fr ? `Continuer (${state.selectedBlends.length})` : `Continue (${state.selectedBlends.length})`}
            />
          </div>
        )}
      </div>

      <div className="border-t border-stone-100 bg-white px-4 py-4 sm:px-5">
        {state.mode === "contact" && <ContactForm onSubmit={handleContactSubmit} busy={typing} lang={state.data.language} />}
      </div>
    </div>
  );
}