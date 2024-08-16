// import React, { useState } from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import './custom.css'
// export default function  EmailEditor() {
//   const [value, setValue] = useState('');

//   return <ReactQuill  className='w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600' theme="snow" value={value} onChange={setValue} />;
// }



 import { useTheme } from "next-themes";
import React, { useEffect, useRef, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

export default function Editor({ value, setValue }: any) {
  const { theme } = useTheme();
  const [editorValue, setEditorValue] = useState("value");

  const handleEditorChange = (newValue: any) => {
    setEditorValue(newValue);
    setEditorValue(newValue);
  };

  const handlePaste = async (event: any) => {
    event.preventDefault();
    const clipboardItems = event.clipboardData.items;
    for (let i = 0; i < clipboardItems.length; i++) {
      const item = clipboardItems[i];
      if (item.type.includes("image")) {
        const file = item.getAsFile();
        const imageUrl = `![Uploading ${file.name}...]()`;
        const updatedValue = editorValue ? `${editorValue}\n${imageUrl}` : imageUrl;
        setValue(updatedValue);
        setEditorValue(updatedValue);
        await handleFile(file);
      }
    }
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.includes("image")) {
        handleFile(file);
      }
    }
  };

  const handleFile = async (file: any) => {
    // const reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onloadend = async () => {
    //   const base64String: any = reader.result;
    //   const response = await ImageService.uploadImage(base64String, file.name);
    //   if (response?.data.result) {
    //     const imageUrl = `![${file.name}](${response?.data.result})`;
    //     const updatedValue = editorValue.replace(`![Uploading ${file.name}...]()`, imageUrl);
    //     console.log(imageUrl)
    //     setValue(updatedValue);
    //     setEditorValue(updatedValue);
    //   }
    // };
    // reader.onerror = (error) => {
    //   console.error("Error reading file:", error);
    // };
  };

  return (
    <div data-color-mode={"light"} onDrop={handleDrop}>
      <br />
      <MDEditor
        onChange={handleEditorChange}
        value={editorValue}
        textareaProps={{
          placeholder: "Enter comment",
          // onPaste: handlePaste,
          // onDrop: handleDrop,
        }}
        preview="edit"
      />
    </div>
  );
}