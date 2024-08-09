import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { buttonVariants } from "../components/ui/button";
import { cn } from "../lib/utils";
import { NavLink } from "react-router-dom";

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
              <TooltipTrigger>
                <NavLink
                  to={link.title.toLowerCase()}
                  className={({ isActive }) =>
                    cn(
                      buttonVariants({
                        variant: isActive ? "default" : "ghost",
                        size: "sm",
                      }),
                      "justify-start"
                    )
                  }
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </NavLink>
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
            <NavLink
              to={link.title.toLowerCase()}
              className={({ isActive }) =>
                cn(
                  buttonVariants({
                    variant: isActive ? "default" : "ghost",
                    size: "sm",
                  }),
                  "justify-start"
                )
              }
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    "ml-auto",
                    link.variant === "default" &&
                      "text-background dark:text-white"
                  )}
                >
                  {link.label}
                </span>
              )}
            </NavLink>
          )
        )}
      </div>
    </div>
  );
};

export default Navbar;
