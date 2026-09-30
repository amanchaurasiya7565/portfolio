import { useState } from "react";
import { uploadImage } from "../../services/uploadService";

export default function ImageUploader({
  value,
  onChange,
  label = "Image",
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      return;
    }

    try {
      setUploading(true);

      const image = await uploadImage(file);

      onChange(image.url);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Image upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-image-uploader">
      <label>{label}</label>

      {value && (
        <div className="admin-image-preview">
          <img src={value} alt="Preview" />
        </div>
      )}

      <label className="admin-upload-button">
        {uploading ? "Uploading..." : "Choose Image"}

        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          hidden
        />
      </label>

      <small>
        JPG, PNG, WebP • Maximum 5 MB
      </small>

      {error && (
        <span className="admin-upload-error">
          {error}
        </span>
      )}
    </div>
  );
}