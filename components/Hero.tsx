"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { siteData as staticSiteData } from "@/data/siteData";
import { usePortfolioData } from "@/data/PortfolioContext";
import { ArrowDown, FileText, ChevronRight, MapPin, Award, CheckCircle2 } from "lucide-react";

interface HeroProps {
  onOpenResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResume }) => {
  const { data } = usePortfolioData();
  const personal = data?.siteData?.personal || staticSiteData.personal;
  const roles = personal.rotatingRoles && personal.rotatingRoles.length > 0 ? personal.rotatingRoles : staticSiteData.personal.rotatingRoles;

  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [roles.length]);

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden border-b border-border/60"
    >
      {/* Structural Grid Background Overlay */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      {/* Ambient Lighting Gradient */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-accent/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Bio & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status & Licensing Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surface border border-border text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-text-secondary">{personal.license}</span>
              <span className="text-border">|</span>
              <span className="text-accent font-semibold">Civil Engineering</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <p className="text-sm sm:text-base font-mono text-accent uppercase tracking-wider font-semibold">
                Technical Portfolio &amp; Site Records
              </p>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-text-primary leading-[1.08]">
                {personal.name}
              </h1>
            </div>

            {/* Rotating Role Pill (Selfer adaptation) */}
            <div className="py-2">
              <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface border border-border/90 shadow-lg">
                <span className="text-xs font-mono uppercase text-accent font-semibold">Specialization:</span>
                <span
                  key={currentRoleIndex}
                  className="text-base sm:text-lg font-bold text-text-primary transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
                >
                  {roles[currentRoleIndex]}
                </span>
              </div>
            </div>

            {/* Professional Summary Statement */}
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl">
              {personal.shortBio}
            </p>

            {/* Location & Contact Meta */}
            <div className="flex flex-wrap items-center gap-5 text-xs text-text-muted font-mono pt-1">
              <span className="flex items-center gap-1.5 text-text-secondary">
                <MapPin className="w-4 h-4 text-accent" />
                {personal.location}
              </span>
              <span className="flex items-center gap-1.5 text-text-secondary">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Available for Site &amp; Project Operations
              </span>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-soft transition-all shadow-xl shadow-accent/25 hover:shadow-accent/40 group"
              >
                <span>Explore Major Projects</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                onClick={onOpenResume}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-surface hover:bg-surface-light border border-border hover:border-accent text-text-primary font-semibold text-sm transition-all group"
              >
                <FileText className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
                <span>Download CV</span>
              </button>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-4 py-3.5 text-text-secondary hover:text-accent font-semibold text-sm transition-colors"
              >
                Contact Directly →
              </a>
            </div>
          </div>

          {/* Right Column: High-Fidelity Engineering Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Glow & Technical Frame */}
              <div className="relative rounded-2xl bg-surface border border-border p-3 shadow-2xl shadow-black/80 overflow-hidden group">
                <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-surface-dark border border-border/60">
                  <Image
                    src="/images/profile/profile-1.jpg"
                    alt="Er. Denish Adhikari - Civil Site Engineer & Surveyor (Nepal)"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>

                {/* Floating On-Site Badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-[#0B0F14]/95 backdrop-blur-md border border-border rounded-xl p-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-mono text-accent font-semibold uppercase tracking-wider">
                        Sarathi Construction Pvt. Ltd.
                      </p>
                      <p className="text-sm font-bold text-text-primary">
                        WWTP Sallaghari, Kodku &amp; Dhobighat
                      </p>
                    </div>
                    <div className="text-right font-mono text-xs text-text-secondary">
                      <span className="text-emerald-400 font-bold">40–50</span> Workers
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator (Selfer Signature Arrow) */}
        <div className="pt-16 flex items-center justify-between border-t border-border/60 mt-16">
          <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
            <span className="w-2 h-2 rounded-full bg-accent" />
            SCROLL TO EXPLORE ENGINEERING PRACTICE
          </div>
          <a
            href="#stats"
            className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent transition-all group"
            aria-label="Scroll Down"
          >
            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};
