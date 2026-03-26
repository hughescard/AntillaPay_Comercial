'use client';
import { AuthProvider } from './authContext';
import { EnvironmentProvider } from './environmentContext';
import { LanguageProvider } from './languageContext';
import { RbacSimulationProvider } from './rbacSimulationContext';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <LanguageProvider>
      <RbacSimulationProvider>
        <EnvironmentProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </EnvironmentProvider>
      </RbacSimulationProvider>
    </LanguageProvider>
  );
};
