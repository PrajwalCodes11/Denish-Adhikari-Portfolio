import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs";
import path from "path";

import { siteData } from "@/data/siteData";
import { projectsData } from "@/data/projects";
import { experienceData } from "@/data/experience";
import { skillsData } from "@/data/skills";
import { galleryData } from "@/data/gallery";

const ADMIN_SECRET = process.env.ADMIN_PASSWORD || "denish2026!";
const SESSION_COOKIE = "denish_admin_session";
const SESSION_SALT = "denish_portfolio_salt_2026";

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const expected = crypto
    .createHmac("sha256", SESSION_SALT)
    .update(`${ADMIN_SECRET}:authenticated_admin`)
    .digest("hex");
  return token === expected;
}

export async function GET(request: NextRequest) {
  // Allow fetching current state with strict no-store so client never receives stale cached data
  const response = NextResponse.json({
    siteData,
    projects: projectsData,
    experience: experienceData,
    skills: skillsData,
    gallery: galleryData,
  });
  response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
  return response;
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const { siteData: updatedSiteData, projects, experience, skills, gallery, githubToken: clientToken } = payload;

    if (!updatedSiteData && !projects && !experience && !skills && !gallery) {
      return NextResponse.json({ error: "No valid content payload provided" }, { status: 400 });
    }

    const modifiedFiles: string[] = [];
    const filesToSync: { path: string; content: string }[] = [];

    // 1. Prepare files and serialize
    if (updatedSiteData) {
      const content = `export const siteData = ${JSON.stringify(updatedSiteData, null, 2)};\n`;
      filesToSync.push({ path: "data/siteData.ts", content });
    }

    if (Array.isArray(projects)) {
      const content = `export interface ProjectPhase {
  phaseNumber: string;
  title: string;
  category?: string;
  summary: string;
  keyTasks: string[];
  toolsUsed: string[];
  image?: string;
}

export interface ProjectDrawing {
  title: string;
  description: string;
  type: string;
  image?: string;
  sheetNo?: string;
  scale?: string;
}

export interface ProjectCaseStudy {
  id: string;
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  category: "INFRASTRUCTURE" | "BUILDINGS" | "SURVEYING" | "ACADEMIC";
  location: string;
  firm: string;
  duration: string;
  role: string;
  tools: string[];
  image: string;
  summary: string;
  facts: {
    label: string;
    value: string;
  }[];
  overview: string;
  myRole: string;
  responsibilities: string[];
  technicalApproach: string[];
  challenges: string[];
  solutions: string[];
  outcomes: string[];
  phases?: ProjectPhase[];
  drawings: ProjectDrawing[];
  sitePhotos: {
    caption: string;
    stage: string;
    image?: string;
  }[];
}

export const projectsData: ProjectCaseStudy[] = ${JSON.stringify(projects, null, 2)};\n`;
      filesToSync.push({ path: "data/projects.ts", content });
    }

    if (Array.isArray(experience)) {
      const content = `export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  achievements: string[];
  skills: string[];
}

export const experienceData: ExperienceItem[] = ${JSON.stringify(experience, null, 2)};\n`;
      filesToSync.push({ path: "data/experience.ts", content });
    }

    if (Array.isArray(skills)) {
      const content = `export interface SkillCategory {
  category: string;
  description: string;
  skills: {
    name: string;
    level?: string;
    note: string;
  }[];
}

export const skillsData: SkillCategory[] = ${JSON.stringify(skills, null, 2)};\n`;
      filesToSync.push({ path: "data/skills.ts", content });
    }

    if (Array.isArray(gallery)) {
      const content = `export interface GalleryItem {
  id: string;
  title: string;
  category: "CONSTRUCTION" | "SURVEYING" | "STRUCTURES" | "TESTING";
  location: string;
  date: string;
  caption: string;
  image: string;
  tags: string[];
}

export const galleryData: GalleryItem[] = ${JSON.stringify(gallery, null, 2)};\n`;
      filesToSync.push({ path: "data/gallery.ts", content });
    }

    // 2. Local filesystem write (for local development)
    try {
      const dataDir = path.join(process.cwd(), "data");
      for (const file of filesToSync) {
        fs.writeFileSync(path.join(process.cwd(), file.path), file.content, "utf-8");
        modifiedFiles.push(file.path);
      }
    } catch (fsErr) {
      // In serverless / read-only environment, local disk writes are ignored
      console.warn("Local disk write not supported on serverless host.");
    }

    // 3. GitHub API sync (if GitHub token provided either via UI or env)
    let gitHubSynced = false;
    let gitHubError = null;
    const token = clientToken || process.env.GITHUB_TOKEN || process.env.GITHUB_PAT;
    const repoOwner = process.env.GITHUB_REPO_OWNER || "PrajwalCodes11";
    const repoName = process.env.GITHUB_REPO_NAME || "Denish-Adhikari-Portfolio";

    if (token) {
      try {
        for (const file of filesToSync) {
          // Get current SHA
          const getRes = await fetch(
            `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${file.path}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github.v3+json",
                "User-Agent": "Denish-Portfolio-Admin",
              },
            }
          );

          let sha: string | undefined;
          if (getRes.ok) {
            const fileData = await getRes.json();
            sha = fileData.sha;
          }

          // Commit updated content
          const putRes = await fetch(
            `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${file.path}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github.v3+json",
                "Content-Type": "application/json",
                "User-Agent": "Denish-Portfolio-Admin",
              },
              body: JSON.stringify({
                message: `chore(cms): update ${file.path} via engineer admin console`,
                content: Buffer.from(file.content).toString("base64"),
                sha: sha,
                branch: "main",
              }),
            }
          );

          if (putRes.ok) {
            gitHubSynced = true;
          } else {
            const errBody = await putRes.text();
            console.error(`GitHub API error on ${file.path}:`, errBody);
            gitHubError = errBody;
          }
        }
      } catch (ghErr: any) {
        console.error("GitHub commit failed:", ghErr);
        gitHubError = ghErr.message;
      }
    }

    let message = "Changes updated in your browser and local session.";
    if (gitHubSynced) {
      message = "Success! Changes committed directly to GitHub. Vercel is now rebuilding the public website (~30 seconds).";
    } else if (modifiedFiles.length > 0) {
      message = "Changes saved to local project files successfully.";
    }

    return NextResponse.json({
      success: true,
      message,
      modifiedFiles,
      gitHubSynced,
      gitHubError,
    });
  } catch (error) {
    console.error("Content API error:", error);
    return NextResponse.json({ error: "Failed to process content update" }, { status: 500 });
  }
}
