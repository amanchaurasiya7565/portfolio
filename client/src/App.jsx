import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./components/admin/AdminDashboard";
import ProjectManager from "./components/admin/ProjectManager";
import ProfileManager from "./pages/admin/ProfileManager";
import SkillsManager from "./pages/admin/SkillsManager";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import NotFound from "./pages/NotFound";
import { Navigate } from "react-router-dom";
import EducationManager from "./pages/admin/EducationManager";
import ExperienceManager from "./pages/admin/ExperienceManager";
import AchievementsManager from "./pages/admin/AchievementsManager";
import CertificationsManager from "./pages/admin/CertificationsManager";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/admin/login"
          element={<Login />}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/admin"
            element={<AdminLayout />}
          >
            <Route index element={<Navigate to="dashboard" replace />} />

            <Route
              path="dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="profile"
              element={<ProfileManager />}
            />

            <Route
              path="projects"
              element={<ProjectManager />}
            />

            <Route
              path="skills"
              element={<SkillsManager />}
            />
            <Route path="education" element={<EducationManager />} />
            <Route path="experience" element={<ExperienceManager />} />
            <Route path="achievements" element={<AchievementsManager />} />
            <Route path="certifications" element={<CertificationsManager />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;