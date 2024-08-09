import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster.tsx";
import ShadcnProvider from "./components/ShadcnProvider.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider
        clientId={
          "639566010681-lt4gkh6lf2v6s6nap66vfvjpueqaqgkm.apps.googleusercontent.com"
        }
      >
        <ShadcnProvider>
          <RouterProvider router={routes} />
        </ShadcnProvider>
        <Toaster />
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
