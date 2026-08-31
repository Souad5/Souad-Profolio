import { z } from "zod";

const idParam = z.object({ id: z.coerce.number().int().positive() });

const stringArray = z.array(z.string()).default([]);
const jsonArray = z.array(z.unknown()).default([]);

// ---- Auth ----
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

// ---- Site settings ----
export const siteSettingsSchema = z.object({
  name: z.string().default("Md Souad Al Kabir"),
  title: z.string().default("MERN Stack Developer"),
  shortBio: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  profileImage: z.string().optional(),
  resumeUrl: z.string().optional(),
  availability: z.string().optional(),
  heroGreeting: z.string().optional(),
  heroHeading: z.string().optional(),
  heroHighlight: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroDescription: z.string().optional(),
  heroPrimaryCta: z.string().optional(),
  heroSecondaryCta: z.string().optional(),
  heroEnabled: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  seoOgImage: z.string().optional(),
  seoAuthor: z.string().optional(),
  seoCanonicalUrl: z.string().optional(),
});

export const socialLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
  icon: z.string().default("FaGithub"),
  order: z.number().int().default(0),
  enabled: z.boolean().default(true),
});

export const socialLinkUpdateSchema = socialLinkSchema.partial();

// ---- About ----
export const aboutSchema = z.object({
  heading: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  focusPoints: jsonArray.optional(),
  skillTags: stringArray.optional(),
  highlights: jsonArray.optional(),
  enabled: z.boolean().optional(),
  order: z.number().int().optional(),
});

// ---- Skills ----
export const skillCategorySchema = z.object({
  name: z.string().min(1),
  order: z.number().int().default(0),
  enabled: z.boolean().default(true),
});

export const skillSchema = z.object({
  name: z.string().min(1),
  level: z.number().int().min(0).max(100).default(0),
  icon: z.string().default("FaStar"),
  order: z.number().int().default(0),
  enabled: z.boolean().default(true),
  categoryId: z.number().int().positive(),
});

// ---- Experience ----
export const experienceSchema = z.object({
  company: z.string().min(1),
  position: z.string().min(1),
  employmentType: z.string().default("Full-time"),
  location: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
  technologies: stringArray.optional(),
  logo: z.string().optional(),
  order: z.number().int().default(0),
  enabled: z.boolean().default(true),
});

// ---- Education ----
export const educationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  result: z.string().nullable().optional(),
  image: z.string().optional(),
  startYear: z.string().nullable().optional(),
  endYear: z.string().nullable().optional(),
  order: z.number().int().default(0),
  enabled: z.boolean().default(true),
});

// ---- Projects ----
export const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  gallery: jsonArray.optional(),
  technologies: stringArray.optional(),
  category: z.string().optional(),
  liveUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  challenges: z.string().nullable().optional(),
  improvements: z.string().nullable().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order: z.number().int().default(0),
});

// ---- Services ----
export const serviceSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  icon: z.string().default("FaCode"),
  order: z.number().int().default(0),
  enabled: z.boolean().default(true),
});

// ---- Testimonials ----
export const testimonialSchema = z.object({
  name: z.string().min(1),
  role: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  content: z.string().min(1),
  avatar: z.string().optional(),
  rating: z.number().int().min(0).max(5).default(5),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  enabled: z.boolean().default(true),
});

// ---- Certifications ----
export const certificationSchema = z.object({
  title: z.string().min(1),
  issuer: z.string().min(1),
  year: z.string().nullable().optional(),
  link: z.string().nullable().optional(),
  image: z.string().optional(),
  order: z.number().int().default(0),
  enabled: z.boolean().default(true),
});

// ---- Achievements ----
export const achievementSchema = z.object({
  title: z.string().min(1),
  detail: z.string().optional(),
  icon: z.string().default("FaTrophy"),
  order: z.number().int().default(0),
  enabled: z.boolean().default(true),
});

// ---- Navigation ----
export const navigationItemSchema = z.object({
  label: z.string().min(1),
  target: z.string().min(1),
  order: z.number().int().default(0),
  enabled: z.boolean().default(true),
});

// ---- Contact ----
export const contactMessageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

// ---- Section visibility ----
export const sectionVisibilitySchema = z.object({
  key: z.string().min(1),
  label: z.string().optional(),
  enabled: z.boolean().optional(),
  order: z.number().int().optional(),
});

// ---- Media ----
export const mediaAssetSchema = z.object({
  url: z.string().min(1),
  filename: z.string(),
  mimeType: z.string(),
  size: z.number().int(),
});

export { idParam };
