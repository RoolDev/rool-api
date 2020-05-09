import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/camelcase
const recover_email_api = axios.create({
  baseURL: 'https://api.emailjs.com/api/v1.0/email'
});

// eslint-disable-next-line @typescript-eslint/camelcase
export default recover_email_api;