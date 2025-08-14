// API Service Layer - Compatible with backend routes
// Toggle USE_MOCK_DATA to switch between mocked data and real API calls

const USE_MOCK_DATA = false;
const API_BASE_URL = 'http://localhost:3000'; // Change to your backend URL when ready

// Mock data that matches API response structure
const mockUsers = [
  {
    id: "64f7b1234567890abcdef123",
    nome: "Ana Santos",
    cpf: "12345678901",
    fatSecretUserId: "abc123def456",
    email: "ana.santos@email.com",
    telefone: "(81) 99999-9999",
    forms: [
      {
        id: "form1",
        idade: 28,
        peso: 65,
        altura: 1.65,
        objetivo: "emagrecimento",
        restricoes: ["lactose"],
        preferencias: ["vegetariano"],
        dataCriacao: "2024-01-15T10:30:00.000Z",
        dataConsulta: "2024-01-15",
        ocupacao: "Professora",
        sexo: "feminino",
        dataNascimento: "1995-05-10",
        vinculoUfpe: "servidor",
        objetivoHistoriaClinica: "Perda de peso para melhoria da saúde"
      }
    ],
    receita: [
      {
        _id: "64f7b1234567890abcdef456",
        recipeId: "12345",
        nome: "Salada de Quinoa com Vegetais",
        descricao: "Receita saudável e nutritiva para emagrecimento",
        dataCriacao: "2024-01-15T10:30:00.000Z",
        preferences: {
          dietaryRestrictions: ["vegetarian"],
          allergens: ["lactose"],
          maxCalories: 400
        }
      }
    ]
  },
  {
    id: "64f7b1234567890abcdef124",
    nome: "Carlos Silva",
    cpf: "12345678902",
    fatSecretUserId: "abc123def457",
    email: "carlos.silva@email.com",
    telefone: "(81) 88888-8888",
    forms: [
      {
        id: "form2",
        idade: 35,
        peso: 80,
        altura: 1.80,
        objetivo: "ganho_massa",
        restricoes: [],
        preferencias: [],
        dataCriacao: "2024-01-10T14:20:00.000Z",
        dataConsulta: "2024-01-10",
        ocupacao: "Engenheiro",
        sexo: "masculino",
        dataNascimento: "1988-03-15",
        vinculoUfpe: "externo",
        objetivoHistoriaClinica: "Ganho de massa muscular"
      }
    ],
    receita: [
      {
        _id: "64f7b1234567890abcdef457",
        recipeId: "12346",
        nome: "Frango Grelhado com Batata Doce",
        descricao: "Receita rica em proteínas para ganho de massa",
        dataCriacao: "2024-01-10T14:20:00.000Z",
        preferences: {
          dietaryRestrictions: [],
          maxCalories: 650
        }
      }
    ]
  }
];

const mockReceitas = [
  {
    _id: "64f7b1234567890abcdef456",
    recipeId: "12345",
    nome: "Salada de Quinoa com Vegetais",
    descricao: "Receita saudável e nutritiva para emagrecimento",
    dataCriacao: "2024-01-15T10:30:00.000Z",
    preferences: {
      dietaryRestrictions: ["vegetarian"],
      allergens: ["lactose"],
      maxCalories: 400
    }
  },
  {
    _id: "64f7b1234567890abcdef457",
    recipeId: "12346",
    nome: "Frango Grelhado com Batata Doce",
    descricao: "Receita rica em proteínas para ganho de massa",
    dataCriacao: "2024-01-10T14:20:00.000Z",
    preferences: {
      dietaryRestrictions: [],
      maxCalories: 650
    }
  },
  {
    _id: "64f7b1234567890abcdef458",
    recipeId: "12347",
    nome: "Salmão com Aspargos",
    descricao: "Receita rica em ômega 3 e baixa em carboidratos",
    dataCriacao: "2024-01-12T16:45:00.000Z",
    preferences: {
      dietaryRestrictions: [],
      maxCalories: 500
    }
  }
];

// API Service Class
class ApiService {
  private baseURL = 'http://localhost:3000';

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
    };
  }

  // Users endpoints
  async getUsers() {
    if (USE_MOCK_DATA) {
      return { users: mockUsers };
    }
    
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getUserById(id: string) {
    if (USE_MOCK_DATA) {
      const user = mockUsers.find(u => u.id === id);
      return user ? { user } : { error: "Usuário não encontrado" };
    }
    
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getUserByCpf(cpf: string) {
    if (USE_MOCK_DATA) {
      const user = mockUsers.find(u => u.cpf === cpf);
      return user ? { user } : { error: "Usuário não encontrado" };
    }
    
    const response = await fetch(`${API_BASE_URL}/users?cpf=${cpf}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getUserFormsReceitas(id: string) {
    if (USE_MOCK_DATA) {
      const user = mockUsers.find(u => u.id === id);
      if (!user) return { error: "Usuário não encontrado" };
      
      return {
        forms: user.forms || [],
        receitas: user.receita || []
      };
    }
    
    const response = await fetch(`${API_BASE_URL}/users/${id}/forms-receitas`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getUser(userId: string) {
    try {
      const response = await fetch(`${this.baseURL}/users/${userId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return { error: 'Erro ao buscar usuário' };
    }
  }

  async getUserReceita(userId: string, receitaId: string) {
    try {
      const response = await fetch(`${this.baseURL}/users/${userId}/receita/${receitaId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar receita:', error);
      return { error: 'Erro ao buscar receita' };
    }
  }

  // Forms endpoints
  async createForm(formData: {
    cpf: string;
    nome: string;
    forms: {
      idade: number;
      peso: number;
      altura: number;
      objetivo: string;
      restricoes: string[];
      preferencias: string[];
      dataConsulta?: string;
      ocupacao?: string;
      sexo?: string;
      dataNascimento?: string;
      telefone?: string;
      email?: string;
      vinculoUfpe?: string;
      objetivoHistoriaClinica?: string;
      [key: string]: any;
    };
  }) {
    if (USE_MOCK_DATA) {
      const existingUser = mockUsers.find(u => u.cpf === formData.cpf);
      
      if (existingUser) {
        const newForm = {
          id: `form${Date.now()}`,
          ...formData.forms,
          dataCriacao: new Date().toISOString(),
          dataConsulta: formData.forms.dataConsulta || new Date().toISOString().split('T')[0],
          ocupacao: formData.forms.ocupacao || "",
          sexo: formData.forms.sexo || "masculino",
          dataNascimento: formData.forms.dataNascimento || "",
          vinculoUfpe: formData.forms.vinculoUfpe || "externo",
          objetivoHistoriaClinica: formData.forms.objetivoHistoriaClinica || ""
        };
        existingUser.forms.push(newForm);
        
        return {
          message: "Formulário adicionado com sucesso",
          user: existingUser
        };
      } else {
        const newUser = {
          id: `user${Date.now()}`,
          nome: formData.nome,
          cpf: formData.cpf,
          fatSecretUserId: `fs${Date.now()}`,
          email: formData.forms.email || "",
          telefone: formData.forms.telefone || "",
          forms: [{
            id: `form${Date.now()}`,
            ...formData.forms,
            dataCriacao: new Date().toISOString(),
            dataConsulta: formData.forms.dataConsulta || new Date().toISOString().split('T')[0],
            ocupacao: formData.forms.ocupacao || "",
            sexo: formData.forms.sexo || "masculino",
            dataNascimento: formData.forms.dataNascimento || "",
            vinculoUfpe: formData.forms.vinculoUfpe || "externo",
            objetivoHistoriaClinica: formData.forms.objetivoHistoriaClinica || ""
          }],
          receita: []
        };
        
        mockUsers.push(newUser);
        
        return {
          message: "Usuário criado e formulário adicionado com sucesso",
          user: newUser
        };
      }
    }
    
    const response = await fetch(`${API_BASE_URL}/forms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `HTTP error! status: ${response.status}` }));
      return { error: errorData.error || errorData.message || `HTTP error! status: ${response.status}` };
    }
    
    return response.json();
  }

  // Recipes endpoints
  async generateRecipes(recipeData: {
    cpf: string;
    preferences: {
      dietaryRestrictions?: string[];
      preferredIngredients?: string[];
      allergens?: string[];
      maxCalories?: number;
      cuisine?: string;
      mealType?: string;
      spiceLevel?: string;
    };
  }) {
    if (USE_MOCK_DATA) {
      const generatedReceitas = mockReceitas.slice(0, 3).map(receita => ({
        ...receita,
        _id: `generated${Date.now()}${Math.random()}`,
        dataCriacao: new Date().toISOString(),
        preferences: {
          dietaryRestrictions: recipeData.preferences.dietaryRestrictions || [],
          allergens: recipeData.preferences.allergens || [],
          maxCalories: recipeData.preferences.maxCalories || 1800
        }
      }));
      
      // Add recipes to user's receita array
      const user = mockUsers.find(u => u.cpf === recipeData.cpf);
      if (user) {
        user.receita.push(...generatedReceitas);
      }
      
      return {
        message: "Receitas geradas com sucesso",
        receitas: generatedReceitas,
        totalReceitas: generatedReceitas.length
      };
    }
    
    const response = await fetch(`${API_BASE_URL}/recipes/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipeData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `HTTP error! status: ${response.status}` }));
      return { error: errorData.error || errorData.message || `HTTP error! status: ${response.status}` };
    }
    
    return response.json();
  }

  // Compatibility route
  async gerarReceita(recipeData: {
    cpf: string;
    preferences: {
      dietaryRestrictions?: string[];
      preferredIngredients?: string[];
      allergens?: string[];
      maxCalories?: number;
      cuisine?: string;
      mealType?: string;
      spiceLevel?: string;
    };
  }) {
    // This route works the same as generateRecipes for compatibility
    return this.generateRecipes(recipeData);
  }

  // Food search endpoint
  async searchFoods(searchExpression: string, maxResults: number = 10, pageNumber: number = 0) {
    try {
      const queryParams = new URLSearchParams({
        search_expression: searchExpression,
        max_results: maxResults.toString(),
        page_number: pageNumber.toString()
      });

      const response = await fetch(`${API_BASE_URL}/foods/search?${queryParams}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar alimentos:', error);
      return { error: 'Erro ao buscar alimentos' };
    }
  }
}

export const apiService = new ApiService();
export default apiService;