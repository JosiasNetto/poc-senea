import FatSecretAPIService from './fatAPIservice.js';

class FoodService {
    constructor() {
        this.fatSecretService = new FatSecretAPIService(
            process.env.FAT_SECRET_CONSUMER_KEY || "7ef452824e4b47cfb0274ac44014a0ca",
            process.env.FAT_SECRET_CONSUMER_SECRET || "dba0feedca144e9b86e7f2c385a6e7d8"
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
