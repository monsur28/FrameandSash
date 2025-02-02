import { RouterProvider } from "react-router-dom";
import { useSiteInfo } from "../ContextProvider/SiteInfoContext";
import { router } from "../Router/Router";
import Loader from "./Loader";

const Metadata = () => {
  const { siteInfo, loading } = useSiteInfo();

  if (loading) {
    // Show a loading screen or fallback UI while site info is being loaded
    return <Loader />;
  }

  // Update the metadata once site info is loaded
  document.title = siteInfo.siteTitle || "Frame & Sash";
  const metaTitle = document.querySelector('meta[name="title"]');
  if (metaTitle) {
    metaTitle.setAttribute("content", siteInfo.siteTitle);
  }
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
