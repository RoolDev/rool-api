import axios from 'axios';

const validateRecaptchaToken = async (token: string) => {
  try {
    const { RE_SECRET } = process.env;

    await axios.get(
      `https://www.google.com/recaptcha/api/siteverify?secret=${RE_SECRET}&response=${token}`,
    );

    return true;
  } catch(err){
    throw(err);
  }
}

export default validateRecaptchaToken;