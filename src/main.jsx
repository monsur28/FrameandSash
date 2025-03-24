import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LanguageProvider } from "./ContextProvider/LanguageContext";
import { SidebarProvider } from "./ContextProvider/SidebarContext";
import AuthProvider from "./ContextProvider/AuthProvider";
import { SweetAlertProvider } from "./ContextProvider/SweetAlertContext";
import { SiteInfoProvider } from "./ContextProvider/SiteInfoContext";
import "./index.css";
import Metadata from "./Shared/Metadata";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LanguageProvider>
      <SidebarProvider>
        <AuthProvider>
          <SweetAlertProvider>
            <SiteInfoProvider>
              <QueryClientProvider client={queryClient}>
                <ToastContainer />
                <div className="popins">
                  <Metadata />
                </div>
              </QueryClientProvider>
            </SiteInfoProvider>
          </SweetAlertProvider>
        </AuthProvider>
      </SidebarProvider>
    </LanguageProvider>
  </StrictMode>
);
