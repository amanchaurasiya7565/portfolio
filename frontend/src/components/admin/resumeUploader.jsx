import { useState } from "react";
import { uploadResume } from "../../services/resumeService";

export default function ResumeUploader({
  value,
  onChange,
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setSuccess("");

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a valid PDF file.");
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
      setSuccess("Resume uploaded and synced successfully!");
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
      <label className="admin-field-label">Resume PDF Document</label>

      {value && (
        <div className="admin-resume-current">
          <div className="resume-current-info">
            <span className="file-badge">PDF Active</span>
            <span className="file-url-preview">{value}</span>
          </div>
          <div className="resume-test-actions">
            <a
              href="/api/resume/view"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-link-button view"
            >
              👁️ View Resume
            </a>
            <a
              href="/api/resume/download"
              className="admin-link-button download"
            >
              ⬇️ Download Test
            </a>
          </div>
        </div>
      )}

      <div className="upload-controls-row">
        <label className="admin-upload-button">
          {uploading ? (
            <>
              <span className="spinner-small" /> Uploading PDF...
            </>
          ) : (
            <>📄 {value ? "Replace Resume PDF" : "Upload Resume PDF"}</>
          )}

          <input
            type="file"
            accept="application/pdf"
            onChange={handleUpload}
            disabled={uploading}
            hidden
          />
        </label>

        <small className="admin-upload-hint">
          PDF format only • Max 5 MB • Automatically stored & viewable inline
        </small>
      </div>

      {success && (
        <span className="admin-upload-success">
          ✓ {success}
        </span>
      )}

      {error && (
        <span className="admin-upload-error">
          ⚠ {error}
        </span>
      )}
    </div>
  );
}