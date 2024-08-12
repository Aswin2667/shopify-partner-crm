import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/auth/Login";
import Inbox from "./pages/mail/Inbox";
import PageNotFount from "./pages/404/404";
import OrganizationList from "./pages/organizations/OrganizationList";
import RootLayout from "./components/RootLayout";
import Integration from "./pages/Integration/Integration";
import IntegrationDetailScreen from "./pages/Integration/components/IntegrationDetailScreen";
import IntegrationDashboard from "./pages/Integration/components/IntegrationDashboard";
import IntegrationDashboardLayout from "./pages/Integration/components/IntegrationDashboardLayout";

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
        index: true,
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
            path: "integration",
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
        ],
      },
      {
        path: "settings",
        element: <>Organization Settings</>,
      },
    ],
  },
]);
