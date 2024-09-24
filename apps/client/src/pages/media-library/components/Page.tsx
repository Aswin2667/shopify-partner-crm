import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileIcon,
  GridIcon,
  ListIcon,
  SearchIcon,
  UploadIcon,
} from "lucide-react";

export default function Page() {
  const mediaItems = [
    {
      id: 1,
      type: "image",
      name: "Beach Sunset",
      src: "https://g-pmpdlrxi1cj.vusercontent.net/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      type: "video",
      name: "Mountain Timelapse",
      src: "https://g-pmpdlrxi1cj.vusercontent.net/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      type: "audio",
      name: "Forest Ambience",
      src: "https://g-pmpdlrxi1cj.vusercontent.net/placeholder.svg?height=100&width=100",
    },
    {
      id: 4,
      type: "document",
      name: "Project Proposal",
      src: "https://g-pmpdlrxi1cj.vusercontent.net/placeholder.svg?height=100&width=100",
    },
    {
      id: 5,
      type: "image",
      name: "City Skyline",
      src: "https://g-pmpdlrxi1cj.vusercontent.net/placeholder.svg?height=100&width=100",
    },
    {
      id: 6,
      type: "video",
      name: "Cooking Tutorial",
      src: "https://g-pmpdlrxi1cj.vusercontent.net/placeholder.svg?height=100&width=100",
    },
    {
      id: 7,
      type: "audio",
      name: "Piano Sonata",
      src: "https://g-pmpdlrxi1cj.vusercontent.net/placeholder.svg?height=100&width=100",
    },
    {
      id: 8,
      type: "document",
      name: "Research Paper",
      src: "https://g-pmpdlrxi1cj.vusercontent.net/placeholder.svg?height=100&width=100",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-full max-w-sm">
                <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input className="pl-8 w-full" placeholder="Search files..." />
              </div>
              <div className="flex items-center space-x-2">
                <Select defaultValue="name">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="date">Date Added</SelectItem>
                    <SelectItem value="size">Size</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-5 justify-end p-4 ">
                  <Tabs defaultValue="grid">
                    <TabsList>
                      <TabsTrigger value="grid">
                        <GridIcon className="h-4 w-4" />
                      </TabsTrigger>
                      <TabsTrigger value="list">
                        <ListIcon className="h-4 w-4" />
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                
                  {/* <h1 className="text-2xl font-bold">Media Library</h1> */}
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <UploadIcon className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                    <Button>
                      <FileIcon className="mr-2 h-4 w-4" />
                      New Folder
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <ScrollArea className="h-[calc(100vh-180px)]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {mediaItems.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg overflow-hidden bg-white max-"
                  >
                    <img
                      src={item.src}
                      alt={item.name}
                      className="w-full h-24 object-cover"
                    />
                    <div className="p-2">
                      <h3 className="text-sm font-medium truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 capitalize">
                        {item.type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </main>
        <aside className="w-64 p-4 border-l  overflow-auto">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">File Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Files" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Files</SelectItem>
                  <SelectItem value="images">Images</SelectItem>
                  <SelectItem value="videos">Videos</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="documents">Documents</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Date Added</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
