// useTranslation.js
import { useEffect, useState } from "react";
import useLanguage from "./UseLanguage";
import enTranslations from "../../public/Translation/translations";

const translations = {
  en: enTranslations,
};

const useTranslation = () => {
  const { language } = useLanguage();
  const [currentTranslations, setCurrentTranslations] = useState(
    translations[language]
  );

  useEffect(() => {
    setCurrentTranslations(translations[language]);
  }, [language]);

  const t = (key) => currentTranslations[key] || key;

  return { t };
};

export default useTranslation;
