import { useTranslation } from "react-i18next";

const LanguageButton = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const nextLang = i18n.language === "ko" ? "en" : "ko";
        i18n.changeLanguage(nextLang);
    };

    return (
        <button onClick={toggleLanguage} className="hover:bg-gray-200 p-2 rounded-3xl">
            {i18n.language === "ko" ? "English" : "한국어"}
        </button>
    );
};

export default LanguageButton;