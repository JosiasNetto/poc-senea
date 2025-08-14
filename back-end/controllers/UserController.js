import UserService from '../services/UserService.js';

class UserController {
    constructor() {
        this.userService = new UserService();
    }

    // GET /users
    getAllUsers = async (req, res) => {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json({ users });
        } catch (error) {
            console.log("Erro ao listar usuarios", error.message);
            res.status(500).json({
                error: 'Erro interno do servidor',
                details: error.message
            });
        }
    }

    // GET /users/:id
    getUserById = async (req, res) => {
        try {
            const { id } = req.params;
            const user = await this.userService.getUserById(id);
            
            if (!user) {
                return res.status(404).json({
                    error: 'Usuário não encontrado'
                });
            }

            res.status(200).json({ user });
        } catch (error) {
            console.log("Erro ao buscar usuário:", error.message);
            res.status(500).json({
                error: 'Erro interno do servidor',
                details: error.message
            });
        }
    }

    // GET /users/:id/forms-receitas
    getUserFormsAndRecipes = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await this.userService.getUserFormsAndRecipes(id);
            
            if (!result) {
                return res.status(404).json({
                    error: 'Usuário não encontrado'
                });
            }

            res.status(200).json(result);
        } catch (error) {
            console.log("Erro ao exibir as receitas do usuário:", error.message);
            res.status(500).json({
                error: 'Erro interno do servidor',
                details: error.message
            });
        }
    }

    // GET /users/:userId/receita/:id
    getUserRecipeById = async (req, res) => {
        try {
            const { userId, id } = req.params;
            const receita = await this.userService.getUserRecipeById(userId, id);
            
            if (!receita) {
                return res.status(404).json({
                    error: 'Receita não encontrada'
                });
            }

            res.status(200).json({
                message: 'Receita encontrada com sucesso',
                receita
            });
        } catch (error) {
            console.log("Erro ao buscar receita específica:", error.message);
            res.status(500).json({
                error: 'Erro interno do servidor',
                details: error.message
            });
        }
    }
}

export default UserController;
