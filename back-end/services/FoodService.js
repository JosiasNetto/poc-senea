import FatSecretAPIService from './fatAPIservice.js';

class FoodService {
    constructor() {
        this.fatSecretService = new FatSecretAPIService(
            process.env.FAT_SECRET_CONSUMER_KEY,
            process.env.FAT_SECRET_CONSUMER_SECRET
        );
    }

    async searchFoods(searchExpression, maxResults = 10, pageNumber = 0) {
        try {
            const response = await this.fatSecretService.searchFoods(searchExpression, maxResults, pageNumber);
            
            // Retornar apenas o primeiro elemento de foods.food
            if (response && response.foods && response.foods.food && response.foods.food.length > 0) {
                return {
                    ...response,
                    foods: {
                        ...response.foods,
                        food: response.foods.food[0] // Retorna apenas o primeiro elemento
                    }
                };
            }
            
            return response;
        } catch (error) {
            throw new Error(`Erro no serviço de busca de alimentos: ${error.message}`);
        }
    }
}

export default FoodService;
