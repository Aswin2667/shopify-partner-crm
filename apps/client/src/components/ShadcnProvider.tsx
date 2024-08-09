import React from "react";
import { AlertDialog } from "./ui/alert-dialog";
import { TooltipProvider } from "./ui/tooltip";
import { ThemeProvider } from "./ThemeProvider";

type Props = {
  children: React.ReactNode;
};

const ShadcnProvider = ({ children }: Props) => {
  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AlertDialog>
          <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
        </AlertDialog>
      </ThemeProvider>
    </>
  );
};

export default ShadcnProvider;
