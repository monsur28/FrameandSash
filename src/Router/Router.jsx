import { createBrowserRouter, Navigate } from "react-router-dom";
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
import CreateProductCategory from "../Components/CreateProductCategory";
import EditProduct from "../Components/EditProduct";
import AddProduct from "../Components/AddProduct";
import Blogs from "../Pages/Blogs";
import Contact from "../Pages/Contact";
import AddBlog from "../Components/AddBlog";
import AdminProfile from "../Pages/Settings";
import Discount from "../Pages/Discount";
import SiteInfo from "../Pages/SiteInfo";
import SiteImage from "../Pages/SiteImage";
import PushNotification from "../Pages/PushNotification";
import ImageUpload from "../Pages/ImageUpload";
import ProtectedRoute from "./ProtectedRoute";
import UpdateProfile from "../Components/UpdateProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/dashboard/products",
        element: <Products />,
      },
      {
        path: "/dashboard/products/create-product",
        element: <CreateProductCategory />,
      },
      {
        path: "/dashboard/products/:title",
        element: <ProductListWrapper />,
      },
      {
        path: "/dashboard/products/addproduct",
        element: <AddProduct />,
      },
      {
        path: "/dashboard/products/EditProduct",
        element: <EditProduct />,
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
      {
        path: "/dashboard/blog",
        element: <Blogs />,
      },
      {
        path: "/dashboard/blogs/add-blog",
        element: <AddBlog />,
      },
      {
        path: "/dashboard/contact",
        element: <Contact />,
      },
      {
        path: "/dashboard/discount",
        element: <Discount />,
      },
      {
        path: "/dashboard/imageupload",
        element: <ImageUpload />,
      },
      {
        path: "/dashboard/settings",
        element: <AdminProfile />,
      },
      {
        path: "/dashboard/settings/siteinfo",
        element: <SiteInfo />,
      },
      {
        path: "/dashboard/settings/siteimage",
        element: <SiteImage />,
      },
      {
        path: "/dashboard/settings/pushnotification",
        element: <PushNotification />,
      },
      {
        path: "/dashboard/settings/update-profile",
        element: <UpdateProfile />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
