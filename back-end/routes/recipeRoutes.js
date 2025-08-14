import express from 'express';
import RecipeController from '../controllers/RecipeController.js';

const router = express.Router();
const recipeController = new RecipeController();

// POST /recipes/generate - Generate recipes for user
router.post('/generate', recipeController.generateRecipe);

export default router;
