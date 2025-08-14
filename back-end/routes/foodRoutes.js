import express from 'express';
import FoodController from '../controllers/FoodController.js';

const router = express.Router();
const foodController = new FoodController();

// GET /foods/search - Search for foods
router.get('/search', foodController.searchFoods);

export default router;
