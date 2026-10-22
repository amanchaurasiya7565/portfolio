import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";
import fs from "fs";
import path from "path";
import Profile from "../models/Profile.js";

const getPossibleResumePaths = () => [
  path.resolve("uploads", "resumes", "resume.pdf"),
  path.resolve("server", "uploads", "resumes", "resume.pdf"),
  path.resolve("..", "server", "uploads", "resumes", "resume.pdf"),
  path.join(process.cwd(), "uploads", "resumes", "resume.pdf"),
  path.join(process.cwd(), "server", "uploads", "resumes", "resume.pdf"),
];

const getPrimaryResumePath = () => {
  // If cwd is inside server, save to uploads/resumes/resume.pdf; otherwise server/uploads/resumes/resume.pdf
  if (process.cwd().endsWith("server")) {
    return path.resolve("uploads", "resumes", "resume.pdf");
  }
  return path.resolve("server", "uploads", "resumes", "resume.pdf");
};

const uploadResumeToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    // Note: Do NOT add .pdf in Cloudinary raw public_id as Cloudinary's default ACL blocks .pdf delivery with 401
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "portfolio/resume",
        resource_type: "raw",
        public_id: `resume_${Date.now()}`,
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

    const isPdf =
      req.file.mimetype === "application/pdf" ||
      req.file.originalname?.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return res.status(400).json({
        message: "Only PDF resumes are allowed.",
      });
    }

    // 1. Save local copy for instant, bulletproof local streaming to all possible candidate locations
    const primaryPath = getPrimaryResumePath();
    try {
      const primaryDir = path.dirname(primaryPath);
      if (!fs.existsSync(primaryDir)) {
        fs.mkdirSync(primaryDir, { recursive: true });
      }
      fs.writeFileSync(primaryPath, req.file.buffer);

      // Also sync to sibling candidate paths if applicable
      for (const candidate of getPossibleResumePaths()) {
        try {
          const dir = path.dirname(candidate);
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(candidate, req.file.buffer);
        } catch {}
      }
    } catch (fsErr) {
      console.warn("Could not write local resume copy:", fsErr.message);
    }

    // 2. Upload to Cloudinary as raw storage backup
    let secureUrl = "";
    let publicId = "";
    try {
      const result = await uploadResumeToCloudinary(req.file.buffer);
      secureUrl = result.secure_url;
      publicId = result.public_id;
    } catch (cloudErr) {
      console.warn("Cloudinary backup upload failed, relying on local copy:", cloudErr.message);
    }

    // Automatically update the profile record so the resume is persisted immediately
    let profile = await Profile.findOne();
    if (profile) {
      if (secureUrl) profile.resumeUrl = secureUrl;
      await profile.save();
    } else {
      profile = await Profile.create({
        name: "Aman Chaurasiya",
        resumeUrl: secureUrl || "/uploads/resumes/resume.pdf",
      });
    }

    res.status(201).json({
      message: "Resume uploaded successfully.",
      resume: {
        url: secureUrl || "/uploads/resumes/resume.pdf",
        publicId,
      },
      profile,
    });
  } catch (error) {
    console.error("Resume upload failed:", error);

    res.status(500).json({
      message: "Resume upload failed.",
      error: error.message,
    });
  }
};

/**
 * Helper to get PDF buffer either from local disk or remote URL
 */
const getPdfBuffer = async () => {
  // Check local files first
  for (const candidate of getPossibleResumePaths()) {
    try {
      if (fs.existsSync(candidate)) {
        const buffer = fs.readFileSync(candidate);
        if (buffer && buffer.length > 0) {
          return buffer;
        }
      }
    } catch (e) {
      console.warn("Error reading local resume candidate:", e.message);
    }
  }

  // Fallback to profile URL in MongoDB
  const profile = await Profile.findOne();
  if (profile?.resumeUrl) {
    try {
      const response = await fetch(profile.resumeUrl, { signal: AbortSignal.timeout(15000) });
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        // Save to local cache
        const primaryPath = getPrimaryResumePath();
        try {
          const dir = path.dirname(primaryPath);
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(primaryPath, buffer);
        } catch {}
        return buffer;
      }
    } catch (e) {
      console.error("Error fetching remote resume:", e.message);
    }
  }

  return null;
};

/**
 * Stream the PDF inline so the browser displays it instead of forcing a download.
 */
export const getResumeView = async (req, res) => {
  try {
    const buffer = await getPdfBuffer();
    if (!buffer) {
      return res.status(404).json({ message: "Resume file not found. Please upload your resume in the admin panel." });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="Aman_Chaurasiya_Resume.pdf"');
    res.setHeader("Content-Length", buffer.length);
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.end(buffer);
  } catch (error) {
    console.error("Failed to stream inline resume:", error);
    res.status(500).json({ message: "Failed to render resume.", error: error.message });
  }
};

/**
 * Send the PDF with attachment header and proper personalized filename.
 */
export const getResumeDownload = async (req, res) => {
  try {
    const buffer = await getPdfBuffer();
    if (!buffer) {
      return res.status(404).json({ message: "Resume file not found. Please upload your resume in the admin panel." });
    }

    const profile = await Profile.findOne();
    const safeName = (profile?.name || "Aman_Chaurasiya")
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    const downloadFilename = `${safeName}_Resume.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${downloadFilename}"`);
    res.setHeader("Content-Length", buffer.length);
    return res.end(buffer);
  } catch (error) {
    console.error("Failed to download resume:", error);
    res.status(500).json({ message: "Failed to download resume.", error: error.message });
  }
};