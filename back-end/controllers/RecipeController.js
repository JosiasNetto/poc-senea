import RecipeService from '../services/RecipeService.js';

class RecipeController {
    constructor() {
        this.recipeService = new RecipeService();
    }

    // POST /gerarReceita
    generateRecipe = async (req, res) => {
        try {
            const { cpf, preferences } = req.body;

            const result = await this.recipeService.generateRecipesForUser(cpf, preferences);

            if (!result) {
                return res.status(404).json({
                    error: 'Usuário não encontrado'
                });
            }

            res.status(200).json({
                message: 'Receitas geradas com sucesso',
                receitas: result.receitas,
                totalReceitas: result.totalReceitas
            });

        } catch (error) {
            console.error('Erro ao gerar receitas:', error.message);
            res.status(500).json({
                error: 'Erro interno do servidor',
                details: error.message
            });
        }
    }
}

export default RecipeController;
