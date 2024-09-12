import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

type Props = {};

const IntegrateGmail = (props: Props) => {
  const navigate = useNavigate();
  const { organizationId } = useParams();

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
        <Button
          onClick={() =>
            navigate(`/${organizationId}/settings/integration/create/gmail`)
          }
        >
          Connect
        </Button>
      </div>
    </div>
  );
};

export default IntegrateGmail;
