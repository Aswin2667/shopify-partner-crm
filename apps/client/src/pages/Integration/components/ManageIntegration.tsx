import { TbArrowNarrowLeft } from "react-icons/tb";
import { Link, Outlet, useParams } from "react-router-dom";
import ManageFactory from "./type-manage/ManageFactory";

type Props = {};

const ManageIntegration = ({}: Props) => {
  const { integrationType, projectId } = useParams();

  return (
    <div className="space-y-10">
      {/* BreadCrumbs */}
      <div className="border-b p-5 w-full"> 
        <Link
          to=".."
          className="flex items-center gap-1 text-sm text-[#767676]
          hover:text-gray-800 w-fit"
        >
          <TbArrowNarrowLeft size={20} />
          <h6 className="">Integration</h6>
        </Link>
        <h1 className="text-2xl font-medium">
          {integrationType
            ? integrationType?.charAt(0).toUpperCase() +
              integrationType?.slice(1)
            : ""}
        </h1>
      </div>

      {projectId && integrationType ? (
        <Outlet />
      ) : (
        <div className="space-y-4">
          <ManageFactory />
        </div>
      )}
    </div>
  );
};
export default ManageIntegration;
