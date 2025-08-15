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
  Clock,
  Activity,
  Heart,
  User,
  Stethoscope,
  Beaker,
  AlertTriangle
} from "lucide-react";
import apiService from "@/services/api";

export const ReceitasPaciente = () => {
  const { pacienteId } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<any>(null);
  const [receitas, setReceitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to format enum values
  const formatEnumValue = (value: string) => {
    const translations = {
      'nunca': 'Nunca',
      '1x_mes': '1x por mês',
      '1-2x_mes': '1-2x por mês', 
      '3-4x_mes': '3-4x por mês',
      'diariamente': 'Diariamente',
      'raramente': 'Raramente',
      'masculino': 'Masculino',
      'feminino': 'Feminino',
      'servidor': 'Servidor',
      'estudante': 'Estudante',
      'externo': 'Externo',
      'sim': 'Sim',
      'nao': 'Não',
      'diario': 'Diário',
      'dias_alternados': 'Dias alternados',
      'mais_2_dias': 'Mais de 2 dias',
      'escura': 'Escura',
      'clara': 'Clara',
      'transparente': 'Transparente'
    };
    return translations[value as keyof typeof translations] || value;
  };

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
        const allForms = user.forms || [];
        
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
          pesoInicial: parseFloat(allForms[0]?.peso) || parseFloat(latestForm.peso) || 0,
          pesoAtual: parseFloat(latestForm.peso) || 0,
          metaPeso: parseFloat(latestForm.peso) - 5 || 0, // Mock meta
          dataInicio: user.forms?.[0]?.dataCriacao?.split('T')[0] || new Date().toISOString().split('T')[0],
          // Dados do formulário completo
          cpf: user.cpf,
          telefone: latestForm.telefone || "Não informado",
          email: latestForm.email || "Não informado",
          ocupacao: latestForm.ocupacao || "Não informado",
          vinculoUfpe: latestForm.vinculoUfpe || "Não informado",
          altura: parseFloat(latestForm.altura) || 0,
          imc: latestForm.imc || "Não calculado",
          pressaoArterial: latestForm.pressaoArterial || "Não informado",
          historiaClinica: {
            temDiagnostico: latestForm.temDiagnostico || "Não informado",
            quaisDiagnosticos: latestForm.quaisDiagnosticos || "Nenhum",
            alergiaIntolerancia: latestForm.alergiaIntolerancia || "Nenhuma",
            suplementosMedicamentos: latestForm.suplementosMedicamentos || "Nenhum"
          },
          estiloVida: {
            bebidaAlcoolica: formatEnumValue(latestForm.bebidaAlcoolica) || "Não informado",
            fuma: formatEnumValue(latestForm.fuma) || "Não informado",
            atividadeFisica1: latestForm.atividadeFisica1 || "Não informado",
            frequenciaAtividade1: latestForm.frequenciaAtividade1 || "",
            horasSono: latestForm.horasSono || "Não informado",
            aguaPorDia: latestForm.aguaPorDia || "Não informado"
          },
          ultimaConsulta: latestForm.dataConsulta || new Date().toISOString().split('T')[0],
          objetivoHistoriaClinica: latestForm.objetivoHistoriaClinica || "Não especificado",
          totalConsultas: allForms.length,
          evolucaoPeso: allForms.length > 1 ? 
            parseFloat(latestForm.peso) - parseFloat(allForms[0].peso) : 0
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
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Última consulta: {new Date(paciente.ultimaConsulta).toLocaleDateString('pt-BR')}
                    {paciente.totalConsultas > 1 && (
                      <>
                        <span>•</span>
                        <span>{paciente.totalConsultas} consultas realizadas</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {receitas.length} receitas
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

              {paciente.totalConsultas > 1 && (
                <div className={`flex items-center gap-3 p-4 rounded-lg ${
                  paciente.evolucaoPeso < 0 ? 'bg-green-50 border border-green-200' : 
                  paciente.evolucaoPeso > 0 ? 'bg-red-50 border border-red-200' : 
                  'bg-gray-50 border border-gray-200'
                }`}>
                  <TrendingUp className={`w-8 h-8 ${
                    paciente.evolucaoPeso < 0 ? 'text-green-600' : 
                    paciente.evolucaoPeso > 0 ? 'text-red-600' : 
                    'text-gray-600'
                  }`} />
                  <div>
                    <p className="font-semibold text-foreground">Evolução</p>
                    <p className={`${
                      paciente.evolucaoPeso < 0 ? 'text-green-700' : 
                      paciente.evolucaoPeso > 0 ? 'text-red-700' : 
                      'text-gray-700'
                    }`}>
                      {paciente.evolucaoPeso > 0 ? '+' : ''}{paciente.evolucaoPeso.toFixed(1)} kg
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Informações Detalhadas do Paciente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Dados Pessoais e Contato */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Dados Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">CPF</p>
                  <p className="text-foreground">{paciente.cpf}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ocupação</p>
                  <p className="text-foreground">{paciente.ocupacao}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                  <p className="text-foreground">{paciente.telefone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-foreground">{paciente.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Vínculo UFPE</p>
                  <p className="text-foreground">{formatEnumValue(paciente.vinculoUfpe)}</p>
                </div>
              </div>
              {paciente.objetivoHistoriaClinica && paciente.objetivoHistoriaClinica !== "Não especificado" && (
                <div className="p-3 bg-accent/30 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Objetivo da Consulta</p>
                  <p className="text-foreground">{paciente.objetivoHistoriaClinica}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Antropometria */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Antropometria
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Altura</p>
                  <p className="text-foreground">{paciente.altura} cm</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">IMC</p>
                  <p className="text-foreground">{paciente.imc}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Pressão Arterial</p>
                  <p className="text-foreground">{paciente.pressaoArterial}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* História Clínica */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary" />
                História Clínica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Possui Diagnóstico</p>
                <p className="text-foreground">{formatEnumValue(paciente.historiaClinica.temDiagnostico)}</p>
              </div>
              {paciente.historiaClinica.quaisDiagnosticos && paciente.historiaClinica.quaisDiagnosticos !== "Nenhum" && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Diagnósticos</p>
                  <p className="text-foreground">{paciente.historiaClinica.quaisDiagnosticos}</p>
                </div>
              )}
              {paciente.historiaClinica.alergiaIntolerancia && paciente.historiaClinica.alergiaIntolerancia !== "Nenhuma" && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Alergias/Intolerâncias</p>
                      <p className="text-yellow-700">{paciente.historiaClinica.alergiaIntolerancia}</p>
                    </div>
                  </div>
                </div>
              )}
              {paciente.historiaClinica.suplementosMedicamentos && paciente.historiaClinica.suplementosMedicamentos !== "Nenhum" && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Medicamentos/Suplementos</p>
                  <p className="text-foreground">{paciente.historiaClinica.suplementosMedicamentos}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estilo de Vida */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Estilo de Vida
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bebida Alcoólica</p>
                  <p className="text-foreground">{paciente.estiloVida.bebidaAlcoolica}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fuma</p>
                  <p className="text-foreground">{paciente.estiloVida.fuma}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Horas de Sono</p>
                  <p className="text-foreground">{paciente.estiloVida.horasSono}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Água por Dia</p>
                  <p className="text-foreground">{paciente.estiloVida.aguaPorDia}</p>
                </div>
              </div>
              {paciente.estiloVida.atividadeFisica1 && paciente.estiloVida.atividadeFisica1 !== "Não informado" && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800">Atividade Física</p>
                  <p className="text-green-700">{paciente.estiloVida.atividadeFisica1}</p>
                  {paciente.estiloVida.frequenciaAtividade1 && (
                    <p className="text-sm text-green-600">Frequência: {paciente.estiloVida.frequenciaAtividade1}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Histórico de Receitas */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Histórico de Consultas e Receitas</h2>
            <Badge variant="outline" className="text-sm">
              {receitas.length} {receitas.length === 1 ? 'receita' : 'receitas'}
            </Badge>
          </div>
          
          <div className="space-y-4">
            {receitas.length > 0 ? receitas.map((receita, index) => (
              <Card 
                key={receita.id} 
                className="animate-slide-up hover:shadow-md transition-shadow"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {receita.nome}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(receita.dataGeracao).toLocaleDateString('pt-BR')}
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Target className="w-4 h-4" />
                              {receita.calorias} kcal/dia
                            </div>
                            <span>•</span>
                            <span>Peso: {receita.peso} kg</span>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigate(`/receita-resultado?receita=${receita.id}`)}
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                      
                      <div className="p-4 bg-accent/20 rounded-lg border border-accent/30">
                        <p className="text-sm text-foreground font-medium mb-2">Descrição da Receita:</p>
                        <p className="text-sm text-muted-foreground">
                          {receita.descricao}
                        </p>
                      </div>
                      
                      {index === 0 && (
                        <div className="flex items-center gap-2 text-xs text-primary">
                          <Clock className="w-3 h-3" />
                          <span className="font-medium">Consulta mais recente</span>
                        </div>
                      )}
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
                  Este paciente ainda não possui receitas geradas. Realize uma nova consulta para gerar a primeira receita nutricional.
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