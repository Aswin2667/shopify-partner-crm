import React from "react";
import { AlertDialog } from "./ui/alert-dialog";
import { TooltipProvider } from "./ui/tooltip";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeWrapper } from "./theme-wrapper";

type Props = {
  children: React.ReactNode;
};

const ShadcnProvider = ({ children }: Props) => {
  return (
    <>
      {/* <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme"> */}
      <ThemeWrapper>
        <AlertDialog>
          <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
        </AlertDialog>
        </ThemeWrapper>
      {/* </ThemeProvider> */}
    </>
  );
};

export default ShadcnProvider;
