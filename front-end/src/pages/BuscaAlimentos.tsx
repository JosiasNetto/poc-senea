import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  ArrowLeft, 
  Utensils, 
  Target,
  Activity,
  Zap,
  ExternalLink,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api";

interface FoodItem {
  food_id: string;
  food_name: string;
  food_description: string;
  food_type: string;
  food_url: string;
}

interface SearchResponse {
  success?: boolean;
  data?: {
    foods: {
      food: FoodItem; // Always single object now
      max_results: string;
      page_number: string;
      total_results: string;
    };
  };
  query?: {
    search_expression: string;
    max_results: number;
    page_number: number;
  };
  error?: string;
}

export const BuscaAlimentos = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [food, setFood] = useState<FoodItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const parseNutritionInfo = (description: string) => {
    // Parse the description format: "Per 100g - Calories: 89kcal | Fat: 0.33g | Carbs: 22.84g | Protein: 1.09g"
    const regex = /Calories: ([\d.]+)kcal.*?Fat: ([\d.]+)g.*?Carbs: ([\d.]+)g.*?Protein: ([\d.]+)g/;
    const match = description.match(regex);
    
    if (match) {
      return {
        calories: parseFloat(match[1]),
        fat: parseFloat(match[2]),
        carbs: parseFloat(match[3]),
        protein: parseFloat(match[4])
      };
    }
    
    return null;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      toast({
        title: "Erro na busca",
        description: "Por favor, digite um termo para buscar.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setHasSearched(true);
    setSearchQuery(searchTerm);

    try {
      const response = await apiService.searchFoods(searchTerm.trim(), 20, 0) as SearchResponse;
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.success && response.data?.foods?.food) {
        // Always single food item
        const foodData = response.data.foods.food;
        
        setFood(foodData);
        
        toast({
          title: "Busca realizada com sucesso",
          description: `Alimento encontrado: ${foodData.food_name}`,
        });
      } else {
        setFood(null);
        toast({
          title: "Nenhum resultado encontrado",
          description: `Não foi encontrado alimento para "${searchTerm}".`,
        });
      }
    } catch (error) {
      console.error("Erro na busca:", error);
      setFood(null);
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro ao buscar o alimento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getFoodTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "generic": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "brand": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
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
        </div>

        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Busca de Alimentos
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Pesquise informações nutricionais detalhadas de alimentos
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8 animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Pesquisar Alimento
            </CardTitle>
            <CardDescription>
              Digite o nome do alimento que deseja pesquisar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <Input
                type="text"
                placeholder="Ex: banana, arroz, frango..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
                disabled={loading}
              />
              <Button 
                type="submit" 
                variant="hero" 
                disabled={loading || !searchTerm.trim()}
                className="gap-2 min-w-[120px]"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                {loading ? "Buscando..." : "Buscar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Search Results */}
        {hasSearched && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                {food 
                  ? `Resultado para "${searchQuery}"` 
                  : `Nenhum resultado para "${searchQuery}"`
                }
              </h2>
              {food && (
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  Alimento encontrado
                </Badge>
              )}
            </div>

            {food ? (
              <Card className="animate-slide-up hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <Utensils className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {food.food_name}
                          </h3>
                          <Badge className={getFoodTypeColor(food.food_type)}>
                            {food.food_type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {food.food_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(food.food_url, '_blank')}
                        className="gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Ver Detalhes
                      </Button>
                    )}
                  </div>

                  {(() => {
                    const nutrition = parseNutritionInfo(food.food_description);
                    
                    return nutrition ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <h4 className="text-sm font-medium text-muted-foreground mb-3">
                            Informações Nutricionais (por 100g)
                          </h4>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center gap-2 p-3 bg-accent/30 rounded-lg">
                            <Zap className="w-5 h-5 text-orange-500" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Calorias</p>
                              <p className="text-sm text-muted-foreground">{nutrition.calories} kcal</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 p-3 bg-accent/30 rounded-lg">
                            <Target className="w-5 h-5 text-blue-500" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Proteínas</p>
                              <p className="text-sm text-muted-foreground">{nutrition.protein}g</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 p-3 bg-accent/30 rounded-lg">
                            <Activity className="w-5 h-5 text-green-500" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Carboidratos</p>
                              <p className="text-sm text-muted-foreground">{nutrition.carbs}g</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 p-3 bg-accent/30 rounded-lg">
                            <Target className="w-5 h-5 text-yellow-500" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Gorduras</p>
                              <p className="text-sm text-muted-foreground">{nutrition.fat}g</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-accent/20 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          {food.food_description}
                        </p>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            ) : hasSearched && !loading && (
              <Card className="text-center p-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhum alimento encontrado
                </h3>
                <p className="text-muted-foreground mb-6">
                  Tente usar termos diferentes ou verifique a ortografia.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setHasSearched(false);
                    setFood(null);
                  }}
                >
                  Nova Busca
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* Welcome Message */}
        {!hasSearched && (
          <Card className="text-center p-8 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Pesquise informações nutricionais
            </h3>
            <p className="text-muted-foreground">
              Use o campo de busca acima para encontrar informações detalhadas sobre alimentos
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
