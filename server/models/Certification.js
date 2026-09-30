import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    issuer: {
      type: String,
      trim: true,
    },

    issueDate: String,

    credentialId: String,

    credentialUrl: String,

    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "Certification",
  certificationSchema
);