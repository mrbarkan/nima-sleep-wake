import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "./components/layout/Navigation";
import Header from "./components/layout/Header";
import WelcomeModal from "./components/features/user/WelcomeModal";
import Sleep from "./pages/Sleep";
import Fasting from "./pages/Fasting";
import Caffeine from "./pages/Caffeine";
import Todo from "./pages/Todo";
import Relax from "./pages/Relax";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <WelcomeModal />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Header />
            <Navigation />
            <main className="flex-1">
              <Routes>
            <Route path="/" element={<Sleep />} />
            <Route path="/fasting" element={<Fasting />} />
            <Route path="/caffeine" element={<Caffeine />} />
            <Route path="/todo" element={<Todo />} />
                <Route path="/relax" element={<Relax />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
