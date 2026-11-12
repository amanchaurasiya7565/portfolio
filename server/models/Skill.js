import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },

    level: {
      type: Number,
      min: 0,
      max: 100,
      default: 70,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Skill", skillSchema);