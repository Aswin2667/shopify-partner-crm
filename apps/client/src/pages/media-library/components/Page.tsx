"use client";

import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileIcon,
  GridIcon,
  ListIcon,
  SearchIcon,
  UploadIcon,
  ImageIcon,
  VideoIcon,
  FileTextIcon,
  Music2Icon,
} from "lucide-react";
import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "us-east-1",
  endpoint: "http://localhost:9001", // MinIO endpoint
  credentials: {
    accessKeyId: "jiOqGEpwVPO18z0cLzYJ",
    secretAccessKey: "u3RwAFmfdvrC26lYZusr8ug8wi9T0jpiGD8WNKoq",
  },
  forcePathStyle: true, // Required for MinIO
});

export default function Page() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [fileTypeFilter, setFileTypeFilter] = useState("all");
  const [mediaItems, setMediaItems] = useState<any[]>([]); // Holds the fetched files

  const defaultImageUrl =
    "https://g-pmpdlrxi1cj.vusercontent.net/placeholder.svg?height=100&width=100";
  const fetchFiles = async () => {
    try {
      const command = new ListObjectsCommand({
        Bucket: "crm-bucket", // replace with your bucket name
      });
      const response = await s3Client.send(command);
      if (response.Contents) {
        const items = response.Contents.map((file: any) => {
          const fileType = getFileType(file.Key!);
          return {
            id: file.ETag,
            name: file.Key,
            type: fileType,
            src:
              fileType === "image"
                ? getPresignedUrl(file.Key!)
                : defaultImageUrl,
            dateAdded: new Date(file.LastModified!).toLocaleDateString(),
            size: (file?.Size / (1024 * 1024)).toFixed(2) + " MB",
          };
        });
        setMediaItems(items);
      }
    } catch (err) {
      console.error("Error fetching files: ", err);
    }
  };
  // Fetch files from S3
  useEffect(() => {
    fetchFiles();
    setFilePreview(null);
  }, [isUploadModalOpen]);

  // Get file type from extension
  const getFileType = (fileName: string) => {
    const extension = fileName.split(".").pop();
    switch (extension) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "svg":
        return "image";
      case "mp4":
      case "mov":
        return "video";
      case "mp3":
      case "wav":
        return "audio";
      case "pdf":
      case "doc":
      case "docx":
        return "document";
      default:
        return "file";
    }
  };

  // Placeholder for presigned URL generation (you would implement this with your server-side logic)
  const getPresignedUrl = (key: string) => {
    return `http://localhost:9001/crm-bucket/${key}`; // Assuming the key will be accessible directly from your S3/MinIO setup
  };

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string); // Set the preview URL
      };
      reader.readAsDataURL(file); // Read file as data URL
    }
  };
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleUpload = async () => {
    if (selectedFile) {
      console.log("Uploading file:", selectedFile.name);
      try {
        const uploadParams = {
          Bucket: "crm-bucket", // Replace with your bucket name
          Key: selectedFile.name,
          Body: selectedFile,
          ContentType: selectedFile.type,
        };
        await s3Client.send(new PutObjectCommand(uploadParams));
        fetchFiles(); // Refresh file list after upload
      } catch (error) {
        console.error("Error uploading file:", error);
      }
      setSelectedFile(null);
      setIsUploadModalOpen(false);
    }
  };

  const filteredItems = mediaItems.filter(
    (item) => fileTypeFilter === "all" || item.type === fileTypeFilter
  );

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />;
      case "video":
        return <VideoIcon className="h-4 w-4" />;
      case "audio":
        return <Music2Icon className="h-4 w-4" />;
      case "document":
        return <FileTextIcon className="h-4 w-4" />;
      default:
        return <FileIcon className="h-4 w-4" />;
    }
  };
  const handleDelete = async (key: string) => {
    try {
      const deleteParams = {
        Bucket: "crm-bucket",
        Key: key,
      };
      await s3Client.send(new DeleteObjectCommand(deleteParams));
      fetchFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

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
                <Tabs
                  value={viewMode}
                  onValueChange={(value) =>
                    setViewMode(value as "grid" | "list")
                  }
                >
                  <TabsList>
                    <TabsTrigger value="grid">
                      <GridIcon className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="list">
                      <ListIcon className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <Dialog
                  open={isUploadModalOpen}
                  onOpenChange={setIsUploadModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button onClick={() => setIsUploadModalOpen(true)}>
                      <UploadIcon className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload a File</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center justify-center w-full">
                      {!filePreview && (
                        <label
                          htmlFor="dropzone-file"
                          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 16"
                            >
                              <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400"></p>
                          </div>
                          <input
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </label>
                      )}
                      {filePreview && (
                        <img
                          src={filePreview}
                          alt="Preview"
                          className="mt-4 h-32 object-cover rounded-lg"
                        />
                      )}
                    </div>

                    <Button onClick={handleUpload} className="mt-4">
                      Upload
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <ScrollArea className="h-[calc(100vh-180px)]">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg overflow-hidden bg-white"
                    >
                      <a href={item.src} download>
                        <img
                          src={item.src}
                          alt={item.name}
                          className="w-full h-24 object-cover cursor-pointer" // Added cursor-pointer for better UX
                        />
                      </a>
                      <div className="p-2">
                        <h3 className="text-sm font-medium truncate">
                          <a href={item.src} download>
                            {item.name}
                          </a>
                        </h3>
                        <p className="text-xs text-gray-500 capitalize">
                          {item.type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date Added</TableHead>
                      <TableHead>Size</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <a
                            href={item.src}
                            download
                            className="text-blue-500 hover:underline"
                          >
                            {item.name}
                          </a>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getFileTypeIcon(item.type)}
                            <span className="ml-2 capitalize">{item.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.dateAdded}</TableCell>
                        <TableCell>{item.size}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleDelete(item.name)}
                            className="text-red-500"
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </ScrollArea>
          </div>
        </main>
      </div>
    </div>
  );
}
