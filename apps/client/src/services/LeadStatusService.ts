import axiosInstance from "@/utils/_axios";

 
export default class LeadStatusService {
    static async deleteStatus(id: any) {
        try {
            const response = await axiosInstance.delete(`${this.BASE_PATH}/${id}`);
            return response;
        } catch (error) {
            console.error('Error deleting status:', error);
            throw new Error('Failed to delete status');
        }
    }
    static async updateStatus(id: any, updatedStatus: any) {
        try {
            const response = await axiosInstance.patch(`${this.BASE_PATH}/${id}`, updatedStatus);
            return response;
        } catch (error) {
            console.error('Error updating status: ', error);
            throw new Error('Failed to  update status');
        }
    }
    private static readonly BASE_PATH = "/lead-status";
    public static async getAllByOrgId(orgId: string) {
      try {
        const response = await axiosInstance.get(`${this.BASE_PATH}/${orgId}`);
        return response
      } catch (error) {
        
      }
    }

    public static async create(data: any) {
        try {
            const response = await axiosInstance.post(`${this.BASE_PATH}`, data);
            return response;
        } catch (error) {
            console.error('Error creating lead:', error);
            throw new Error('Failed to create lead');
        }
    }

    public static async getAll() {
        try {
            const response = await axiosInstance.get(`${this.BASE_PATH}`);
            return response;
        } catch (error) {
            console.error('Error fetching leads:', error);
            throw new Error('Failed to fetch leads');
        }
    }

    public static async getById(id: string) {
        try {
            const response = await axiosInstance.get(`${this.BASE_PATH}/${id}`);
            return response;
        } catch (error) {
            console.error('Error fetching lead by ID:', error);
            throw new Error('Failed to fetch lead');
        }
    }
}
