import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { integrationAction } from "@/redux/integrationSlice";
import DateHelper from "@/utils/DateHelper";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const IntegrationCard = ({ integration }: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentOrganization } = useSelector(
    (state: any) => state.organization,
  );

  const clickHandler = () => {
    dispatch(integrationAction.setCurrentIntegration(integration));
    navigate(`/${currentOrganization.id}/${integration.id}`);
  };
  return (
    <Card onClick={clickHandler} className="hover:cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">{integration.name}</CardTitle>
        {/* <img
          src={organization.organization.logo}
          className="h-10 w-10 rounded-lg "
          alt=""
        /> */}
      </CardHeader>
      <CardContent>
        <div className=" text-sm font-medium">{integration.description}</div>
        <p className="text-xs text-muted-foreground">
          {DateHelper.formatTimestamp(integration.createdAt)}
        </p>
      </CardContent>
    </Card>
  );
};

export default IntegrationCard;
