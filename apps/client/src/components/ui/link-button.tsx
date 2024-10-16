import { IntegrationType } from "@org/integrations";
import React, { useEffect, useState } from "react";
import { HiOutlineExternalLink } from "react-icons/hi";
import { useSelector } from "react-redux";

type Props = {
  children?: React.ReactNode;
  title: string;
  type?: IntegrationType | null;
  onClick?: () => void;
};

// const currentUrl = encodeURIComponent(window.location.href);
const redirectUri = `https://shopcrm-server-5e5331b6be39.herokuapp.com/auth/google/callback`;
// const redirectUri = `https://shopcrm-server-5e5331b6be39.herokuapp.com/integration/connect/auth`;
// console.log(currentUrl);

const LinkButton: React.FC<Props> = ({ title, type, onClick }: Props) => {
  const [currentUrl, setCurrentUrl] = useState("");

  const orgMemberId = useSelector(
    (state: any) => state.organization.currentOrgMember
  )?.id;

  console.log(orgMemberId);
  useEffect(() => {
    setCurrentUrl(encodeURIComponent(window.location.href));
  }, [window.location.href]);
  console.log(currentUrl);

  return (
    <div className="flex">
      {type ? (
        <a
          className="bg-[#2b62f0] text-white text-sm rounded-full ml-auto 
        px-3 py-1 font-semibold hover:bg-[#3062e0] flex items-center gap-2"
          onClick={() => {
            localStorage.setItem("url", currentUrl);
          }}
          href={`https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${import.meta.env.VITE_CLIENT_ID||'132861762148-dhkdcu4kmkv3p3drdr6n1l3m748mbfk1.apps.googleusercontent.com'}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid%20https://mail.google.com/%20https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile&access_type=offline&state=${orgMemberId + "url=" + currentUrl}&orgMemberId=${orgMemberId}&prompt=consent`}
        >
          <span>{title}</span>
          <HiOutlineExternalLink size={16} />
        </a>
      ) : (
        <button
          className="bg-[#2b62f0] text-white text-sm rounded-full ml-auto 
        px-3 py-1 font-semibold hover:bg-[#3062e0] flex items-center gap-2"
          onClick={onClick}
        >
          <span>{title}</span>
          <HiOutlineExternalLink size={16} />
        </button>
      )}
    </div>
  );
};

export default LinkButton;
