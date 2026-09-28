import { z } from "zod";

const idParam = z.object({
  id: z.coerce.number({ invalid_type_error: "Invalid id" }).int("Invalid id").positive("Invalid id"),
});

/* ------------------------------------------------------------------ */
/* Shared field helpers                                                */
/* ------------------------------------------------------------------ */
// These mirror what the admin forms send: numbers as numbers (or numeric
// strings), "" for cleared text/dates, arrays for tag fields.

const stringArray = z.array(z.string().max(200)).default([]);
const jsonArray = z.array(z.unknown()).default([]);

/** Integer that also accepts numeric strings (e.g. "3" from a <select>). */
const int = () => z.coerce.number().int();

/** Optional text column (non-nullable in the DB): null is treated as "not sent". */
const text = (max = 5000) =>
  z
    .string()
    .max(max)
    .nullish()
    .transform((v) => v ?? undefined);

/** Optional nullable text column: "" and null both clear it. */
const nullableText = (max = 5000) =>
  z
    .string()
    .max(max)
    .nullish()
    .transform((v) => (v === "" ? null : v));

// `z.string().url()` accepts `javascript:` URLs, and these values are rendered
// as href/src on the public site — so restrict the scheme explicitly.
const SAFE_LINK = /^(https?:\/\/|mailto:|tel:|\/(?!\/))/i;
const SAFE_MEDIA = /^(https?:\/\/|\/(?!\/)|data:image\/(png|jpe?g|webp|gif|svg\+xml);base64,)/i;

/** External link: http(s), mailto:, tel: or a site-relative path. "" clears it. */
const link = (msg = "Must be an http(s) URL, mailto:, tel: or a /path") =>
  z
    .string()
    .trim()
    .max(2000)
    .refine((v) => v === "" || SAFE_LINK.test(v), msg)
    .nullish()
    .transform((v) => v ?? undefined);

const nullableLink = () =>
  z
    .string()
    .trim()
    .max(2000)
    .refine((v) => v === "" || SAFE_LINK.test(v), "Must be an http(s) URL or a /path")
    .nullish()
    .transform((v) => (v === "" ? null : v));

/** Image source: http(s) URL, /path, or an inline base64 image. "" clears it. */
const media = () =>
  z
    .string()
    .trim()
    .max(1_500_000)
    .refine((v) => v === "" || SAFE_MEDIA.test(v), "Must be an image URL (http/https) or a /path")
    .nullish()
    .transform((v) => v ?? undefined);

/** Date input value ("YYYY-MM-DD" / ISO); "" and null clear it. */
const optionalDate = z.preprocess(
  (v) => (v === "" ? null : v),
  z.coerce.date({ invalid_type_error: "Invalid date" }).nullable().optional(),
);

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  password: z.string().min(1, "Password is required").max(200),
});

/* ------------------------------------------------------------------ */
/* Site settings                                                       */
/* ------------------------------------------------------------------ */
export const siteSettingsSchema = z.object({
  name: z.string().min(1).max(120).default("Md Souad Al Kabir"),
  title: z.string().max(120).default("MERN Stack Developer"),
  shortBio: text(2000),
  email: z.union([z.literal(""), z.string().trim().email("Invalid email")]).optional(),
  phone: text(50),
  location: text(120),
  profileImage: media(),
  resumeUrl: link(),
  availability: text(120),
  heroGreeting: text(120),
  heroHeading: text(200),
  heroHighlight: text(120),
  heroSubtitle: text(200),
  heroDescription: text(1000),
  heroPrimaryCta: text(60),
  heroSecondaryCta: text(60),
  heroEnabled: z.boolean().optional(),
  heroTags: stringArray.optional(),
  seoTitle: text(200),
  seoDescription: text(500),
  seoKeywords: text(500),
  seoOgImage: media(),
  seoAuthor: text(120),
  seoCanonicalUrl: link("Must be a full http(s) URL"),
});

export const socialLinkSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(60),
  url: z
    .string()
    .trim()
    .min(1, "URL is required")
    .max(2000)
    .refine((v) => SAFE_LINK.test(v), "Must be an http(s) URL, mailto: or tel:"),
  icon: z.string().max(60).default("FaGithub"),
  order: int().default(0),
  enabled: z.boolean().default(true),
});

export const socialLinkUpdateSchema = socialLinkSchema.partial();

/* ------------------------------------------------------------------ */
/* Content entities                                                    */
/* ------------------------------------------------------------------ */
export const aboutSchema = z.object({
  heading: text(120),
  description: text(10000),
  image: media(),
  focusPoints: jsonArray.optional(),
  skillTags: stringArray.optional(),
  highlights: jsonArray.optional(),
  enabled: z.boolean().optional(),
  order: int().optional(),
});

export const skillCategorySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  order: int().default(0),
  enabled: z.boolean().default(true),
});

export const skillSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  level: int().min(0, "Level must be 0–100").max(100, "Level must be 0–100").default(0),
  icon: z.string().max(60).default("FaStar"),
  order: int().default(0),
  enabled: z.boolean().default(true),
  categoryId: int().positive("Pick a category"),
});

export const experienceSchema = z.object({
  company: z.string().trim().min(1, "Company is required").max(120),
  position: z.string().trim().min(1, "Position is required").max(120),
  employmentType: z.string().max(60).default("Full-time"),
  location: text(120),
  startDate: z.coerce.date({ invalid_type_error: "Start date is required" }),
  endDate: optionalDate,
  current: z.boolean().default(false),
  description: z.string().max(10000).default(""),
  highlights: stringArray.optional(),
  technologies: stringArray.optional(),
  logo: media(),
  order: int().default(0),
  enabled: z.boolean().default(true),
});

export const educationSchema = z.object({
  institution: z.string().trim().min(1, "Institution is required").max(200),
  degree: z.string().trim().min(1, "Degree is required").max(200),
  result: nullableText(60),
  image: media(),
  startYear: nullableText(30),
  endYear: nullableText(30),
  order: int().default(0),
  enabled: z.boolean().default(true),
});

export const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(160),
  slug: z
    .string()
    .trim()
    .max(80)
    .regex(/^[a-z0-9-]*$/i, "Slug may only contain letters, numbers and dashes")
    .optional(),
  shortDescription: z.string().max(300).default(""),
  description: z.string().max(10000).default(""),
  thumbnail: media(),
  gallery: z.array(z.string().max(2000).refine((v) => SAFE_MEDIA.test(v), "Invalid image URL")).optional(),
  technologies: stringArray.optional(),
  category: text(60),
  liveUrl: link(),
  githubUrl: link(),
  challenges: nullableText(5000),
  improvements: nullableText(5000),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order: int().default(0),
});

export const serviceSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  description: z.string().max(2000).default(""),
  icon: z.string().max(60).default("FaCode"),
  order: int().default(0),
  enabled: z.boolean().default(true),
});

export const testimonialSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  role: nullableText(120),
  company: nullableText(120),
  content: z.string().trim().min(1, "Content is required").max(3000),
  avatar: media(),
  rating: int().min(0).max(5).default(5),
  featured: z.boolean().default(false),
  order: int().default(0),
  enabled: z.boolean().default(true),
});

export const certificationSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(160),
  issuer: z.string().trim().min(1, "Issuer is required").max(160),
  year: nullableText(30),
  link: nullableLink(),
  image: media(),
  order: int().default(0),
  enabled: z.boolean().default(true),
});

export const achievementSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(160),
  detail: text(1000),
  icon: z.string().max(60).default("FaTrophy"),
  order: int().default(0),
  enabled: z.boolean().default(true),
});

export const navigationItemSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(60),
  target: z
    .string()
    .trim()
    .min(1, "Target is required")
    .max(60)
    .regex(/^[a-z0-9-]+$/i, "Target must be a section id (letters, numbers, dashes)"),
  order: int().default(0),
  enabled: z.boolean().default(true),
});

/* ------------------------------------------------------------------ */
/* Public contact form                                                 */
/* ------------------------------------------------------------------ */
export const contactMessageSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Valid email required").max(200),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1, "Message is required").max(5000, "Message is too long (max 5000 characters)"),
});

/* ------------------------------------------------------------------ */
/* Misc                                                                */
/* ------------------------------------------------------------------ */
export const sectionVisibilitySchema = z.object({
  key: z.string().trim().min(1).max(60),
  label: text(60),
  enabled: z.boolean().optional(),
  order: int().optional(),
});

export const mediaAssetSchema = z.object({
  url: z.string().min(1).refine((v) => SAFE_MEDIA.test(v), "Invalid media URL"),
  filename: z.string().max(255),
  mimeType: z.string().regex(/^(image\/(png|jpeg|webp|gif|svg\+xml)|application\/pdf)$/, "Unsupported file type"),
  size: int().positive().max(5 * 1024 * 1024, "File must be 5 MB or smaller"),
});

export { idParam };
