import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/pages/Dashboard";
import { FormularioConsulta } from "@/pages/FormularioConsulta";
import { ReceitaResultado } from "@/pages/ReceitaResultado";
import { Pacientes } from "@/pages/Pacientes";
import { ReceitasPaciente } from "@/pages/ReceitasPaciente";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/formulario" element={<FormularioConsulta />} />
          <Route path="/receita/:id" element={<ReceitaResultado />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/pacientes/:pacienteId/receitas" element={<ReceitasPaciente />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
