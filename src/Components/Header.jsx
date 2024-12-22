import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Bell, Mail, X, Menu } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let title;
  switch (location.pathname) {
    case "/manufacturer":
      title = "Manufacturer Dashboard";
      break;
    case "/reseller":
      title = "Reseller Dashboard";
      break;
    default:
      title = "Dashboard";
      break;
  }

  return (
    <div className="bg-gray-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold">
              {title}
            </h1>
          </div>
          <div className="hidden md:block">
            <SearchBar />
          </div>
          <div className="hidden md:block">
            <HeaderActions />
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && windowWidth < 768 && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <SearchBar />
            <HeaderActions />
          </div>
        </div>
      )}
    </div>
  );
};

const SearchBar = () => {
  return (
    <fieldset className="w-full space-y-1 dark:text-gray-800">
      <label htmlFor="Search" className="hidden">
        Search
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          <button
            type="button"
            title="search"
            className="p-1 focus:outline-none focus:ring"
          >
            <svg
              fill="currentColor"
              viewBox="0 0 512 512"
              className="w-4 h-4 dark:text-gray-800"
            >
              <path d="M479.6,399.716l-81.084-81.084-62.368-25.767A175.014,175.014,0,0,0,368,192c0-97.047-78.953-176-176-176S16,94.953,16,192,94.953,368,192,368a175.034,175.034,0,0,0,101.619-32.377l25.7,62.2L400.4,478.911a56,56,0,1,0,79.2-79.195ZM48,192c0-79.4,64.6-144,144-144s144,64.6,144,144S271.4,336,192,336,48,271.4,48,192ZM456.971,456.284a24.028,24.028,0,0,1-33.942,0l-76.572-76.572-23.894-57.835L380.4,345.771l76.573,76.572A24.028,24.028,0,0,1,456.971,456.284Z"></path>
            </svg>
          </button>
        </span>
        <input
          type="search"
          name="Search"
          placeholder="Search..."
          className="w-32 py-2 pl-10 text-sm rounded-md sm:w-auto focus:outline-none bg-gray-200"
        />
      </div>
    </fieldset>
  );
};

const HeaderActions = () => (
  <div className="flex items-center space-x-4 mt-4 md:mt-0">
    <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
    <Mail className="w-5 h-5 text-gray-600 cursor-pointer" />
    <div className="flex items-center space-x-2">
      <span className="text-sm">English</span>
      <img
        src="https://cdn.britannica.com/79/4479-050-6EF87027/flag-Stars-and-Stripes-May-1-1795.jpg"
        alt="US Flag"
        className="w-6"
      />
    </div>
    <img
      src="https://static.vecteezy.com/system/resources/thumbnails/033/168/356/small/a-beautiful-young-business-woman-in-a-suit-ai-generative-free-photo.jpg"
      alt="Profile"
      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#37B34A]"
    />
  </div>
);

export default Header;
