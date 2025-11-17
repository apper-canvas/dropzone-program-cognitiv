import React from "react";
import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 rounded-xl">
      <div className="text-center space-y-6 max-w-md px-6">
        <div className="relative">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center shadow-lg">
            <ApperIcon name="AlertTriangle" className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
            <ApperIcon name="X" className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-gray-800">Upload Error</h3>
          <p className="text-gray-600 leading-relaxed">{message}</p>
          <div className="bg-red-100 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            <ApperIcon name="Info" className="w-4 h-4 inline mr-2" />
            Please check your files and try again
          </div>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-accent px-6 py-3 rounded-lg text-white font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <ApperIcon name="RotateCcw" className="w-5 h-5" />
            <span>Try Again</span>
          </button>
        )}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Check file formats and sizes</p>
          <p>• Ensure stable internet connection</p>
          <p>• Try uploading fewer files at once</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorView;