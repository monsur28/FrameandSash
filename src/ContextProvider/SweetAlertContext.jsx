import { createContext, useState, useContext } from "react";
import SweetAlert from "../Shared/SweetAlert";

const SweetAlertContext = createContext(undefined);

export const useSweetAlert = () => {
  const context = useContext(SweetAlertContext);
  if (!context) {
    throw new Error("useSweetAlert must be used within a SweetAlertProvider");
  }
  return context;
};

export const SweetAlertProvider = ({ children }) => {
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    title: "",
    message: "",
    type: "success",
  });

  // Function to show the alert
  const showAlert = (title, message, type = "success") => {
    setAlertConfig({ show: true, title, message, type });
  };

  // Function to close the alert
  const handleCloseAlert = () => {
    setAlertConfig((prev) => ({ ...prev, show: false }));
  };

  return (
    <SweetAlertContext.Provider value={{ showAlert }}>
      {children}
      <SweetAlert
        show={alertConfig.show}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={handleCloseAlert}
      />
    </SweetAlertContext.Provider>
  );
};
