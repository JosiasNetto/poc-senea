import mongoose from 'mongoose';
import UserService from './UserService.js';
import FatSecretAPIService from './fatAPIservice.js';

class RecipeService {
    constructor() {
        this.userService = new UserService();
        this.fatSecretService = new FatSecretAPIService(
            process.env.FAT_SECRET_CONSUMER_KEY || "7ef452824e4b47cfb0274ac44014a0ca",
            process.env.FAT_SECRET_CONSUMER_SECRET || "dba0feedca144e9b86e7f2c385a6e7d8"
        );
    }

    async generateRecipesForUser(cpf, preferences) {
        // Buscar usuário pelo CPF
        const user = await this.userService.getUserByCpf(cpf);
        
        if (!user) {
            return null;
        }

        // Gerar receitas baseadas nas preferências usando FatSecret API
        const recipes = await this.fatSecretService.getRecommendedRecipes(preferences);

        // Salvar as receitas no usuário
        const receitasComId = recipes.map(recipe => ({
            _id: new mongoose.Types.ObjectId(),
            recipeId: recipe.recipe_id,
            nome: recipe.recipe_name,
            descricao: recipe.recipe_description,
            dataCriacao: new Date(),
            preferences: preferences
        }));

        await this.userService.updateUser(cpf, { 
            $push: { receita: { $each: receitasComId } } 
        });

        return {
            receitas: receitasComId,
            totalReceitas: recipes.length
        };
    }

    async getRecipeDetails(recipeId) {
        return await this.fatSecretService.getRecipeDetails(recipeId);
    }
}

export default RecipeService;
