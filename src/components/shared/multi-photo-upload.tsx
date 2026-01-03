import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload, Image as ImageIcon } from "lucide-react";

interface MultiPhotoUploadProps {
  onUpload: (files: File[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: Record<string, string[]>;
  uploadPath?: string;
}

export default function MultiPhotoUpload({
  onUpload,
  maxFiles = Infinity,
  acceptedFileTypes = {
    "image/*": [".jpeg", ".jpg", ".png", ".gif"],
  },
  uploadPath = "/api/upload",
}: MultiPhotoUploadProps) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles((prevFiles) => {
        const newFiles = [...prevFiles, ...acceptedFiles];
        return newFiles.slice(0, maxFiles);
      });
    },
    [maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    multiple: true,
    maxFiles,
  });

  const removeFile = (file: File) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });

      const response = await fetch(uploadPath, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      onUpload(files);
      setFiles([]);
      console.log("Upload successful:", result);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div className="w-full max-w-md mt-2 p-6 bg-white rounded-lg shadow-md">
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">Drag 'n' drop some files here, or click to select files</p>
        {maxFiles < Infinity && <p className="mt-1 text-xs text-gray-500">Maximum number of files: {maxFiles}</p>}
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Selected Files:</h3>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                <div className="flex items-center">
                  <ImageIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-700 truncate max-w-[200px]">{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(file)}
                  className="text-red-500 hover:text-red-700"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {files.length > 0 && (
        <button type="button" onClick={handleUpload} className="mt-4 w-full btn btn-primary btn-sm">
          Upload {files.length} {files.length === 1 ? "file" : "files"}
        </button>
      )}
    </div>
  );
}
