import axios from 'axios';

const Urls = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/local/register`;

const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(Urls, {
     
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.log("error", error);
  }
};

export default loginUser;
