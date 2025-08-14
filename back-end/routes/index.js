import userRoutes from './userRoutes.js';
import formRoutes from './formRoutes.js';
import recipeRoutes from './recipeRoutes.js';
import express from 'express';
import RecipeController from '../controllers/RecipeController.js';

const setupRoutes = (app) => {
    // User routes
    app.use('/users', userRoutes);
    
    // Form routes
    app.use('/forms', formRoutes);
    
    // Recipe routes
    app.use('/recipes', recipeRoutes);
    
    // Backward compatibility for /gerarReceita
    const recipeController = new RecipeController();
    app.post('/gerarReceita', recipeController.generateRecipe);
};

export default setupRoutes;
