import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadsDir = './uploads';
const deviceImagesDir = './uploads/devices';
const profileImagesDir = './uploads/profiles';
const documentsDir = './uploads/documents';

[uploadsDir, deviceImagesDir, profileImagesDir, documentsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage for different types of uploads
const deviceImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, deviceImagesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const baseName = `device-${req.user?.id || 'unknown'}-${uniqueSuffix}${extension}`;
    cb(null, baseName);
  }
});

const profileImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileImagesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const baseName = `profile-${req.user?.id || 'unknown'}-${uniqueSuffix}${extension}`;
    cb(null, baseName);
  }
});

const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, documentsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const baseName = `document-${req.user?.id || 'unknown'}-${uniqueSuffix}${extension}`;
    cb(null, baseName);
  }
});

// File filter functions
const imageFileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  
  const extension = path.extname(file.originalname).toLowerCase();
  
  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(extension)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
  }
};

const documentFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/png'
  ];
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png'];
  
  const extension = path.extname(file.originalname).toLowerCase();
  
  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(extension)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, TXT, and image files are allowed'), false);
  }
};

// Configure multer instances
export const uploadDeviceImages = multer({
  storage: deviceImageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files per upload
  }
});

export const uploadProfileImage = multer({
  storage: profileImageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Single file only
  }
});

export const uploadDocuments = multer({
  storage: documentStorage,
  fileFilter: documentFileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
    files: 3 // Maximum 3 files per upload
  }
});

// Memory storage for temporary processing
export const uploadToMemory = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1
  }
});

// Error handling middleware
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: "File too large. Maximum size allowed is 10MB for images, 20MB for documents.",
          error: "FILE_TOO_LARGE"
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          message: "Too many files. Maximum allowed varies by endpoint.",
          error: "TOO_MANY_FILES"
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: "Unexpected file field name.",
          error: "UNEXPECTED_FILE"
        });
      default:
        return res.status(400).json({
          success: false,
          message: "Upload error occurred.",
          error: error.code
        });
    }
  } else if (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "File upload failed",
      error: "UPLOAD_ERROR"
    });
  }
  next();
};

// Helper function to get file URL
export const getFileUrl = (filename, type = 'device') => {
  if (!filename) return null;
  
  const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
  return `${baseUrl}/uploads/${type}s/${filename}`;
};

// Helper function to delete file
export const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Helper function to validate image dimensions (optional)
export const validateImageDimensions = async (filePath, minWidth = 200, minHeight = 200, maxWidth = 4000, maxHeight = 4000) => {
  try {
    // This is a placeholder - in a real implementation, you'd use a library like 'sharp' or 'jimp'
    // For now, we'll just return true
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

// Compression helper (placeholder for future implementation)
export const compressImage = async (inputPath, outputPath, quality = 80) => {
  try {
    // Placeholder for image compression using sharp or similar library
    // For now, just copy the file
    fs.copyFileSync(inputPath, outputPath);
    return { success: true, path: outputPath };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default {
  uploadDeviceImages,
  uploadProfileImage,
  uploadDocuments,
  uploadToMemory,
  handleUploadError,
  getFileUrl,
  deleteFile,
  validateImageDimensions,
  compressImage
};