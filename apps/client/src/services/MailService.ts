import axiosInstance from "@/utils/_axios";

export default class MailService {
  private static BASE_PATH = "/mail";

  public static async sendMail(data: any) {
    try {
      const response = await axiosInstance.post(`${this.BASE_PATH}/send`, data);
      return response.data;
    } catch (error) {
      console.error("Error fetching mail:", error);
      throw error;
    }
  }

  public static async getMailsByOrgId(orgId: string) {
    try {
      const response = await axiosInstance.get(
        `${this.BASE_PATH}/org/${orgId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching mails:", error);
      throw error;
    }
  }

  public static async getMailsByLeadId(leadId: string) {
    try {
      const response = await axiosInstance.get(
        `${this.BASE_PATH}/lead/${leadId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching mails:", error);
      throw error;
    }
  }

  // From Email(Send As)
  public static async getFromEmailsByOrgId(orgId: string) {
    try {
      const response = await axiosInstance.get(
        `${this.BASE_PATH}/org/${orgId}/fromEmails`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching mails:", error);
      throw error;
    }
  }

  public static async createFromEmail(data: any) {
    try {
      const response = await axiosInstance.post(
        `${this.BASE_PATH}/createFromEmail`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching integration:", error);
      throw error;
    }
  }

  public static async updateFromEmail(data: any) {
    try {
      const response = await axiosInstance.patch(
        `${this.BASE_PATH}/updateFromEmail/${data.id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching integration:", error);
      throw error;
    }
  }

  public static async deleteFromEmail(id: any) {
    try {
      const response = await axiosInstance.delete(
        `${this.BASE_PATH}/deleteFromEmail/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching integration:", error);
      throw error;
    }
  }
}
