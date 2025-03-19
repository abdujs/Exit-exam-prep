import axios from 'axios';

// File upload service
export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('resource_type', 'raw'); // Ensure the resource type is set to raw

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const apiEndpoint = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

    const response = await axios.post(apiEndpoint, formData);

    if (!response.data.secure_url) {
      throw new Error('File upload failed: secure_url not returned');
    }

    console.log('File uploaded to Cloudinary:', response.data.secure_url);
    return response.data.secure_url; // Return the uploaded file's URL
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    throw error;
  }
};

// File deletion service
export const deleteFile = async (fileURL) => {
  try {
    // Extract the public ID from the file URL
    const publicId = fileURL.split('/').pop().split('.')[0]; // Extract filename without extension
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const apiEndpoint = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload`;

    // Use the public ID to delete the file
    await axios.delete(`${apiEndpoint}/${publicId}`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_CLOUDINARY_API_KEY}`, // Ensure API key is set
      },
    });

    console.log('File deleted from Cloudinary:', fileURL);
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw error;
  }
};
