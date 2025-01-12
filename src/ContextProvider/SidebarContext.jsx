import { createContext, useContext, useState } from "react";

// Create SidebarContext
const SidebarContext = createContext(undefined);

// SidebarProvider component to manage the sidebar state
export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the sidebar open/close
  const toggleSidebar = () => setIsOpen((prevState) => !prevState);

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Custom hook to use sidebar context
export const UseSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
