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
      setError("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image file size must be smaller than 5 MB.");
      return;
    }

    try {
      setUploading(true);
      const image = await uploadImage(file);
      onChange(image.url);
    } catch (err) {
      setError(
        err.response?.data?.message || "Image upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="admin-image-uploader">
      <label className="admin-field-label">{label}</label>

      {value && (
        <div className="admin-image-preview-wrapper">
          <img src={value} alt="Preview" className="admin-image-preview-img" />
          <button
            type="button"
            onClick={handleRemove}
            className="admin-image-remove-btn"
            title="Remove image"
          >
            ✕ Remove
          </button>
        </div>
      )}

      <div className="upload-controls-row">
        <label className="admin-upload-button">
          {uploading ? (
            <>
              <span className="spinner-small" /> Uploading...
            </>
          ) : (
            <>🖼️ {value ? "Replace Image" : "Choose Image File"}</>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            hidden
          />
        </label>

        <small className="admin-upload-hint">
          JPG, PNG, WebP • Max 5 MB
        </small>
      </div>

      {error && (
        <span className="admin-upload-error">
          ⚠ {error}
        </span>
      )}
    </div>
  );
}