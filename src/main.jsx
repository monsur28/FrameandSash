import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router/Router";
import { SidebarProvider } from "./Shared/SidebarContext";
import AuthProvider from "./Router/AuthProvider";
import { LanguageProvider } from "./Router/LanguageContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LanguageProvider>
      <SidebarProvider>
        <AuthProvider>
          <div className="inter">
            <RouterProvider router={router} />
          </div>
        </AuthProvider>
      </SidebarProvider>
    </LanguageProvider>
  </StrictMode>
);
