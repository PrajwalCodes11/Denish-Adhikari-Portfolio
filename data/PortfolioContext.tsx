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

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(defaultPortfolio);

  useEffect(() => {
    // 1. Check localStorage on client mount
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const hasConsolidatedWWTP =
          Array.isArray(parsed.projectsData) &&
          parsed.projectsData.some((p: any) => p.id === "wwtp-sallaghari-kodku-dhobighat");
        setData({
          siteData: parsed.siteData || defaultSiteData,
          projectsData: hasConsolidatedWWTP ? parsed.projectsData : defaultProjectsData,
          experienceData: Array.isArray(parsed.experienceData) ? parsed.experienceData : defaultExperienceData,
          galleryData: Array.isArray(parsed.galleryData) ? parsed.galleryData : defaultGalleryData,
          skillsData: Array.isArray(parsed.skillsData) ? parsed.skillsData : defaultSkillsData,
        });
      }
    } catch (e) {
      console.warn("Could not load custom portfolio data from localStorage:", e);
    }

    // 2. Listen for real-time update events (e.g. from /admin tab)
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: merged }));
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
      return merged;
    });
  };

  const resetToDefault = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setData(defaultPortfolio);
      window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: defaultPortfolio }));
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
