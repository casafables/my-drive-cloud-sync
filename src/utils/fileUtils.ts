
/**
 * Utility functions for file operations
 */

// Get file extension from filename
export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

// Get file icon based on file type
export const getFileIcon = (filename: string): string => {
  const extension = getFileExtension(filename).toLowerCase();
  
  // Document types
  if (['doc', 'docx', 'txt', 'rtf', 'odt', 'pages'].includes(extension)) {
    return 'file-text';
  }
  
  // Spreadsheets
  if (['xls', 'xlsx', 'csv', 'numbers', 'ods'].includes(extension)) {
    return 'file-text';
  }
  
  // Presentations
  if (['ppt', 'pptx', 'key', 'odp'].includes(extension)) {
    return 'file-text';
  }
  
  // PDFs
  if (extension === 'pdf') {
    return 'file-text';
  }
  
  // Images
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension)) {
    return 'file';
  }
  
  // Audio
  if (['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac'].includes(extension)) {
    return 'file';
  }
  
  // Video
  if (['mp4', 'avi', 'mov', 'wmv', 'mkv', 'flv', 'webm'].includes(extension)) {
    return 'file';
  }
  
  // Archives
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
    return 'file';
  }
  
  // Default icon
  return 'file';
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Download a blob as a file
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// Check if file is an image
export const isImage = (filename: string): boolean => {
  const extension = getFileExtension(filename).toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension);
};

// Check if file is a video
export const isVideo = (filename: string): boolean => {
  const extension = getFileExtension(filename).toLowerCase();
  return ['mp4', 'avi', 'mov', 'wmv', 'mkv', 'flv', 'webm'].includes(extension);
};

// Check if file is a document
export const isDocument = (filename: string): boolean => {
  const extension = getFileExtension(filename).toLowerCase();
  return [
    'doc', 'docx', 'txt', 'rtf', 'odt', 'pages',
    'xls', 'xlsx', 'csv', 'numbers', 'ods',
    'ppt', 'pptx', 'key', 'odp',
    'pdf'
  ].includes(extension);
};
