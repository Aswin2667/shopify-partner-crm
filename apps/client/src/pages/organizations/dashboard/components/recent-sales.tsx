import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentSales() {
  return (
    <div className="space-y-8">
      {Array.from({ length: 5 }).map((_, i) => (
        <div className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm p-0 font-medium leading-none">
              Olivia Martin
            </p>
            <p className="text-sm p-0 text-muted-foreground">
              olivia.martin@email.com
            </p>
          </div>
          <div className="ml-auto font-medium">+$1,999.00</div>
        </div>
      ))}
    </div>
  );
}
