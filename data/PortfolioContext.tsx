"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { siteData as defaultSiteData } from "@/data/siteData";
import { projectsData as defaultProjectsData, ProjectCaseStudy } from "@/data/projects";
import { experienceData as defaultExperienceData, ExperienceItem } from "@/data/experience";
import { galleryData as defaultGalleryData, GalleryItem } from "@/data/gallery";
import { skillsData as defaultSkillsData, SkillCategory } from "@/data/skills";

export interface PortfolioData {
  siteData: typeof defaultSiteData;
  projectsData: ProjectCaseStudy[];
  experienceData: ExperienceItem[];
  galleryData: GalleryItem[];
  skillsData: SkillCategory[];
}

const defaultPortfolio: PortfolioData = {
  siteData: defaultSiteData,
  projectsData: defaultProjectsData,
  experienceData: defaultExperienceData,
  galleryData: defaultGalleryData,
  skillsData: defaultSkillsData,
};

const PortfolioContext = createContext<{
  data: PortfolioData;
  updateData: (newData: Partial<PortfolioData>) => void;
  resetToDefault: () => void;
}>({
  data: defaultPortfolio,
  updateData: () => {},
  resetToDefault: () => {},
});

export const STORAGE_KEY = "denish_portfolio_live_data";
export const UPDATE_EVENT = "denish_portfolio_updated";
export const DATA_VERSION = "2026.09.26-wwtp-flagship-v4";
export const BROADCAST_CHANNEL = "denish_portfolio_realtime_sync";

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(defaultPortfolio);

  useEffect(() => {
    // 1. Check localStorage on client mount with strict schema & version verification
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const isCurrentVersion = parsed.version === DATA_VERSION;
        const hasValidConsolidatedProject =
          Array.isArray(parsed.projectsData) &&
          parsed.projectsData.length === defaultProjectsData.length &&
          parsed.projectsData.some((p: any) => p.id === "wwtp-sallaghari-kodku-dhobighat");

        if (isCurrentVersion && hasValidConsolidatedProject) {
          setData({
            siteData: parsed.siteData || defaultSiteData,
            projectsData: parsed.projectsData,
            experienceData: Array.isArray(parsed.experienceData) ? parsed.experienceData : defaultExperienceData,
            galleryData: Array.isArray(parsed.galleryData) ? parsed.galleryData : defaultGalleryData,
            skillsData: Array.isArray(parsed.skillsData) ? parsed.skillsData : defaultSkillsData,
          });
        } else {
          // Stale cache detected: cleanly purge and initialize with current verified codebase data
          const freshData = {
            siteData: defaultSiteData,
            projectsData: defaultProjectsData,
            experienceData: defaultExperienceData,
            galleryData: defaultGalleryData,
            skillsData: defaultSkillsData,
            version: DATA_VERSION,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(freshData));
          setData(defaultPortfolio);
        }
      } else {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ ...defaultPortfolio, version: DATA_VERSION })
        );
      }
    } catch (e) {
      console.warn("Could not load custom portfolio data from localStorage:", e);
    }

    // 2. Real-time multi-tab cross-synchronization via BroadcastChannel & window events
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        channel = new BroadcastChannel(BROADCAST_CHANNEL);
        channel.onmessage = (event) => {
          if (event.data) {
            setData(event.data);
          }
        };
      }
    } catch (e) {}

    const handleUpdate = (e: any) => {
      if (e.detail) {
        setData(e.detail);
      } else {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            setData(JSON.parse(stored));
          } catch (err) {}
        }
      }
    };

    window.addEventListener(UPDATE_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(UPDATE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      if (channel) {
        channel.close();
      }
    };
  }, []);

  const updateData = (newData: Partial<PortfolioData>) => {
    setData((prev) => {
      const merged: PortfolioData = {
        siteData: newData.siteData || prev.siteData,
        projectsData: newData.projectsData || prev.projectsData,
        experienceData: newData.experienceData || prev.experienceData,
        galleryData: newData.galleryData || prev.galleryData,
        skillsData: newData.skillsData || prev.skillsData,
      };
      try {
        const payloadToStore = { ...merged, version: DATA_VERSION };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payloadToStore));
        window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: merged }));

        if (typeof window !== "undefined" && "BroadcastChannel" in window) {
          const ch = new BroadcastChannel(BROADCAST_CHANNEL);
          ch.postMessage(merged);
          ch.close();
        }
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
      return merged;
    });
  };

  const resetToDefault = () => {
    try {
      const fresh = { ...defaultPortfolio, version: DATA_VERSION };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      setData(defaultPortfolio);
      window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: defaultPortfolio }));
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const ch = new BroadcastChannel(BROADCAST_CHANNEL);
        ch.postMessage(defaultPortfolio);
        ch.close();
      }
    } catch (e) {}
  };

  return (
    <PortfolioContext.Provider value={{ data, updateData, resetToDefault }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export function usePortfolioData() {
  return useContext(PortfolioContext);
}
