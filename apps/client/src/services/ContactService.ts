import axiosInstance from "@/utils/_axios";

class ContactService {
    static BASE_PATH: string = '/contact';

    public static async create(data: any) {
        try {
            const response = await axiosInstance.post(this.BASE_PATH, data);
            return response.data;
        } catch (error) {
            console.error("Error fetching contact:", error);
            throw error;
        }
    }
}

export default ContactService