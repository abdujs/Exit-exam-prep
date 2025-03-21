import axios from 'axios';

const CLOUDINARY_API_BASE = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}`;

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

    if (!response.data.secure_url || !response.data.public_id) {
      throw new Error('File upload failed: secure_url or public_id not returned');
    }

    console.log('File uploaded to Cloudinary:', response.data.secure_url, response.data.public_id);
    return { secureUrl: response.data.secure_url, publicId: response.data.public_id }; // Return both secure_url and public_id
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    throw error;
  }
};

// Delete a file from Cloudinary
export const deleteFile = async (publicId) => {
  try {
    console.log('Attempting to delete file with publicId:', publicId); // Log the publicId
    const apiUrl = `${CLOUDINARY_API_BASE}/resources/image/upload`;

    // Make a DELETE request to Cloudinary
    const response = await axios.delete(apiUrl, {
      params: { public_id: publicId },
      auth: {
        username: import.meta.env.VITE_CLOUDINARY_API_KEY,
        password: import.meta.env.VITE_CLOUDINARY_API_SECRET,
      },
    });

    console.log('Cloudinary response:', response.data); // Log the response from Cloudinary

    if (response.status === 200) {
      console.log('File deleted successfully from Cloudinary:', publicId);
    } else {
      console.error('Failed to delete file from Cloudinary:', response.data);
    }
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw error;
  }
};
