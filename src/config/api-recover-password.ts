import axios from 'axios';

const recoverApi = axios.create({
  baseURL: 'https://api.emailjs.com/api/v1.0/email'
});

export default recoverApi;