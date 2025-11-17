import React from "react";
import { Outlet } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                <ApperIcon name="Upload" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  DropZone
                </h1>
                <p className="text-xs text-gray-500">File Upload Utility</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Shield" className="w-4 h-4 text-success" />
                  <span>Secure Upload</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Zap" className="w-4 h-4 text-warning" />
                  <span>Fast Transfer</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Check" className="w-4 h-4 text-primary" />
                  <span>100MB Max</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-2 rounded-full text-sm font-medium text-primary border border-primary/20">
              <ApperIcon name="Upload" className="w-4 h-4" />
              <span>File Upload Center</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Upload your files with ease
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Drag and drop your files or click to browse. We support all common file types with fast, secure uploads up to 100MB per file.
            </p>
          </div>

          {/* Content */}
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500">
              © 2024 DropZone. Secure file uploading made simple.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Lock" className="w-4 h-4" />
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Server" className="w-4 h-4" />
                <span>Cloud Storage</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Smartphone" className="w-4 h-4" />
                <span>Mobile Ready</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;