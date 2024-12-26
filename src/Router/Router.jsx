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
import Offers from "../Pages/Offer";
import ResellerDetails from "../Components/ResellerDetails";
import ManufacturerDetails from "../Components/ManufacturerDetails";
import CompanyOffer from "../Shared/CompanyOffer";
import AddManufacturerForm from "../Components/AddManufacturerForm";
import AddResellerForm from "../Components/AddResellerForm";

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
        path: "/dashboard/manufacturer/:manufacturerName",
        element: <ManufacturerDetails />,
      },
      {
        path: "/dashboard/manufacturer/addmanufacturer",
        element: <AddManufacturerForm />,
      },
      {
        path: "/dashboard/reseller",
        element: <Reseller />,
      },
      {
        path: "/dashboard/reseller/:resellerName",
        element: <ResellerDetails />,
      },
      {
        path: "/dashboard/reseller/addreseller",
        element: <AddResellerForm />,
      },
      {
        path: "/dashboard/offers",
        element: <Offers />,
      },
      {
        path: "/dashboard/offers/:CompanyName",
        element: <CompanyOffer />,
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
