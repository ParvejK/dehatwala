import { useEffect } from "react";

declare global {
  interface Window {
    Tawk_API?: {
      hideWidget: () => void;
      showWidget: () => void;
      [key: string]: any; // Allows additional dynamic properties
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

  
  // useEffect(() => {
  //   // Prevent script from loading multiple times
  //   if (document.getElementById("tawk-script")) return;

  //   // Set load start time
  //   window.Tawk_LoadStart = new Date();

  //   // Create the script element
  //   const script = document.createElement("script");
  //   script.id = "tawk-script";
  //   script.src = "https://embed.tawk.to/679b1bac825083258e0d633a/default"; // Replace with your Tawk.to ID
  //   script.async = true;
  //   script.charset = "UTF-8";
  //   script.setAttribute("crossorigin", "*");

  //   // Append to document
  //   document.body.appendChild(script);

  //   // Handle Tawk API when it's loaded
  //   script.onload = () => {
  //     const interval = setInterval(() => {
  //       if (window.Tawk_API?.hideWidget) {
  //         window.Tawk_API.hideWidget(); // You can change to showWidget() if needed
  //         clearInterval(interval);
  //       }
  //     }, 500);
  //   };

  //   // Cleanup on unmount
  //   return () => {
  //     const existingScript = document.getElementById("tawk-script");
  //     if (existingScript) {
  //       document.body.removeChild(existingScript);
  //     }
  //   };
  // }, []);

  return null;
};

export default TawkMessenger;
