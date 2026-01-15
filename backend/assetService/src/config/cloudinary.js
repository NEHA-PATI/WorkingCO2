const cloudinary = require('cloudinary').v2;
const config = require('./env');

// Check if Cloudinary is configured
const isCloudinaryConfigured = !!(
  config.cloudinary.cloudName && 
  config.cloudinary.apiKey && 
  config.cloudinary.apiSecret
);

// Configure Cloudinary
if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure: true
  });
  console.log('✅ Cloudinary configured successfully');
} else {
  console.warn('⚠️  Cloudinary credentials not configured.');
  console.warn('   Image uploads will use mock data until configured.');
  console.warn('   Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env');
}

// Upload image to Cloudinary
const uploadImage = async (fileBuffer, folder = 'co2plus-assets') => {
  // Return mock data if Cloudinary not configured
  if (!isCloudinaryConfigured) {
    console.warn('⚠️  Using mock image upload (Cloudinary not configured)');
    return {
      public_id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url: `https://via.placeholder.com/400x300?text=Image+Pending`,
      width: 400,
      height: 300,
      format: 'jpg'
    };
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve({
            public_id: result.public_id,
            url: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format
          });
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  // Skip if Cloudinary not configured or mock image
  if (!isCloudinaryConfigured || publicId.startsWith('mock_')) {
    console.warn('⚠️  Skipping delete (Cloudinary not configured or mock image)');
    return { result: 'ok', mock: true };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

// Get image URL
const getImageUrl = (publicId, transformations = {}) => {
  // Return placeholder for mock images
  if (!isCloudinaryConfigured || publicId.startsWith('mock_')) {
    return `https://via.placeholder.com/400x300?text=Image+${publicId}`;
  }

  return cloudinary.url(publicId, {
    secure: true,
    ...transformations
  });
};

module.exports = {
  cloudinary,
  uploadImage,
  deleteImage,
  getImageUrl,
  isConfigured: isCloudinaryConfigured
};
