import { createBrowserRouter, Navigate } from "react-router-dom";
import DashboardLayout from "../Pages/AdminDashboard/DashboardLayout";
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
import Error from "../Pages/Error";
import Main from "../Pages/UserHome/Home/Main";
import Home from "../Pages/UserHome/Home/Home/Home";
import Auth from "../Pages/Register/Register";
import WantToSell from "../Pages/UserHome/WantToSell/WantToSell";
import WantToSellLanding from "../Pages/UserHome/WantToSell/Landing/Landing";
import BlogSection from "../Pages/UserHome/Blogs/Blogs";
import UserLandingPage from "../Pages/UserDashboard/UserLanding/UserLanding";
import MyProfile from "../Pages/UserDashboard/MyProfile/MyProfile";
import Order from "../Pages/UserDashboard/MyOrder/MyOrder";
import ManufacturerPrivateRoute from "./ManufacturerPrivateRoute";
import Shop from "../Pages/UserHome/Shop/Shop";
import AboutUs from "../Pages/UserHome/About-Us/About-Us";
import WindowConfigurator from "../Pages/UserHome/Configurator/WindowConfigurator";
import DoorConfigurator from "../Pages/UserHome/Configurator/DoorConfigurator";
import ContactUs from "../Pages/UserHome/Contact-Us/Contact-Us";
import UserTable from "../Pages/AdminDashboard/User/User";
import CreateProducts from "../Pages/AdminDashboard/Products/CreateProducts/CreateProducts";
import CreateProductCategory from "../Components/CreateProductCategory";
import ProductPreview from "../Components/ProductPreview";
import ProtectedRoute from "./ProtectedRoute";
import ShopDetails from "../Pages/UserHome/Shop/ProductDetails/ProductDetails";
import Cart from "../Pages/UserHome/Shopping-cart/ShoppingCart";
import EditCategory from "../Components/EditCategory";
import OrderTable from "../Pages/AdminDashboard/Order/Order";
import PaymentHistory from "../Pages/AdminDashboard/PaymentHistory/PaymentHistory";
import EditProductConfiguration from "../Pages/AdminDashboard/Products/ProductConfigurator/EditProductConfigurator/EditProductConfigurator";
import Packages from "../Pages/AdminDashboard/Packages/Packages";
import ConfiguratorLanding from "../Pages/UserHome/Configurator/ConfiguratorLanding/ConfiguratorLanding";
import Checkout from "../Pages/UserHome/Checkout/Checkout";
import DeliverySystem from "../Pages/AdminDashboard/DeliverySystem/DeliverySystem";
import AdminPrivateRoute from "./AdminPrivateRoute";
import ManufacturerOrder from "../Pages/ManufacturerDashboard/Orders/Orders";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <Error />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/register", element: <Auth /> },
      { path: "/want-to-sell", element: <WantToSellLanding /> },
      { path: "/want-to-sell/CreateManufacturer", element: <WantToSell /> },
      { path: "/blogs", element: <BlogSection /> },
      { path: "/configurator", element: <ConfiguratorLanding /> },
      {
        path: "/manufacturer/:company_slug/configurator-products",
        element: <WindowConfigurator />,
      },
      { path: "/configurator/doors", element: <DoorConfigurator /> },
      { path: "/shop", element: <Shop /> },
      { path: "/shop/:id", element: <ShopDetails /> },
      { path: "/cart", element: <Cart /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/about-us", element: <AboutUs /> },
      { path: "/contact-us", element: <ContactUs /> },

      // User Dashboard
      {
        path: "userDashboard",
        element: (
          <ProtectedRoute>
            <UserLandingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-orders",
        element: (
          <ProtectedRoute>
            <Order />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Admin Dashboard Routes
  {
    path: "/adminDashboard",
    errorElement: <Error />,
    element: (
      <AdminPrivateRoute>
        <DashboardLayout />
      </AdminPrivateRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "products", element: <Products /> },
      { path: "products/:title", element: <ProductListWrapper /> },
      { path: "products/create-product", element: <CreateProducts /> },
      { path: "product/edit-product/:id", element: <EditProduct /> },
      {
        path: "product/edit-cofigurator/:id",
        element: <EditProductConfiguration />,
      },
      { path: "productPreview/:id", element: <ProductPreview /> },
      { path: "users", element: <UserTable /> },
      { path: "order", element: <OrderTable /> },
      { path: "orders", element: <ManufacturerOrder /> },
      { path: "payment-history", element: <PaymentHistory /> },
      {
        path: "categories/create-category",
        element: <CreateProductCategory />,
      },
      { path: "products/edit-category/:id", element: <EditCategory /> },
      { path: "manufacturer", element: <Manufacturer /> },
      {
        path: "manufacturer/:manufacturerName",
        element: <ManufacturerDetails />,
      },
      {
        path: "manufacturer/addmanufacturer",
        element: <AddManufacturerForm />,
      },
      { path: "reseller", element: <Reseller /> },
      { path: "reseller/:resellerName", element: <ResellerDetails /> },
      { path: "reseller/addreseller", element: <AddResellerForm /> },
      { path: "offers", element: <Offers /> },
      { path: "packages", element: <Packages /> },
      { path: "offers/:CompanyName", element: <CompanyOffer /> },
      { path: "discount", element: <Discount /> },
      { path: "imageupload", element: <ImageUpload /> },
      { path: "delivery-system", element: <DeliverySystem /> },
      { path: "settings", element: <AdminProfile /> },
      { path: "settings/siteinfo", element: <SiteInfo /> },
      { path: "settings/siteimage", element: <SiteImage /> },
      { path: "settings/pushnotification", element: <PushNotification /> },
      { path: "settings/update-profile", element: <UpdateProfile /> },
      { path: "blogs", element: <Blogs /> },
      { path: "blogs/:id", element: <BlogDetail /> },
      { path: "blogs/edit/:id", element: <EditBlog /> },
      { path: "blogs/add-blog", element: <AddBlog /> },
      { path: "contact", element: <Contact /> },
    ],
  },

  // Manufacturer Dashboard Routes (Same Layout, Different Access)
  {
    path: "/manufacturerDashboard",
    errorElement: <Error />,
    element: (
      <ManufacturerPrivateRoute>
        <DashboardLayout />
      </ManufacturerPrivateRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "products", element: <Products /> },
      { path: "products/:title", element: <ProductListWrapper /> },
      { path: "products/create-product", element: <CreateProducts /> },
      { path: "product/edit-product/:id", element: <EditProduct /> },
      {
        path: "product/edit-cofigurator/:id",
        element: <EditProductConfiguration />,
      },
      { path: "category/edit-category/:id", element: <EditCategory /> },
      { path: "productPreview/:id", element: <ProductPreview /> },
      { path: "packages", element: <Packages /> },
      { path: "offers", element: <Offers /> },
      { path: "offers/:CompanyName", element: <CompanyOffer /> },
      { path: "manufacturer", element: <Manufacturer /> },
      {
        path: "manufacturer/:manufacturerName",
        element: <ManufacturerDetails />,
      },
      { path: "settings", element: <AdminProfile /> },
      { path: "settings/siteinfo", element: <SiteInfo /> },
      { path: "settings/siteimage", element: <SiteImage /> },
      { path: "settings/update-profile", element: <UpdateProfile /> },
    ],
  },
]);
