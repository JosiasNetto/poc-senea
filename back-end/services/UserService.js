import User from '../models/UsersModel.js';
import axios from 'axios';
import crypto from 'crypto';

class UserService {
    async getAllUsers() {
        const users = await User.find({});
        return users.map(user => ({
            id: user._id,
            nome: user.nome,
            cpf: user.cpf,
            fatSecretUserId: user.fatSecretUserId,
            forms: user.forms,
            receita: user.receita
        }));
    }

    async getUserById(id) {
        const user = await User.findById(id);
        
        if (!user) {
            return null;
        }

        return {
            id: user._id,
            nome: user.nome,
            cpf: user.cpf,
            fatSecretUserId: user.fatSecretUserId,
            forms: user.forms,
            receita: user.receita
        };
    }

    async getUserByCpf(cpf) {
        return await User.findOne({ cpf });
    }

    async getUserFormsAndRecipes(id) {
        const user = await User.findById(id);
        
        if (!user) {
            return null;
        }

        return {
            forms: user.forms,
            receitas: user.receita
        };
    }

    async getUserRecipeById(userId, recipeId) {
        const user = await User.findById(userId);
        
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const receita = user.receita.find(r => r._id.toString() === recipeId);
        
        if (!receita) {
            return null;
        }

        return receita;
    }

    async createUser(cpf, nome, forms = [], receitas = []) {
        // Generate a random user_id
        const user_id = crypto.randomBytes(16).toString('hex');
        
        try {
            // Make HTTP POST request to FatSecret platform
            const fatSecretResponse = await this.createFatSecretProfile(user_id);
            console.log('FatSecret profile created:', fatSecretResponse);
            
            // Create user in our database with the generated user_id
            const newUser = await User.create({
                cpf,
                nome,
                forms,
                receita: receitas,
                fatSecretUserId: user_id // Store the FatSecret user ID
            });
            
            return newUser;
        } catch (error) {
            console.error('Error creating FatSecret profile:', error.message);
            // Still create the user in our database even if FatSecret fails
            const newUser = await User.create({
                cpf,
                nome,
                forms,
                receita: receitas,
                fatSecretUserId: user_id
            });
            
            return newUser;
        }
    }

    async createFatSecretProfile(user_id) {
        const url = 'https://platform.fatsecret.com/rest/profile/v1';
        
        // Get FatSecret credentials from environment or use defaults
        const consumerKey = process.env.FAT_SECRET_CONSUMER_KEY || "7ef452824e4b47cfb0274ac44014a0ca";
        const consumerSecret = process.env.FAT_SECRET_CONSUMER_SECRET || "dba0feedca144e9b86e7f2c385a6e7d8";
        
        const params = {
            method: 'profile.create',
            user_id: user_id,
            format: 'json',
            oauth_consumer_key: consumerKey,
            oauth_nonce: crypto.randomBytes(16).toString('hex'),
            oauth_signature_method: 'HMAC-SHA1',
            oauth_timestamp: Math.floor(Date.now() / 1000),
            oauth_version: '1.0'
        };

        // Generate OAuth signature
        params.oauth_signature = this.generateFatSecretSignature('POST', url, params, consumerSecret);

        try {
            const response = await axios.post(url, null, { params });
            const { auth_token, auth_secret } = response.data || {};

            if (auth_token && auth_secret) {
                // Salva dinamicamente no processo (não persiste no .env, apenas em runtime)
                process.env.FAT_SECRET_CONSUMER_KEY = auth_token;
                process.env.FAT_SECRET_CONSUMER_SECRET = auth_secret;
            }

            // Não retorna response.data conforme solicitado
            return { success: true };
        } catch (error) {
            throw new Error(`Failed to create FatSecret profile: ${error.message}`);
        }
    }

    generateFatSecretSignature(method, url, params, consumerSecret) {
        const sortedParams = Object.keys(params)
            .sort()
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');

        const baseString = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
        const signingKey = `${encodeURIComponent(consumerSecret)}&`;
        
        return crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');
    }

    async updateUser(cpf, updateData) {
        return await User.updateOne({ cpf }, updateData);
    }
}

export default UserService;
