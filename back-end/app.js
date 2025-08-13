import express from 'express';
import connectDB from "./config/dbConfig.js"
import User from "./models/UsersModel.js"

connectDB()

const app = express();

app.use(express.json());

app.post('/forms', async (req, res) => {
    const { cpf, nome } = req.body;
    const formData = req.body.forms;

    try {
        let targetUser = await User.findOne({cpf});
        
        if (!targetUser) {
            targetUser = await User.create({
                cpf, 
                nome,
                forms: [formData],
                receita: []
            });
            return res.status(201).json({
                message: 'Usuário criado e formulário adicionado com sucesso',
                user: targetUser
            });
        }

        await User.updateOne(
            { cpf }, 
            { $push: { forms: formData } }
        );

        const updatedUser = await User.findOne({cpf});

        //Gerar a receita pelo fatSecret, sava-la no mongo e retornar para o user
        
        res.status(200).json({
            message: 'Formulário adicionado com sucesso',
            user: updatedUser
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
        res.status(200).json({users});
    }catch(error){
        console.log("Erro ao listar Usuarios", error.message)
        res.status(500).json({
            error: 'Erro interno do servidor',
            details: error.message
        })
    }
})

export default app;