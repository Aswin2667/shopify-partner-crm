"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw } from "lucide-react";
import MailDisplay from "./MailDisplay";
import SelectMailType from "./SelectMailType";
import { useState } from "react";

export default function MailInbox({ mails }: any) {
  const [mailType, setMailType] = useState("ALL");
  console.log(mailType);
  const refreshEmails = () => {
    // In a real application, this would fetch new emails from the server
    alert("Refreshing emails...");
  };

  const filteredMails =
    mailType === "ALL"
      ? mails
      : mails.filter((mail: any) => mail.source === mailType);
  console.log(filteredMails);

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inbox</h1>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search emails"
            className="w-64"
            // startDecorator={<Search className="h-4 w-4 text-gray-500" />}
          />
          <SelectMailType value={mailType} setValue={setMailType} />
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <Tabs defaultValue="all" className="flex-1 flex flex-col">
            <div className="border-b flex justify-between items-center py-2">
              <TabsList className="space-x-4">
                <TabsTrigger value="all" className="border">
                  All
                </TabsTrigger>
                <TabsTrigger value="send" className="border">
                  Send
                </TabsTrigger>
                <TabsTrigger value="schedule" className="border">
                  Schedule
                </TabsTrigger>
              </TabsList>
              <Button variant="ghost" size="icon" onClick={refreshEmails}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            <TabsContent value="all" className="flex-1 p-0">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                {filteredMails.map((mail: any) => (
                  <MailDisplay key={mail.id} mail={mail} />
                ))}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="send" className="flex-1 p-0">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                {filteredMails
                  .filter((mail: any) => mail.status === "SEND")
                  .map((mail: any) => (
                    <MailDisplay key={mail.id} mail={mail} />
                  ))}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="schedule" className="flex-1 p-0">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                {filteredMails
                  .filter((mail: any) => mail.status === "SCHEDULE")
                  .map((mail: any) => (
                    <MailDisplay key={mail.id} mail={mail} />
                  ))}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
