import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { buttonVariants } from "../components/ui/button";
import { cn } from "../lib/utils";

const Navbar = ({ links, isCollapsed }: any) => {
  return (
    <div
      data-collapsed={isCollapsed}
      className="group min-h-fit flex flex-col gap-4 py-2 data-[collapsed=true]:py-2 min-w-full"
    >
      <div className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]">
        {links.map((link: any, index: any) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: link.variant, size: "sm" }),
                    "h-9 w-12 flex items-center justify-center",
                    link.variant === "light " &&
                      "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </a>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4 ">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <a
              key={index}
              href="#"
              className={cn(
                buttonVariants({ variant: link.variant, size: "sm" }),
                link.variant === "light" &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white outline-none",
                "justify-start",
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    "ml-auto",
                    link.variant === "default" &&
                      "text-background dark:text-white",
                  )}
                >
                  {link.label}
                </span>
              )}
            </a>
          ),
        )}
      </div>
    </div>
  );
};

export default Navbar;
