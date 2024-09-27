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

  public static async performAction(type: string, action: string, params: any) {
    const config = { type, action, params };
    try {
      console.log(type);
      const response = await axiosInstance.post(
        `${this.BASE_PATH}/action`,
        config
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

  public static async delete(id: any) {
    try {
      const response = await axiosInstance.delete(`${this.BASE_PATH}/${id}`);
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

  public static async getAllIntegrationsByOrgId(
    orgId: string,
    orgMemberId?: string
  ) {
    try {
      const response = await axiosInstance.get(
        // `${this.BASE_PATH}/getAll/${orgId}`
        `${this.BASE_PATH}/getAll/${orgId}${orgMemberId ? `?orgMemberId=${orgMemberId}` : ""}`
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
