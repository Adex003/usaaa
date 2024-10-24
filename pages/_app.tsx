import "../styles/globals.css";

import type { AppProps } from "next/app";
import { createContext, useState } from "react";
import { generateString } from "../utils/generateString";

export const DataContext = createContext({} as any);

function MyApp({ Component, pageProps }: AppProps) {
  // Initializing state
  const [data, setData] = useState(() => {
    let sessionId;

    if (typeof window !== 'undefined') {
      // Try to fetch the sessionId from localStorage
      sessionId = localStorage.getItem('sessionId');

      // If sessionId doesn't exist in localStorage, generate a new one
      if (!sessionId) {
        sessionId = generateString(10);
        localStorage.setItem('sessionId', sessionId);
      }
    }

    return {
      sessionId: sessionId,
    };
  });
  return (
    <DataContext.Provider value={{ data, setData }}>
      <Component {...pageProps} />
    </DataContext.Provider>
  );
}

export default MyApp;
