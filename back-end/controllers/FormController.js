import FormService from '../services/FormService.js';

class FormController {
    constructor() {
        this.formService = new FormService();
    }

    // POST /forms
    createForm = async (req, res) => {
        try {
            const { cpf, nome } = req.body;
            const formData = req.body.forms;

            const result = await this.formService.createForm(cpf, nome, formData);

            if (result.isNewUser) {
                return res.status(201).json({
                    message: 'Usuário criado e formulário adicionado com sucesso',
                    user: result.user
                });
            }

            res.status(200).json({
                message: 'Formulário adicionado com sucesso',
                user: result.user
            });

        } catch (error) {
            console.log("Erro ao cadastrar forms:", error.message);
            res.status(500).json({
                error: 'Erro interno do servidor',
                details: error.message
            });
        }
    }
}

export default FormController;
