import { useEffect } from "react";

declare global {
  interface Window {
    Tawk_API?: {
      hideWidget: () => void;
      showWidget: () => void;
      [key: string]: unknown; // Allows additional dynamic properties
    };
    Tawk_LoadStart?: Date;
  }
}

const TawkMessenger = () => {


  useEffect(() => {
    if (window.Tawk_API) return; // Prevent multiple injections

    const script = document.createElement("script");
    script.async = true;
    script.src = 'https://embed.tawk.to/679b1b713a84273260771a79/1iiqu6evq';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    document.body.appendChild(script);

    return () => {
      // Optional Cleanup: Remove script if unmounting (not usually necessary)
      // document.body.removeChild(script);
    };
  }, []);


  return null;
};

export default TawkMessenger;
