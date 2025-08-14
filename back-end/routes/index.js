import userRoutes from './userRoutes.js';
import formRoutes from './formRoutes.js';
import recipeRoutes from './recipeRoutes.js';
import foodRoutes from './foodRoutes.js';
import express from 'express';
import RecipeController from '../controllers/RecipeController.js';

const setupRoutes = (app) => {
    // Health check endpoint
    app.get('/health', (req, res) => {
        res.json({ 
            status: 'OK', 
            message: 'Server is running',
            timestamp: new Date().toISOString(),
            cors: 'enabled'
        });
    });
    
    // Root endpoint
    app.get('/', (req, res) => {
        res.json({ 
            message: 'API SENEA - Backend is running',
            endpoints: {
                health: '/health',
                users: '/users',
                forms: '/forms',
                recipes: '/recipes',
                foods: '/foods',
                gerarReceita: '/gerarReceita'
            }
        });
    });
    
    // User routes
    app.use('/users', userRoutes);
    
    // Form routes
    app.use('/forms', formRoutes);
    
    // Recipe routes
    app.use('/recipes', recipeRoutes);
    
    // Food routes
    app.use('/foods', foodRoutes);
    
    // Backward compatibility for /gerarReceita
    const recipeController = new RecipeController();
    app.post('/gerarReceita', recipeController.generateRecipe);
    
    // 404 handler for unmatched routes
    app.use('*', (req, res) => {
        res.status(404).json({
            error: 'Route not found',
            method: req.method,
            path: req.originalUrl,
            message: 'The requested endpoint does not exist'
        });
    });
};

export default setupRoutes;
