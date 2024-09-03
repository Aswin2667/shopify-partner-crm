import axiosInstance from "@/utils/_axios";

export default class IntegrationService {
  private static BASE_PATH = "/integration";

  public static async connect(data: any) {
    try {
      const response = await axiosInstance.post(
        `${this.BASE_PATH}/connect`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching integration:", error);
      throw error;
    }
  }

  public static async create(data: any) {
    try {
      const response = await axiosInstance.post(this.BASE_PATH, data);
      return response.data;
    } catch (error) {
      console.error("Error fetching integration:", error);
      throw error;
    }
  }

  public static async getPresentIntegrationsList() {
    try {
      const response = await axiosInstance.get(`${this.BASE_PATH}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching integrations:", error);
      throw error;
    }
  }

  public static async getAllIntegrationsByOrgId(orgId: string) {
    try {
      const response = await axiosInstance.get(
        `${this.BASE_PATH}/getAll/${orgId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching integrations:", error);
      throw error;
    }
  }

  public static async getGmailIntegration(orgId: string) {
    try {
      const response = await axiosInstance.get(
        `${this.BASE_PATH}/${orgId}/gmail`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching gmail integration:", error);
      throw error;
    }
  }
}
