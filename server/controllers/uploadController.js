import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (buffer, folder, resourceType = "image") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    Readable.from(buffer).pipe(stream);
  });
};

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select an image.",
      });
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      "portfolio",
      "image"
    );

    res.status(201).json({
      message: "Image uploaded successfully.",
      image: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      },
    });
  } catch (error) {
    console.error("Image upload failed:", error);

    res.status(500).json({
      message: "Image upload failed.",
    });
  }
};

export const uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select an audio file.",
      });
    }

    // Cloudinary categorizes audio under "video" or "auto"
    const result = await uploadToCloudinary(
      req.file.buffer,
      "portfolio/audio",
      "auto"
    );

    res.status(201).json({
      message: "Audio uploaded successfully.",
      audio: {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        duration: result.duration,
      },
    });
  } catch (error) {
    console.error("Audio upload failed:", error);

    res.status(500).json({
      message: error.message || "Audio upload failed.",
    });
  }
};