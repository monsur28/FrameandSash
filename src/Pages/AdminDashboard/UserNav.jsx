import { useState } from "react";

export function UserNav() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const closeDropdown = () => setDropdownOpen(false);

  return (
    <div className="relative">
      {/* User Avatar */}
      <button
        className="relative h-8 w-8 rounded-full border bg-gray-200 flex items-center justify-center focus:outline-none"
        onClick={toggleDropdown}
      >
        <img
          src="/avatars/01.png"
          alt="username"
          className="h-8 w-8 rounded-full object-cover"
        />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10"
          onMouseLeave={closeDropdown}
        >
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-medium text-gray-800">username</p>
            <p className="text-xs text-gray-500">user@example.com</p>
          </div>
          <div className="py-2">
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Profile
              <span className="float-right text-gray-400">⇧⌘P</span>
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Settings
              <span className="float-right text-gray-400">⌘S</span>
            </button>
          </div>
          <div className="border-t">
            <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
              Log out
              <span className="float-right text-gray-400">⇧⌘Q</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
