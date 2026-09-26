"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ProjectCaseStudy } from "@/data/projects";
import { X, MapPin, Building, Calendar, Wrench, CheckCircle2, AlertTriangle, Lightbulb, FileText, ChevronRight, Maximize2 } from "lucide-react";

interface CaseStudyModalProps {
  project: ProjectCaseStudy | null;
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<"overview" | "phases" | "approach" | "drawings" | "photos">("overview");
  const [zoomedImage, setZoomedImage] = useState<{ src: string; caption: string } | null>(null);

  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (zoomedImage) {
          setZoomedImage(null);
        } else {
          onClose();
        }
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, zoomedImage, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#0B0F14] border border-border rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 bg-surface border-b border-border">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xl font-extrabold text-accent">
              {project.number}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/15 text-accent font-semibold">
                  {project.category}
                </span>
                <span className="text-xs text-text-muted font-mono flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-accent" />
                  {project.location}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-text-primary mt-0.5">
                {project.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-surface-light border border-border text-text-secondary hover:text-text-primary hover:border-accent transition-colors"
            aria-label="Close Case Study"
          >
            <X className="w-5 h-5 text-accent" />
          </button>
        </div>

        {/* Modal Tab Nav */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-border bg-surface/50 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 px-3 text-xs font-mono font-semibold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === "overview"
                ? "border-accent text-accent"
                : "border-transparent text-text-muted hover:text-text-primary"
            }`}
          >
            01 Overview &amp; Role
          </button>
          {project.phases && project.phases.length > 0 && (
            <button
              onClick={() => setActiveTab("phases")}
              className={`pb-3 px-3 text-xs font-mono font-semibold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
                activeTab === "phases"
                  ? "border-accent text-accent"
                  : "border-transparent text-text-muted hover:text-text-primary"
              }`}
            >
              02 Work Phases ({project.phases.length})
            </button>
          )}
          <button
            onClick={() => setActiveTab("approach")}
            className={`pb-3 px-3 text-xs font-mono font-semibold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === "approach"
                ? "border-accent text-accent"
                : "border-transparent text-text-muted hover:text-text-primary"
            }`}
          >
            03 Approach &amp; Solutions
          </button>
          <button
            onClick={() => setActiveTab("drawings")}
            className={`pb-3 px-3 text-xs font-mono font-semibold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === "drawings"
                ? "border-accent text-accent"
                : "border-transparent text-text-muted hover:text-text-primary"
            }`}
          >
            04 Drawings &amp; CAD ({project.drawings.length})
          </button>
          <button
            onClick={() => setActiveTab("photos")}
            className={`pb-3 px-3 text-xs font-mono font-semibold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === "photos"
                ? "border-accent text-accent"
                : "border-transparent text-text-muted hover:text-text-primary"
            }`}
          >
            05 Site Records
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          {/* Main Visual Image Hero with Zoom Button */}
          <div
            onClick={() => setZoomedImage({ src: project.image, caption: project.title + " – " + project.subtitle })}
            className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-surface-dark border border-border cursor-pointer group"
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B0F14]/90 border border-border text-xs font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-3.5 h-3.5 text-accent" />
              <span>Expand Visual</span>
            </div>
          </div>

          {/* Project Quick Facts Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-4 rounded-xl bg-surface border border-border text-xs font-mono">
            {project.facts.map((fact) => (
              <div key={fact.label} className="space-y-1">
                <span className="text-text-muted uppercase text-[10px] block">{fact.label}</span>
                <span className="text-text-primary font-semibold block truncate">{fact.value}</span>
              </div>
            ))}
          </div>

          {/* TAB 1: OVERVIEW & ROLE */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-3">
                <h4 className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
                  01 — PROJECT OVERVIEW
                </h4>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                  {project.overview}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-border/60">
                <h4 className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
                  02 — MY ROLE AS CIVIL ENGINEER
                </h4>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                  {project.myRole}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-border/60">
                <h4 className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
                  03 — SPECIFIC SITE RESPONSIBILITIES
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {project.responsibilities.map((resp, i) => (
                    <div key={i} className="p-3.5 rounded-lg bg-surface border border-border/80 flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-text-secondary leading-relaxed">{resp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: APPROACH, CHALLENGES & OUTCOMES */}
          {activeTab === "approach" && (
            <div className="space-y-6 animate-in fade-in">
              {/* Technical Approach */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
                  04 — TECHNICAL WORKFLOW &amp; APPROACH
                </h4>
                <div className="space-y-2.5">
                  {project.technicalApproach.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-surface border border-border/80">
                      <span className="w-6 h-6 rounded bg-accent/15 text-accent font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-text-secondary leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Challenge & Solution Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/60">
                {/* Challenges */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono text-amber-400 uppercase font-bold tracking-widest flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    05 — SITE CHALLENGES
                  </h4>
                  <div className="space-y-2">
                    {project.challenges.map((c, i) => (
                      <div key={i} className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/30 text-xs text-text-secondary">
                        {c}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Solutions */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-widest flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-emerald-400" />
                    06 — ENGINEERING SOLUTIONS
                  </h4>
                  <div className="space-y-2">
                    {project.solutions.map((s, i) => (
                      <div key={i} className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/30 text-xs text-text-secondary">
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Outcomes */}
              <div className="space-y-3 pt-4 border-t border-border/60">
                <h4 className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
                  07 — VERIFIED OUTCOMES
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.outcomes.map((out, i) => (
                    <div key={i} className="p-3.5 rounded-lg bg-surface border border-accent/20 flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span className="text-xs text-text-primary font-medium">{out}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: PHASES & SUB-TASKS */}
          {activeTab === "phases" && project.phases && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2">
                <h4 className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
                  PROJECT BREAKDOWN // EXECUTION PHASES &amp; SUB-TASKS
                </h4>
                <p className="text-xs text-text-muted">
                  Detailed structural stages executed under direct engineering and surveying supervision.
                </p>
              </div>

              <div className="space-y-4">
                {project.phases.map((phase) => (
                  <div
                    key={phase.phaseNumber}
                    className="p-5 rounded-xl bg-surface border border-border space-y-4 shadow-lg hover:border-accent/60 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-accent/15 text-accent font-mono text-xs font-extrabold flex items-center justify-center shrink-0 border border-accent/30">
                          {phase.phaseNumber}
                        </span>
                        <div>
                          <span className="text-[10px] font-mono text-accent font-semibold uppercase tracking-wider block">
                            {phase.category || "ENGINEERING WORK PACKAGE"}
                          </span>
                          <h5 className="text-base font-bold text-text-primary mt-0.5">
                            {phase.title}
                          </h5>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                      {phase.summary}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className={phase.image ? "md:col-span-8 space-y-2.5" : "md:col-span-12 space-y-2.5"}>
                        <p className="text-[11px] font-mono uppercase text-text-muted font-bold">
                          Key Tasks &amp; Quality Checks:
                        </p>
                        <div className="space-y-2">
                          {phase.keyTasks.map((task, tIdx) => (
                            <div key={tIdx} className="flex items-start gap-2.5 text-xs text-text-secondary">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                              <span className="leading-relaxed">{task}</span>
                            </div>
                          ))}
                        </div>

                        {phase.toolsUsed && phase.toolsUsed.length > 0 && (
                          <div className="pt-2 flex flex-wrap gap-1.5 items-center">
                            <span className="text-[10px] font-mono text-text-muted mr-1">Tools / Machinery:</span>
                            {phase.toolsUsed.map((tool) => (
                              <span
                                key={tool}
                                className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-light border border-border/60 text-text-muted"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {phase.image && (
                        <div
                          onClick={() => setZoomedImage({ src: phase.image!, caption: `${phase.title} (Phase ${phase.phaseNumber})` })}
                          className="md:col-span-4 relative aspect-[16/10] rounded-xl overflow-hidden bg-surface-dark border border-border cursor-pointer group shrink-0"
                        >
                          <Image
                            src={phase.image}
                            alt={phase.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 300px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0B0F14]/90 text-white text-[10px] font-mono">
                              <Maximize2 className="w-3 h-3 text-accent" />
                              Inspect Phase
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DRAWINGS & DOCUMENTATION */}
          {activeTab === "drawings" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2">
                <h4 className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
                  TECHNICAL DRAWINGS &amp; CAD LAYOUTS
                </h4>
                <p className="text-xs text-text-muted">
                  Engineering documentation, 2D process schematics, and 3D structural models verified and executed on-site. Click any drawing to expand high-resolution view.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {project.drawings.map((draw, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-surface border border-border flex flex-col justify-between space-y-3 group hover:border-accent transition-colors shadow-lg"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-light text-accent font-semibold uppercase">
                          {draw.type}
                        </span>
                        {draw.sheetNo && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-dark border border-border text-text-muted">
                            {draw.sheetNo}
                          </span>
                        )}
                      </div>
                      <h5 className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">
                        {draw.title}
                      </h5>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {draw.description}
                      </p>
                    </div>

                    {draw.image && (
                      <div
                        onClick={() => setZoomedImage({ src: draw.image!, caption: `${draw.title} – ${draw.sheetNo || draw.type}` })}
                        className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-surface-dark border border-border/80 cursor-pointer group/img"
                      >
                        <Image
                          src={draw.image}
                          alt={draw.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover group-hover/img:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B0F14]/90 text-white text-xs font-mono border border-accent">
                            <Maximize2 className="w-3.5 h-3.5 text-accent" />
                            Zoom Technical Drawing
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SITE RECORDS */}
          {activeTab === "photos" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2">
                <h4 className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
                  09 — SITE FIELD RECORDS &amp; QA PHASES
                </h4>
                <p className="text-xs text-text-muted">
                  Chronological site milestones supervised by Er. Denish Adhikari.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {project.sitePhotos.map((photo, i) => (
                  <div
                    key={i}
                    onClick={() => photo.image && setZoomedImage({ src: photo.image, caption: photo.caption + " (Phase: " + photo.stage + ")" })}
                    className="bg-surface rounded-xl border border-border overflow-hidden flex flex-col justify-between group cursor-pointer hover:border-accent transition-colors"
                  >
                    {photo.image && (
                      <div className="relative aspect-[16/10] w-full bg-surface-dark overflow-hidden border-b border-border/60">
                        <Image
                          src={photo.image}
                          alt={photo.caption}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2 left-2 text-[10px] font-mono text-accent bg-[#0B0F14]/90 px-2 py-0.5 rounded border border-border uppercase font-semibold">
                          Phase: {photo.stage}
                        </span>
                        <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B0F14]/90 text-white text-xs font-mono">
                            <Maximize2 className="w-3.5 h-3.5 text-accent" />
                            Zoom Photo
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-4 flex items-center justify-between gap-2">
                      <p className="text-xs text-text-primary font-medium">{photo.caption}</p>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 flex-shrink-0">
                        Verified
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-surface border-t border-border flex items-center justify-between text-xs font-mono text-text-muted">
          <span>Project Ref: {project.id}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-surface-light hover:bg-border text-text-primary transition-colors font-sans font-semibold"
          >
            Close Viewer
          </button>
        </div>
      </div>

      {/* High-Resolution Technical Image Zoom Lightbox */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in"
          onClick={() => setZoomedImage(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 bg-surface-dark border-b border-border">
              <span className="text-xs font-mono text-accent uppercase font-bold">
                HIGH-RESOLUTION INSPECTION VIEW
              </span>
              <button
                onClick={() => setZoomedImage(null)}
                className="p-1.5 rounded-lg bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-accent transition-colors"
              >
                <X className="w-5 h-5 text-accent" />
              </button>
            </div>
            <div className="relative aspect-[16/10] w-full bg-black">
              <Image
                src={zoomedImage.src}
                alt={zoomedImage.caption}
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-contain"
              />
            </div>
            <div className="p-4 bg-surface border-t border-border flex items-center justify-between text-xs font-mono text-text-secondary">
              <p className="max-w-3xl leading-relaxed">{zoomedImage.caption}</p>
              <button
                onClick={() => setZoomedImage(null)}
                className="px-3 py-1 rounded bg-surface-light hover:bg-border text-text-primary transition-colors flex-shrink-0 ml-4"
              >
                Close (ESC)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

