import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import App from "../App";
import Home from "../Pages/Home";
import NotFound from "../Pages/NotFound";
import LoginPage from "../Pages/admin/LoginPage";
import AdminLayout from "../components/admin/AdminLayout";
import ProtectedRoute from "../components/admin/ProtectedRoute";

const DashboardPage = lazy(() => import("../Pages/admin/DashboardPage"));
const SettingsPage = lazy(() => import("../Pages/admin/SettingsPage"));
const ProjectsPage = lazy(() => import("../Pages/admin/ProjectsPage"));
const SkillsPage = lazy(() => import("../Pages/admin/SkillsPage"));
const ExperiencePage = lazy(() => import("../Pages/admin/ExperiencePage"));
const EducationPage = lazy(() => import("../Pages/admin/EducationPage"));
const ServicesPage = lazy(() => import("../Pages/admin/ServicesPage"));
const TestimonialsPage = lazy(() => import("../Pages/admin/TestimonialsPage"));
const CertificationsPage = lazy(
  () => import("../Pages/admin/CertificationsPage"),
);
const AchievementsPage = lazy(() => import("../Pages/admin/AchievementsPage"));
const NavigationPage = lazy(() => import("../Pages/admin/NavigationPage"));
const MessagesPage = lazy(() => import("../Pages/admin/MessagesPage"));
const PreferencesPage = lazy(() => import("../Pages/admin/PreferencesPage"));

function withSuspense(node) {
  return <Suspense fallback={<AdminFallback />}>{node}</Suspense>;
}

// eslint-disable-next-line react-refresh/only-export-components
function AdminFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [{ index: true, element: <Home /> }],
  },
  {
    path: "/admin/login",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: [
      { index: true, element: withSuspense(<DashboardPage />) },
      { path: "settings", element: withSuspense(<SettingsPage />) },
      { path: "projects", element: withSuspense(<ProjectsPage />) },
      { path: "skills", element: withSuspense(<SkillsPage />) },
      { path: "experience", element: withSuspense(<ExperiencePage />) },
      { path: "education", element: withSuspense(<EducationPage />) },
      { path: "services", element: withSuspense(<ServicesPage />) },
      { path: "testimonials", element: withSuspense(<TestimonialsPage />) },
      { path: "certifications", element: withSuspense(<CertificationsPage />) },
      { path: "achievements", element: withSuspense(<AchievementsPage />) },
      { path: "navigation", element: withSuspense(<NavigationPage />) },
      { path: "messages", element: withSuspense(<MessagesPage />) },
      { path: "preferences", element: withSuspense(<PreferencesPage />) },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
