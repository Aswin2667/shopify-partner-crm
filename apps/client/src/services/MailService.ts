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
      const response = await axiosInstance.get(`${this.BASE_PATH}/${orgId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching mails:", error);
      throw error;
    }
  }
}
