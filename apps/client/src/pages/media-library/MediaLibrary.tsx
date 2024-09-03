// src/MediaLibrary.js
import React, { useState } from 'react';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const MediaLibrary = () => {
  const [file, setFile] = useState<any>(null);
  const [message, setMessage] = useState<string>('');

  // Configure the MinIO client
  const s3Client = new S3Client({
    region:"us-east-1",
     endpoint: 'http://localhost:9001', // MinIO endpoint
    credentials: {
      accessKeyId: '3qPU2HcjkpOsxiEE0Mxs',
      secretAccessKey: 'NdCaOrsz5feMiY1jvNmZ8czVzr8Cxc0nwpfIaqqT',
    },
    forcePathStyle: true, // Required for MinIO
  });

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const onUpload = async () => {
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    const uploadParams = {
      Bucket: 'test123',
      Key: file.name,
      Body: file,
      ContentType: file.type,
    };

    try {
      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);
      setMessage('File uploaded successfully.');
    } catch (error) {
      setMessage('Failed to upload file.');
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <h1>Upload File to MinIO</h1>
      <input type="file" onChange={onFileChange} />
      <button onClick={onUpload}>Upload</button>
      <p>{message}</p>
    </div>
  );
};

export default MediaLibrary;
