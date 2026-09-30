import { useState } from "react";
import { uploadResume } from "../../services/resumeService";

export default function ResumeUploader({
  value,
  onChange,
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (file.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume must be smaller than 5 MB.");
      return;
    }

    try {
      setUploading(true);

      const resume = await uploadResume(file);

      onChange(resume.url);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Resume upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-resume-uploader">
      <label>Resume PDF</label>

      {value && (
        <div className="admin-resume-current">
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Current Resume
          </a>
        </div>
      )}

      <label className="admin-upload-button">
        {uploading
          ? "Uploading..."
          : "Choose Resume PDF"}

        <input
          type="file"
          accept="application/pdf"
          onChange={handleUpload}
          disabled={uploading}
          hidden
        />
      </label>

      <small>
        PDF only • Maximum 5 MB
      </small>

      {error && (
        <span className="admin-upload-error">
          {error}
        </span>
      )}
    </div>
  );
}