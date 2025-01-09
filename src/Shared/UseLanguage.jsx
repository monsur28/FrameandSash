import { useContext } from "react";
import LanguageContext from "../Router/LanguageContext";

const useLanguage = () => useContext(LanguageContext);

export default useLanguage;
