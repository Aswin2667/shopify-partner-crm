import axiosInstance from "@/utils/_axios";

type Lead = {
  id: string;
  shopifyDomain: string;
  shopifyStoreId: string;
  leadSource?: string;
};

class LeadService {
  private static BASE_URL: string = "leads";
  public static async create(data: Lead) {
    try {
      const response = await axiosInstance.post(
        `${this.BASE_URL}/create`,
        data,
      );
      return response;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }

  public static async getByIntegrationId(integrationId:string) {

    try {
      const response = await axiosInstance.get(`/${this.BASE_URL}/${integrationId}`);
      return response;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    } 

  }
  public static async getActivityById(id:string) {
    try {
      const response = await axiosInstance.get(`/lead-activity/${id}`);
      return response;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    } 
  } 
  public static async getLeadById(id:string) {
    try {
      const response = await axiosInstance.get(`/${this.BASE_URL}/get/${id}`);
      return response;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    } 
  } 
}

export default LeadService;
