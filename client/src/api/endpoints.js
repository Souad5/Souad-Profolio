import { api } from "./client.js";

// ---- Public / shared ----
export const fetchSiteSettings = () => api.get("/site-settings");
export const fetchSeo = () => api.get("/seo");
export const fetchNavigation = () => api.get("/navigation");
export const fetchSections = () => api.get("/sections");
export const fetchAbout = () => api.get("/about");
export const fetchSkills = () => api.get("/skills");
export const fetchExperience = () => api.get("/experience");
export const fetchEducation = () => api.get("/education");
export const fetchProjects = (params = {}) => api.get(`/projects?${new URLSearchParams(params)}`);
export const fetchServices = () => api.get("/services");
export const fetchTestimonials = () => api.get("/testimonials");
export const fetchCertifications = () => api.get("/certifications");
export const fetchAchievements = () => api.get("/achievements");

// ---- Contact ----
export const submitContact = (data) => api.post("/contact", data);

// ---- Auth ----
export const login = (data) => api.post("/auth/login", data);
export const fetchMe = () => api.get("/auth/me", { auth: true });

// ---- Admin CRUD (all require auth) ----
const adminCrud = (resource) => ({
  list: (params = {}) =>
    api.get(`/admin/${resource}?${new URLSearchParams(params)}`, { auth: true }),
  get: (id) => api.get(`/admin/${resource}/${id}`, { auth: true }),
  create: (data) => api.post(`/admin/${resource}`, data, { auth: true }),
  update: (id, data) => api.put(`/admin/${resource}/${id}`, data, { auth: true }),
  remove: (id) => api.delete(`/admin/${resource}/${id}`, { auth: true }),
  reorder: (items) =>
    api.patch(`/admin/${resource}/reorder`, { items }, { auth: true }),
});

export const admin = {
  stats: () => api.get("/admin/stats", { auth: true }),
  skills: adminCrud("skills"),
  skillCategories: adminCrud("skill-categories"),
  experience: adminCrud("experience"),
  education: adminCrud("education"),
  services: adminCrud("services"),
  testimonials: adminCrud("testimonials"),
  certifications: adminCrud("certifications"),
  achievements: adminCrud("achievements"),
  navigation: adminCrud("navigation"),
  about: adminCrud("about"),
  sections: adminCrud("sections"),
  media: adminCrud("media"),
  siteSettings: {
    get: () => api.get("/admin/site-settings", { auth: true }),
    update: (data) => api.put("/admin/site-settings", data, { auth: true }),
    addSocial: (data) => api.post("/admin/social-links", data, { auth: true }),
    updateSocial: (id, data) => api.put(`/admin/social-links/${id}`, data, { auth: true }),
    deleteSocial: (id) => api.delete(`/admin/social-links/${id}`, { auth: true }),
  },
  projects: {
    list: (params = {}) =>
      api.get(`/admin/projects?${new URLSearchParams(params)}`, { auth: true }),
    get: (id) => api.get(`/admin/projects/${id}`, { auth: true }),
    create: (data) => api.post("/admin/projects", data, { auth: true }),
    update: (id, data) => api.put(`/admin/projects/${id}`, data, { auth: true }),
    remove: (id) => api.delete(`/admin/projects/${id}`, { auth: true }),
    duplicate: (id) => api.post(`/admin/projects/${id}/duplicate`, {}, { auth: true }),
  },
  messages: {
    list: (params = {}) =>
      api.get(`/admin/contact-messages?${new URLSearchParams(params)}`, { auth: true }),
    markRead: (id) => api.patch(`/admin/contact-messages/${id}/read`, {}, { auth: true }),
    remove: (id) => api.delete(`/admin/contact-messages/${id}`, { auth: true }),
  },
};
