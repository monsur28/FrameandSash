// src/Hooks/useDocumentTitle.js
import { useEffect } from "react";

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Your App Name` : "Your App Name";
  }, [title]);
}
