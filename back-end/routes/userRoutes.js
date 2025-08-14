import express from 'express';
import UserController from '../controllers/UserController.js';

const router = express.Router();
const userController = new UserController();

// GET /users - Get all users
router.get('/', userController.getAllUsers);

// GET /users/:id - Get user by ID
router.get('/:id', userController.getUserById);

// GET /users/:id/forms-receitas - Get user forms and recipes
router.get('/:id/forms-receitas', userController.getUserFormsAndRecipes);

// GET /users/:userId/receita/:id - Get specific recipe for user
router.get('/:userId/receita/:id', userController.getUserRecipeById);

export default router;
