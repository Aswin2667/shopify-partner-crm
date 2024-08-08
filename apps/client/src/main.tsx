import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "./components/ThemeProvider.tsx";
import { RouterProvider } from "react-router-dom";
import {routes} from "./routes.tsx"
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <GoogleOAuthProvider clientId={"639566010681-lt4gkh6lf2v6s6nap66vfvjpueqaqgkm.apps.googleusercontent.com"} >
      <RouterProvider router={routes}/>
      </GoogleOAuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
