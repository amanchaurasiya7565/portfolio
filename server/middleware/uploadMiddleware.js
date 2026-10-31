import multer from "multer";

const storage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed."));
  }
};

const audioFilter = (req, file, cb) => {
  const allowed = [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/x-wav",
    "audio/ogg",
    "audio/m4a",
    "audio/x-m4a",
    "audio/mp4",
    "audio/webm",
    "video/webm",
    "video/mp4",
  ];

  if (file.mimetype.startsWith("audio/") || allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only audio files (mp3, wav, m4a, ogg, webm) are allowed."));
  }
};

export const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const uploadAudioMiddleware = multer({
  storage,
  fileFilter: audioFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max for audio
  },
});

export default upload;