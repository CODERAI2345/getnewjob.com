import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Portals from "./pages/Portals";
import Companies from "./pages/Companies";
import CompanyDetail from "./pages/CompanyDetail";
import Customize from "./pages/Customize";
import AdminPortals from "./pages/AdminPortals";
import AdminCompanies from "./pages/AdminCompanies";
import JobSearch from "./pages/JobSearch";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portals" element={<Portals />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/company/:id" element={<CompanyDetail />} />
          <Route path="/job-search" element={<JobSearch />} />
          <Route path="/customize" element={<Customize />} />
          <Route path="/admin/portals" element={<AdminPortals />} />
          <Route path="/admin/companies" element={<AdminCompanies />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
