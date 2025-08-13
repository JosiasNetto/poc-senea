import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome é obrigatório.'],
  },
  cpf: {
    type: String,
    required: [true, 'O CPF é obrigatório.']
  },
  forms: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  receita: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  }
});

const User = mongoose.model('User', userSchema);

export default User;