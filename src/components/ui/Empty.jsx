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
</div>
      </div>
    </div>
  );
};

export default Empty;