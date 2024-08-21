import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/auth/Login";
import PageNotFount from "./pages/404/404";
import OrganizationList from "./pages/organizations/OrganizationList";
import RootLayout from "./components/RootLayout";
import Integration from "./pages/Integration/Index";
import IntegrationDetailScreen from "./pages/Integration/components/IntegrationDetailScreen";
import IntegrationDashboard from "./pages/Integration/components/IntegrationDashboard";
import IntegrationDashboardLayout from "./pages/Integration/components/IntegrationDashboardLayout";
import WorkflowTable from "./pages/workflows/table/WorkflowTable";
import Editor from "./pages/workflows/editor/Editor";
import SettingsLayout from "./pages/organizations/settings/layout";
import SettingsProfilePage from "./pages/organizations/settings/page";
import SettingsAppearancePage from "./pages/organizations/settings/appearance/page";
import SettingsNotificationsPage from "./pages/organizations/settings/notifications/page";
import SettingsDisplayPage from "./pages/organizations/settings/display/page";
import ManageAccess from "./pages/organizations/ManageAccess";
import DashboardPage from "./pages/organizations/dashboard/page";
import LeadDashboard from "./pages/leads/DashBoard";
import LeadTable from "./pages/leads/table/LeadTable";
import MailPage from "./pages/mail/Index";
import Project from "./pages/Project/Index";

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
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            path: "inbox",
            element: <MailPage />,
          },
          {
            path: "leads",
            children: [
              {
                index: true,
                element: <LeadTable />,
              },
              {
                path: ":leadId",

                element: <LeadDashboard />,
              },
            ],
          },
          {
            path: "projects",
            children: [
              {
                index: true,
                element: <Project />,
              },
              {
                path: ":projectId",
                element: <DashboardPage />,
              },
            ],
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
          },
        ],
      },
      {
        path: "create-integration",
        children: [
          {
            index: true,
            element: <Integration />,
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
        children: [
          {
            index: true,
            path: "profile",
            element: <SettingsProfilePage />,
          },
          {
            path: "appearance",
            element: <SettingsAppearancePage />,
          },
          {
            path: "notifications",
            element: <SettingsNotificationsPage />,
          },
          {
            path: "display",
            element: <SettingsDisplayPage />,
          },
        ],
      },
      {
        path: "manage-access",
        element: <ManageAccess />,
      },
    ],
  },
]);
