import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  Globe,
  User,
  UserCircle,
  FileText,
  Settings,
  LogOut,
  Search,
} from "lucide-react";
import useAuth from "../Hooks/UseAuth";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const [configuratorOpen, setConfiguratorOpen] = useState(false);
  const { user, logOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false); // state for the user dropdown

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);
  const closeMenu = () => setUserMenuOpen(false);

  return (
    <nav className="w-full bg-white shadow-md">
      {/* Top banner */}
      <div className="w-full bg-zinc-800 text-white text-center py-2 text-sm">
        Spend $50 more and get FREE Shipping!!
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex-shrink-0" onClick={closeMobileMenu}>
            <img
              src="https://i.ibb.co.com/MxJcpGGY/PNG-version.png"
              alt="Company Logo"
              className="h-8 w-auto"
            />
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/" className="text-sm hover:text-gray-600">
              Home
            </NavLink>
            <NavLink to="/shop" className="text-sm hover:text-gray-600">
              Shop
            </NavLink>
            <NavLink to="/blogs" className="text-sm hover:text-gray-600">
              Blogs
            </NavLink>
            <div className="relative">
              <NavLink
                to="/configurator"
                className="text-sm hover:text-gray-600"
              >
                Configurator
              </NavLink>
              {/* {configuratorOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white shadow-md border rounded-lg z-10">
                  <NavLink
                    to="/configurator/windows"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Window Configurator
                  </NavLink>
                  <NavLink
                    to="/configurator/doors"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Door Configurator
                  </NavLink>
                </div>
              )} */}
            </div>
            <NavLink
              to="/want-to-sell"
              className="text-sm text-primary hover:text-blue-700"
            >
              Want To Sell?
            </NavLink>
            <NavLink to="/about-us" className="text-sm hover:text-gray-600">
              About Us
            </NavLink>
            <NavLink to="/contact-us" className="text-sm hover:text-gray-600">
              Contact Us
            </NavLink>
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center md:hidden">
            <Link to={"/cart"}>
              <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                <ShoppingCart className="h-5 w-5" />
              </button>
            </Link>
            <button
              onClick={toggleMobileMenu}
              className="ml-2 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* User Actions (visible on desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search bar */}
            <div className="flex flex-1">
              <div className="relative w-full">
                <input
                  type="search"
                  placeholder="Search here"
                  className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:border-blue-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
            <Link to={"/cart"}>
              <button className="p-2 rounded-md  hover:text-gray-500 hover:bg-gray-100">
                <ShoppingCart className="h-5 w-5" />
              </button>
            </Link>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Globe className="h-5 w-5" />
            </button>
            {/* User Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  className="p-2 hover:bg-gray-100 rounded-full"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <User className="h-5 w-5" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md overflow-hidden z-50">
                    {user.role !== "manufacturer" &&
                      user.role !== "+admin$" && (
                        <>
                          <NavLink
                            to="/profile"
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                            onClick={closeMenu}
                          >
                            <UserCircle className="h-5 w-5" />
                            My Profile
                          </NavLink>
                          <NavLink
                            to="/my-orders"
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                            onClick={closeMenu}
                          >
                            <FileText className="h-5 w-5" />
                            My Orders
                          </NavLink>
                          <NavLink
                            to="/settings"
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                            onClick={closeMenu}
                          >
                            <Settings className="h-5 w-5" />
                            Settings
                          </NavLink>
                        </>
                      )}
                    {user.role === "manufacturer" || user.role === "+admin$" ? (
                      <NavLink
                        to="/adminDashboard/dashboard"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                        onClick={closeMenu}
                      >
                        <UserCircle className="h-5 w-5" />
                        Dashboard
                      </NavLink>
                    ) : null}
                    <button
                      onClick={() => {
                        logOut();
                        closeMenu();
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink to="/register" onClick={closeMenu}>
                <button className="px-4 py-2 border border-gray-300 hover:bg-primary rounded-md text-sm">
                  Sign In
                </button>
              </NavLink>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLink
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            onClick={closeMobileMenu}
          >
            Home
          </NavLink>
          <NavLink
            to="/shop"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            onClick={closeMobileMenu}
          >
            Shop
          </NavLink>
          <NavLink
            to="/blogs"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            onClick={closeMobileMenu}
          >
            Blogs
          </NavLink>
          <NavLink
            to="/configurator/windows"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            onClick={closeMobileMenu}
          >
            Window Configurator
          </NavLink>
          <NavLink
            to="/configurator/doors"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            onClick={closeMobileMenu}
          >
            Door Configurator
          </NavLink>
          <NavLink
            to="/want-to-sell"
            className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:text-blue-700"
            onClick={closeMobileMenu}
          >
            Want To Sell?
          </NavLink>
          <NavLink
            to="/about-us"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            onClick={closeMobileMenu}
          >
            About Us
          </NavLink>
          <NavLink
            to="/contact-us"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            onClick={closeMobileMenu}
          >
            Contact Us
          </NavLink>
          {user ? (
            <>
              {user.role === "manufacturer" || user.role === "+admin$" ? (
                <NavLink
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </NavLink>
              ) : (
                <>
                  <NavLink
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={closeMobileMenu}
                  >
                    My Profile
                  </NavLink>
                  <NavLink
                    to="/my-orders"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={closeMobileMenu}
                  >
                    My Orders
                  </NavLink>
                  <NavLink
                    to="/settings"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={closeMobileMenu}
                  >
                    Settings
                  </NavLink>
                </>
              )}
              <button
                onClick={() => {
                  logOut();
                  closeMobileMenu();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/register"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={closeMobileMenu}
            >
              Sign In
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
