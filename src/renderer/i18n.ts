import i18n, { InitOptions } from "i18next";
import { initReactI18next } from "react-i18next";
import enMain from "../../locales/en/main.json";
import ruMain from "../../locales/ru/main.json";

const config: InitOptions = {
    resources: {
        en: { main: enMain },
        ru: { main: ruMain },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "ru"],
    ns: ["main"],
};

i18n.use(initReactI18next).init(config);

export default i18n;
