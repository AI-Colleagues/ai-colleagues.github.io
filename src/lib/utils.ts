import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Get the base path from Astro config (e.g., '/astro-genai-startup-theme' or '/')
const BASE_PATH = import.meta.env.BASE_URL || '/';

/**
 * Prepends the configured base path to internal URLs for static hosting.
 */
export function withBase(path: string): string {
  // Handle hash-only links (e.g., '#features')
  if (path.startsWith('#')) {
    return path;
  }

  // Handle absolute URLs (external links)
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Remove trailing slash from base and leading slash from path, then combine
  const base = BASE_PATH.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${base}${cleanPath}`;
}
