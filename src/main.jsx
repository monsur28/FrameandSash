import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router/Router";
import { SidebarProvider } from "./Shared/SidebarContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SidebarProvider>
      <div className="inter">
        <RouterProvider router={router} />
      </div>
    </SidebarProvider>
  </StrictMode>
);
