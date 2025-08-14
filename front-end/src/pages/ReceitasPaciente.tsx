import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  Target,
  TrendingUp,
  Clock
} from "lucide-react";
import apiService from "@/services/api";

export const ReceitasPaciente = () => {
  const { pacienteId } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<any>(null);
  const [receitas, setReceitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load patient data and recipes using API service
  useEffect(() => {
    const loadPacienteData = async () => {
      if (!pacienteId) return;
      
      try {
        setLoading(true);
        
        // Get patient basic info
        const userResponse = await apiService.getUserById(pacienteId);
        if (userResponse.error) {
          console.error("Paciente não encontrado");
          return;
        }
        
        // Get patient forms and recipes
        const formsReceitasResponse = await apiService.getUserFormsReceitas(pacienteId);
        
        const user = userResponse.user;
        const latestForm = user.forms?.length > 0 ? user.forms[user.forms.length - 1] : {};
        
        // Transform data to match UI expectations
        setPaciente({
          id: user.id,
          nome: user.nome,
          idade: latestForm.idade || 0,
          sexo: latestForm.sexo === "masculino" ? "Masculino" : 
                latestForm.sexo === "feminino" ? "Feminino" : "Não informado",
          objetivo: latestForm.objetivo === "perda_peso" ? "Perda de Peso" :
                   latestForm.objetivo === "ganho_peso" ? "Ganho de Peso" :
                   latestForm.objetivo === "ganho_massa" ? "Ganho de Massa" :
                   latestForm.objetivo === "manutencao" ? "Manutenção" : "Não informado",
          pesoInicial: parseFloat(latestForm.peso) || 0,
          pesoAtual: parseFloat(latestForm.peso) || 0,
          metaPeso: parseFloat(latestForm.peso) - 5 || 0, // Mock meta
          dataInicio: user.forms?.[0]?.dataCriacao?.split('T')[0] || new Date().toISOString().split('T')[0]
        });
        
        // Transform recipes data
        if (formsReceitasResponse.receitas) {
          const transformedReceitas = formsReceitasResponse.receitas.map((receita: any) => ({
            id: receita._id,
            nome: receita.nome || "Receita Nutricional",
            descricao: receita.descricao || "Receita personalizada gerada",
            dataGeracao: receita.dataCriacao?.split('T')[0] || new Date().toISOString().split('T')[0],
            objetivo: latestForm.objetivo || "Não informado",
            calorias: receita.preferences?.maxCalories || 1800,
            peso: parseFloat(latestForm.peso) || 0
          }));
          
          setReceitas(transformedReceitas);
        }
        
      } catch (error) {
        console.error("Erro ao carregar dados do paciente:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPacienteData();
  }, [pacienteId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dados do paciente...</p>
        </div>
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Paciente não encontrado</h2>
          <Button onClick={() => navigate("/pacientes")}>Voltar aos Pacientes</Button>
        </div>
      </div>
    );
  }

  // Use only data from API instead of mock data

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate("/pacientes")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar aos Pacientes
          </Button>
          
          <Button 
            variant="hero"
            onClick={() => navigate(`/formulario?paciente=${pacienteId}`)}
            className="gap-2"
          >
            <FileText className="w-4 h-4" />
            Nova Consulta
          </Button>
        </div>

        {/* Paciente Info */}
        <Card className="mb-8 animate-slide-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {paciente.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div>
                  <CardTitle className="text-2xl">{paciente.nome}</CardTitle>
                  <CardDescription className="text-lg">
                    {paciente.idade} anos • {paciente.sexo} • {paciente.objetivo}
                  </CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {receitas.length} receitas
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 p-4 bg-accent/30 rounded-lg">
                <Target className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Peso Inicial</p>
                  <p className="text-muted-foreground">{paciente.pesoInicial} kg</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-accent/30 rounded-lg">
                <TrendingUp className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Peso Atual</p>
                  <p className="text-muted-foreground">{paciente.pesoAtual} kg</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-accent/30 rounded-lg">
                <Target className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Meta</p>
                  <p className="text-muted-foreground">{paciente.metaPeso} kg</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Histórico de Receitas */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Possíveis Receitas</h2>
          
          <div className="space-y-4">
            {receitas.length > 0 ? receitas.map((receita, index) => (
              <Card 
                key={receita.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {receita.nome}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(receita.dataGeracao).toLocaleDateString('pt-BR')}
                        </div>
                        <span>•</span>
                        <span>{receita.calorias} kcal/dia</span>
                        <span>•</span>
                        <span>Peso: {receita.peso} kg</span>
                      </div>
                      <div className="p-3 bg-accent/30 rounded-lg">
                        <p className="text-sm text-foreground font-medium">
                          {receita.descricao}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <Card className="text-center p-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhuma receita encontrada
                </h3>
                <p className="text-muted-foreground mb-6">
                  Este paciente ainda não possui receitas geradas.
                </p>
                <Button 
                  variant="hero"
                  onClick={() => navigate(`/formulario?paciente=${pacienteId}`)}
                  className="gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Gerar Primeira Receita
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};