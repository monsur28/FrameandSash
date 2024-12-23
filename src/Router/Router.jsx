import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../Pages/DashboardLayout";
import Login from "../Pages/Login";
import Manufacturer from "../Pages/Manufacturer";
import Dashboard from "../Components/Dashboard";
import Reseller from "../Pages/Reseller";
import RoleManagement from "../Pages/RoleManagment";
import Packages from "../Pages/Packages";
import Products from "../Pages/Products";

import ProductListWrapper from "../Components/ProductListWrapper";

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
        path: "/dashboard/products",
        element: <Products />,
      },
      {
        path: "/dashboard/products/:title",
        element: <ProductListWrapper />,
      },
      {
        path: "/dashboard/manufacturer",
        element: <Manufacturer />,
      },
      {
        path: "/dashboard/reseller",
        element: <Reseller />,
      },
      {
        path: "/dashboard/packages",
        element: <Packages />,
      },
      {
        path: "/dashboard/rolemanagement",
        element: <RoleManagement />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
