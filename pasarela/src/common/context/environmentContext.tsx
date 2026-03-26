/* eslint-disable react-hooks/set-state-in-effect */
import { setAxiosEnvironment } from "@/lib/api";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./authContext";

interface EnvironmentContextType {
  environment: 'production' | 'sandbox';
  setEnvironment: (env: 'production' | 'sandbox') => void;
}

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(undefined);

export const EnvironmentProvider = ({ children }: { children: ReactNode }) => {
    const [environment, setEnvironment] = useState<'production' | 'sandbox'>("production"); 
    const { client } = useAuth();

    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const storedEnvironment = localStorage.getItem("app_environment");
        if(storedEnvironment === 'production' || storedEnvironment === 'sandbox'){
         setEnvironment(storedEnvironment);
        }
        setIsInitialized(true);
    }, [client]);

    useEffect(() => {
        if (isInitialized && environment) {
        localStorage.setItem("app_environment", environment);
        
        setAxiosEnvironment(environment);
        }
    }, [environment, isInitialized]);


    return (
        <EnvironmentContext.Provider value={{ environment, setEnvironment }}>
        {children}
        </EnvironmentContext.Provider>
    );
};

export const useEnvironment = () => {
  const context = useContext(EnvironmentContext);
  
  if (context === undefined) {
    throw new Error("useEnvironment debe ser usado dentro de un EnvironmentProvider");
  }
  
  return context;
};