import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../Pages/DashboardLayout";
import Login from "../Pages/Login";
import Manufacturer from "../Pages/Manufacturer";
import Dashboard from "../Components/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/dashboard/manufacturer",
        element: <Manufacturer />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
]);
