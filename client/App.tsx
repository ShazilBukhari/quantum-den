import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { PlaceholderPage } from "./components/PlaceholderPage";
import Index from "./pages/Index";
import Templates from "./pages/Templates";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import Support from "./pages/Support";
import SignIn from "./pages/SignIn";
import GetStarted from "./pages/GetStarted";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import PortfolioBuilder from "./pages/PortfolioBuilder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/support" element={<Support />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/get-started" element={<GetStarted />} />
              <Route
                path="/builder/resume"
                element={
                  <PlaceholderPage
                    title="Resume Builder"
                    description="Create stunning resumes with our interactive builder. Real-time preview and professional templates."
                  />
                }
              />
              <Route path="/builder/portfolio" element={<PortfolioBuilder />} />
              <Route path="/account" element={<Account />} />
              <Route
                path="/privacy"
                element={
                  <PlaceholderPage
                    title="Privacy Policy"
                    description="Learn how we protect and handle your personal information."
                  />
                }
              />
              <Route
                path="/terms"
                element={
                  <PlaceholderPage
                    title="Terms of Service"
                    description="Read our terms and conditions for using R&P Generator."
                  />
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <PlaceholderPage
                    title="Reset Password"
                    description="Enter your email address to receive a password reset link."
                  />
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
