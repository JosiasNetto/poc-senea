import axios from 'axios';

const appId = '7ef452824e4b47cfb0274ac44014a0ca';
const appKey = 'c53a1e48df6842e7a9f5c63436cb5aec';

export const buscarAlimento = async (query) => {
  try {
    const response = await axios.get(`https://platform.fatsecret.com/rest/server.api?` +
      `method=food.search&` + 
      `search_expression=${query}&` +
      `format=json&` +
      `oauth_consumer_key=${appId}&` +
      `oauth_signature_method=HMAC-SHA1&` +
      `oauth_timestamp=${Math.floor(Date.now() / 1000)}&` +
      `oauth_nonce=${Math.floor(Math.random() * 1000000000)}`
    );
    
    console.log('Resposta da API:', response.data);
    return response.data;
  } catch (error) {
    console.log('Erro na API:', error.response?.data || error.message);
    throw error;
  }
};

export const buscarAlimentoPorId = async (foodId) => {
  try {
    const response = await axios.get(`https://platform.fatsecret.com/rest/server.api?` +
      `method=food.get&` + 
      `food_id=${foodId}&` +
      `format=json&` +
      `oauth_consumer_key=${appId}&` +
      `oauth_signature_method=HMAC-SHA1&` +
      `oauth_timestamp=${Math.floor(Date.now() / 1000)}&` +
      `oauth_nonce=${Math.floor(Math.random() * 1000000000)}`
    );
    
    console.log('Detalhes do alimento:', response.data);
    return response.data;
  } catch (error) {
    console.log('Erro ao buscar alimento por ID:', error.response?.data || error.message);
    throw error;
  }
};
