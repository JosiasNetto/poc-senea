import 'dotenv/config';
import FatSecretAPIService from './services/fatAPIservice.js';

const CONSUMER_KEY = process.env.FAT_SECRET_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.FAT_SECRET_CONSUMER_SECRET;

async function testFatSecretAPI() {
  console.log('🚀 Iniciando testes da API FatSecret...\n');

  const recipeService = new FatSecretAPIService(CONSUMER_KEY, CONSUMER_SECRET);

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
          console.log('📖 Nome:', recipeDetails.recipe_name);
          console.log('📖 Calorias por porção:', recipeDetails.serving_sizes?.serving?.calories);
          console.log('📖 Tempo de preparo:', recipeDetails.preparation_time_min, 'minutos');
          console.log('📖 Tempo de cozimento:', recipeDetails.cooking_time_min, 'minutos');
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
