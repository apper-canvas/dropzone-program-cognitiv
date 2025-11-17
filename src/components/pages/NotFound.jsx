import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md px-6">
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center shadow-xl">
            <ApperIcon name="FileX" className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-warning to-orange-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">404</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-error to-red-600 bg-clip-text text-transparent">
            Page Not Found
          </h1>
          <p className="text-gray-600 leading-relaxed">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            variant="primary"
            size="lg"
            icon="Home"
            onClick={() => navigate("/")}
            className="w-full sm:w-auto"
          >
            Back to Upload
          </Button>
          
          <div className="text-sm text-gray-500 space-y-2">
            <p className="flex items-center justify-center space-x-2">
              <ApperIcon name="Upload" className="w-4 h-4" />
              <span>Ready to upload your files?</span>
            </p>
            <p className="flex items-center justify-center space-x-2">
              <ApperIcon name="HelpCircle" className="w-4 h-4" />
              <span>Need help? Check our upload guide</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;