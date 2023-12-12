import i18n, { InitOptions } from "i18next";
import Backend from "i18next-fs-backend";

const config: InitOptions = {
    backend: {
        loadPath: "./locales/{{lng}}/{{ns}}.json",
    },
    fallbackLng: "en",
    saveMissing: true,
    supportedLngs: ["en", "ru"],
    ns: ["menu"],
};

i18n.use(Backend).init(config);

export default i18n;
