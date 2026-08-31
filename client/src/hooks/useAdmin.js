import { useQuery } from "@tanstack/react-query";
import { admin as adminApi } from "../api/endpoints.js";

const unwrap = (res) => res?.data;

// Admin overview stats (entity counts, unread messages, recent activity)
export const useAdminStats = () =>
  useQuery({ queryKey: ["admin-stats"], queryFn: adminApi.stats, select: unwrap });

// Contact-message feed used by the header notification bell
export const useAdminMessages = (limit = 8) =>
  useQuery({
    queryKey: ["admin-messages", limit],
    queryFn: () => adminApi.messages.list({ limit }),
    select: unwrap,
  });