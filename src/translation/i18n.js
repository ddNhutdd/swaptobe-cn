import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

import VItranslate from "./locales/VItranslation.json";
import ENtranslate from "./locales/ENtranslation.json";
import KOtranslate from "./locales/KOtranslation.json";
import JAtranslate from "./locales/JAtranslation.json";
import ZHtranslate from "./locales/ZHtranslation.json";
import THtranslate from "./locales/THtranslation.json";
import KMtranslate from "./locales/KMtranslation.json";
import LOtranslate from "./locales/LOtranslation.json";
import IDtranslate from "./locales/IDtranslation.json";

export const availableLanguage = {
  vi: "vi",
  en: "en",
  ko: "ko",
  ja: "ja",
  zh: "zh",
  th: "th",
  km: "km",
  lo: "lo",
  id: "id",
  fr: "fr",
  es: "es",
};
export const availableLanguageMapper = {
  vi: "Vietnamese",
  en: "English",
  ko: "Korean",
  ja: "Japanese",
  zh: "Chinese",
  th: "Thai",
  km: "Cambodian",
  lo: "Lao",
  id: "Indonesian",
};
// the translations
const resources = {
  vi: {
    translation: VItranslate,
  },
  en: {
    translation: ENtranslate,
  },
  ko: {
    translation: KOtranslate,
  },
  ja: {
    translation: JAtranslate,
  },
  zh: {
    translation: ZHtranslate,
  },
  th: {
    translation: THtranslate,
  },
  km: {
    translation: KMtranslate,
  },
  lo: {
    translation: LOtranslate,
  },
  id: {
    translation: IDtranslate,
  },
};

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: availableLanguage.en,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
