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

  // Distributions for the admin dashboard charts.
  const allProjects = await prisma.project.findMany({
    select: { category: true, published: true, featured: true },
  });

  const projectsByCategoryMap = new Map<string, number>();
  for (const p of allProjects) {
    const key = p.category?.trim() || "Uncategorized";
    projectsByCategoryMap.set(key, (projectsByCategoryMap.get(key) ?? 0) + 1);
  }
  const projectsByCategory = [...projectsByCategoryMap.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const publishedCount = allProjects.filter((p) => p.published).length;
  const draftCount = allProjects.length - publishedCount;
  const featuredCount = allProjects.filter(
    (p) => p.published && p.featured,
  ).length;

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
    charts: {
      projectsByCategory,
      projectsByStatus: [
        { name: "Published", value: publishedCount },
        { name: "Draft", value: draftCount },
      ],
      projectsFeatured: [
        { name: "Featured", value: featuredCount },
        { name: "Standard", value: publishedCount - featuredCount },
      ],
      messagesRead: {
        read: totalMessages - unreadMessages,
        unread: unreadMessages,
      },
    },
    visibility,
    recentMessages,
  });
}
