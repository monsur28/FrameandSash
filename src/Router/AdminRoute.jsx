// src/Routes/AdminRoutes.jsx
import { Route, Navigate } from "react-router-dom";
import DashboardLayout from "../Pages/AdminDashboard/DashboardLayout"; // Admin Dashboard Layout
import Dashboard from "../Components/Dashboard";
import Products from "../Pages/AdminDashboard/Products/Products";
import ProductListWrapper from "../Components/ProductListWrapper";
import Reseller from "../Pages/AdminDashboard/Reseller/Reseller";
import Manufacturer from "../Pages/AdminDashboard/Manufacturer/Manufacturer";
import ManufacturerDetails from "../Components/ManufacturerDetails";
import ResellerDetails from "../Components/ResellerDetails";
import CompanyOffer from "../Shared/CompanyOffer";
import AddManufacturerForm from "../Components/AddManufacturerForm";
import AddResellerForm from "../Components/AddResellerForm";
import EditProduct from "../Components/EditProduct";
import Blogs from "../Pages/AdminDashboard/Blogs/Blogs";
import Contact from "../Pages/AdminDashboard/Contact/Contact";
import AddBlog from "../Components/AddBlog";
import AdminProfile from "../Pages/AdminDashboard/Settings/Settings";
import Discount from "../Pages/AdminDashboard/Discount/Discount";
import SiteInfo from "../Pages/AdminDashboard/SiteInfo/SiteInfo";
import Offers from "../Pages/AdminDashboard/Offer/Offer";
import SiteImage from "../Pages/AdminDashboard/SiteImage/SiteImage";
import PushNotification from "../Pages/AdminDashboard/PushNotification/PushNotification";
import ImageUpload from "../Pages/AdminDashboard/ImageUpload/ImageUpload";
import UpdateProfile from "../Components/UpdateProfile";
import BlogDetail from "../Components/BlogDetail";
import EditBlog from "../Components/EditBlog";
import UserTable from "../Pages/AdminDashboard/User/User";
import CreateProducts from "../Pages/AdminDashboard/Products/CreateProducts/CreateProducts";
import CreateProductCategory from "../Components/CreateProductCategory";
import ProductPreview from "../Components/ProductPreview";
import EditCategory from "../Components/EditCategory";
import OrderTable from "../Pages/AdminDashboard/Order/Order";
import PaymentHistory from "../Pages/AdminDashboard/PaymentHistory/PaymentHistory";
import EditProductConfiguration from "../Pages/AdminDashboard/Products/ProductConfigurator/EditProductConfigurator/EditProductConfigurator";
import Packages from "../Pages/AdminDashboard/Packages/Packages";
import Shipping from "../Pages/AdminDashboard/Shipping/Shipping";
import DeliverySystem from "../Pages/AdminDashboard/DeliverySystem/DeliverySystem";
import ProtectedRoute from "./ProtectedRoute";

const AdminRoutes = () => {
  return (
    <Route
      path="/adminDashboard"
      element={
        <ProtectedRoute requiredRole="+admin$">
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="products" element={<Products />} />
      <Route path="products/:title" element={<ProductListWrapper />} />
      <Route path="products/create-product" element={<CreateProducts />} />
      <Route path="product/edit-product/:id" element={<EditProduct />} />
      <Route
        path="product/edit-cofigurator/:id"
        element={<EditProductConfiguration />}
      />
      <Route path="productPreview/:id" element={<ProductPreview />} />
      <Route path="users" element={<UserTable />} />
      <Route path="orders" element={<OrderTable />} />
      <Route path="payment-history" element={<PaymentHistory />} />
      <Route
        path="categories/create-category"
        element={<CreateProductCategory />}
      />
      <Route path="products/edit-category/:id" element={<EditCategory />} />
      <Route path="manufacturer" element={<Manufacturer />} />
      <Route
        path="manufacturer/:manufacturerName"
        element={<ManufacturerDetails />}
      />
      <Route
        path="manufacturer/addmanufacturer"
        element={<AddManufacturerForm />}
      />
      <Route path="reseller" element={<Reseller />} />
      <Route path="reseller/:resellerName" element={<ResellerDetails />} />
      <Route path="reseller/addreseller" element={<AddResellerForm />} />
      <Route path="offers" element={<Offers />} />
      <Route path="packages" element={<Packages />} />
      <Route path="offers/:CompanyName" element={<CompanyOffer />} />
      <Route path="discount" element={<Discount />} />
      <Route path="imageupload" element={<ImageUpload />} />
      <Route path="delivery-system" element={<DeliverySystem />} />
      <Route path="shipping" element={<Shipping />} />
      <Route path="settings" element={<AdminProfile />} />
      <Route path="settings/siteinfo" element={<SiteInfo />} />
      <Route path="settings/siteimage" element={<SiteImage />} />
      <Route path="settings/pushnotification" element={<PushNotification />} />
      <Route path="settings/update-profile" element={<UpdateProfile />} />
      <Route path="blogs" element={<Blogs />} />
      <Route path="blogs/:id" element={<BlogDetail />} />
      <Route path="blogs/edit/:id" element={<EditBlog />} />
      <Route path="blogs/add-blog" element={<AddBlog />} />
      <Route path="contact" element={<Contact />} />
    </Route>
  );
};

export default AdminRoutes;
