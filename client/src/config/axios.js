// client/src/config/axios.js
import axios from 'axios';

// Configurar Axios para que SIEMPRE envíe cookies
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:3001';

export default axios;