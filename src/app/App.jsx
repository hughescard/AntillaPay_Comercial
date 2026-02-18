import AppProviders from "@/app/providers/AppProviders";
import AppRouter from "@/app/router/AppRouter";
import { Toaster } from "@/components/ui/toaster";

export default function App() {
  return (
    <AppProviders>
      <AppRouter />
      <Toaster />
    </AppProviders>
  );
}

