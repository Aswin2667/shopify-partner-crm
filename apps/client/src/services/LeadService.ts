import axiosInstance from "@/utils/_axios";

type Lead = {
  id: string;
  shopifyDomain: string;
  shopifyStoreId: string;
  leadSource?: string;
};

class LeadService {
  private static BASE_URL: string = "leads";
  public static async getTotalAmountByLeadId(leadId: string) {
    try {
      const response = await axiosInstance.get(
        `${this.BASE_URL}/total-amount/${leadId}`
      );
      return response;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }
  public static async create(data: Lead) {
    try {
      const response = await axiosInstance.post(
        `${this.BASE_URL}/create`,
        data
      );
      return response;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }

  public static async getLeadsByOrganizationId(
    organizationId: string,
    shopifyDomain?: string,
    domainFilterOption?: { value: string },
    selectedStatuses: { value: string }[] = [],
    _createdAt?: { startDate: string; endDate: string },
    leadStatusFilterOption?: string,
    selectedDateComparison?: string,
    selectedDateOption?: string,
    customDate?: Date | null
  ) {
    try {
      const params: any = {
        shopifyDomain: shopifyDomain || undefined,
        domainFilterOption: domainFilterOption ? domainFilterOption : undefined, // Convert object to JSON
        leadStatusFilterOption: leadStatusFilterOption
          ? leadStatusFilterOption
          : undefined,
        selectedStatuses: selectedStatuses.length
          ? JSON.stringify(selectedStatuses)
          : undefined, // Convert array to JSON
        createdAt: customDate || undefined,
        DateComparison: selectedDateComparison,
        DateOption: selectedDateOption,
      };

      // Make the Axios request
      const response = await axiosInstance.get(
        `${this.BASE_URL}/${organizationId}`,
        {
          params,
        }
      );

      return response;
    } catch (error) {
      console.error("Error fetching leads:", error);
      throw error;
    }
  }
  public static async getActivityById(id: string) {
    try {
      const response = await axiosInstance.get(`/lead-activity/${id}`);
      return response;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }
  public static async getLeadById(id: string) {
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
