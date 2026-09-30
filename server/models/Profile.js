import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    headline: {
      type: String,
      trim: true,
    },

    bio: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    github: {
      type: String,
      trim: true,
    },

    linkedin: {
      type: String,
      trim: true,
    },

    profileImage: {
      type: String,
      trim: true,
    },

    resumeUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);