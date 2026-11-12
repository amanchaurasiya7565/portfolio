import { useState, useEffect, useRef } from "react";

/**
 * AI Intro Guide:
 * 1. Automatic futuristic hologram welcome card on initial visit
 * 2. High-clarity audible speech:
 *    - Plays Aman's personal intro audio (if uploaded in Profile Settings)
 *    - Or uses robust browser SpeechSynthesis personalized to Aman's details
 * 3. Cancel / Dismiss button to terminate the intro immediately
 * 4. Persistent floating icon on the bottom-right corner to re-open anytime
 * 5. Quick interactive action chips for instant navigation
 */
export default function AiIntro({ profile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioMode, setAudioMode] = useState("tts"); // "personal" | "tts"

  // Moveable floating bot state (lower screen area)
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initX: 0, initY: 0, moved: false });

  const audioRef = useRef(null);
  const speechUtteranceRef = useRef(null);

  // Check if personal audio URL is available
  const personalAudioUrl = profile?.introAudioUrl;

  // Drag handlers for movable lower chatbot icon (mouse & touch)
  const handleDragStart = (clientX, clientY) => {
    dragRef.current = {
      startX: clientX,
      startY: clientY,
      initX: position.x,
      initY: position.y,
      moved: false,
    };
    setIsDragging(true);
  };

  const handleDragMove = (clientX, clientY) => {
    if (!dragRef.current) return;
    const dx = clientX - dragRef.current.startX;
    const dy = clientY - dragRef.current.startY;

    if (Math.hypot(dx, dy) > 6) {
      dragRef.current.moved = true;
    }

    // Limit movement within viewport bounds so bot remains on lower side
    const maxLeftMove = -(window.innerWidth - 80);
    const maxRightMove = 10;
    const maxUpMove = -(window.innerHeight * 0.45); // Keep on lower portion
    const maxDownMove = 10;

    const newX = Math.max(maxLeftMove, Math.min(maxRightMove, dragRef.current.initX + dx));
    const newY = Math.max(maxUpMove, Math.min(maxDownMove, dragRef.current.initY + dy));

    setPosition({ x: newX, y: newY });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const onMouseMove = (e) => {
      if (isDragging) {
        handleDragMove(e.clientX, e.clientY);
      }
    };
    const onMouseUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);

  // Pre-initialize personal audio element if URL exists
  useEffect(() => {
    if (personalAudioUrl) {
      const audio = new Audio(personalAudioUrl);
      audio.preload = "auto";

      audio.onplay = () => {
        setIsPlaying(true);
        setAudioMode("personal");
      };

      audio.onpause = () => {
        setIsPlaying(false);
      };

      audio.onended = () => {
        setIsPlaying(false);
      };

      audio.onerror = () => {
        console.warn("Could not play personal audio note, falling back to AI voice synthesis.");
        setAudioMode("tts");
      };

      audioRef.current = audio;

      return () => {
        audio.pause();
        audio.src = "";
      };
    } else {
      audioRef.current = null;
    }
  }, [personalAudioUrl]);

  // Clean stop all audio
  const stopAllAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const handleClose = () => {
    stopAllAudio();
    setIsOpen(false);
    sessionStorage.setItem("aman_ai_intro_dismissed", "true");
  };

  const handleOpen = () => {
    setIsOpen((prev) => {
      if (prev) {
        stopAllAudio();
      }
      return !prev;
    });
  };

  const scrollToSection = (id) => {
    handleClose();
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 200);
  };

  // Build personalized speech script based on Aman's real details
  const getPersonalizedSpeechText = () => {
    return (
      "Hello and welcome! I'm Aman's AI Portfolio Guide. " +
      "Aman Chaurasiya is an aspiring Software Engineer and second-year Computer Science student at ABES Engineering College. " +
      "He specializes in C++, Python, JavaScript, React, and modern full-stack development, with featured projects including his E-Commerce web platform Shopnest. " +
      "Feel free to explore his projects, technical skills, or get in touch directly!"
    );
  };

  // Play / Pause toggle handler
  const toggleAudio = () => {
    if (isPlaying) {
      stopAllAudio();
      return;
    }

    // 1. Try playing personal audio note if configured
    if (personalAudioUrl && audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setAudioMode("personal");
        })
        .catch((err) => {
          console.warn("Personal audio playback blocked or failed:", err);
          playSpeechSynthesis();
        });
      return;
    }

    // 2. Otherwise play browser Text-to-Speech synthesis
    playSpeechSynthesis();
  };

  const playSpeechSynthesis = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Speech synthesis is not supported on this browser.");
      return;
    }

    window.speechSynthesis.cancel(); // Clear any previous queued speech

    const text = getPersonalizedSpeechText();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 1.0; // Max volume
    utterance.rate = 1.02; // Natural conversational pace
    utterance.pitch = 1.0;

    // Pick best natural voice available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        (v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Jenny") || v.name.includes("Zira"))) ||
        v.lang === "en-US"
    ) || voices.find((v) => v.lang.startsWith("en"));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setAudioMode("tts");
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error:", e);
      setIsPlaying(false);
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      {/* =========================================================
          1. AI INTRO MODAL / HOLOGRAM DIALOG
          ========================================================= */}
      {isOpen && (
        <div
          className="ai-intro-overlay"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-intro-title"
        >
          <div
            className="ai-intro-card card-3d"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Status and Cancel Button */}
            <div className="ai-intro-header">
              <div className="ai-status-badge">
                <span className="ai-status-pulse" />
                <span className="ai-status-text">
                  AI ASSISTANT // NEXUS v2.5
                </span>
              </div>

              <div className="ai-header-controls">
                <button
                  type="button"
                  onClick={handleClose}
                  className="ai-close-btn"
                  title="Terminate & Close AI Intro"
                  aria-label="Close AI Intro"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2.2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* AI Hologram Avatar & Info */}
            <div className="ai-avatar-row">
              <div className="ai-avatar-orb">
                <div className={`ai-orb-core ${isPlaying ? "active-pulse" : ""}`}>
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
                    <path d="M18 10a6 6 0 0 1-12 0" />
                    <line x1="12" y1="16" x2="12" y2="22" />
                    <line x1="8" y1="22" x2="16" y2="22" />
                  </svg>
                </div>
                <div className="ai-orb-ring ring-1" />
                <div className="ai-orb-ring ring-2" />
              </div>

              <div className="ai-avatar-info">
                <h3 id="ai-intro-title" className="ai-title">
                  Hello, Visitor! 👋
                </h3>
                <p className="ai-subtitle">
                  I'm <span className="ai-highlight">Aman's AI Co-Pilot</span>. Welcome to his digital ecosystem.
                </p>

                {/* Animated Waveform Equalizer */}
                <div className="ai-waveform" aria-hidden="true">
                  <span className={`wave-bar b1 ${isPlaying ? "playing" : ""}`} />
                  <span className={`wave-bar b2 ${isPlaying ? "playing" : ""}`} />
                  <span className={`wave-bar b3 ${isPlaying ? "playing" : ""}`} />
                  <span className={`wave-bar b4 ${isPlaying ? "playing" : ""}`} />
                  <span className={`wave-bar b5 ${isPlaying ? "playing" : ""}`} />
                </div>
              </div>
            </div>

            {/* Prominent High-Visibility Audio Player Bar */}
            <div className="ai-audio-player-banner">
              <button
                type="button"
                onClick={toggleAudio}
                className={`ai-play-audio-btn ${isPlaying ? "playing" : ""}`}
                title={isPlaying ? "Pause Audio" : "Listen to Audio Introduction"}
                aria-label={isPlaying ? "Pause Audio" : "Listen to Audio Introduction"}
              >
                {isPlaying ? (
                  <>
                    <span className="audio-btn-icon">⏸</span>
                    <span>Pause Audio Intro</span>
                  </>
                ) : (
                  <>
                    <span className="audio-btn-icon">▶</span>
                    <span>Listen to Voice Intro</span>
                  </>
                )}
              </button>

              <div className="ai-audio-meta">
                <span className="audio-mode-pill">
                  {personalAudioUrl && audioMode === "personal"
                    ? "🎙️ Personal Voice Note"
                    : "🤖 AI Voice Guide"}
                </span>
                <span className="audio-status-label">
                  {isPlaying ? "Audio playing loud & clear" : "Click to hear audible intro"}
                </span>
              </div>
            </div>

            {/* AI Speech Bubble Content */}
            <div className="ai-speech-bubble">
              <p>
                <strong>Aman Chaurasiya</strong> is an aspiring Software Engineer and second-year B.Tech CSE student at
                ABES Engineering College. Skilled in <strong>C++</strong>, <strong>Python</strong>, <strong>JavaScript</strong>, and <strong>React.js</strong>,
                he creates responsive web apps and scalable software solutions.
              </p>
              <div className="ai-key-stats">
                <span className="ai-stat-chip">💻 C++ & Python</span>
                <span className="ai-stat-chip">⚡ JavaScript & React</span>
                <span className="ai-stat-chip">🎨 HTML5 & CSS3</span>
                <span className="ai-stat-chip">🎓 ABES Engineering College</span>
              </div>
            </div>

            {/* Quick Action Navigation Chips */}
            <div className="ai-action-buttons">
              <button
                type="button"
                onClick={() => scrollToSection("projects")}
                className="ai-action-btn primary"
              >
                <span>🚀 Explore Projects</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("skills")}
                className="ai-action-btn"
              >
                <span>⚡ Technical Skills</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("resume")}
                className="ai-action-btn"
              >
                <span>📄 View Resume</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("contact")}
                className="ai-action-btn highlight"
              >
                <span>💬 Get in Touch</span>
              </button>
            </div>

            {/* Bottom Footer with explicit Cancel / Terminate Action */}
            <div className="ai-intro-footer">
              <span className="ai-footer-note">Client is 100% offline-ready</span>
              <button
                type="button"
                onClick={handleClose}
                className="ai-dismiss-btn"
              >
                ✕ Cancel / Terminate Intro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          2. PERSISTENT MOVABLE FLOATING BOT ICON ON LOWER SIDE
          ========================================================= */}
      <div
        className="ai-fab-container"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          touchAction: "none",
        }}
      >
        <button
          type="button"
          onClick={() => {
            if (dragRef.current?.moved) return;
            handleOpen();
          }}
          onMouseDown={(e) => {
            handleDragStart(e.clientX, e.clientY);
          }}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            if (touch) {
              handleDragStart(touch.clientX, touch.clientY);
            }
          }}
          onTouchMove={(e) => {
            const touch = e.touches[0];
            if (touch) {
              handleDragMove(touch.clientX, touch.clientY);
            }
          }}
          onTouchEnd={() => {
            handleDragEnd();
          }}
          className={`ai-fab-button ${isOpen ? "active" : ""} ${isDragging ? "dragging" : ""}`}
          aria-label="Open AI Portfolio Assistant (Drag to move)"
          title="AI Assistant (Drag to move on screen)"
        >
          {/* Animated Glow Rings */}
          <span className="ai-fab-pulse" />
          <span className="ai-fab-ring" />

          {/* AI Robot Bot Icon */}
          <div className="ai-fab-icon">
            {isOpen ? (
              <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" fill="none" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              /* High-tech Cute AI Robot Avatar */
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                {/* Antenna */}
                <circle cx="12" cy="2.5" r="1.5" fill="#38bdf8" />
                <path d="M12 4v2" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
                
                {/* Robot Head */}
                <rect x="4" y="6" width="16" height="12" rx="4" fill="currentColor" />
                
                {/* Visor / Eye Screen */}
                <rect x="6.5" y="8.5" width="11" height="5" rx="2" fill="#080811" />
                
                {/* Glowing Eyes */}
                <circle cx="9" cy="11" r="1.3" fill="#38bdf8" />
                <circle cx="15" cy="11" r="1.3" fill="#38bdf8" />
                
                {/* Cheerful Smile */}
                <path d="M9.5 15.5c.8.6 1.7.9 2.5.9s1.7-.3 2.5-.9" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                
                {/* Ear Plugs / Sensors */}
                <rect x="2" y="9.5" width="2" height="5" rx="1" fill="#818cf8" />
                <rect x="20" y="9.5" width="2" height="5" rx="1" fill="#818cf8" />
                
                {/* Neck connector */}
                <rect x="9.5" y="18.5" width="5" height="2.5" rx="1" fill="#818cf8" opacity="0.8" />
              </svg>
            )}
          </div>

          {/* Tooltip Pill */}
          <span className="ai-fab-tooltip">
            {isOpen ? "Close Guide" : "🤖 AI Co-Pilot"}
          </span>
        </button>
      </div>
    </>
  );
}
