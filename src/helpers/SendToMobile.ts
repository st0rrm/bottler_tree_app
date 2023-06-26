//@ts-nocheck
"use client";

import React, { useEffect } from "react";

export const useMobileStatus = (): boolean => {
  const [status, setStatus] = React.useState<boolean>(true);
  useEffect(() => {
    setStatus(
      window?.navigator.userAgent?.includes("Mobile") ||
        window?.navigator.userAgent?.includes("Android") ||
        window?.navigator.userAgent?.includes("iPhone")
    );
  }, []);

  return status;
};

export const SendToMobile = (type: string, message: string) => {
  window.ReactNativeWebView?.postMessage(JSON.stringify({ type, message }));
};
