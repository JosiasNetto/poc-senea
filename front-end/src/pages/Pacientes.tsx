import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  FileText, 
  Calendar, 
  Users,
  Filter,
  MoreVertical,
  Eye,
  Edit
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import apiService from "@/services/api";

interface Patient {
  id: string;
  nome: string;
  cpf: string;
  email?: string;
  telefone?: string;
  forms: any[];
  receita: any[];
  ultimaConsulta?: string;
  totalReceitas: number;
  objetivo?: string;
  status: string;
  idade?: number;
  sexo?: string;
}

export const Pacientes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pacientes, setPacientes] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load patients data using API service
  useEffect(() => {
    const loadPacientes = async () => {
      try {
        setLoading(true);
        const response = await apiService.getUsers();
        
        // Transform API data to match UI expectations
        const transformedPacientes = response.users.map((user: any) => ({
          id: user.id,
          nome: user.nome,
          cpf: user.cpf,
          email: user.email || "",
          telefone: user.telefone || "",
          forms: user.forms,
          receita: user.receita,
          ultimaConsulta: user.forms?.length > 0 
            ? user.forms[user.forms.length - 1]?.dataCriacao?.split('T')[0] 
            : new Date().toISOString().split('T')[0],
          totalReceitas: user.receita?.length || 0,
          objetivo: user.forms?.length > 0 
            ? user.forms[user.forms.length - 1]?.objetivo 
            : "Não informado",
          status: user.receita?.length > 0 ? "Ativo" : "Inativo",
          idade: user.forms?.length > 0 
            ? user.forms[user.forms.length - 1]?.idade 
            : 0,
          sexo: user.forms?.length > 0 
            ? user.forms[user.forms.length - 1]?.sexo 
            : "Não informado"
        }));
        
        setPacientes(transformedPacientes);
      } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPacientes();
  }, []);

  const filteredPacientes = pacientes.filter(paciente =>
    paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.objetivo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    return status === "Ativo" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground";
  };

  const handleViewReceitas = (pacienteId: string) => {
    navigate(`/pacientes/${pacienteId}/receitas`);
  };

  const handleViewDetails = (pacienteId: string) => {
    navigate(`/pacientes/${pacienteId}/receitas`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Users className="w-8 h-8 text-primary" />
              Pacientes
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie todos os seus pacientes e suas receitas
            </p>
          </div>
          
          <Button 
            variant="hero"
            onClick={() => navigate("/formulario")}
            className="gap-2"
          >
            <FileText className="w-4 h-4" />
            Nova Consulta
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{pacientes.length}</p>
                  <p className="text-sm text-muted-foreground">Total de Pacientes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-glow/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{pacientes.filter(p => p.status === "Ativo").length}</p>
                  <p className="text-sm text-muted-foreground">Pacientes Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: "200ms" }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {pacientes.reduce((total, p) => total + p.totalReceitas, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Receitas Geradas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: "300ms" }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent/30 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
          <p className="text-2xl font-bold text-foreground">
            {pacientes.length > 0 ? Math.round(pacientes.reduce((total, p) => total + p.totalReceitas, 0) / pacientes.length) : 0}
          </p>
                  <p className="text-sm text-muted-foreground">Média por Paciente</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 animate-slide-up" style={{ animationDelay: "400ms" }}>
          <CardHeader>
            <CardTitle>Buscar Pacientes</CardTitle>
            <CardDescription>
              Encontre rapidamente o paciente que você procura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou objetivo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pacientes List */}
        <div className="space-y-4">
          {filteredPacientes.map((paciente, index) => (
            <Card 
              key={paciente.id} 
              className="cursor-pointer hover:shadow-glow animate-slide-up"
              style={{ animationDelay: `${(index + 5) * 100}ms` }}
              onClick={() => handleViewDetails(paciente.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {paciente.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-foreground">{paciente.nome}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        
                        <span>Última consulta: {new Date(paciente.ultimaConsulta).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge className={getStatusColor(paciente.status)}>
                        {paciente.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {paciente.objetivo}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold text-foreground">{paciente.totalReceitas}</p>
                      <p className="text-sm text-muted-foreground">Receitas</p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(paciente.id);
                        }}>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleViewReceitas(paciente.id);
                        }}>
                          <FileText className="w-4 h-4 mr-2" />
                          Ver Receitas
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/formulario?paciente=${paciente.id}`);
                        }}>
                          <Edit className="w-4 h-4 mr-2" />
                          Nova Consulta
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredPacientes.length === 0 && (
          <Card className="text-center p-12 animate-fade-in">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum paciente encontrado
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? "Tente usar outros termos de busca." : "Comece criando sua primeira consulta."}
            </p>
            <Button 
              variant="medical" 
              onClick={() => navigate("/formulario")}
              className="gap-2"
            >
              <FileText className="w-4 h-4" />
              Nova Consulta
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};