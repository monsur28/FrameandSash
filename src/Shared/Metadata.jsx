import { RouterProvider } from "react-router-dom";
import { useSiteInfo } from "../ContextProvider/SiteInfoContext";
import { router } from "../Router/Router";

const Metadata = () => {
  const { siteInfo, loading } = useSiteInfo();

  if (loading) {
    // Show a loading screen or fallback UI while site info is being loaded
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="grid grid-cols-3 gap-1 w-[70px] h-[70px]">
          <span className="w-full h-full bg-gray-400 animate-blink delay-[0ms]" />
          <span className="w-full h-full bg-gray-400 animate-blink delay-[200ms]" />
          <span className="w-full h-full bg-gray-400 animate-blink delay-[300ms]" />
          <span className="w-full h-full bg-gray-400 animate-blink delay-[400ms]" />
          <span className="w-full h-full bg-gray-400 animate-blink delay-[500ms]" />
          <span className="w-full h-full bg-gray-400 animate-blink delay-[600ms]" />
        </div>
      </div>
    );
  }

  // Update the metadata once site info is loaded
  document.title = siteInfo.siteTitle || "Default Site Title";
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute(
      "content",
      siteInfo.short_description || "Default site description"
    );
  }

  return <RouterProvider router={router} />;
};

export default Metadata;
