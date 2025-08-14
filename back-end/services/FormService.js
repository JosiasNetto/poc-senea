import mongoose from 'mongoose';
import UserService from './UserService.js';

class FormService {
    constructor() {
        this.userService = new UserService();
    }

    async createForm(cpf, nome, formData) {
        let targetUser = await this.userService.getUserByCpf(cpf);
        
        // Adicionar ID único ao formulário
        const formWithId = {
            _id: new mongoose.Types.ObjectId(),
            ...formData,
            dataCriacao: new Date()
        };
        
        if (!targetUser) {
            // Criar novo usuário
            targetUser = await this.userService.createUser(cpf, nome, [formWithId], []);
            return {
                isNewUser: true,
                user: {
                    id: targetUser._id,
                    nome: targetUser.nome,
                    cpf: targetUser.cpf,
                    fatSecretUserId: targetUser.fatSecretUserId,
                    forms: targetUser.forms,
                    receita: targetUser.receita
                }
            };
        }

        // Usuário já existe, adicionar formulário
        await this.userService.updateUser(cpf, { $push: { forms: formWithId } });

        const updatedUser = await this.userService.getUserByCpf(cpf);

        return {
            isNewUser: false,
            user: {
                id: updatedUser._id,
                nome: updatedUser.nome,
                cpf: updatedUser.cpf,
                fatSecretUserId: updatedUser.fatSecretUserId,
                forms: updatedUser.forms,
                receita: updatedUser.receita
            }
        };
    }
}

export default FormService;
