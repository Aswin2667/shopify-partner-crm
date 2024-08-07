import { TokenResponse } from '@react-oauth/google';
import axios from 'axios';

class UserService {
   private static URL:string = 'http://localhost:8080/user';
  public static async login(data: Omit<TokenResponse, "error" | "error_description" | "error_uri">) {
    try {
      const response = await axios.post(`${UserService.URL}/login`, data);
      return response;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }
}

export default UserService;