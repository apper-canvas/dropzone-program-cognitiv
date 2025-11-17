import React, { useRef, useState, useCallback } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const DropZone = ({ 
  onFilesSelected, 
  acceptedTypes = [], 
  maxFileSize = 100 * 1024 * 1024, // 100MB
  multiple = true 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const fileInputRef = useRef(null);

const validateFile = useCallback((file) => {
    if (file.size > maxFileSize) {
      return `File "${file.name}" is too large. Maximum size is ${Math.round(maxFileSize / 1024 / 1024)}MB.`;
    }
    
    if (acceptedTypes.length > 0) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      const mimeType = file.type;
      
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith(".")) {
          return type.slice(1).toLowerCase() === fileExtension;
        }
        if (type.includes("*")) {
          return mimeType.startsWith(type.split("*")[0]);
        }
        return mimeType === type;
      });
      
      if (!isAccepted) {
        return `File "${file.name}" type is not supported.`;
      }
    }
    
    return null;
  }, [acceptedTypes, maxFileSize]);

  const handleFiles = useCallback((files) => {
    const fileArray = Array.from(files);
    const validFiles = [];
    const errors = [];

    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (onFilesSelected) {
      onFilesSelected(validFiles, errors);
    }
  }, [validateFile, onFilesSelected]);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        setIsDragOver(false);
      }
      return newCounter;
    });
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragCounter(0);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleFileInputChange = useCallback((e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input value to allow selecting the same files again
    e.target.value = "";
  }, [handleFiles]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const formatAcceptedTypes = () => {
    if (acceptedTypes.length === 0) return "All file types";
    return acceptedTypes.map(type => type.startsWith(".") ? type : type.split("/")[0]).join(", ");
  };

  return (
    <div
      className={cn(
        "drop-zone relative border-2 border-dashed border-primary/30 rounded-xl p-8 text-center cursor-pointer transition-all duration-200",
        "hover:border-primary/50 hover:bg-blue-50/50",
        isDragOver && "drag-over border-primary bg-blue-50 border-3 scale-102"
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={acceptedTypes.join(",")}
        onChange={handleFileInputChange}
        className="file-input"
        aria-label="File upload"
      />
      
      <div className="space-y-4">
        <div className="relative inline-block">
          <div className={cn(
            "w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-all duration-300",
            isDragOver 
              ? "bg-gradient-to-br from-primary to-accent text-white scale-110" 
              : "bg-gradient-to-br from-blue-100 to-indigo-100 text-primary"
          )}>
            <ApperIcon 
              name={isDragOver ? "Download" : "Upload"} 
              className="w-8 h-8"
            />
          </div>
          {isDragOver && (
            <div className="absolute -inset-2 rounded-full bg-primary/20 animate-ping"></div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">
            {isDragOver ? "Drop files here" : "Upload your files"}
          </h3>
          <p className="text-gray-600">
            {isDragOver 
              ? "Release to upload your files" 
              : "Drag and drop files here, or click to browse"
            }
          </p>
        </div>

        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            icon="FolderOpen"
            className="pointer-events-none"
          >
            Browse Files
          </Button>
          
          <div className="text-sm text-gray-500 space-y-1">
            <p><strong>Supported:</strong> {formatAcceptedTypes()}</p>
            <p><strong>Max size:</strong> {Math.round(maxFileSize / 1024 / 1024)}MB per file</p>
            {multiple && <p><strong>Multiple files</strong> supported</p>}
          </div>
        </div>
      </div>

      {/* Visual feedback overlay */}
      {isDragOver && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl pointer-events-none">
          <div className="absolute inset-4 border-2 border-dashed border-white/50 rounded-lg flex items-center justify-center">
            <div className="text-primary font-semibold text-lg">
              Drop your files here
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropZone;