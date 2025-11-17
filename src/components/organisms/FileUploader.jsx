import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { uploadService } from "@/services/api/uploadService";
import ApperIcon from "@/components/ApperIcon";
import FileCard from "@/components/molecules/FileCard";
import DropZone from "@/components/molecules/DropZone";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import ErrorView from "@/components/ui/ErrorView";
import Button from "@/components/atoms/Button";

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
                progress: progress,
                uploadedBytes: uploadedBytes,
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
      Name: file.name,
      name: file.name,
      size: file.size,
      size_c: file.size,
      type: file.type,
      type_c: file.type,
      status: "queued",
      status_c: "queued",
      progress: 0,
      progress_c: 0,
      uploadedBytes: 0,
      uploaded_bytes_c: 0,
      previewUrl: createPreviewUrl(file),
      preview_url_c: createPreviewUrl(file),
      error: null,
      error_c: null,
      uploadedAt: null,
      uploaded_at_c: null
    }));

    // Add files to state
    setFiles(prevFiles => [...prevFiles, ...newFiles]);

    // Start uploads using the service
    for (const fileObj of newFiles) {
      try {
        // Update status to uploading
        setFiles(prevFiles => 
          prevFiles.map(f => 
            f.id === fileObj.id 
              ? { ...f, status: "uploading", status_c: "uploading" }
              : f
          )
        );

        // Use the upload service to handle the actual upload and database storage
        const result = await uploadService.uploadFile(fileObj.file, (progressData) => {
          setFiles(prevFiles => 
            prevFiles.map(f => 
              f.id === fileObj.id 
                ? { 
                    ...f, 
                    progress: progressData.progress,
                    progress_c: progressData.progress,
                    uploadedBytes: progressData.uploadedBytes,
                    uploaded_bytes_c: progressData.uploadedBytes,
                    status: progressData.status,
                    status_c: progressData.status
                  }
                : f
            )
          );
        });
        
        // Final update with database record ID
        setFiles(prevFiles => 
          prevFiles.map(f => 
            f.id === fileObj.id 
              ? { ...f, Id: result.recordId, uploadedAt: Date.now(), uploaded_at_c: Date.now() }
              : f
          )
        );
        
        toast.success(`${fileObj.Name} uploaded successfully!`);
      } catch (err) {
        console.error(`Upload failed for ${fileObj.Name}:`, err);
        
        setFiles(prevFiles => 
          prevFiles.map(f => 
            f.id === fileObj.id 
              ? { 
                  ...f, 
                  status: "error",
                  status_c: "error",
                  error: err.message || "Upload failed",
                  error_c: err.message || "Upload failed"
                }
              : f
          )
        );
        
        toast.error(`Failed to upload ${fileObj.Name}: ${err.message}`);
      }
    }
  }, [simulateUpload]);
const handleRemoveFile = useCallback(async (fileId) => {
const fileToRemove = files.find(f => (f.Id || f.id) === fileId);
    if (!fileToRemove) return;

    try {
      // Clean up preview URL if it exists
      if (fileToRemove.previewUrl || fileToRemove.preview_url_c) {
        URL.revokeObjectURL(fileToRemove.previewUrl || fileToRemove.preview_url_c);
      }

      // Remove from database if it has an ID
      if (fileToRemove.Id) {
        await uploadService.deleteUpload(fileToRemove.Id);
      }

      setFiles(prevFiles => prevFiles.filter(f => (f.Id || f.id) !== fileId));
      toast.info(`${fileToRemove.Name || fileToRemove.name} removed`);
    } catch (error) {
      console.error("Error removing file:", error);
      toast.error("Failed to remove file");
    }
  }, [files]);

const handleClearAll = useCallback(async () => {
    try {
      // Clean up all preview URLs
      files.forEach(file => {
        if (file.previewUrl || file.preview_url_c) {
          URL.revokeObjectURL(file.previewUrl || file.preview_url_c);
        }
      });
      
      // Clear from database
      await uploadService.clearHistory();
      
      setFiles([]);
      toast.info("All files cleared");
    } catch (error) {
      console.error("Error clearing files:", error);
      toast.error("Failed to clear all files");
    }
  }, [files]);

const handleRetryError = useCallback(async (fileId) => {
    const file = files.find(f => (f.Id || f.id) === fileId);
    if (!file || (file.status_c || file.status) !== "error") return;

    try {
      setFiles(prevFiles => 
        prevFiles.map(f => 
          (f.Id || f.id) === fileId 
            ? { 
                ...f, 
                status: "uploading", 
                status_c: "uploading",
                progress: 0,
                progress_c: 0, 
                uploadedBytes: 0,
                uploaded_bytes_c: 0,
                error: null,
                error_c: null 
              }
            : f
        )
      );

      const result = await uploadService.uploadFile(file.file, (progressData) => {
        setFiles(prevFiles => 
          prevFiles.map(f => 
            (f.Id || f.id) === fileId 
              ? { 
                  ...f, 
                  progress: progressData.progress,
                  progress_c: progressData.progress,
                  uploadedBytes: progressData.uploadedBytes,
                  uploaded_bytes_c: progressData.uploadedBytes,
                  status: progressData.status,
                  status_c: progressData.status
                }
              : f
          )
        );
      });
      
      setFiles(prevFiles => 
        prevFiles.map(f => 
          (f.Id || f.id) === fileId 
            ? { ...f, Id: result.recordId, uploadedAt: Date.now(), uploaded_at_c: Date.now() }
            : f
        )
      );
      
      toast.success(`${file.Name || file.name} uploaded successfully!`);
    } catch (err) {
      console.error(`Retry failed for ${file.Name || file.name}:`, err);
      setFiles(prevFiles => 
        prevFiles.map(f => 
          (f.Id || f.id) === fileId 
            ? { 
                ...f, 
                status: "error",
                status_c: "error",
                error: err.message || "Upload failed",
                error_c: err.message || "Upload failed"
              }
            : f
        )
      );
      toast.error(`Retry failed for ${file.Name || file.name}: ${err.message}`);
    }
  }, [files]);

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
    uploading: files.filter(f => (f.status_c || f.status) === "uploading").length,
    completed: files.filter(f => (f.status_c || f.status) === "success").length,
    failed: files.filter(f => (f.status_c || f.status) === "error").length,
    queued: files.filter(f => (f.status_c || f.status) === "queued").length
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
        <Empty />
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
files.filter(f => (f.status_c || f.status) === "error").forEach(f => {
                    handleRetryError(f.Id || f.id);
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
                key={file.Id || file.id}
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