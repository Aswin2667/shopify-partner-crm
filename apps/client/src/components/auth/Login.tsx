import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";
import {  GoogleLogin, TokenResponse, useGoogleLogin } from "@react-oauth/google";
import userService from "@/services/UserService";

export default function Login() {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse : Omit<TokenResponse, "error" | "error_description" | "error_uri">) => {

      handleLogin(tokenResponse);
    },
  });
  const handleLogin = async (tokenResponse:Omit<TokenResponse, "error" | "error_description" | "error_uri"> ) => {
    try {
      const response = await userService.login(tokenResponse);
      console.log("Login response:", response.data);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

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
            <Button
              onClick={() => login()}
              variant="outline"
              className="w-full"
            >
              <img
                src="https://img.icons8.com/color/48/000000/google-logo.png"
                className="h-7 w-7 mr-5"
                alt=""
              />{" "}
              Login with Google
            </Button>
            <GoogleLogin
  onSuccess={credentialResponse => {
    console.log(credentialResponse);
  }}
  onError={() => {
    console.log('Login Failed');
  }}
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