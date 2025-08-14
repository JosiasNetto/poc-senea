import crypto from "crypto"
import axios from "axios"

class FatSecretAPIService {
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



export default FatSecretAPIService;