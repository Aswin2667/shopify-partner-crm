import { useNavigate } from "react-router-dom";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "./avatar"
  import { Button } from "./button"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "./dropdown-menu"

  export function UserNav() {
    const navigate = useNavigate();
    const session = sessionStorage.getItem("session")??"";
    const user = JSON.parse(session)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatarUrl} alt="@shadcn" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col ">
          <p className="text-sm font-medium p-0 leading-none">
              {user?.name}
            </p>
            <p className="text-xs leading-none p-0 mt-1 text-muted-foreground">
              {user?.email}
            </p>
          </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => {
            sessionStorage.clear()
            navigate('/login')
          }}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }