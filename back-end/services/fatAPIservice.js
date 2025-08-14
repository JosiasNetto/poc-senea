import crypto from "crypto"
import axios from "axios"

class RecipeService {
  constructor(consumerKey, consumerSecret) {
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
    this.baseUrl = 'https://platform.fatsecret.com/rest/server.api';
  }

  generateSignature(method, url, params) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');

    const baseString = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
    const signingKey = `${encodeURIComponent(this.consumerSecret)}&`;
    
    return crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');
  }

  async getRecommendedRecipes(userData) {
    const searchTerm = this.buildSearchQuery(userData);
    
    const params = {
      method: 'recipes.search',
      search_expression: searchTerm,
      page_number: 0,
      max_results: 10,
      format: 'json',
      oauth_consumer_key: this.consumerKey,
      oauth_nonce: crypto.randomBytes(16).toString('hex'),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: Math.floor(Date.now() / 1000),
      oauth_version: '1.0'
    };

    params.oauth_signature = this.generateSignature('GET', this.baseUrl, params);

    try {
      const response = await axios.get(this.baseUrl, { params });
      const recipes = response.data.recipes?.recipe || [];
      
      // Filtrar receitas baseadas nas preferências do usuário
      return this.filterRecipesByUserPreferences(recipes, userData);
    } catch (error) {
      throw new Error(`Erro ao buscar receitas: ${error.message}`);
    }
  }

  // Construir query de busca baseada nos dados do usuário
  buildSearchQuery(userData) {
    const { dietaryRestrictions, preferredIngredients, cuisine, mealType } = userData;
    
    let searchTerms = [];
    
    if (preferredIngredients?.length > 0) {
      searchTerms.push(...preferredIngredients);
    }
    
    if (cuisine) {
      searchTerms.push(cuisine);
    }
    
    if (mealType) {
      searchTerms.push(mealType);
    }
    
    // Se não há termos específicos, usar termo genérico
    if (searchTerms.length === 0) {
      searchTerms.push('healthy');
    }
    
    return searchTerms.join(' ');
  }

  // Filtrar receitas baseadas nas preferências do usuário
  filterRecipesByUserPreferences(recipes, userData) {
    const { 
      maxCalories, 
      dietaryRestrictions, 
      allergens, 
      nutritionalGoals 
    } = userData;

    return recipes.filter(recipe => {
      // Filtrar por calorias máximas
      if (maxCalories && recipe.recipe_calories > maxCalories) {
        return false;
      }

      // Filtrar por restrições dietárias
      if (dietaryRestrictions?.includes('vegetarian')) {
        if (!this.isVegetarian(recipe)) return false;
      }

      if (dietaryRestrictions?.includes('vegan')) {
        if (!this.isVegan(recipe)) return false;
      }

      // Filtrar por alérgenos
      if (allergens?.length > 0) {
        if (this.containsAllergens(recipe, allergens)) return false;
      }

      return true;
    });
  }

 
  async getRecipeDetails(recipeId) {
    const params = {
      method: 'recipe.get',
      recipe_id: recipeId,
      format: 'json',
      oauth_consumer_key: this.consumerKey,
      oauth_nonce: crypto.randomBytes(16).toString('hex'),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: Math.floor(Date.now() / 1000),
      oauth_version: '1.0'
    };

    params.oauth_signature = this.generateSignature('GET', this.baseUrl, params);

    try {
      const response = await axios.get(this.baseUrl, { params });
      return response.data.recipe;
    } catch (error) {
      throw new Error(`Erro ao obter detalhes da receita: ${error.message}`);
    }
  }

  // Funções auxiliares para filtragem
  isVegetarian(recipe) {
    const nonVegKeywords = ['chicken', 'beef', 'pork', 'fish', 'meat', 'bacon', 'ham'];
    const recipeName = recipe.recipe_name.toLowerCase();
    const recipeDesc = recipe.recipe_description?.toLowerCase() || '';
    
    return !nonVegKeywords.some(keyword => 
      recipeName.includes(keyword) || recipeDesc.includes(keyword)
    );
  }

  isVegan(recipe) {
    const nonVeganKeywords = ['chicken', 'beef', 'pork', 'fish', 'meat', 'cheese', 'milk', 'egg', 'butter', 'cream'];
    const recipeName = recipe.recipe_name.toLowerCase();
    const recipeDesc = recipe.recipe_description?.toLowerCase() || '';
    
    return !nonVeganKeywords.some(keyword => 
      recipeName.includes(keyword) || recipeDesc.includes(keyword)
    );
  }

  containsAllergens(recipe, allergens) {
    const recipeName = recipe.recipe_name.toLowerCase();
    const recipeDesc = recipe.recipe_description?.toLowerCase() || '';
    
    return allergens.some(allergen => 
      recipeName.includes(allergen.toLowerCase()) || 
      recipeDesc.includes(allergen.toLowerCase())
    );
  }
}

const CONSUMER_KEY= "7ef452824e4b47cfb0274ac44014a0ca"
const CONSUMER_SECRET="dba0feedca144e9b86e7f2c385a6e7d8"
async function testFatSecretAPI() {
  console.log('🚀 Iniciando testes da API FatSecret...\n');

  const recipeService = new RecipeService(CONSUMER_KEY, CONSUMER_SECRET);

  // Dados de teste do usuário
  const userData = {
    preferredIngredients: ['chicken', 'rice'],
    dietaryRestrictions: [],
    allergens: [],
    maxCalories: 600,
    cuisine: 'asian',
    mealType: 'dinner'
  };

  try {
    console.log('📋 Dados do usuário para teste:');
    console.log(JSON.stringify(userData, null, 2));
    console.log('\n');

    // Teste 1: Buscar receitas recomendadas
    console.log('🔍 Teste 1: Buscando receitas recomendadas...');
    const recipes = await recipeService.getRecommendedRecipes(userData);
    console.log(`✅ Encontradas ${recipes.length} receitas!`);
    
    if (recipes.length > 0) {
      console.log('\n📄 Primeiras 3 receitas encontradas:');
      recipes.slice(0, 3).forEach((recipe, index) => {
        console.log(`${index + 1}. ${recipe.recipe_name}`);
        console.log(`   ID: ${recipe.recipe_id}`);
        console.log(`   Descrição: ${recipe.recipe_description}`);
        console.log('');
      });

      // Teste 2: Buscar detalhes de uma receita específica
      if (recipes[0]?.recipe_id) {
        console.log('🔍 Teste 2: Buscando detalhes da primeira receita...');
        try {
          const recipeDetails = await recipeService.getRecipeDetails(recipes[0].recipe_id);
          console.log('✅ Detalhes da receita obtidos com sucesso!');
          console.log('📖 Detalhes:', JSON.stringify(recipeDetails, null, 2));
        } catch (detailError) {
          console.log('⚠️  Erro ao buscar detalhes da receita:', detailError.message);
        }
      }
    } else {
      console.log('⚠️  Nenhuma receita encontrada para os critérios especificados.');
    }

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
    
    // Log mais detalhado do erro
    if (error.response) {
      console.error('📊 Detalhes da resposta de erro:');
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testFatSecretAPI();

export default RecipeService;