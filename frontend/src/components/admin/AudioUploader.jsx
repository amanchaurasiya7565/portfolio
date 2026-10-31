import { useState, useRef } from "react";
import { uploadAudio } from "../../services/uploadService";

export default function AudioUploader({
  label = "Personal Intro Audio",
  value = "",
  onChange,
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const audioPlayerRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/") && !file.name.match(/\.(mp3|wav|m4a|ogg|webm)$/i)) {
      setError("Please select a valid audio file (.mp3, .wav, .m4a, .ogg).");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const uploaded = await uploadAudio(file);
      if (uploaded?.url) {
        onChange(uploaded.url);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to upload audio. Try again or paste direct audio URL."
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    onChange("");
  };

  return (
    <div className="admin-audio-uploader">
      <div className="uploader-header">
        <label className="uploader-label">
          {label}
        </label>
        <span className="uploader-hint">
          (Plays in AI Assistant intro)
        </span>
      </div>

      <p className="admin-field-help" style={{ marginBottom: "12px" }}>
        Record a personal welcome message or upload an audio intro (.mp3, .wav, .m4a).
      </p>

      {error && (
        <div className="admin-alert admin-alert-error" style={{ marginBottom: "12px", padding: "8px 12px" }}>
          <span>⚠ {error}</span>
        </div>
      )}

      {value ? (
        <div className="audio-preview-box">
          <div className="audio-player-wrapper">
            <audio
              ref={audioPlayerRef}
              src={value}
              controls
              className="custom-audio-element"
              preload="metadata"
            >
              Your browser does not support the audio element.
            </audio>
          </div>

          <div className="audio-actions">
            <button
              type="button"
              className="admin-secondary-button remove-btn"
              onClick={handleRemove}
              title="Remove Audio"
            >
              ✕ Remove Audio
            </button>
            <button
              type="button"
              className="admin-secondary-button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Replace Audio"}
            </button>
          </div>
        </div>
      ) : (
        <div className="audio-empty-box">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,.mp3,.wav,.m4a,.ogg,.webm"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="audio-file-input"
          />

          <button
            type="button"
            className="admin-primary-button audio-upload-trigger"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <span className="btn-spinner" /> Uploading Audio...
              </>
            ) : (
              <>
                <span>🎙️ Upload Personal Voice Intro</span>
              </>
            )}
          </button>

          <div className="url-fallback-row">
            <span className="or-divider">or paste direct audio link:</span>
            <input
              type="url"
              placeholder="https://example.com/my-intro.mp3"
              value={value}
              onChange={(e) => onChange(e.target.value.trim())}
              className="admin-input-compact"
            />
          </div>
        </div>
      )}
    </div>
  );
}
