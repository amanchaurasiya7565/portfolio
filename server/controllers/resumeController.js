import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

const uploadResumeToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "portfolio/resume",
        resource_type: "raw",
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

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select a PDF resume.",
      });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({
        message: "Only PDF resumes are allowed.",
      });
    }

    const result = await uploadResumeToCloudinary(req.file.buffer);

    res.status(201).json({
      message: "Resume uploaded successfully.",
      resume: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (error) {
    console.error("Resume upload failed:", error);

    res.status(500).json({
      message: "Resume upload failed.",
      error: error.message,
    });
  }
};