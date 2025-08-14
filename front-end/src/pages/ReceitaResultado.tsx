import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Share2, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Target,
  Utensils,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api";

export const ReceitaResultado = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { toast } = useToast();
  const { formData, user, receitas } = location.state || {};
  
  // Get recipe ID from URL params or location state
  const receitaId = params.id || location.state?.receitaId;
  
  const [loading, setLoading] = useState(true);
  const [receitaData, setReceitaData] = useState(null);
  const [userData, setUserData] = useState(user || null);

  useEffect(() => {
    const fetchReceitaData = async () => {
      if (!user?.id || !receitaId) {
        console.error("Missing user ID or receita ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch specific recipe
        const receitaResponse = await apiService.getUserReceita(user.id, receitaId);
        console.log("Receita response:", receitaResponse);
        
        if (receitaResponse.receita) {
          setReceitaData(receitaResponse.receita);
        } else {
          throw new Error("Receita não encontrada");
        }
        
        // Optionally fetch updated user data if not available
        if (!userData) {
          const userResponse = await apiService.getUser(user.id);
          if (userResponse.user) {
            setUserData(userResponse.user);
          }
        }
        
      } catch (error) {
        console.error("Erro ao buscar dados da receita:", error);
        toast({
          title: "Erro ao carregar receita",
          description: "Não foi possível carregar os dados da receita.",
          variant: "destructive",
        });
        
        // Use fallback data from location state if available
        if (receitas && receitas.length > 0) {
          const fallbackReceita = receitas.find(r => r._id === receitaId) || receitas[0];
          setReceitaData(fallbackReceita);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReceitaData();
  }, [user?.id, receitaId, receitas, userData, toast]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Carregando receita...</p>
        </div>
      </div>
    );
  }

  // Error state - no data available
  if (!receitaData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Receita não encontrada</h2>
          <p className="text-muted-foreground mb-6">Não foi possível carregar os dados da receita.</p>
          <Button onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getObjetivoLabel = (objetivo: string) => {
    const objetivos = {
      perda_peso: "Perda de Peso",
      ganho_peso: "Ganho de Peso", 
      manutencao: "Manutenção",
      ganho_massa: "Ganho de Massa"
    };
    return objetivos[objetivo as keyof typeof objetivos] || objetivo;
  };

  const handleDownload = () => {
    // Implementar download do PDF
    console.log("Download da receita");
  };

  const handleShare = () => {
    // Implementar compartilhamento
    console.log("Compartilhar receita");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </Button>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleShare} className="gap-2">
              <Share2 className="w-4 h-4" />
              Compartilhar
            </Button>
            <Button variant="medical" onClick={handleDownload} className="gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Receita Header */}
        <Card className="mb-8 animate-slide-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">Receita Nutricional Personalizada</CardTitle>
                <CardDescription className="text-lg">
                  Gerada para {userData?.nome || 'Paciente'} em {new Date(receitaData.dataCriacao).toLocaleDateString('pt-BR')}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                ID: {receitaData._id}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 p-4 bg-accent/30 rounded-lg">
                <Target className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Objetivo</p>
                  <p className="text-muted-foreground">{getObjetivoLabel(receitaData.preferences?.objetivo || receitaData.objetivo || 'melhoria_saude')}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-accent/30 rounded-lg">
                <Utensils className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Calorias Diárias</p>
                  <p className="text-muted-foreground">{receitaData.preferences?.maxCalories || receitaData.calorias?.total || 'N/A'} kcal</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-accent/30 rounded-lg">
                <Clock className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Refeições</p>
                  <p className="text-muted-foreground">{receitaData.refeicoes?.length || 0} por dia</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Macronutrientes */}
        {receitaData.macros && (
          <Card className="mb-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <CardHeader>
              <CardTitle>Distribuição de Macronutrientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                  <h3 className="text-2xl font-bold text-primary">{receitaData.macros.proteina || 'N/A'}</h3>
                  <p className="text-muted-foreground">Proteínas</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg">
                  <h3 className="text-2xl font-bold text-secondary">{receitaData.macros.carboidrato || 'N/A'}</h3>
                  <p className="text-muted-foreground">Carboidratos</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-accent-foreground/10 to-accent-foreground/5 rounded-lg">
                  <h3 className="text-2xl font-bold text-accent-foreground">{receitaData.macros.gordura || 'N/A'}</h3>
                  <p className="text-muted-foreground">Gorduras</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Refeições */}
        {receitaData.refeicoes && receitaData.refeicoes.length > 0 ? (
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold text-foreground">Plano Alimentar Diário</h2>
            <div className="grid gap-6">
              {receitaData.refeicoes.map((refeicao, index) => (
                <Card key={index} className="animate-slide-up" style={{ animationDelay: `${(index + 2) * 100}ms` }}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        {refeicao.nome}
                      </CardTitle>
                      <div className="flex items-center gap-4">
                        {refeicao.horario && <Badge variant="outline">{refeicao.horario}</Badge>}
                        {refeicao.calorias && <Badge variant="secondary">{refeicao.calorias} kcal</Badge>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {refeicao.alimentos && refeicao.alimentos.length > 0 ? (
                      <div className="space-y-3">
                        {refeicao.alimentos.map((alimento, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-primary" />
                              <div>
                                <p className="font-medium text-foreground">{alimento.nome}</p>
                                {alimento.quantidade && <p className="text-sm text-muted-foreground">{alimento.quantidade}</p>}
                              </div>
                            </div>
                            {alimento.calorias && <Badge variant="outline">{alimento.calorias} kcal</Badge>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Nenhum alimento especificado para esta refeição.</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="mb-8">
            <CardContent className="py-8">
              <div className="text-center">
                <Utensils className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma refeição disponível</h3>
                <p className="text-muted-foreground">Esta receita não possui informações detalhadas sobre refeições.</p>
              </div>
            </CardContent>
          </Card>
        )}



        {/* Footer Actions */}
        <div className="flex justify-center gap-4 animate-fade-in">
          <Button 
            variant="outline" 
            onClick={() => navigate("/formulario")}
            className="gap-2"
          >
            Nova Consulta
          </Button>
          <Button 
            variant="medical" 
            onClick={() => navigate("/pacientes")}
            className="gap-2"
          >
            Ver Pacientes
          </Button>
        </div>
      </div>
    </div>
  );
};