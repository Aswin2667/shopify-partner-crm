import axiosInstance from "@/utils/_axios";

export default class ProjectService {
  private static BASE_PATH = "/project";

  public static async create(data: any) {
    try {
      const response = await axiosInstance.post(this.BASE_PATH, data);
      return response.data;
    } catch (error) {
      console.error("Error fetching project:", error);
      throw error;
    }
  }

  public static async getAllProjects(orgId: string) {
    try {
      const response = await axiosInstance.get(`${this.BASE_PATH}/${orgId}/all`);
      return response.data;
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  }
}
