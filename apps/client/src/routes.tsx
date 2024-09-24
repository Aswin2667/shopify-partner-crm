import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/auth/Login";
import PageNotFount from "./pages/404/404";
import OrganizationList from "./pages/organizations/OrganizationList";
import RootLayout from "./components/RootLayout";
import CreateIntegration from "./pages/Integration/Index";
import IntegrationDetailScreen from "./pages/Integration/components/IntegrationDetailScreen";
import IntegrationDashboard from "./pages/Integration/components/IntegrationDashboard";
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
import Activity from "./pages/leads/components/Activity";
import MediaLibrary from "./pages/media-library/MediaLibrary";
import Notes from "./pages/leads/notes/Notes";
import LeadMail from "./pages/leads/components/LeadMail";
import ContactTable from "./pages/contacts/table/ContactTable";
import CustomFiled from "./pages/organizations/settings/customFields/CustomFiled";
import Templates from "./pages/organizations/settings/templates/Templates";
import TemplateCreatePage from "./pages/organizations/settings/templates/TemplateCreatePage";
import Invitation from "./pages/auth/Invitation";
import LeadStatus from "./pages/organizations/settings/leadStatus/LeadStatus";
import ManageIntegration from "./pages/Integration/components/ManageIntegration";
import ProjectSettings from "./pages/Project/settings/page";
import CliAccesTokens from "./pages/Project/settings/CliAccessTokens";
import EamilSettings from "./pages/organizations/settings/Emails/EamilSettings";
import MyEmailSettings from "./pages/organizations/settings/Emails/components/MyEmailSettings";
import SendingLimits from "./pages/organizations/settings/Emails/components/SendingLimits";
import UnsubscribeLinks from "./pages/organizations/settings/Emails/components/UnsubscribeLinks";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <OrganizationList />,
    errorElement: <PageNotFount />,
  },
  {
    path: "/invite",
    element: <Invitation />,
    errorElement: <PageNotFount />,
  },
  {
    path: "/login",
    element: <Login />,
    index: true,
  },
  {
    path: "/:organizationId",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
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
            children: [
              {
                index: true,
                element: <Activity />,
              },
              {
                path: "emails",
                element: <LeadMail />,
              },
              {
                path: "calls",
                element: <>call</>,
              },
              {
                path: "tasks",
                element: <>task</>,
              },
              {
                path: "notes",
                element: <Notes />,
              },
              {
                path: "messages",
                element: <>messages</>,
              },
            ],
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
      {
        path: "media library",
        element: <MediaLibrary />,
      },
      {
        path: "contacts",
        element: <ContactTable />,
      },
      {
        path: "settings",
        element: <SettingsLayout />,
        children: [
          {
            index: true,
            element: <SettingsProfilePage />,
          },
          {
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
          {
            path: "integration",
            children: [
              {
                index: true,
                element: <IntegrationDashboard />,
              },
              {
                path: "manage/:integrationType",
                element: <ManageIntegration />,
                children: [
                  {
                    path: "projects",
                    children: [
                      {
                        index: true,
                        element: <Project />,
                      },
                      {
                        path: ":projectId",
                        element: <ProjectSettings />,
                        children: [
                          {
                            index: true,
                            path: "tokens",
                            element: <CliAccesTokens />,
                          },
                          {
                            path: "webhooks",
                            element: <>webhooks</>,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                path: "create",
                children: [
                  {
                    index: true,
                    element: <CreateIntegration />,
                  },
                  {
                    path: ":integrationType",
                    element: <IntegrationDetailScreen />,
                  },
                ],
              },
            ],
          },
          {
            path: "templates",
            element: <Templates />,
          },
          {
            path: "create-template",
            element: <TemplateCreatePage />,
          },
          {
            path: "status",
            element: <LeadStatus />,
          },
          {
            path: "custom-fields",
            element: <CustomFiled />,
          },
          {
            path: "manage-access",
            element: <ManageAccess />,
          },
          {
            path: "email",
            element: <EamilSettings />,
            children:[
              {
                element:<MyEmailSettings />,
                index:true
              },
              {
                element:<SendingLimits />,
                path:"limit"
              },
              {
                element:<UnsubscribeLinks />,
                path:"unsubscribe"
              }
            ]
          },
        ],
      },
    ],
  },
]);
