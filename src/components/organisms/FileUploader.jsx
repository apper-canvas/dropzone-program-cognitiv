import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import DropZone from "@/components/molecules/DropZone";
import FileCard from "@/components/molecules/FileCard";
import Button from "@/components/atoms/Button";
import { uploadService } from "@/services/api/uploadService";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";

const FileUploader = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadSettings, setUploadSettings] = useState(null);

  // Load upload settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError("");
        const settings = await uploadService.getUploadSettings();
        setUploadSettings(settings);
      } catch (err) {
        setError("Failed to load upload settings");
        console.error("Error loading settings:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  const generateFileId = () => {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const createPreviewUrl = (file) => {
    if (file.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const simulateUpload = useCallback(async (fileObj) => {
    const totalSteps = 10;
    const stepDelay = 200;
    
    for (let step = 0; step <= totalSteps; step++) {
      await new Promise(resolve => setTimeout(resolve, stepDelay));
      
      const progress = (step / totalSteps) * 100;
      const uploadedBytes = Math.floor((progress / 100) * fileObj.file.size);
      
      setFiles(prevFiles => 
        prevFiles.map(f => 
          f.id === fileObj.id 
            ? { 
                ...f, 
                progress,
                uploadedBytes,
                status: progress === 100 ? "success" : "uploading"
              }
            : f
        )
      );
      
      // Simulate random errors (5% chance)
      if (step < totalSteps && Math.random() < 0.05) {
        throw new Error("Network connection interrupted");
      }
    }
    
    // Set completion timestamp
    setFiles(prevFiles => 
      prevFiles.map(f => 
        f.id === fileObj.id 
          ? { ...f, uploadedAt: Date.now() }
          : f
      )
    );
  }, []);

  const handleFilesSelected = useCallback(async (selectedFiles, errors) => {
    // Show validation errors
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
    }
    
    if (selectedFiles.length === 0) return;

    // Create file objects
    const newFiles = selectedFiles.map(file => ({
      id: generateFileId(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: "queued",
      progress: 0,
      uploadedBytes: 0,
      previewUrl: createPreviewUrl(file),
      error: null,
      uploadedAt: null
    }));

    // Add files to state
    setFiles(prevFiles => [...prevFiles, ...newFiles]);

    // Start uploads
    for (const fileObj of newFiles) {
      try {
        // Update status to uploading
        setFiles(prevFiles => 
          prevFiles.map(f => 
            f.id === fileObj.id 
              ? { ...f, status: "uploading" }
              : f
          )
        );

        await simulateUpload(fileObj);
        toast.success(`${fileObj.name} uploaded successfully!`);
      } catch (err) {
        console.error(`Upload failed for ${fileObj.name}:`, err);
        
        setFiles(prevFiles => 
          prevFiles.map(f => 
            f.id === fileObj.id 
              ? { 
                  ...f, 
                  status: "error",
                  error: err.message || "Upload failed"
                }
              : f
          )
        );
        
        toast.error(`Failed to upload ${fileObj.name}: ${err.message}`);
      }
    }
  }, [simulateUpload]);

  const handleRemoveFile = useCallback((fileId) => {
    const fileToRemove = files.find(f => f.id === fileId);
    if (!fileToRemove) return;

    // Clean up preview URL if it exists
    if (fileToRemove.previewUrl) {
      URL.revokeObjectURL(fileToRemove.previewUrl);
    }

    setFiles(prevFiles => prevFiles.filter(f => f.id !== fileId));
    toast.info(`${fileToRemove.name} removed`);
  }, [files]);

  const handleClearAll = useCallback(() => {
    // Clean up all preview URLs
    files.forEach(file => {
      if (file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
    });
    
    setFiles([]);
    toast.info("All files cleared");
  }, [files]);

  const handleRetryError = useCallback(async (fileId) => {
    const file = files.find(f => f.id === fileId);
    if (!file || file.status !== "error") return;

    try {
      setFiles(prevFiles => 
        prevFiles.map(f => 
          f.id === fileId 
            ? { 
                ...f, 
                status: "uploading", 
                progress: 0, 
                uploadedBytes: 0,
                error: null 
              }
            : f
        )
      );

      await simulateUpload(file);
      toast.success(`${file.name} uploaded successfully!`);
    } catch (err) {
      console.error(`Retry failed for ${file.name}:`, err);
      setFiles(prevFiles => 
        prevFiles.map(f => 
          f.id === fileId 
            ? { 
                ...f, 
                status: "error",
                error: err.message || "Upload failed"
              }
            : f
        )
      );
      toast.error(`Retry failed for ${file.name}: ${err.message}`);
    }
  }, [files, simulateUpload]);

  const retryAll = useCallback(async () => {
    setError("");
    setLoading(true);
    
    try {
      const settings = await uploadService.getUploadSettings();
      setUploadSettings(settings);
    } catch (err) {
      setError("Failed to load upload settings");
      console.error("Error loading settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate stats
  const stats = {
    total: files.length,
    uploading: files.filter(f => f.status === "uploading").length,
    completed: files.filter(f => f.status === "success").length,
    failed: files.filter(f => f.status === "error").length,
    queued: files.filter(f => f.status === "queued").length
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={retryAll} />;
  }

  if (!uploadSettings) {
    return <ErrorView message="Unable to load upload settings" onRetry={retryAll} />;
  }

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <DropZone
        onFilesSelected={handleFilesSelected}
        acceptedTypes={uploadSettings.acceptedTypes}
        maxFileSize={uploadSettings.maxFileSize}
        multiple={true}
      />

      {/* Upload Stats */}
      {files.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <ApperIcon name="BarChart3" className="w-5 h-5 text-primary" />
              <span>Upload Progress</span>
            </h3>
            <Button
              variant="outline"
              size="sm"
              icon="Trash2"
              onClick={handleClearAll}
              className="text-gray-600"
            >
              Clear All
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Files</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">{stats.uploading}</div>
              <div className="text-sm text-gray-600">Uploading</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-success">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-error">{stats.failed}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-secondary">{stats.queued}</div>
              <div className="text-sm text-gray-600">Queued</div>
            </div>
          </div>
        </div>
      )}

      {/* File List */}
      {files.length === 0 ? (
        <Empty onAction={() => {/* Handled by drop zone */}} />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <ApperIcon name="FileText" className="w-5 h-5 text-primary" />
              <span>Files ({files.length})</span>
            </h3>
            
            {stats.failed > 0 && (
              <Button
                variant="outline"
                size="sm"
                icon="RotateCcw"
                onClick={() => {
                  files.filter(f => f.status === "error").forEach(f => {
                    handleRetryError(f.id);
                  });
                }}
                className="text-error border-error hover:bg-error hover:text-white"
              >
                Retry Failed ({stats.failed})
              </Button>
            )}
          </div>
          
          <div className="space-y-3">
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onRemove={handleRemoveFile}
                showRemove={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;