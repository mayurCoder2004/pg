import dotenv from "dotenv";
dotenv.config(); 

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Debug: Log Cloudinary config (remove in production)
console.log('Cloudinary config at runtime:', cloudinary.config());

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = file.mimetype.startsWith("video") ? "pg_videos" : "pg_photos";
    return {
      folder: folder,
      resource_type: file.mimetype.startsWith("video") ? "video" : "image",
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },

});

export { cloudinary, storage };
