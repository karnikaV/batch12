export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (fileType: string): string => {
  const type = fileType.toLowerCase();
  
  if (type.includes('pdf')) {
    return 'pdf';
  } else if (type.includes('word') || type.includes('doc')) {
    return 'doc';
  } else if (type.includes('sheet') || type.includes('excel') || type.includes('xls')) {
    return 'xls';
  } else if (type.includes('image') || type.includes('jpg') || type.includes('png') || type.includes('jpeg')) {
    return 'img';
  } else if (type.includes('video')) {
    return 'video';
  } else if (type.includes('audio')) {
    return 'audio';
  } else if (type.includes('zip') || type.includes('archive') || type.includes('compress')) {
    return 'zip';
  } else {
    return 'file';
  }
};

export const isImageFile = (fileType: string): boolean => {
  const type = fileType.toLowerCase();
  return type.includes('image') || type.includes('jpg') || type.includes('png') || type.includes('jpeg');
};