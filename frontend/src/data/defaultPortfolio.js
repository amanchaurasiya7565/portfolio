/**
 * Real data filled by Aman Chaurasiya in the portfolio database.
 * Used as the baseline offline fallback whenever the backend server is offline or unreachable.
 * When the server is online, fresh updates are automatically fetched and saved into cache.
 */

export const defaultProfile = {
  _id: "6ad4e1c636bdc00a16a7b972",
  name: "Aman Chaurasiya",
  headline: "Aspiring Software Enginner | B.Tech CSE  Student | C++ & Python  | Full Stack Devlopment | Problem Solver",
  bio: `👋 Hi, I'm a second-year B.Tech Computer Science student passionate about software engineering, problem-solving, and building meaningful digital solutions.
💻 I work with C++, Python, Java, and web development technologies, continuously strengthening my programming skills and exploring new technologies.
🚀 I enjoy turning ideas into practical projects, learning through hands-on experience, and improving my technical and communication skills.
🎯 My goal is to become a skilled software engineer, contribute to impactful projects, and build innovative solutions that solve real-world problems.
✨ Always learning, building, and growing!`,
  location: "Delhi NCR",
  email: "amanchaurasiya7565@gmail.com",
  phone: "7275523611",
  whatsapp: "MnChaurasiya",
  github: "https://github.com/amanchaurasiya7565/",
  linkedin: "https://www.linkedin.com/in/aman-chaurasiya-cs",
  leetcode: "https://leetcode.com/u/Ac_0103/",
  codechef: "https://www.codechef.com/users/aman_ch_13",
  codeforces: "",
  profileImage: "",
  resumeUrl: "https://res.cloudinary.com/zx9lt4ne/raw/upload/v1792946547/portfolio/resume/resume_1792946547035",
  introAudioUrl: "",
};

export const defaultSkills = [
  {
    _id: "6ada56329360667ecff64dfb",
    category: "Frontend",
    name: "HTML ,CSS",
    level: 100,
    order: 0,
  },
  {
    _id: "6ada564d9360667ecff64dfc",
    category: "Frontend",
    name: "Java Script",
    level: 75,
    order: 0,
  },
  {
    _id: "6ada56b09360667ecff64dfd",
    category: "Frontend",
    name: "React.Js",
    level: 40,
    order: 3,
  },
  {
    _id: "6ada56cd9360667ecff64dfe",
    category: "Programming",
    name: "C++",
    level: 50,
    order: 0,
  },
  {
    _id: "6ada56e49360667ecff64dff",
    category: "Programming",
    name: "Python",
    level: 70,
    order: 0,
  },
];

export const defaultProjects = [
  {
    _id: "6ad51074c1977bc683be9fd2",
    title: "E Commerce UI",
    description: `🚀 E-Commerce Website | Frontend Web Development

Developed a responsive e-commerce website using HTML, CSS, and JavaScript to deliver a smooth and user-friendly online shopping experience. The website enables users to explore products, search and filter items, manage their shopping cart, and access integrated payment functionality.

✨ Key Features
- 🛒 Shopping Cart: Add and manage products in the cart.
- 🔍 Product Search & Filters: Find relevant products efficiently.
- 📱 Responsive Design: Provides an adaptable interface across different screen sizes.
- 💳 Payment Integration: Includes payment functionality to support the checkout process.

🛠️ Technologies: HTML5, CSS3, JavaScript

💡 Key Learning: Strengthened my understanding of frontend development, interactive user interfaces, responsive web design, and JavaScript-based functionality while building a complete e-commerce project.

📌 Status: Completed`,
    image: "https://res.cloudinary.com/zx9lt4ne/image/upload/v1792694584/portfolio/dpqzyp0ahtj9smt18ofi.png",
    technologies: ["HTML", "CSS", "Java Script"],
    githubUrl: "https://github.com/amanchaurasiya7565/shopnest.git",
    liveUrl: "https://shopnest-2bb4.onrender.com",
    featured: false,
    order: 1,
  },
];

export const defaultEducation = [
  {
    _id: "6ada52b79360667ecff64dfa",
    degree: "BTech 1st Year",
    institution: "ABES Enginnering College",
    location: "Delhi NCR",
    startYear: "2025",
    endYear: "2026",
    grade: "9.1/10",
    description: "Built a strong foundation in Computer Science and Engineering, developing an understanding of programming fundamentals, computational thinking, and problem-solving. Started exploring programming languages and web development while strengthening analytical skills and building a foundation for advanced software development.",
    order: 0,
  },
];

export const defaultExperience = [];
export const defaultAchievements = [];
export const defaultCertifications = [];

const CACHE_KEY = "aman_portfolio_cached_data_v3";

/**
 * Retrieve cached data or Aman's real default data
 */
export function getInitialPortfolioData() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.profile) {
        return {
          ...parsed,
          isOffline: false,
          isCached: true,
        };
      }
    }
  } catch (err) {
    console.warn("Could not read cached portfolio data:", err);
  }

  return {
    profile: defaultProfile,
    skills: defaultSkills,
    projects: defaultProjects,
    education: defaultEducation,
    experience: defaultExperience,
    achievements: defaultAchievements,
    certifications: defaultCertifications,
    isOffline: false,
    isCached: false,
  };
}

/**
 * Save freshly fetched data into local storage
 */
export function cachePortfolioData(data) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        profile: data.profile,
        skills: data.skills,
        projects: data.projects,
        education: data.education,
        experience: data.experience,
        achievements: data.achievements,
        certifications: data.certifications,
        cachedAt: new Date().toISOString(),
      })
    );
  } catch (err) {
    console.warn("Failed to cache portfolio data:", err);
  }
}
