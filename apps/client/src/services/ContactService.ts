import axiosInstance from "@/utils/_axios";
import axios from "axios";

class ContactService {
  public static async getByOrganizationId(organizationId: string | undefined) {
    try {
      const response = await axiosInstance.get(
        this.BASE_PATH + "/get/" + organizationId
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }
  }
  static BASE_PATH: string = "/contacts";

  // TODO: Remove currentIntegration Method

  public static async create(data: any) {
    try {
      const response = await axiosInstance.post(this.BASE_PATH, data);
      return response.data;
    } catch (error) {
      console.error("Error fetching contact:", error);
      throw error;
    }
  }
  public static async getByLeadId(leadId: string) {
    try {
      const response = await axiosInstance.get(this.BASE_PATH + "/" + leadId);
      return response.data;
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }
  }

  public static async unSubscribeContact(contactId: any) {
    try {
      // const response = await axiosInstance.get(
      //   `${this.BASE_PATH}/${contactId}/unsubscribe`
      // );

      const response = await axios.get(
        `https://crmserver.ngrok.dev/contacts/${contactId}/unsubscribe`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching contact:", error);
      throw error;
    }
  }
}

export default ContactService;
