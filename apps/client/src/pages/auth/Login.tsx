import { Button } from "@/components/ui/button";
import { Separator } from "../../components/ui/separator";
import { GoogleLogin } from "@react-oauth/google";
import userService from "@/services/UserService";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

export default function Login() {
  const navigate = useNavigate();

  const { mutate: handleLogin } = useMutation({
    mutationFn: async (tokenResponse: any): Promise<any> =>
      await userService.login(tokenResponse),
    onSuccess: (response) => {
      if (response.data?.status) {
        sessionStorage.setItem("session", JSON.stringify(response.data.data));
        navigate("../");
      }
    },
    onError: (error: any) => {
      console.error("Login failed:", error?.response.data);
    },
  });

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center ">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <Button type="submit" className="w-full">
              Continue with Email
            </Button>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                handleLogin(credentialResponse);
              }}
              auto_select={true}
            />
          </div>
        </div>
        <Separator orientation="vertical" />
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="https://img.freepik.com/premium-vector/register-access-login-password-internet-online-website-concept-flat-illustration_385073-108.jpg?w=900"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
