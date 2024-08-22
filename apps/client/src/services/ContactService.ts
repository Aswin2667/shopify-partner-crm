import axiosInstance from "@/utils/_axios";

class ContactService {
    static BASE_PATH: string = '/contacts';

    public static async getByIntegrationId(id: any) {
        try {
            const response = await axiosInstance.get(this.BASE_PATH+'/get/'+id);
            return response.data;
        } catch (error) {
            console.error("Error fetching contacts:", error);
            throw error;
        }
    }

    public static async create(data: any) {
        try {
            const response = await axiosInstance.post(this.BASE_PATH, data);
            return response.data;
        } catch (error) {
            console.error("Error fetching contact:", error);
            throw error;
        }
    }
    public static async getByLeadId(leadId:string) {
        try {
            const response = await axiosInstance.get(this.BASE_PATH+'/'+leadId);
            return response.data;
        } catch (error) {
            console.error("Error fetching contacts:", error);
            throw error;
        }
    }
}

export default ContactService