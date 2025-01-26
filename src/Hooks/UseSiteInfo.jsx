import { useEffect, useState } from "react";
import axios from "axios"; // or your custom axios instance

const useSiteInfo = () => {
  const [siteInfo, setSiteInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSiteInfo = async () => {
      try {
        const response = await axios.get("/api/site-info");
        setSiteInfo(response.data);
      } catch (error) {
        console.error("Error fetching site info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteInfo();
  }, []);

  return { siteInfo, loading };
};

const MyApp = () => {
  const { siteInfo, loading } = useSiteInfo();

  useEffect(() => {
    if (!loading) {
      document.title = siteInfo.siteTitle || "Default Site Title";
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          siteInfo.short_description || "Default site description"
        );
      }
    }
  }, [siteInfo, loading]);

  return <div>{/* Your application JSX */}</div>;
};
