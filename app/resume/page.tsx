"use client";

import React from "react";
import Link from "next/link";
import { siteData } from "@/data/siteData";
import { experienceData } from "@/data/experience";
import { educationData } from "@/data/education";
import { ArrowLeft, Printer, Phone, Mail, MapPin, Download } from "lucide-react";

export default function ResumePage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-text-primary py-8 sm:py-12">
      {/* Action Header (Excluded from Print) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-text-secondary hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-accent" />
          <span>RETURN TO PORTFOLIO</span>
        </Link>

        <div className="flex items-center gap-3">
          <a
            href="/Denish_Adhikari_CV.docx"
            download="Denish_Adhikari_CV_2026.docx"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface hover:bg-surface-light border border-border text-text-primary font-bold text-xs uppercase tracking-wider transition-all"
          >
            <Download className="w-4 h-4 text-accent" />
            <span>Download DOCX</span>
          </a>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-bold text-xs uppercase tracking-wider hover:bg-accent-soft transition-all shadow-lg shadow-accent/25"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF (ATS)</span>
          </button>
        </div>
      </div>

      {/* Main Resume Sheet */}
      <main className="max-w-4xl mx-auto px-6 sm:px-12 py-12 bg-surface rounded-2xl border border-border shadow-2xl space-y-8 font-sans">
        {/* Header */}
        <div className="text-center pb-6 border-b border-border space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-text-primary uppercase">
            {siteData.personal.name}
          </h1>
          <p className="text-sm font-mono text-accent font-bold">
            Civil Site Engineer &amp; Surveyor • Nepal Engineering Council (NEC Registered)
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-text-secondary pt-1">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-accent" />
              +977 9867730557
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-accent" />
              den.adh0709@gmail.com
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-accent" />
              Kathmandu, Nepal
            </span>
          </div>
        </div>

        {/* Professional Summary */}
        <section className="space-y-2">
          <h2 className="text-xs font-mono text-accent uppercase font-bold tracking-widest border-b border-border/80 pb-1">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Civil Engineer with practical experience in wastewater treatment plant construction, reinforced concrete works, surveying, and construction quality control. Skilled in Total Station and Auto Level operations, reinforcement inspection, concrete testing, and site supervision. Capable of managing workforce activities, verifying structural drawings, and maintaining technical compliance on construction sites. Seeking opportunities in construction engineering and site operations.
          </p>
        </section>

        {/* Education & Licensing */}
        <section className="space-y-3">
          <h2 className="text-xs font-mono text-accent uppercase font-bold tracking-widest border-b border-border/80 pb-1">
            EDUCATION &amp; LICENSING
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-text-primary text-sm">Bachelor in Civil Engineering</div>
                <div className="text-text-secondary">Lumbini Engineering, Management and Science College, Pokhara University</div>
              </div>
              <div className="text-right font-mono text-text-muted">Sep 2018 A.D. – Feb 2024 A.D.</div>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-emerald-400 text-sm">Nepal Engineering Council (NEC)</div>
                <div className="text-text-secondary">Registered Civil Engineer (Reg. No. 79422 &quot;Civil&quot;)</div>
              </div>
              <div className="text-right font-mono text-text-muted">October 23, 2024 A.D.</div>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-text-primary">+2 / High School (Science)</div>
                <div className="text-text-secondary">Tilottama Secondary School</div>
              </div>
              <div className="text-right font-mono text-text-muted">Completed: 2018 A.D.</div>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-text-primary">School Leaving Certificate (SLC)</div>
                <div className="text-text-secondary">Bethel English Boarding Secondary School</div>
              </div>
              <div className="text-right font-mono text-text-muted">Completed: 2016 A.D.</div>
            </div>
          </div>
        </section>

        {/* Key Project Experience */}
        <section className="space-y-4">
          <h2 className="text-xs font-mono text-accent uppercase font-bold tracking-widest border-b border-border/80 pb-1">
            KEY PROJECT EXPERIENCE
          </h2>

          {experienceData.map((exp, i) => (
            <div key={i} className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                <div>
                  <span className="font-bold text-text-primary text-sm">{exp.role}</span>
                  <span className="text-text-secondary text-xs block sm:inline sm:ml-2">
                    – {exp.company}, {exp.location}
                  </span>
                </div>
                <span className="font-mono text-xs text-accent font-semibold">{exp.period}</span>
              </div>
              <ul className="space-y-1 text-xs text-text-secondary pl-3">
                {exp.achievements.map((ach, aIdx) => (
                  <li key={aIdx} className="list-disc leading-relaxed">
                    {ach}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Technical Skills */}
        <section className="space-y-2">
          <h2 className="text-xs font-mono text-accent uppercase font-bold tracking-widest border-b border-border/80 pb-1">
            TECHNICAL SKILLS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-text-secondary">
            <div>• Construction Site Supervision – RCC Structures</div>
            <div>• Surveying – Total Station and Auto Level</div>
            <div>• Setting Out and Structural Alignment</div>
            <div>• Reinforcement Inspection and BBS Verification</div>
            <div>• Concrete Testing and Aggregate Analysis</div>
            <div>• Quantity Estimation &amp; Material Takeoffs</div>
            <div>• AutoCAD 2D Drafting</div>
            <div>• Microsoft Office (Excel, Word)</div>
          </div>
        </section>

        {/* Core Competencies */}
        <section className="space-y-2">
          <h2 className="text-xs font-mono text-accent uppercase font-bold tracking-widest border-b border-border/80 pb-1">
            CORE COMPETENCIES
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-text-secondary">
            <div>• Leadership and Team Coordination (40–50 Laborers)</div>
            <div>• Problem Solving and Critical Thinking</div>
            <div>• Attention to Technical Detail &amp; Drawing Verification</div>
            <div>• Time Management &amp; Daily Progress Reporting</div>
            <div>• Communication Skills &amp; Multi-trade Coordination</div>
          </div>
        </section>

        {/* Interests */}
        <section className="space-y-1">
          <h2 className="text-xs font-mono text-accent uppercase font-bold tracking-widest border-b border-border/80 pb-1">
            INTERESTS
          </h2>
          <p className="text-xs text-text-secondary">
            Football &amp; Futsal • Cricket • Hiking and Outdoor Activities • Volunteering
          </p>
        </section>

        {/* Footer info */}
        <div className="pt-4 border-t border-border/60 text-right text-[11px] font-mono text-text-muted">
          Prepared on 24th June 2026 A.D.
        </div>
      </main>
    </div>
  );
}
