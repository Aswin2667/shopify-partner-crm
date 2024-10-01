import axiosInstance from "@/utils/_axios";

class OrgMemberService {
  static BASE_PATH: string = "/org-member";

  public static async generateSignature(data: {
    orgMemberId: string | undefined;
    signature: string;
  }) {
    try {
      const { orgMemberId, signature } = data;
      const response = await axiosInstance.patch(
        `${this.BASE_PATH}/${orgMemberId}/signature`,
        {
          signature,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error generating signature:", error);
      throw error;
    }
  }
}

export default OrgMemberService;
