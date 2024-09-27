import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { organizationAction } from "@/redux/organizationSlice";
import DateHelper from "@/utils/DateHelper";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const OrganizationCard = ({ organization }: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const organizations = JSON.parse(
    localStorage.getItem("organizations") || "[]"
  );
  const presentOrgMemberDetails = organizations.find(
    (org: any) => org.organizationId === organization.organization.id
  );

  const clickHandler = () => {
    console.log(organization);

    localStorage.setItem(
      "presentOrgMemberDetails",
      JSON.stringify(presentOrgMemberDetails)
    );

    navigate(`/${organization.organizationId}/dashboard`);

    dispatch(organizationAction.setCurrentOrgMember(organization));
    // localStorage.setItem("organization", JSON.stringify(organization));
  };
  return (
    <Card onClick={clickHandler} className="hover:cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">
          {organization.organization.name}
        </CardTitle>
        <img
          src={organization.organization.logo}
          className="h-10 w-10 rounded-lg "
          alt=""
        />
      </CardHeader>
      <CardContent>
        <div className=" text-sm font-medium">
          {organization.organization.description}
        </div>
        <p className="text-xs text-muted-foreground">
          {DateHelper.formatTimestamp(organization.organization.createdAt)}
        </p>
      </CardContent>
    </Card>
  );
};

export default OrganizationCard;
