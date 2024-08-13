import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/auth/Login";
import Inbox from "./pages/mail/Inbox";
import PageNotFount from "./pages/404/404";
import OrganizationList from "./pages/organizations/OrganizationList";
import RootLayout from "./components/RootLayout";
import CreateIntegration from "./pages/Integration/CreateIntegration";
import IntegrationDetailScreen from "./pages/Integration/components/IntegrationDetailScreen";
import IntegrationDashboard from "./pages/Integration/components/IntegrationDashboard";
import IntegrationDashboardLayout from "./pages/Integration/components/IntegrationDashboardLayout";
import WorkflowTable from "./pages/workflows/table/WorkflowTable";
import Editor from "./pages/workflows/editor/Editor";
import OrganizationSettings from "./pages/organizations/OrganizationSettings";
import SettingsLayout from "./pages/organizations/settings/layout";
import SettingsProfilePage from "./pages/organizations/settings/page";
import SettingsAppearancePage from "./pages/organizations/settings/appearance/page";
import SettingsNotificationsPage from "./pages/organizations/settings/notifications/page";
import SettingsDisplayPage from "./pages/organizations/settings/display/page";
import ManageAccess from "./pages/organizations/ManageAccess";
import Lead from "./pages/leads/Lead";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <OrganizationList />,
    errorElement: <PageNotFount />,
  },
  {
    path: "/login",
    element: <Login />,
    index: true,
  },
  {
    path: "/:organizationId",
    element: <IntegrationDashboardLayout />,
    children: [
      {
        path: "dashboard",
        element: <IntegrationDashboard />,
      },
      {
        path: "dashboard",
        element: <IntegrationDashboard />,
      },
      {
        path: ":integrationId",
        element: <RootLayout />,
        children: [
          {
            path: "inbox",
            element: <Inbox />,
          },
          {
            path: "workflows",
            children: [
              {
                index: true,
                element: <WorkflowTable />,
              },
              {
                path: "editor/:id",
                element: <Editor />,
              },
            ],
          },{
            path: "leads",
            element: <Lead />,
          }
        ],
      },
      {
        path: "create-integration",
        children: [
          {
            index: true,
            element: <CreateIntegration />,
          },
          {
            path: ":intergrationName",
            element: <IntegrationDetailScreen />,
          },
        ],
      },
      {
        path: "settings",
        element: <SettingsLayout />,
        children:[
          {
            index: true,
            path:"profile",
            element: <SettingsProfilePage />
          },
          {
            path:"appearance",
            element: <SettingsAppearancePage />
          },
          {
            path:"notifications",
            element: <SettingsNotificationsPage />
          },
          {
            path:"display",
            element: <SettingsDisplayPage/>
          }
        ]
      },
      {
        path: "manage-access",
        element: <ManageAccess />,
      },
    ],
  },
]);
