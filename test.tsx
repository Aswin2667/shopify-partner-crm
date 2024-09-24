import React, { useState, useEffect } from "react";
import { S3Client, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileIcon, GridIcon, ListIcon, SearchIcon, UploadIcon } from "lucide-react";

// Initialize S3/MinIO client
const s3Client = new S3Client({
  region: "us-east-1",
  endpoint: "http://localhost:9001", // MinIO endpoint
  credentials: {
    accessKeyId: "YDFDWRDCtopvBv9p9CTn",
    secretAccessKey: "mwhRf9PgmCW5xEABpAAUVdlPtQOJ4prFY9U56Zs6",
  },
  forcePathStyle: true, // Required for MinIO
});

export default function Page() {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  // Function to fetch files from MinIO
  const fetchFiles = async () => {
    setLoading(true);
    try {
      const data = await s3Client.send(
        new ListObjectsV2Command({ Bucket: "shopjar" }) // Replace with your bucket
      );
      const items = data.Contents.map((item) => ({
        id: item.Key,
        name: item.Key,
        src: `http://localhost:9001/shopjar/${item.Key}`, // Replace with your bucket name
      }));
      console.log(items)
      setMediaItems(items);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle file uploads
  const handleFileUpload = async () => {
    if (!file) return;
    try {
      const uploadParams = {
        Bucket: "shopjar", // Replace with your bucket name
        Key: file.name,
        Body: file,
        ContentType: file.type,
      };
      await s3Client.send(new PutObjectCommand(uploadParams));
      fetchFiles(); // Refresh file list after upload
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // UseEffect to fetch files on component mount
  useEffect(() => {
    fetchFiles();
  }, []);

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
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleFileUpload}>
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
            <ScrollArea className="h-[calc(100vh-180px)]">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {mediaItems.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg overflow-hidden bg-white"
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
              )}
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
      <div className="p-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />
      </div>
    </div>
  );
}
