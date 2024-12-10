import { Bell, Mail, Search } from "lucide-react";

const Header = () => (
  <div className="flex justify-between items-center p-4 bg-gray-50">
    <h1 className="text-2xl font-semibold">Dashboard</h1>
    <div className="hidden lg:flex items-center space-x-4">
      <SearchBar />
      <HeaderActions />
    </div>
  </div>
);

const SearchBar = () => (
  <div className="relative right-96">
    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
    <input
      type="text"
      placeholder="Search Products"
      className="pl-10 pr-10 py-2 bg-gray-200 rounded-lg w-96"
    />
  </div>
);

const HeaderActions = () => (
  <div className="flex items-center space-x-4">
    <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
    <Mail className="w-5 h-5 text-gray-600 cursor-pointer" />
    <div className="flex items-center space-x-2">
      <span>English</span>
      <img
        src="https://cdn.britannica.com/79/4479-050-6EF87027/flag-Stars-and-Stripes-May-1-1795.jpg"
        alt="US Flag"
        className="w-6"
      />
    </div>
    <img
      src="https://cdnstorage.sendbig.com/unreal/female.webp"
      alt="US Flag"
      className="w-12 h-12 rounded-full border-[4px] border-[#37B34A]"
    />
  </div>
);

export default Header;
