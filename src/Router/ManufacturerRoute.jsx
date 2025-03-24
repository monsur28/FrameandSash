import { Route, Navigate } from "react-router-dom";
import DashboardLayout from "../Pages/AdminDashboard/DashboardLayout"; //  Dashboard Layout
import Dashboard from "../Components/Dashboard";
import Products from "../Pages/AdminDashboard/Products/Products"; // Reuse admin components where possible
import ProductListWrapper from "../Components/ProductListWrapper";
import Manufacturer from "../Pages/AdminDashboard/Manufacturer/Manufacturer"; // Reuse
import ManufacturerDetails from "../Components/ManufacturerDetails"; // Reuse
import EditProduct from "../Components/EditProduct"; // Reuse
import AdminProfile from "../Pages/AdminDashboard/Settings/Settings"; //Reuse
import SiteInfo from "../Pages/AdminDashboard/SiteInfo/SiteInfo"; //Reuse
import SiteImage from "../Pages/AdminDashboard/SiteImage/SiteImage"; //Reuse
import UpdateProfile from "../Components/UpdateProfile"; // Reuse
import CreateProducts from "../Pages/AdminDashboard/Products/CreateProducts/CreateProducts";
import ProductPreview from "../Components/ProductPreview";
import EditCategory from "../Components/EditCategory";
import Packages from "../Pages/AdminDashboard/Packages/Packages";
import CompanyOffer from "../Shared/CompanyOffer";
import Offers from "../Pages/AdminDashboard/Offer/Offer";
import EditProductConfiguration from "../Pages/AdminDashboard/Products/ProductConfigurator/EditProductConfigurator/EditProductConfigurator";
import ProtectedRoute from "./ProtectedRoute";
import ManufacturerOrder from "../Pages/ManufacturerDashboard/Orders/Orders";
import PaymentHistory from "../Pages/AdminDashboard/PaymentHistory/PaymentHistory";
import Blogs from "../Pages/AdminDashboard/Blogs/Blogs";
import Contact from "../Pages/AdminDashboard/Contact/Contact";
import Discount from "../Pages/AdminDashboard/Discount/Discount";

const ManufacturerRoutes = () => {
  return (
    <Route
      path="/manufacturerDashboard"
      element={
        <ProtectedRoute requiredRole="manufacturer">
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="products" element={<Products />} />
      <Route path="orders" element={<ManufacturerOrder />} />
      <Route path="products/:title" element={<ProductListWrapper />} />
      <Route path="products/create-product" element={<CreateProducts />} />
      <Route path="product/edit-product/:id" element={<EditProduct />} />
      <Route
        path="product/edit-cofigurator/:id"
        element={<EditProductConfiguration />}
      />
      <Route path="category/edit-category/:id" element={<EditCategory />} />
      <Route path="productPreview/:id" element={<ProductPreview />} />
      <Route path="packages" element={<Packages />} />
      <Route path="offers" element={<Offers />} />
      <Route path="offers/:CompanyName" element={<CompanyOffer />} />
      <Route path="manufacturer" element={<Manufacturer />} />
      <Route
        path="manufacturer/:manufacturerName"
        element={<ManufacturerDetails />}
      />
      <Route path="settings" element={<AdminProfile />} />
      <Route path="settings/siteinfo" element={<SiteInfo />} />
      <Route path="settings/siteimage" element={<SiteImage />} />
      <Route path="settings/update-profile" element={<UpdateProfile />} />
      <Route path="payment-history" element={<PaymentHistory />} />
      <Route path="blogs" element={<Blogs />} />
      <Route path="contact" element={<Contact />} />
      <Route path="discount" element={<Discount />} />
    </Route>
  );
};

export default ManufacturerRoutes;
