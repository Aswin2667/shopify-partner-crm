import { Card, CardContent } from "@/components/ui/card";
import { Inbox } from "lucide-react";

export default function EmptyInbox() {
  return (
    <Card className="w-full max-w-full mx-auto h-[90vh]">
      <CardContent className="flex flex-col items-center justify-center space-y-4 p-6 text-center h-[70%]">
        <div className="rounded-full bg-muted p-3">
          <Inbox className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          Your inbox is empty
        </h2>
        <p className="text-muted-foreground">
          When you receive emails, they'll appear here. Stay tuned!
        </p>
      </CardContent>
    </Card>
  );
}
