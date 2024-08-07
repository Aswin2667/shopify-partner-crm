import { createBrowserRouter } from "react-router-dom";
import Login from "./components/auth/Login";
import RootLayout from "./components/RootLayout";
import Dashboard from "./pages/organizations/Dashboard";
import Inbox from "./pages/mail/Inbox";
import PageNotFount from "./pages/404/404";
import Integration from "./components/Integration";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <PageNotFount />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: ":id",
        
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "mail",
            element: <Inbox />,
          },
        ],
      },
      {
        path: "integrations",
        element: <Integration />
      }
    ],
  },{
    path: "/login",
    element: <Login />,
    index:true
  }
]);
