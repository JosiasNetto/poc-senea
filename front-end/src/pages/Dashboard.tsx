import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Users, FileText, Search } from "lucide-react";

export const Dashboard = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Nova Consulta",
      description: "Iniciar formulário para novo paciente",
      icon: ClipboardList,
      path: "/formulario",
      variant: "hero" as const
    },
    {
      title: "Ver Pacientes",
      description: "Gerenciar pacientes existentes",
      icon: Users,
      path: "/pacientes",
      variant: "card" as const
    },
    {
      title: "Busca Alimentos",
      description: "Pesquisar informações nutricionais",
      icon: Search,
      path: "/busca-alimentos",
      variant: "card" as const
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground">
            Bem-vindo ao Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Gerencie consultas e receitas personalizadas para seus pacientes
          </p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card 
                  key={action.title} 
                  className="cursor-pointer hover:shadow-glow animate-slide-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                  onClick={() => navigate(action.path)}
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{action.title}</CardTitle>
                    <CardDescription className="text-center">
                      {action.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button 
                      variant={action.variant}
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(action.path);
                      }}
                    >
                      Acessar
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
};