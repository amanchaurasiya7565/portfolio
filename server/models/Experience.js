import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    location: String,

    startDate: String,
    endDate: String,

    current: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      trim: true,
    },

    technologies: [String],

    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Experience", experienceSchema);