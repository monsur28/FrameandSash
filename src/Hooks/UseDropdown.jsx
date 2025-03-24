// src/Hooks/useDropdown.js (No changes, but include for completeness)

import { useState, useRef, useEffect } from "react";

function useDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggle = () => setIsOpen(!isOpen); // Add a toggle function

  return { isOpen, setIsOpen, ref, toggle }; // Return toggle
}

export default useDropdown;
