import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { projectsData } from "@/data/projects";
import { ArrowLeft, MapPin, Building, Calendar, CheckCircle2, AlertTriangle, Lightbulb, ShieldCheck } from "lucide-react";

export function generateStaticParams() {
  const slugs = projectsData.map((project) => ({
    slug: project.slug,
  }));
  slugs.push({ slug: "tokha-wastewater-treatment-plant" });
  slugs.push({ slug: "deep-foundation-bored-cast-in-situ-piling" });
  slugs.push({ slug: "construction-of-waste-water-treatment-plant-sallaghari-khokana" });
  slugs.push({ slug: "construction-of-wastewater-treatment-plant-sallaghari-khokana" });
  slugs.push({ slug: "wwtp-sallaghari-kodku-dhobighat" });
  return slugs;
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  let project = projectsData.find((p) => p.slug === params.slug);
  if (
    !project &&
    (params.slug === "tokha-wastewater-treatment-plant" ||
      params.slug === "deep-foundation-bored-cast-in-situ-piling" ||
      params.slug === "construction-of-waste-water-treatment-plant-sallaghari-khokana" ||
      params.slug === "construction-of-wastewater-treatment-plant-sallaghari-khokana" ||
      params.slug === "wwtp-sallaghari-kodku-dhobighat" ||
      params.slug === "wwtp-sallaghari-khokana")
  ) {
    project = projectsData.find(
      (p) =>
        p.id === "wwtp-sallaghari-kodku-dhobighat" ||
        p.id === "wwtp-sallaghari-khokana"
    );
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0B0F14] text-text-primary">
      {/* Sticky Top Bar */}
      <header className="sticky top-0 z-40 bg-[#0B0F14]/95 backdrop-blur-md border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-text-secondary hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-accent" />
            <span>BACK TO ALL PROJECTS</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
            <span>ER. DENISH ADHIKARI</span>
            <span>//</span>
            <span className="text-accent">{project.category}</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Project Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold px-3 py-1 rounded-full bg-accent/15 text-accent border border-accent/30">
              PROJECT {project.number}
            </span>
            <span className="text-xs font-mono text-text-muted flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-accent" />
              {project.location}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight leading-tight">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-text-secondary">
            {project.subtitle}
          </p>
        </div>

        {/* Large Visual Image Hero */}
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-surface-dark border border-border shadow-2xl">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Project Facts Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 p-6 rounded-2xl bg-surface border border-border text-xs font-mono">
          {project.facts.map((fact) => (
            <div key={fact.label} className="space-y-1">
              <span className="text-text-muted uppercase text-[10px] block">{fact.label}</span>
              <span className="text-text-primary font-bold block">{fact.value}</span>
            </div>
          ))}
        </div>

        {/* Section 1: Overview */}
        <section className="space-y-4 pt-6 border-t border-border/80">
          <h2 className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
            01 — PROJECT OVERVIEW
          </h2>
          <p className="text-base text-text-secondary leading-relaxed">
            {project.overview}
          </p>
        </section>

        {/* Section 2: Role */}
        <section className="space-y-4 pt-6 border-t border-border/80">
          <h2 className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
            02 — ENGINEER’S ROLE &amp; SCOPE
          </h2>
          <p className="text-base text-text-secondary leading-relaxed">
            {project.myRole}
          </p>
        </section>

        {/* Section 3: Responsibilities */}
        <section className="space-y-4 pt-6 border-t border-border/80">
          <h2 className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
            03 — FIELD RESPONSIBILITIES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {project.responsibilities.map((resp, i) => (
              <div key={i} className="p-4 rounded-xl bg-surface border border-border/80 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-text-secondary leading-relaxed">{resp}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Technical Approach */}
        <section className="space-y-4 pt-6 border-t border-border/80">
          <h2 className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
            04 — TECHNICAL WORKFLOW
          </h2>
          <div className="space-y-3">
            {project.technicalApproach.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-border/80">
                <span className="w-7 h-7 rounded-lg bg-accent/15 text-accent font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 & 6: Challenges & Solutions */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border/80">
          <div className="space-y-3">
            <h3 className="text-xs font-mono text-amber-400 uppercase font-bold tracking-widest flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              05 — SITE CHALLENGES
            </h3>
            <div className="space-y-2.5">
              {project.challenges.map((c, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/30 text-xs text-text-secondary">
                  {c}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-widest flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-emerald-400" />
              06 — ENGINEERING SOLUTIONS
            </h3>
            <div className="space-y-2.5">
              {project.solutions.map((s, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-xs text-text-secondary">
                  {s}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 7: Outcomes */}
        <section className="space-y-4 pt-6 border-t border-border/80">
          <h2 className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
            07 — PROJECT OUTCOMES &amp; VERIFIED RESULTS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {project.outcomes.map((out, i) => (
              <div key={i} className="p-4 rounded-xl bg-surface border border-accent/30 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-text-primary font-medium">{out}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Phases & Work Breakdown (For Major Consolidated Projects) */}
        {project.phases && project.phases.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-border/80">
            <div>
              <h2 className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
                EXECUTION PHASES &amp; WORK BREAKDOWN STRUCTURE
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                Sub-works and individual operations consolidated under this major infrastructure project.
              </p>
            </div>

            <div className="space-y-5">
              {project.phases.map((phase) => (
                <div
                  key={phase.phaseNumber}
                  className="p-6 rounded-2xl bg-surface border border-border space-y-4 shadow-lg hover:border-accent/60 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-accent/15 text-accent font-mono text-sm font-extrabold flex items-center justify-center shrink-0 border border-accent/30">
                        {phase.phaseNumber}
                      </span>
                      <div>
                        <span className="text-[10px] font-mono text-accent font-semibold uppercase tracking-wider block">
                          {phase.category || "WORK PACKAGE"}
                        </span>
                        <h3 className="text-lg font-bold text-text-primary mt-0.5">
                          {phase.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-text-secondary leading-relaxed">
                    {phase.summary}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className={phase.image ? "md:col-span-8 space-y-3" : "md:col-span-12 space-y-3"}>
                      <p className="text-xs font-mono uppercase text-text-muted font-bold">
                        Scope of Work &amp; Supervised Tasks:
                      </p>
                      <div className="space-y-2">
                        {phase.keyTasks.map((task, tIdx) => (
                          <div key={tIdx} className="flex items-start gap-3 text-xs sm:text-sm text-text-secondary">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                            <span className="leading-relaxed">{task}</span>
                          </div>
                        ))}
                      </div>

                      {phase.toolsUsed && phase.toolsUsed.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-2 items-center">
                          <span className="text-xs font-mono text-text-muted mr-1">Machinery &amp; Equipment:</span>
                          {phase.toolsUsed.map((tool) => (
                            <span
                              key={tool}
                              className="text-[11px] font-mono px-2.5 py-1 rounded bg-surface-light border border-border/60 text-text-secondary"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {phase.image && (
                      <div className="md:col-span-4 relative aspect-[16/10] rounded-xl overflow-hidden bg-surface-dark border border-border shadow-md">
                        <Image
                          src={phase.image}
                          alt={phase.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 8: Technical Drawings */}
        <section className="space-y-6 pt-6 border-t border-border/80">
          <div>
            <h2 className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
              DRAWINGS, 2D SCHEMATICS &amp; 3D PERSPECTIVES
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Engineering documentation, process layouts, and CAD details verified and executed on-site.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.drawings.map((draw, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-surface border border-border flex flex-col justify-between space-y-4 shadow-lg group hover:border-accent transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-surface-light text-accent font-semibold uppercase">
                      {draw.type}
                    </span>
                    {draw.sheetNo && (
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-surface-dark border border-border text-text-muted">
                        {draw.sheetNo}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-text-primary group-hover:text-accent transition-colors">
                    {draw.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {draw.description}
                  </p>
                </div>

                {draw.image && (
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-surface-dark border border-border/80">
                    <Image
                      src={draw.image}
                      alt={draw.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 9: Site Photos & Verification */}
        {project.sitePhotos && project.sitePhotos.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-border/80">
            <h2 className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
              09 — FIELD RECORDS &amp; ON-SITE VERIFICATION
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {project.sitePhotos.map((photo, i) => (
                <div key={i} className="bg-surface rounded-2xl border border-border overflow-hidden group shadow-lg">
                  {photo.image && (
                    <div className="relative aspect-[16/10] w-full bg-surface-dark overflow-hidden border-b border-border/70">
                      <Image
                        src={photo.image}
                        alt={photo.caption}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 text-[10px] font-mono font-bold text-accent bg-[#0B0F14]/90 px-2.5 py-1 rounded border border-border">
                        Phase: {photo.stage}
                      </span>
                    </div>
                  )}
                  <div className="p-4 flex items-center justify-between gap-2">
                    <p className="text-xs text-text-primary font-medium">{photo.caption}</p>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 flex-shrink-0">
                      On-Site Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Navigation Actions */}
        <div className="pt-12 border-t border-border flex items-center justify-between">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface border border-border hover:border-accent text-text-primary font-semibold text-xs font-mono transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Projects</span>
          </Link>

          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent-soft text-white font-semibold text-xs font-mono transition-colors"
          >
            <span>Inquire About Similar Work →</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
