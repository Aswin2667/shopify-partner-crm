import axiosInstance from "@/utils/_axios";

class UnsubscribeLinkService {
  static BASE_PATH: string = "/unsubscribe-link";

  public static async getByOrgId(id: string) {
    try {
      const response = await axiosInstance.get(`${this.BASE_PATH}/${id}`);
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  public static async create(data: any) {
    try {
      const response = await axiosInstance.post(this.BASE_PATH, data);
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

export default UnsubscribeLinkService;
