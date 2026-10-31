import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import {
  getInitialPortfolioData,
  cachePortfolioData,
} from "../data/defaultPortfolio";

import Navbar from "../components/portfolio/Navbar";
import Hero from "../components/portfolio/Hero";
import About from "../components/portfolio/About";
import Skills from "../components/portfolio/Skills";
import Projects from "../components/portfolio/Projects";
import Education from "../components/portfolio/Education";
import Experience from "../components/portfolio/Experience";
import Achievements from "../components/portfolio/Achievements";
import Certifications from "../components/portfolio/Certifications";
import Contact from "../components/portfolio/Contact";
import Footer from "../components/portfolio/Footer";
import Reveal from "../components/portfolio/Reveal";
import Resume from "../components/portfolio/Resume";

// New 3D, Micro-interactive & AI Intro components
import Background3D from "../components/portfolio/Background3D";
import Card3DEffect from "../components/portfolio/Card3DEffect";
import AiIntro from "../components/portfolio/AiIntro";

export default function Home() {
  // Initialize immediately from cached or default data so the website is instantly accessible
  const initial = getInitialPortfolioData();

  const [profile, setProfile] = useState(initial.profile);
  const [skills, setSkills] = useState(initial.skills);
  const [projects, setProjects] = useState(initial.projects);
  const [education, setEducation] = useState(initial.education);
  const [experience, setExperience] = useState(initial.experience);
  const [achievements, setAchievements] = useState(initial.achievements);
  const [certifications, setCertifications] = useState(initial.certifications);

  const [isOffline, setIsOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchLivePortfolio = useCallback(async (isManual = false) => {
    try {
      if (isManual) setIsSyncing(true);

      // Attempt live fetch with all endpoints
      const [
        profileRes,
        skillsRes,
        projectsRes,
        educationRes,
        experienceRes,
        achievementsRes,
        certificationsRes,
      ] = await Promise.all([
        api.get("/profile"),
        api.get("/skills"),
        api.get("/projects"),
        api.get("/education"),
        api.get("/experience"),
        api.get("/achievements"),
        api.get("/certifications"),
      ]);

      const liveProfile = profileRes.data || initial.profile;
      const liveSkills = Array.isArray(skillsRes.data) ? skillsRes.data : initial.skills;
      const liveProjects = Array.isArray(projectsRes.data?.projects) ? projectsRes.data.projects : initial.projects;
      const liveEducation = Array.isArray(educationRes.data) ? educationRes.data : initial.education;
      const liveExperience = Array.isArray(experienceRes.data) ? experienceRes.data : [];
      const liveAchievements = Array.isArray(achievementsRes.data) ? achievementsRes.data : [];
      const liveCertifications = Array.isArray(certificationsRes.data) ? certificationsRes.data : [];

      setProfile(liveProfile);
      setSkills(liveSkills);
      setProjects(liveProjects);
      setEducation(liveEducation);
      setExperience(liveExperience);
      setAchievements(liveAchievements);
      setCertifications(liveCertifications);

      // Cache fresh data locally
      cachePortfolioData({
        profile: liveProfile,
        skills: liveSkills,
        projects: liveProjects,
        education: liveEducation,
        experience: liveExperience,
        achievements: liveAchievements,
        certifications: liveCertifications,
      });

      setIsOffline(false);
    } catch (err) {
      console.warn("Backend server offline or unreachable. Using offline/cached data:", err.message);
      // Seamlessly keep displaying cached/default data without blocking visitor
      setIsOffline(true);
    } finally {
      if (isManual) setIsSyncing(false);
    }
  }, [initial]);

  useEffect(() => {
    fetchLivePortfolio(false);
  }, [fetchLivePortfolio]);

  return (
    <>
      {/* 3D Glowing Particle Globe & Floating Geometric Shapes Background */}
      <Background3D />

      {/* Micro-Interactive 3D Cards Controller */}
      <Card3DEffect />

      {/* Offline Status Pill / Indicator */}
      {isOffline && (
        <aside
          className="offline-status-pill"
          role="status"
          aria-live="polite"
        >
          <span className="offline-dot" />
          <span className="offline-text">
            Server Standby • Viewing Cached Portfolio
          </span>
          <button
            type="button"
            onClick={() => fetchLivePortfolio(true)}
            className="offline-retry-btn"
            disabled={isSyncing}
            title="Retry connecting to live server"
          >
            {isSyncing ? "Syncing..." : "↻ Retry Sync"}
          </button>
        </aside>
      )}

      {/* Main Navigation Bar */}
      <Navbar />

      <main id="main-content" style={{ position: "relative", zIndex: 1 }}>
        <Hero profile={profile} />
        <About profile={profile} />
        <Education education={education} />
        <Reveal>
          <Skills skills={skills} />
        </Reveal>
        <Projects projects={projects} />
        <Experience experience={experience} />
        <Achievements achievements={achievements} />
        <Certifications certifications={certifications} />
        <Resume resumeUrl={profile?.resumeUrl} profile={profile} />
        <Contact profile={profile} />
      </main>

      <Footer profile={profile} />

      {/* AI Intro with Holographic Animation, Cancel Button & Bottom-Right Floating Icon */}
      <AiIntro profile={profile} />
    </>
  );
}