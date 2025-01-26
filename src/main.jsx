import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LanguageProvider } from "./ContextProvider/LanguageContext";
import { SidebarProvider } from "./ContextProvider/SidebarContext";
import AuthProvider from "./ContextProvider/AuthProvider";
import { SweetAlertProvider } from "./ContextProvider/SweetAlertContext";
import { SiteInfoProvider } from "./ContextProvider/SiteInfoContext";
import "./index.css";
import Metadata from "./Shared/Metadata";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LanguageProvider>
      <SidebarProvider>
        <AuthProvider>
          <SweetAlertProvider>
            <SiteInfoProvider>
              <div className="inter">
                <Metadata />
              </div>
            </SiteInfoProvider>
          </SweetAlertProvider>
        </AuthProvider>
      </SidebarProvider>
    </LanguageProvider>
  </StrictMode>
);
