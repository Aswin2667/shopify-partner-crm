import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import { Eye, EyeOff, Copy, RefreshCw } from "lucide-react"; 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios"; 
const CliAccesTokens: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [secretKey, setSecretKey] = useState<string>(
    (import.meta.env.VITE_TOKEN_SECRET_KEY as string) ?? "1234567890123456"
  );
  const [showToken, setShowToken] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const url = "http://localhost:8080/";
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const projectId = window.location.pathname.split("/")[3] ?? "";
        const response = await axios.get(`${url}project/${projectId}`);

        setToken(response.data.cliAccessToken);
      } catch (error) {
        console.error("Error fetching the token:", error);
      }
    };
    fetchToken();
  }, []);

  const generateToken = async () => {
    try {
      const projectId = window.location.pathname.split("/")[3] ?? "";
      const data = {
        projectId,
      };

      const dataString = JSON.stringify(data);
      const encryptedToken = CryptoJS.AES.encrypt(
        dataString,
        secretKey
      ).toString();

      await axios.patch(`${url}project/${projectId}`, {
        token: encryptedToken,
      });
      setOpenDialog(false);
      setToken(encryptedToken);
    } catch (error) {
      console.error("Error updating the token:", error);
    }
    // setOpenDialog(true);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleUpdateToken = async () => {
    try {
      const projectId = window.location.pathname.split("/")[3] ?? "";

      await axios.patch(`${url}project/${projectId}`, { token });
      setOpenDialog(false);
    } catch (error) {
      console.error("Error updating the token:", error);
    }
  };

  return (
    <>
      {!token ? (
        <button
          onClick={generateToken}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mb-6"
        >
          Generate Encrypted Token
        </button>
      ) : (
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Generated Token:
          </h3>
          <div className="flex items-center mb-4">
            <input
              type={showToken ? "text" : "password"}
              readOnly
              value={token}
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
            />
            <button
              onClick={() => setShowToken(!showToken)}
              className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
            >
              {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <button
              onClick={() => handleCopyToClipboard(token)}
              className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
            >
              <Copy size={16} />
            </button>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded mb-6 flex items-center">
                <RefreshCw size={16} className="mr-2" />
                Update Token
              </button>
            </DialogTrigger>
            <DialogOverlay />
            <DialogContent>
              <DialogTitle>Update Token</DialogTitle>
              <DialogDescription>
                Are you sure you want to update the token? This will generate a
                new token and overwrite the existing one.
              </DialogDescription>
              <DialogFooter>
                <button
                  onClick={() => setOpenDialog(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateToken}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                >
                  Update Token
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default CliAccesTokens;
