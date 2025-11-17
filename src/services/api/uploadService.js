import { getApperClient } from "@/services/apperClient";

class UploadService {
  constructor() {
    this.apperClient = null;
    this.initClient();
  }

  initClient() {
    this.apperClient = getApperClient();
  }

  // Add realistic delay to simulate network requests
  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get upload settings from database
  async getUploadSettings() {
    try {
      if (!this.apperClient) this.initClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "auto_compress_c"}},
          {"field": {"Name": "chunk_size_c"}},
          {"field": {"Name": "chunked_upload_c"}},
          {"field": {"Name": "compression_quality_c"}},
          {"field": {"Name": "max_concurrent_uploads_c"}},
          {"field": {"Name": "max_file_size_c"}},
          {"field": {"Name": "retry_attempts_c"}},
          {"field": {"Name": "timeout_c"}},
          {"field": {"Name": "accepted_types_c"}}
        ],
        pagingInfo: { limit: 1, offset: 0 }
      };

      const response = await this.apperClient.fetchRecords('uploadsettings_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // If no settings exist, create default
      if (!response.data || response.data.length === 0) {
        return await this.createDefaultSettings();
      }

      const settings = response.data[0];
      
      // Transform database format to application format
      return {
        Id: settings.Id,
        autoCompress: settings.auto_compress_c || false,
        chunkSize: settings.chunk_size_c || 1048576,
        chunkedUpload: settings.chunked_upload_c || false,
        compressionQuality: settings.compression_quality_c || 0.8,
        maxConcurrentUploads: settings.max_concurrent_uploads_c || 3,
        maxFileSize: settings.max_file_size_c || 104857600,
        retryAttempts: settings.retry_attempts_c || 3,
        timeout: settings.timeout_c || 30000,
        acceptedTypes: settings.accepted_types_c ? settings.accepted_types_c.split(',') : ["image/jpeg", "image/png", "application/pdf", "text/plain"]
      };
    } catch (error) {
      console.error("Error fetching upload settings:", error);
      throw error;
    }
  }

  // Create default settings if none exist
  async createDefaultSettings() {
    try {
      const defaultSettings = {
        Name: "Default Upload Settings",
        auto_compress_c: false,
        chunk_size_c: 1048576,
        chunked_upload_c: false,
        compression_quality_c: 0.8,
        max_concurrent_uploads_c: 3,
        max_file_size_c: 104857600,
        retry_attempts_c: 3,
        timeout_c: 30000,
        accepted_types_c: "image/jpeg,image/png,application/pdf,text/plain"
      };

      const params = {
        records: [defaultSettings]
      };

      const response = await this.apperClient.createRecord('uploadsettings_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

// Check if we have results and valid data
      if (!response.results || response.results.length === 0) {
        throw new Error('No results returned from create operation');
      }

      const result = response.results[0];
      if (!result.success) {
        const errorMessage = result.message || 'Failed to create default settings';
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      if (!result.data) {
        throw new Error('No data returned from successful create operation');
      }

      return {
        Id: result.data.Id,
        autoCompress: false,
        chunkSize: 1048576,
        chunkedUpload: false,
        compressionQuality: 0.8,
        maxConcurrentUploads: 3,
        maxFileSize: 104857600,
        retryAttempts: 3,
        timeout: 30000,
        acceptedTypes: ["image/jpeg", "image/png", "application/pdf", "text/plain"]
      };
    } catch (error) {
      console.error("Error creating default settings:", error);
      throw error;
    }
  }

  // Update upload settings
  async updateUploadSettings(newSettings) {
    try {
      if (!this.apperClient) this.initClient();

      const updateData = {
        Id: newSettings.Id,
        auto_compress_c: newSettings.autoCompress,
        chunk_size_c: newSettings.chunkSize,
        chunked_upload_c: newSettings.chunkedUpload,
        compression_quality_c: newSettings.compressionQuality,
        max_concurrent_uploads_c: newSettings.maxConcurrentUploads,
        max_file_size_c: newSettings.maxFileSize,
        retry_attempts_c: newSettings.retryAttempts,
        timeout_c: newSettings.timeout,
        accepted_types_c: newSettings.acceptedTypes ? newSettings.acceptedTypes.join(',') : ""
      };

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord('uploadsettings_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return newSettings;
    } catch (error) {
      console.error("Error updating upload settings:", error);
      throw error;
    }
  }

  // Get upload history from database
  async getUploadHistory() {
    try {
      if (!this.apperClient) this.initClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "progress_c"}},
          {"field": {"Name": "uploaded_bytes_c"}},
          {"field": {"Name": "preview_url_c"}},
          {"field": {"Name": "error_c"}},
          {"field": {"Name": "uploaded_at_c"}},
          {"field": {"Name": "upload_duration_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await this.apperClient.fetchRecords('uploadhistory_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database format to application format
      return (response.data || []).map(item => ({
        Id: item.Id,
        name: item.Name,
        size: item.size_c,
        type: item.type_c,
        status: item.status_c,
        progress: item.progress_c,
        uploadedBytes: item.uploaded_bytes_c,
        previewUrl: item.preview_url_c,
        error: item.error_c,
        uploadedAt: item.uploaded_at_c ? new Date(item.uploaded_at_c).getTime() : null,
        uploadDuration: item.upload_duration_c
      }));
    } catch (error) {
      console.error("Error fetching upload history:", error);
      throw error;
    }
  }

  // Get upload by id
  async getUploadById(id) {
    try {
      if (!this.apperClient) this.initClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "progress_c"}},
          {"field": {"Name": "uploaded_bytes_c"}},
          {"field": {"Name": "preview_url_c"}},
          {"field": {"Name": "error_c"}},
          {"field": {"Name": "uploaded_at_c"}},
          {"field": {"Name": "upload_duration_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById('uploadhistory_c', parseInt(id), params);
      
      if (!response.success || !response.data) {
        throw new Error(`Upload with id ${id} not found`);
      }

      const item = response.data;
      return {
        Id: item.Id,
        name: item.Name,
        size: item.size_c,
        type: item.type_c,
        status: item.status_c,
        progress: item.progress_c,
        uploadedBytes: item.uploaded_bytes_c,
        previewUrl: item.preview_url_c,
        error: item.error_c,
        uploadedAt: item.uploaded_at_c ? new Date(item.uploaded_at_c).getTime() : null,
        uploadDuration: item.upload_duration_c
      };
    } catch (error) {
      console.error("Error fetching upload by id:", error);
      throw error;
    }
  }

  // Add new upload to history
  async addUpload(uploadData) {
    try {
      if (!this.apperClient) this.initClient();

      const recordData = {
        Name: uploadData.name,
        size_c: uploadData.size,
        type_c: uploadData.type,
        status_c: uploadData.status || "queued",
        progress_c: uploadData.progress || 0,
        uploaded_bytes_c: uploadData.uploadedBytes || 0,
        preview_url_c: uploadData.previewUrl || null,
        error_c: uploadData.error || null,
        uploaded_at_c: uploadData.uploadedAt ? new Date(uploadData.uploadedAt).toISOString() : null,
        upload_duration_c: uploadData.uploadDuration || null
      };

      const params = {
        records: [recordData]
      };

      const response = await this.apperClient.createRecord('uploadhistory_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const created = response.results[0].data;
      return {
        Id: created.Id,
        name: created.Name,
        size: created.size_c,
        type: created.type_c,
        status: created.status_c,
        progress: created.progress_c,
        uploadedBytes: created.uploaded_bytes_c,
        previewUrl: created.preview_url_c,
        error: created.error_c,
        uploadedAt: created.uploaded_at_c ? new Date(created.uploaded_at_c).getTime() : null,
        uploadDuration: created.upload_duration_c
      };
    } catch (error) {
      console.error("Error adding upload:", error);
      throw error;
    }
  }

  // Update upload status
  async updateUpload(id, updateData) {
    try {
      if (!this.apperClient) this.initClient();

      const recordData = {
        Id: parseInt(id)
      };

      // Only include fields that have values
      if (updateData.status !== undefined) recordData.status_c = updateData.status;
      if (updateData.progress !== undefined) recordData.progress_c = updateData.progress;
      if (updateData.uploadedBytes !== undefined) recordData.uploaded_bytes_c = updateData.uploadedBytes;
      if (updateData.error !== undefined) recordData.error_c = updateData.error;
      if (updateData.uploadedAt !== undefined) {
        recordData.uploaded_at_c = updateData.uploadedAt ? new Date(updateData.uploadedAt).toISOString() : null;
      }
      if (updateData.uploadDuration !== undefined) recordData.upload_duration_c = updateData.uploadDuration;

      const params = {
        records: [recordData]
      };

      const response = await this.apperClient.updateRecord('uploadhistory_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const updated = response.results[0].data;
      return {
        Id: updated.Id,
        name: updated.Name,
        size: updated.size_c,
        type: updated.type_c,
        status: updated.status_c,
        progress: updated.progress_c,
        uploadedBytes: updated.uploaded_bytes_c,
        previewUrl: updated.preview_url_c,
        error: updated.error_c,
        uploadedAt: updated.uploaded_at_c ? new Date(updated.uploaded_at_c).getTime() : null,
        uploadDuration: updated.upload_duration_c
      };
    } catch (error) {
      console.error("Error updating upload:", error);
      throw error;
    }
  }

  // Delete upload from history
  async deleteUpload(id) {
    try {
      if (!this.apperClient) this.initClient();

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord('uploadhistory_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting upload:", error);
      throw error;
    }
  }

  // Clear upload history
  async clearHistory() {
    try {
      if (!this.apperClient) this.initClient();
      
      // First get all records
      const historyResponse = await this.apperClient.fetchRecords('uploadhistory_c', {
        fields: [{"field": {"Name": "Id"}}]
      });

      if (!historyResponse.success) {
        throw new Error(historyResponse.message);
      }

      if (!historyResponse.data || historyResponse.data.length === 0) {
        return true;
      }

      // Delete all records
      const recordIds = historyResponse.data.map(item => item.Id);
      const params = {
        RecordIds: recordIds
      };

      const response = await this.apperClient.deleteRecord('uploadhistory_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      console.error("Error clearing history:", error);
      throw error;
    }
  }

  // Simulate file upload with progress and save to database
  async uploadFile(file, onProgress) {
    const startTime = Date.now();
    const totalSteps = 10;
    const stepDelay = Math.max(100, Math.min(500, file.size / 10000));
    
    let uploadRecord = null;
    
    try {
      // Create initial record
      uploadRecord = await this.addUpload({
        name: file.name,
        size: file.size,
        type: file.type,
        status: "uploading",
        progress: 0,
        uploadedBytes: 0,
        uploadedAt: null,
        uploadDuration: null
      });

      for (let step = 0; step <= totalSteps; step++) {
        await this.delay(stepDelay);
        
        const progress = (step / totalSteps) * 100;
        const uploadedBytes = Math.floor((progress / 100) * file.size);
        
        // Update database record
        await this.updateUpload(uploadRecord.Id, {
          progress,
          uploadedBytes,
          status: progress === 100 ? "success" : "uploading"
        });

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
      }
      
      const uploadDuration = Date.now() - startTime;
      
      // Final update with completion data
      await this.updateUpload(uploadRecord.Id, {
        status: "success",
        progress: 100,
        uploadedBytes: file.size,
        uploadedAt: Date.now(),
        uploadDuration
      });
      
      return {
        success: true,
        uploadDuration,
        url: `https://cdn.example.com/uploads/${file.name}`,
        recordId: uploadRecord.Id
      };
      
    } catch (error) {
      // Update record with error status
      if (uploadRecord) {
        await this.updateUpload(uploadRecord.Id, {
          status: "error",
          error: error.message,
          progress: 0,
          uploadedBytes: 0
        });
      }
      
      throw error;
    }
  }

  // Validate file before upload
  validateFile(file, settings) {
    const errors = [];
    
    // Check file size
    if (file.size > settings.maxFileSize) {
      errors.push(`File "${file.name}" is too large. Maximum size is ${Math.round(settings.maxFileSize / 1024 / 1024)}MB.`);
    }
    
    // Check file type
    if (settings.acceptedTypes.length > 0) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      const mimeType = file.type;
      
      const isAccepted = settings.acceptedTypes.some(type => {
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
    try {
      const history = await this.getUploadHistory();
      
      const stats = {
        total: history.length,
        successful: history.filter(h => h.status === "success").length,
        failed: history.filter(h => h.status === "error").length,
        totalSize: history.reduce((sum, h) => sum + (h.uploadedBytes || 0), 0),
        averageUploadTime: 0
      };
      
      const successfulUploads = history.filter(h => h.status === "success" && h.uploadDuration);
      if (successfulUploads.length > 0) {
        stats.averageUploadTime = Math.round(
          successfulUploads.reduce((sum, h) => sum + h.uploadDuration, 0) / successfulUploads.length
        );
      }
      
      return stats;
    } catch (error) {
      console.error("Error getting upload stats:", error);
      throw error;
    }
  }
}

export const uploadService = new UploadService();