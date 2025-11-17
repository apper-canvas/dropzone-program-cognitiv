import uploadSettings from "@/services/mockData/uploadSettings.json";
import uploadHistory from "@/services/mockData/uploadHistory.json";

class UploadService {
  constructor() {
    this.settings = { ...uploadSettings };
    this.history = [...uploadHistory];
  }

  // Add realistic delay to simulate network requests
  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get upload settings
  async getUploadSettings() {
    await this.delay();
    return { ...this.settings };
  }

  // Update upload settings
  async updateUploadSettings(newSettings) {
    await this.delay();
    this.settings = { ...this.settings, ...newSettings };
    return { ...this.settings };
  }

  // Get upload history
  async getUploadHistory() {
    await this.delay();
    return [...this.history].sort((a, b) => (b.uploadedAt || 0) - (a.uploadedAt || 0));
  }

  // Get upload by id
  async getUploadById(id) {
    await this.delay();
    const upload = this.history.find(item => item.Id === parseInt(id));
    if (!upload) {
      throw new Error(`Upload with id ${id} not found`);
    }
    return { ...upload };
  }

  // Add new upload to history
  async addUpload(uploadData) {
    await this.delay();
    const maxId = Math.max(0, ...this.history.map(item => item.Id));
    const newUpload = {
      Id: maxId + 1,
      name: uploadData.name,
      size: uploadData.size,
      type: uploadData.type,
      status: uploadData.status || "queued",
      progress: uploadData.progress || 0,
      uploadedBytes: uploadData.uploadedBytes || 0,
      previewUrl: uploadData.previewUrl || null,
      error: uploadData.error || null,
      uploadedAt: uploadData.uploadedAt || null,
      uploadDuration: uploadData.uploadDuration || null
    };
    this.history.push(newUpload);
    return { ...newUpload };
  }

  // Update upload status
  async updateUpload(id, updateData) {
    await this.delay();
    const index = this.history.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Upload with id ${id} not found`);
    }
    this.history[index] = { ...this.history[index], ...updateData };
    return { ...this.history[index] };
  }

  // Delete upload from history
  async deleteUpload(id) {
    await this.delay();
    const index = this.history.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Upload with id ${id} not found`);
    }
    const deleted = this.history[index];
    this.history.splice(index, 1);
    return { ...deleted };
  }

  // Clear upload history
  async clearHistory() {
    await this.delay();
    this.history.length = 0;
    return true;
  }

  // Simulate file upload with progress
  async uploadFile(file, onProgress) {
    const startTime = Date.now();
    const totalSteps = 10;
    const stepDelay = Math.max(100, Math.min(500, file.size / 10000)); // Dynamic delay based on file size
    
    try {
      for (let step = 0; step <= totalSteps; step++) {
        await this.delay(stepDelay);
        
        const progress = (step / totalSteps) * 100;
        const uploadedBytes = Math.floor((progress / 100) * file.size);
        
        if (onProgress) {
          onProgress({
            progress,
            uploadedBytes,
            totalBytes: file.size,
            status: progress === 100 ? "success" : "uploading"
          });
        }
        
        // Simulate random network errors (5% chance)
        if (step < totalSteps && Math.random() < 0.05) {
          throw new Error("Network connection interrupted");
        }
        
        // Simulate file too large error
        if (file.size > this.settings.maxFileSize) {
          throw new Error(`File size exceeds maximum limit of ${Math.round(this.settings.maxFileSize / 1024 / 1024)}MB`);
        }
      }
      
      const uploadDuration = Date.now() - startTime;
      
      // Add to history
      await this.addUpload({
        name: file.name,
        size: file.size,
        type: file.type,
        status: "success",
        progress: 100,
        uploadedBytes: file.size,
        uploadedAt: Date.now(),
        uploadDuration
      });
      
      return {
        success: true,
        uploadDuration,
        url: `https://cdn.example.com/uploads/${file.name}`
      };
      
    } catch (error) {
      // Add failed upload to history
      await this.addUpload({
        name: file.name,
        size: file.size,
        type: file.type,
        status: "error",
        progress: 0,
        uploadedBytes: 0,
        error: error.message,
        uploadedAt: null,
        uploadDuration: null
      });
      
      throw error;
    }
  }

  // Validate file before upload
  validateFile(file) {
    const errors = [];
    
    // Check file size
    if (file.size > this.settings.maxFileSize) {
      errors.push(`File "${file.name}" is too large. Maximum size is ${Math.round(this.settings.maxFileSize / 1024 / 1024)}MB.`);
    }
    
    // Check file type
    if (this.settings.acceptedTypes.length > 0) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      const mimeType = file.type;
      
      const isAccepted = this.settings.acceptedTypes.some(type => {
        if (type.startsWith(".")) {
          return type.slice(1).toLowerCase() === fileExtension;
        }
        if (type.includes("*")) {
          return mimeType.startsWith(type.split("*")[0]);
        }
        return mimeType === type;
      });
      
      if (!isAccepted) {
        errors.push(`File "${file.name}" type is not supported.`);
      }
    }
    
    return errors;
  }

  // Get upload statistics
  async getUploadStats() {
    await this.delay();
    const stats = {
      total: this.history.length,
      successful: this.history.filter(h => h.status === "success").length,
      failed: this.history.filter(h => h.status === "error").length,
      totalSize: this.history.reduce((sum, h) => sum + (h.uploadedBytes || 0), 0),
      averageUploadTime: 0
    };
    
    const successfulUploads = this.history.filter(h => h.status === "success" && h.uploadDuration);
    if (successfulUploads.length > 0) {
      stats.averageUploadTime = Math.round(
        successfulUploads.reduce((sum, h) => sum + h.uploadDuration, 0) / successfulUploads.length
      );
    }
    
    return stats;
  }
}

export const uploadService = new UploadService();