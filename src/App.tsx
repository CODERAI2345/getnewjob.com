import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import Portals from "./pages/Portals";
import Companies from "./pages/Companies";
import CompanyDetail from "./pages/CompanyDetail";
import Customize from "./pages/Customize";
import AdminPortals from "./pages/AdminPortals";
import AdminCompanies from "./pages/AdminCompanies";
import IndianStartups from "./pages/IndianStartups";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portals" element={<Portals />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/company/:id" element={<CompanyDetail />} />
            <Route path="/indian-startups" element={<IndianStartups />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/customize" element={<ProtectedRoute><Customize /></ProtectedRoute>} />
            <Route path="/admin/portals" element={<ProtectedRoute><AdminPortals /></ProtectedRoute>} />
            <Route path="/admin/companies" element={<ProtectedRoute><AdminCompanies /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
