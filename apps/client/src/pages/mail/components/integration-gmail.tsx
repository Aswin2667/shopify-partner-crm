import { Button } from "@/components/ui/button";
import React from "react";

type Props = {};

const IntegrateGmail = (props: Props) => {
  const currentUrl = encodeURIComponent(window.location.href);
  const redirectUri = `http://localhost:8080/auth/google/callback`;

  console.log(encodeURIComponent(window.location.href));
  return (
    <div className="flex flex-1 items-center justify-center py-10">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          Looks Like you don't have any Gmail account Integrated Yet!
        </h3>
        <p className="text-sm text-muted-foreground">
          You can start by Integrating your Gmail account
        </p>
        <a
          href={`https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${import.meta.env.VITE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid%20https://mail.google.com/%20https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile&access_type=offline&state=${currentUrl}`}
          // &prompt=consent
          className="bg-[#2b62f0] text-white text-sm rounded-full 
        px-3 py-1 font-semibold hover:bg-[#3062e0] flex items-center gap-2"
        >
          Sign in with Google
        </a>
      </div>
    </div>
  );
};

export default IntegrateGmail;
