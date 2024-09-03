import axiosInstance from "@/utils/_axios";

export default class TemplateService {
  public static async updateTemplateStatus(templateId: any, newStatus: boolean) {
   try {
    const response = await axiosInstance.patch(`/templates/${templateId}`, {
      isEnabled: newStatus
    })
    console.log(response.data)
    return response;
   } catch (error) {
    console.log(error)
   }
  }
  private static BASE_PATH = "/templates";

  public static async create(data: any) {
    try {
      const response = await axiosInstance.post(this.BASE_PATH, data);
      return response;
    } catch (error) {
      console.error("Error fetching project:", error);
      throw error;
    }
  }

  public static async getAllTemplatesByOrgId(orgId: string) {
    try {
      const response = await axiosInstance.get(
        `${this.BASE_PATH}/org/${orgId}`,
      );
      console.log(response.data);
      return response;
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  }
}
