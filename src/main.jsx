import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router/Router";
import { LanguageProvider } from "./ContextProvider/LanguageContext";
import { SidebarProvider } from "./ContextProvider/SidebarContext";
import AuthProvider from "./ContextProvider/AuthProvider";
import { SweetAlertProvider } from "./ContextProvider/SweetAlertContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LanguageProvider>
      <SidebarProvider>
        <AuthProvider>
          <SweetAlertProvider>
            <div className="inter">
              <RouterProvider router={router} />
            </div>
          </SweetAlertProvider>
        </AuthProvider>
      </SidebarProvider>
    </LanguageProvider>
  </StrictMode>
);
