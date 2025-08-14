import express from 'express';
import mongoose from 'mongoose';
import connectDB from "./config/dbConfig.js"
import User from "./models/UsersModel.js"
import { buscarAlimento, buscarAlimentoPorId } from './services/fatAPIservice.js';

connectDB()

const app = express();

app.use(express.json());

app.post('/gerarReceita', async(req, res) =>{
    
})

app.post('/forms', async (req, res) => {
    const { cpf, nome } = req.body;
    const formData = req.body.forms;

    try {
        let targetUser = await User.findOne({cpf});
        
        // Adicionar ID único ao formulário
        const formWithId = {
            _id: new mongoose.Types.ObjectId(),
            ...formData,
            dataCriacao: new Date()
        };
        
        if (!targetUser) {
            targetUser = await User.create({
                cpf, 
                nome,
                forms: [formWithId],
                receita: []
            });
            return res.status(201).json({
                message: 'Usuário criado e formulário adicionado com sucesso',
                user: {
                    id: targetUser._id,
                    nome: targetUser.nome,
                    cpf: targetUser.cpf,
                    forms: targetUser.forms,
                    receita: targetUser.receita
                }
            });
        }

        await User.updateOne(
            { cpf }, 
            { $push: { forms: formWithId } }
        );

        const updatedUser = await User.findOne({cpf});

        //Gerar a receita pelo fatSecret, sava-la no mongo e retornar para o user
        
        res.status(200).json({
            message: 'Formulário adicionado com sucesso',
            user: {
                id: updatedUser._id,
                nome: updatedUser.nome,
                cpf: updatedUser.cpf,
                forms: updatedUser.forms,
                receita: updatedUser.receita
            }
        });

    } catch (error) {
        console.log("Erro ao cadastrar forms:", error.message);
        res.status(500).json({
            error: 'Erro interno do servidor',
            details: error.message
        });
    }
})

app.get("/users", async (req, res) => {
    try{
        const users = await User.find({});
        const usersWithId = users.map(user => ({
            id: user._id,
            nome: user.nome,
            cpf: user.cpf,
            forms: user.forms,
            receita: user.receita
        }));
        res.status(200).json({users: usersWithId});
    }catch(error){
        console.log("Erro ao listar usuarios", error.message)
        res.status(500).json({
            error: 'Erro interno do servidor',
            details: error.message
        })
    }
})

app.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({
                error: 'Usuário não encontrado'
            });
        }

        res.status(200).json({
            user: {
                id: user._id,
                nome: user.nome,
                cpf: user.cpf,
                forms: user.forms,
                receita: user.receita
            }
        });
    } catch(error) {
        console.log("Erro ao buscar usuário:", error.message)
        res.status(500).json({
            error: 'Erro interno do servidor',
            details: error.message
        })
    }
})

// app.get('/food', async (req, res) => {

// })

// app.get('/food/:foodId', async(req, res) => {

// })

app.get('/users/:id/forms-receitas', async (req, res) => {
    const { id } = req.params; 
    try {
        const user = await User.findById(id); 
        if (!user) {
            return res.status(404).json({
                error: 'Usuário não encontrado'
            });
        }
        
        const forms = user.forms;
        const receitas = user.receitas;
        
        res.status(200).json({
            forms: forms,
            receitas: receitas
        });
        
    }catch(error) {
        console.log("Erro ao exibir as receitas do usuário:", error.message);
        res.status(500).json({
            error: 'Erro interno do servidor',
            details: error.message
        });
    }
})

app.get('/users/:userId/receita/:id', async (req, res) => {
    const { userId, id } = req.params;
    
    try {
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                error: 'Usuário não encontrado'
            });
        }
        
        const receita = user.receita.find({ id });
        
        if (!receita) {
            return res.status(404).json({
                error: 'Receita não encontrada'
            });
        }
        
        res.status(200).json({
            message: 'Receita encontrada com sucesso',
            receita: receita
        });
        
    } catch(error) {
        console.log("Erro ao buscar receita específica:", error.message);
        res.status(500).json({
            error: 'Erro interno do servidor',
            details: error.message
        });
    }
})

export default app;