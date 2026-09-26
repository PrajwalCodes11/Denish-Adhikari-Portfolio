"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { projectsData as staticProjects, ProjectCaseStudy } from "@/data/projects";
import { usePortfolioData } from "@/data/PortfolioContext";
import { CaseStudyModal } from "./CaseStudyModal";
import {
  MapPin,
  ArrowRight,
  Layers,
  Eye,
  Search,
  X,
  Share2,
  Check,
} from "lucide-react";

export const ProjectsSection: React.FC = () => {
  const { data } = usePortfolioData();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeProject, setActiveProject] = useState<ProjectCaseStudy | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const activeProjects = data?.projectsData || staticProjects;
  const categories = useMemo(() => {
    const cats = Array.from(new Set(activeProjects.map((p) => p.category)));
    return cats.length > 1 ? ["ALL", ...cats] : ["ALL", ...cats];
  }, [activeProjects]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: activeProjects.length };
    activeProjects.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [activeProjects]);

  // Filtered by Category + Search Query
  const filteredProjects = useMemo(() => {
    return activeProjects.filter((p) => {
      const matchCat = selectedCategory === "ALL" || p.category === selectedCategory;
      if (!matchCat) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        (p.firm && p.firm.toLowerCase().includes(q)) ||
        p.tools.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [activeProjects, selectedCategory, searchQuery]);

  const handleShareProject = (slug: string) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/projects/${slug}`;
      navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    }
  };

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading & Utilities */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-mono uppercase text-accent font-semibold tracking-widest">
              MAJOR CIVIL INFRASTRUCTURE // FIELD CASE STUDY
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary mt-2">
              Major Engineering Project
            </h2>
            <p className="text-sm sm:text-base text-text-secondary mt-2 max-w-2xl">
              Consolidated municipal wastewater treatment infrastructure program covering precision surveying, deep bored piling, dewatering, heavy water-retaining RCC tanks, and material quality assurance.
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-surface p-1.5 rounded-xl border border-border">
            {categories.map((cat) => {
              const count = categoryCounts[cat] || 0;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-accent text-white shadow-md shadow-accent/20"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-light"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? "bg-white/20 text-white" : "bg-surface-light text-text-muted"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Live Search Input */}
          <div className="relative min-w-[260px] sm:min-w-[300px]">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by keyword, tool, location..."
              className="w-full pl-9 pr-9 py-2 rounded-xl bg-surface border border-border text-xs font-mono text-text-primary focus:border-accent focus:outline-none placeholder:text-text-muted/70 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-text-muted hover:text-text-primary"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search / Filter Status info */}
        {(searchQuery || selectedCategory !== "ALL") && (
          <div className="flex items-center justify-between text-xs font-mono text-text-muted mb-6 px-1">
            <span>
              Showing {filteredProjects.length} of {activeProjects.length} projects
              {searchQuery && (
                <span> matching &ldquo;<span className="text-accent">{searchQuery}</span>&rdquo;</span>
              )}
            </span>
            {(searchQuery || selectedCategory !== "ALL") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("ALL");
                }}
                className="text-accent hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}

        {/* Project Cards Grid or Empty State */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 rounded-2xl bg-surface border border-border text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-xl bg-surface-light border border-border flex items-center justify-center text-accent">
              <Layers className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">
              No matching projects found
            </h3>
            <p className="text-xs text-text-secondary max-w-md mx-auto">
              No engineering records matched your filter or search query &ldquo;{searchQuery || selectedCategory}&rdquo;. Try another term like &ldquo;ETABS&rdquo;, &ldquo;Sallaghari&rdquo;, or &ldquo;Piling&rdquo;.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("ALL");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-mono font-semibold hover:bg-accent-soft transition-colors"
            >
              Reset to All Projects
            </button>
          </div>
        ) : (
          <div className={filteredProjects.length === 1 ? "max-w-4xl mx-auto w-full" : "grid grid-cols-1 md:grid-cols-2 gap-8"}>
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="group bg-surface rounded-2xl border border-border hover:border-accent transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl"
              >
                {/* Image Preview Container */}
                <div
                  onClick={() => setActiveProject(proj)}
                  className="relative aspect-[16/10] w-full bg-surface-dark overflow-hidden cursor-pointer border-b border-border/80"
                >
                  <Image
                    src={proj.image}
                    alt={proj.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Category & Number Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-[#0B0F14]/90 text-accent border border-border backdrop-blur-md">
                        {proj.category}
                      </span>
                      {proj.phases && (
                        <span className="font-mono text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#0B0F14]/90 text-emerald-400 border border-emerald-500/40 backdrop-blur-md">
                          {proj.phases.length} Phases
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-xl font-extrabold text-white/90 drop-shadow-md">
                      {proj.number}
                    </span>
                  </div>

                  {/* Hover Reveal Overlay */}
                  <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B0F14]/90 text-white text-xs font-mono font-bold border border-accent">
                      <Eye className="w-4 h-4 text-accent" />
                      Open Engineering Case Study
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-text-muted">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-accent" />
                        <span>{proj.location}</span>
                      </div>
                      <span className="text-[11px] font-mono text-text-muted">{proj.duration}</span>
                    </div>

                    <h3 className="text-xl font-bold text-text-primary group-hover:text-accent transition-colors leading-snug">
                      {proj.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-2">
                      {proj.summary}
                    </p>

                    {/* Sub-items / Phases Breakdown */}
                    {proj.phases && (
                      <div className="pt-2 pb-1 space-y-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-bold block">
                          Consolidated Phases &amp; Sub-Works:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {proj.phases.map((ph) => (
                            <div
                              key={ph.phaseNumber}
                              className="flex items-center gap-1.5 text-[11px] font-mono text-text-secondary bg-surface-light/60 px-2 py-1 rounded border border-border/60"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                              <span className="truncate">
                                Phase {ph.phaseNumber}: {ph.title.split("&")[0].trim()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tools & Tech Chips */}
                  <div className="pt-2">
                    <div className="flex flex-wrap gap-1.5">
                      {proj.tools.map((tool) => (
                        <span
                          key={tool}
                          className="text-[11px] font-mono px-2.5 py-1 rounded bg-surface-light border border-border/60 text-text-muted"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                    <button
                      onClick={() => setActiveProject(proj)}
                      className="inline-flex items-center gap-2 text-xs font-mono font-bold text-accent group-hover:text-accent-soft transition-colors"
                    >
                      <span>VIEW CASE STUDY</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleShareProject(proj.slug)}
                        className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-surface-light transition-colors"
                        title="Copy shareable link"
                      >
                        {copiedSlug === proj.slug ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <Link
                        href={`/projects/${proj.slug}`}
                        className="text-[11px] font-mono text-text-muted hover:text-text-primary underline transition-colors"
                      >
                        Dedicated Page →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Case Study Deep View Modal */}
      <CaseStudyModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </section>
  );
};
