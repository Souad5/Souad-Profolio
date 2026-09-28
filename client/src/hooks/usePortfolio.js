import { useQuery } from "@tanstack/react-query";
import {
  fetchSiteSettings,
  fetchSeo,
  fetchNavigation,
  fetchSections,
  fetchAbout,
  fetchSkills,
  fetchExperience,
  fetchEducation,
  fetchProjects,
  fetchServices,
  fetchTestimonials,
  fetchCertifications,
  fetchAchievements,
} from "../api/endpoints.js";

const unwrap = (res) => res?.data ?? res;

export const useSiteSettings = () =>
  useQuery({ queryKey: ["site-settings"], queryFn: fetchSiteSettings, select: unwrap });

export const useSeo = () =>
  useQuery({ queryKey: ["seo"], queryFn: fetchSeo, select: unwrap });

export const useNavigation = () =>
  useQuery({ queryKey: ["navigation"], queryFn: fetchNavigation, select: unwrap });

export const useSections = () =>
  useQuery({ queryKey: ["sections"], queryFn: fetchSections, select: unwrap });

export const useAbout = () =>
  useQuery({ queryKey: ["about"], queryFn: fetchAbout, select: unwrap });

export const useSkills = () =>
  useQuery({ queryKey: ["skills"], queryFn: fetchSkills, select: unwrap });

export const useExperience = () =>
  useQuery({ queryKey: ["experience"], queryFn: fetchExperience, select: unwrap });

export const useEducation = () =>
  useQuery({ queryKey: ["education"], queryFn: fetchEducation, select: unwrap });

export const useProjects = () =>
  useQuery({
    queryKey: ["projects"],
    queryFn: () => fetchProjects({ limit: 500 }),
    select: (res) => unwrap(res)?.items ?? [],
  });

export const useServices = () =>
  useQuery({ queryKey: ["services"], queryFn: fetchServices, select: unwrap });

export const useTestimonials = () =>
  useQuery({ queryKey: ["testimonials"], queryFn: fetchTestimonials, select: unwrap });

export const useCertifications = () =>
  useQuery({ queryKey: ["certifications"], queryFn: fetchCertifications, select: unwrap });

export const useAchievements = () =>
  useQuery({ queryKey: ["achievements"], queryFn: fetchAchievements, select: unwrap });
