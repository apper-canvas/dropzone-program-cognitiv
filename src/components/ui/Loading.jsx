import React from "react";

const Loading = () => {
  return (
    <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="animate-spin h-16 w-16 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <div className="absolute inset-0 h-16 w-16 border-4 border-accent/20 rounded-full mx-auto"></div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">Loading Files</h3>
          <p className="text-gray-600">Preparing your upload environment...</p>
        </div>
        {/* Skeleton loading for file cards */}
        <div className="space-y-3 mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-2 bg-gray-200 rounded w-full"></div>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;