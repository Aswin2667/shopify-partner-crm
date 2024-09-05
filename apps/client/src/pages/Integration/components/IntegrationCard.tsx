import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { integrationAction } from "@/redux/integrationSlice";
import DateHelper from "@/utils/DateHelper";
import { Settings } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

type Props = {
  type: string;
};

const IntegrationCard = ({ type }: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const integration = useSelector(
    (state: any) => state.integration.presentIntegrations
  ).find((int: any) => type === int.type);

  console.log(integration);

  const clickHandler = () => {
    navigate(`manage/${type}`);
  };
  return (
    <Card onClick={clickHandler} className="hover:cursor-pointer space-y-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <img src={integration.logo} className="h-14 w-14 rounded-lg" alt="" />
        <CardTitle className="text-xl font-semibold">
          {integration.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm font-medium">{integration.description}</div>
        {/* <p className="text-xs text-muted-foreground">
          {DateHelper.formatTimestamp(integration.createdAt)}
        </p> */}
      </CardContent>
      <Separator />
      <CardFooter className="pb-2 flex justify-between items-center">
        <button className="flex items-center justify-center space-x-2 rounded px-2 py-1 hover:bg-[#F3F4F6] transition-all ease-linear">
          <Settings className="w-5" />
          <span>Manage</span>
        </button>
        <Switch checked className="" />
      </CardFooter>
    </Card>
  );
};

export default IntegrationCard;
