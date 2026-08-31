import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { ok } from "../utils/handler.js";

export async function getStats(_req: Request, res: Response) {
  const [
    projects,
    featuredProjects,
    skills,
    skillCategories,
    experience,
    education,
    services,
    certifications,
    testimonials,
    achievements,
    unreadMessages,
    totalMessages,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { featured: true, published: true } }),
    prisma.skill.count(),
    prisma.skillCategory.count(),
    prisma.experience.count(),
    prisma.education.count(),
    prisma.service.count(),
    prisma.certification.count(),
    prisma.testimonial.count(),
    prisma.achievement.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.contactMessage.count(),
  ]);

  const visibility = await prisma.sectionVisibility.findMany({ orderBy: { order: "asc" } });

  const recentMessages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return ok(res, {
    stats: {
      projects,
      featuredProjects,
      skills,
      skillCategories,
      experience,
      education,
      services,
      certifications,
      testimonials,
      achievements,
      unreadMessages,
      totalMessages,
    },
    visibility,
    recentMessages,
  });
}
