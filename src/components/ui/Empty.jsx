import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ onAction }) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
      <div className="text-center space-y-6 max-w-md px-6">
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <ApperIcon name="Upload" className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-success to-green-600 rounded-full flex items-center justify-center animate-bounce">
            <ApperIcon name="Plus" className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Ready to Upload
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Drag and drop your files here or click to browse. We support all common file types with fast, secure uploads.
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Image" className="w-4 h-4 text-primary" />
              <span>Images</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="FileText" className="w-4 h-4 text-primary" />
              <span>Documents</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Video" className="w-4 h-4 text-primary" />
              <span>Videos</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Music" className="w-4 h-4 text-primary" />
              <span>Audio</span>
            </div>
          </div>
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-accent px-8 py-4 rounded-xl text-white font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300 transform"
          >
            <ApperIcon name="Upload" className="w-5 h-5" />
            <span>Select Files</span>
          </button>
        )}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Maximum file size: 100MB</p>
          <p>• Multiple files supported</p>
          <p>• Secure encrypted transfer</p>
        </div>
      </div>
    </div>
  );
};

export default Empty;