"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { StatsCounter } from "@/components/StatsCounter";
import { AboutSection } from "@/components/AboutSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { SkillsSection } from "@/components/SkillsSection";
import { NepalMapSection } from "@/components/NepalMapSection";
import { GallerySection } from "@/components/GallerySection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { ResumeModal } from "@/components/ResumeModal";
import { PortfolioProvider } from "@/data/PortfolioContext";

export default function Home() {
  const [resumeOpen, setResumeOpen] = useState(false);

  return (
    <PortfolioProvider>
      <main className="min-h-screen bg-[#0B0F14] text-text-primary">
        {/* Sticky Header */}
        <Navbar onOpenResume={() => setResumeOpen(true)} />

        {/* Hero Section */}
        <Hero onOpenResume={() => setResumeOpen(true)} />

        {/* Engineering at a Glance (Stats) */}
        <StatsCounter />

        {/* About Section */}
        <AboutSection onOpenResume={() => setResumeOpen(true)} />

        {/* Selected Civil Projects (Consolidated Flagship & Key Works) */}
        <ProjectsSection />

        {/* Professional Experience (Vertical Timeline) */}
        <ExperienceSection />

        {/* Engineering Skills & Instruments */}
        <SkillsSection />

        {/* Geographic Footprint (Nepal Interactive Map) */}
        <NepalMapSection />

        {/* Field Notes / Site Records Gallery */}
        <GallerySection />

        {/* Contact Section */}
        <ContactSection />

        {/* Footer */}
        <Footer />

        {/* ATS Resume Modal (Printable & Downloadable) */}
        <ResumeModal
          isOpen={resumeOpen}
          onClose={() => setResumeOpen(false)}
        />
      </main>
    </PortfolioProvider>
  );
}
