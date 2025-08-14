import FoodService from '../services/FoodService.js';

class FoodController {
    constructor() {
        this.foodService = new FoodService();
    }

    // GET /foods/search
    searchFoods = async (req, res) => {
        try {
            const { 
                search_expression, 
                max_results = 10, 
                page_number = 0 
            } = req.query;

            // Validar parâmetros obrigatórios
            if (!search_expression) {
                return res.status(400).json({
                    error: 'Parâmetro search_expression é obrigatório',
                    message: 'Por favor, forneça um termo de busca'
                });
            }

            // Validar tipos de dados
            const maxResults = parseInt(max_results);
            const pageNumber = parseInt(page_number);

            if (isNaN(maxResults) || maxResults < 1 || maxResults > 50) {
                return res.status(400).json({
                    error: 'Parâmetro max_results deve ser um número entre 1 e 50'
                });
            }

            if (isNaN(pageNumber) || pageNumber < 0) {
                return res.status(400).json({
                    error: 'Parâmetro page_number deve ser um número maior ou igual a 0'
                });
            }

            const result = await this.foodService.searchFoods(
                search_expression, 
                maxResults, 
                pageNumber
            );

            res.status(200).json({
                success: true,
                data: result,
                query: {
                    search_expression,
                    max_results: maxResults,
                    page_number: pageNumber
                }
            });

        } catch (error) {
            console.error('Erro ao buscar alimentos:', error.message);
            res.status(500).json({
                error: 'Erro interno do servidor',
                message: 'Não foi possível buscar os alimentos',
                details: error.message
            });
        }
    }
}

export default FoodController;
