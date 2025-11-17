import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import ProgressBar from "./ProgressBar";
import Button from "@/components/atoms/Button";

const FileCard = ({ 
  file, 
  onRemove,
  showRemove = true 
}) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return "Image";
    if (type.startsWith("video/")) return "Video";
    if (type.startsWith("audio/")) return "Music";
    if (type.includes("pdf")) return "FileText";
    if (type.includes("word") || type.includes("document")) return "FileText";
    if (type.includes("sheet") || type.includes("excel")) return "FileSpreadsheet";
    if (type.includes("presentation") || type.includes("powerpoint")) return "FilePresentation";
    if (type.includes("zip") || type.includes("rar")) return "Archive";
    return "File";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "uploading":
        return <ApperIcon name="Loader2" className="w-5 h-5 text-primary animate-spin" />;
      case "success":
        return <ApperIcon name="CheckCircle" className="w-5 h-5 text-success animate-bounce-in" />;
      case "error":
        return <ApperIcon name="XCircle" className="w-5 h-5 text-error" />;
      default:
        return <ApperIcon name="Clock" className="w-5 h-5 text-secondary" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "uploading":
        return "Uploading...";
      case "success":
        return "Completed";
      case "error":
        return "Failed";
      default:
        return "Queued";
    }
  };

  const statusClasses = {
    queued: "status-queued",
    uploading: "status-uploading", 
    success: "status-success",
    error: "status-error"
  };

return (
    <div className={cn(
      "file-card bg-white rounded-lg p-4 shadow-sm border-l-4 transition-all duration-200",
      statusClasses[file.status_c || file.status],
      (file.status_c || file.status) === "success" && "file-card success",
      (file.status_c || file.status) === "error" && "file-card error"
    )}>
      <div className="flex items-start space-x-4">
        {/* File Icon */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
<ApperIcon 
              name={getFileIcon(file.type_c || file.type)} 
              className="w-5 h-5 text-primary" 
            />
          </div>
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900 truncate pr-2">
{file.Name || file.name}
            </h4>
            {showRemove && (
              <Button
                variant="ghost"
                size="sm"
                icon="X"
onClick={() => onRemove(file.Id || file.id)}
                className="flex-shrink-0 text-gray-400 hover:text-error"
                aria-label={`Remove ${file.name}`}
              />
            )}
          </div>

          <div className="flex items-center space-x-4 text-xs text-gray-500">
<span>{formatFileSize(file.size_c || file.size)}</span>
            <span>•</span>
            <span className="capitalize">{(file.type_c || file.type).split("/")[0] || "File"}</span>
          </div>

          {/* Progress Bar */}
{((file.status_c || file.status) === "uploading" || ((file.status_c || file.status) === "success" && (file.progress_c || file.progress) === 100)) && (
            <ProgressBar
              progress={file.progress_c || file.progress}
              size="sm"
              showPercentage={false}
              variant={(file.status_c || file.status) === "success" ? "success" : "primary"}
              animated={(file.status_c || file.status) === "uploading"}
            />
          )}

          {/* Upload Stats */}
{(file.status_c || file.status) === "uploading" && (
            <div className="text-xs text-gray-500">
              {formatFileSize(file.uploaded_bytes_c || file.uploadedBytes)} of {formatFileSize(file.size_c || file.size)} uploaded
            </div>
          )}

{/* Error Message */}
          {(file.status_c || file.status) === "error" && (file.error_c || file.error) && (
            <div className="text-xs text-error bg-red-50 px-2 py-1 rounded">
              {file.error_c || file.error}
            </div>
          )}

{/* Upload Time */}
          {(file.status_c || file.status) === "success" && (file.uploaded_at_c || file.uploadedAt) && (
            <div className="text-xs text-gray-500">
              Uploaded {new Date(file.uploaded_at_c || file.uploadedAt).toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Status Icon */}
<div className="flex-shrink-0 status-icon">
          {getStatusIcon(file.status_c || file.status)}
        </div>
      </div>

      {/* Image Preview */}
{(file.preview_url_c || file.previewUrl) && (file.type_c || file.type).startsWith("image/") && (
        <div className="mt-3 pl-14">
          <img
            src={file.preview_url_c || file.previewUrl}
            alt={file.Name || file.name}
            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
          />
        </div>
      )}
    </div>
  );
};

export default FileCard;