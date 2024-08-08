import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/organizations/Dashboard";
import Inbox from "./pages/mail/Inbox";
import PageNotFount from "./pages/404/404";
import OrganizationList from "./pages/organizations/OrganizationList";
import RootLayout from "./components/RootLayout";

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
  },{
    path: "/:id",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <Dashboard />,
        index: true,
      },
      {
        path: "inbox",
        element: <Inbox />,
      }
    ],
  }
]);
