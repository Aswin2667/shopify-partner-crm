import { TokenResponse } from "@react-oauth/google";
import axios from "../utils/_axios";

class UserService {
  private static BASE_URL: string = "https://shopcrm-server-5e5331b6be39.herokuapp.com/";
  public static async login(
    data: Omit<TokenResponse, "error" | "error_description" | "error_uri">,
  ) {
    try {
      const response = await axios.post(`${this.BASE_URL}user/login`, data);
      return response;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }
}

export default UserService;
