import { useEffect, useState } from "react";
import api from "../services/api";

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


export default function Home() {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [certifications, setCertifications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        setError("");

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

        setProfile(profileRes.data);
        setSkills(profileRes.data ? skillsRes.data : []);
        setProjects(projectsRes.data.projects || []);
        setEducation(educationRes.data);
        setExperience(experienceRes.data);
        setAchievements(achievementsRes.data);
        setCertifications(certificationsRes.data);

      } catch (error) {
        console.error("Failed to load portfolio:", error);

        setError(
          error.response?.data?.message ||
          error.message ||
          "Failed to load portfolio"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  if (loading) {
    return <div className="loading">Loading portfolio...</div>;
  }

  if (error) {
    return (
      <div className="loading">
        <h2>Unable to load portfolio</h2>
        <p>{error}</p>
        <p>Make sure the backend server is running on port 5000.</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="loading">
        Profile data not found.
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main>
        <Hero profile={profile} />
        <About profile={profile} />
        <Reveal>
          <Skills skills={skills} />
          </Reveal>
        <Projects projects={projects} />
        <Education education={education} />
        <Experience experience={experience} />
        <Achievements achievements={achievements} />
        <Certifications certifications={certifications} />
        <Resume resumeUrl={profile?.resumeUrl} />
        <Contact profile={profile} />
      </main>

      <Footer profile={profile} />
    </>
  );
}