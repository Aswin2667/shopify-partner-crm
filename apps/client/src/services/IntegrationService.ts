import axiosInstance from "@/utils/_axios";

export default class IntegrationService {
  private static BASE_PATH = "/integration";

  public static async create(data: any) {
    try {
      const response = await axiosInstance.post(this.BASE_PATH, data);
      return response.data;
    } catch (error) {
      console.error("Error fetching integration:", error);
      throw error;
    }
  }

  public static async getAllIntegrations(orgId: string) {
    try {
      const response = await axiosInstance.get(`${this.BASE_PATH}/${orgId}/all`);
      return response.data;
    } catch (error) {
      console.error("Error fetching integrations:", error);
      throw error;
    }
  }
}
