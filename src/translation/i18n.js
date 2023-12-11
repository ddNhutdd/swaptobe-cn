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
};
export const availableLanguageMapper = {
  vi: "Việt Nam",
  en: "English",
  ko: "한국",
  ja: "日本",
  zh: "中国",
  th: "ไทย",
  km: "កម្ពុជា",
  lo: "ພາສາລາວ",
  id: "Indonesia",
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
