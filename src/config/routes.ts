/**
 * Application route paths
 */

export const ROUTES = {
  HOME: "/",
  SLEEP: "/",
  FASTING: "/fasting",
  CAFFEINE: "/caffeine",
  TODO: "/todo",
  BLOG: "/relax",
  SETTINGS: "/settings",
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
  NOT_FOUND: "*",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];
