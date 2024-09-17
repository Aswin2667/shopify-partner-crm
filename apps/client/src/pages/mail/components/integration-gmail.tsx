import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

type Props = {};

const IntegrateGmail = (props: Props) => {
  const navigate = useNavigate();
  const { organizationId } = useParams();

  return (
    <div className="flex flex-1 items-center justify-center py-10">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          Looks Like you don't have any Mail Service Integrated Yet!
        </h3>
        <p className="text-sm text-muted-foreground">
          You can start Mailing through our Integrations
        </p>
        <Button
          onClick={() =>
            navigate(`/${organizationId}/settings/integration/create`)
          }
        >
          Integrate
        </Button>
      </div>
    </div>
  );
};

export default IntegrateGmail;
