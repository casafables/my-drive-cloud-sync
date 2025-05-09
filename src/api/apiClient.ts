
import axios from 'axios';

// Create axios instance
export const apiClient = axios.create({
  baseURL: 'https://api.ragastudios.cloud',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      // Exclude auth endpoints from token header
      const isAuthEndpoint = 
        config.url === '/api/login' || 
        config.url === '/api/register';
      
      if (!isAuthEndpoint) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    // Handle other errors
    return Promise.reject(error);
  }
);

// File operations API
export const fileApi = {
  // Get all files and folders
  getAllFiles: () => apiClient.get('/api/files'),
  
  // Get folder details
  getFolder: (folderId?: string) => {
    const url = folderId ? `/api/folder/${folderId}` : '/api/files';
    return apiClient.get(url);
  },
  
  // Create a new folder
  createFolder: (name: string, parentId?: string) => {
    return apiClient.post('/api/folder', { name, parentId: parentId || null });
  },
  
  // Upload a file
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Download a file
  downloadFile: (fileId: string) => {
    return apiClient.get(`/api/download/${fileId}`, {
      responseType: 'blob',
    });
  },
  
  // Get preview URL
  getPreviewUrl: (fileId: string) => {
    return apiClient.get(`/api/preview/${fileId}`);
  },
  
  // Rename file or folder
  rename: (id: string, newName: string) => {
    return apiClient.put(`/api/rename/${id}`, { newName });
  },
};
