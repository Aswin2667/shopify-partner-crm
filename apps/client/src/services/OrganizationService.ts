import { organizationCreate } from "@/lib/types";
import axiosInstance from "@/utils/_axios";

export default class OrganizationService {
  private static BASE_PATH = "/organization";
  static async invite(data: any) {
    try {
      const response = await axiosInstance.post(`invitation/send`, data);
      return response;
    } catch (error) {
      console.error("Error fetching organizations:", error);
      throw error;
    }
  }

  static async getOrganizationsByUserId(id: any) {
    try {
      const response = await axiosInstance.get(`${this.BASE_PATH}/${id}`);
      return response;
    } catch (error) {
      console.error("Error fetching organizations:", error);
      throw error;
    }
  }

  public static async create(data: organizationCreate) {
    try {
      console.log(data);
      const response = await axiosInstance.post(this.BASE_PATH, data);
      return response.data;
    } catch (error) {
      console.error("Error fetching organization:", error);
      throw error;
    }
  }
  public static async getInvitations(organizationId: string | undefined) {
    try {
      const response = await axiosInstance.get(
        "/invitation/all?orgId=" + organizationId
      );
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  public static async getTotalRevenueByOrgId(
    organizationId: string | undefined
  ) {
    try {
      console.log("hello");
      const response = await axiosInstance.get(
        "/leads/total-revenue/" + organizationId
      );
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}
