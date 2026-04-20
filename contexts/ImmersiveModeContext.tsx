"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ImmersiveModeContextType {
  isImmersive: boolean;
  toggleImmersiveMode: () => void;
}

const ImmersiveModeContext = createContext<
  ImmersiveModeContextType | undefined
>(undefined);

export function ImmersiveModeProvider({ children }: { children: ReactNode }) {
  const [isImmersive, setIsImmersive] = useState(false);

  const toggleImmersiveMode = () => {
    setIsImmersive((prev) => !prev);
  };

  return (
    <ImmersiveModeContext.Provider value={{ isImmersive, toggleImmersiveMode }}>
      {children}
    </ImmersiveModeContext.Provider>
  );
}

export function useImmersiveMode() {
  const context = useContext(ImmersiveModeContext);
  if (context === undefined) {
    throw new Error(
      "useImmersiveMode must be used within ImmersiveModeProvider",
    );
  }
  return context;
}
