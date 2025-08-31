import { useEffect, useState } from "react";
import {
  isMobileBrowser as _isMobileBrowser,
  isMobileByFeatures as _isMobileByFeatures,
} from "@/lib/mobile-detector";

export function useMobileDetector() {
  const [isMobileBrowser, setIsMobileBrowser] = useState(false);
  const [isMobileByFeatures, setIsMobileByFeatures] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    setIsMobileBrowser(_isMobileBrowser());
    setIsMobileByFeatures(_isMobileByFeatures());
  }, []);

  return {
    isMobileBrowser: isClient ? isMobileBrowser : false,
    isMobileByFeatures: isClient ? isMobileByFeatures : false,
    isClient,
    isLoading: !isClient,
  };
}
