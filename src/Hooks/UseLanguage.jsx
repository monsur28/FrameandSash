import { useContext } from "react";
import LanguageContext from "../ContextProvider/LanguageContext";

const useLanguage = () => useContext(LanguageContext);

export default useLanguage;
