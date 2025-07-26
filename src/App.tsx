import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/Layout/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { Enrollment } from "./pages/Enrollment";
import { Records } from "./pages/Records";
import { RecordView } from "./pages/RecordView";
import { PrintCards } from "./pages/PrintCards";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/enroll" element={<Enrollment />} />
            <Route path="/enroll/demographics" element={<Enrollment />} />
            <Route path="/enroll/biometrics" element={<Enrollment />} />
            <Route path="/enroll/review" element={<Enrollment />} />
            <Route path="/enroll/:id" element={<Enrollment />} />
            <Route path="/records" element={<Records />} />
            <Route path="/records/:id" element={<RecordView />} />
            <Route path="/print" element={<PrintCards />} />
            <Route path="/logs" element={<NotFound />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
