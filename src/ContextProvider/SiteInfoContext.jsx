import { createContext, useContext, useState, useEffect } from "react";
import axiosSecure from "../Hooks/AsiosSecure";

const SiteInfoContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSiteInfo = () => useContext(SiteInfoContext);

export const SiteInfoProvider = ({ children }) => {
  const [siteInfo, setSiteInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSiteInfo = async () => {
      try {
        const response = await axiosSecure.get("/api/site-info");
        setSiteInfo(response.data || {});
      } catch (error) {
        console.error("Failed to fetch site info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteInfo();
  }, []);

  return (
    <SiteInfoContext.Provider value={{ siteInfo, setSiteInfo, loading }}>
      {children}
    </SiteInfoContext.Provider>
  );
};
