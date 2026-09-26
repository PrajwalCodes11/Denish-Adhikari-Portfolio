"use client";

import React, { useState } from "react";
import { MapPin, Navigation, ExternalLink } from "lucide-react";

export const NepalMapSection: React.FC = () => {
  const [selectedHub, setSelectedHub] = useState<string>("bhaktapur");

  const hubs = [
    {
      id: "bhaktapur",
      name: "Bhaktapur & Kathmandu Valley",
      region: "Bagmati Province",
      projects: [
        "Construction of Wastewater Treatment Plant at Sallaghari, Kodku and Dhobighat (Sarathi Construction)",
        "Heavy RCC Water-Retaining Tanks, Bored Piling & Total Station Alignment",
        "Materials Quality Control, Concrete Cube Testing & Aggregate Analysis",
      ],
      x: "54%",
      y: "56%",
    },
    {
      id: "pokhara",
      name: "Pokhara / Gandaki Region",
      region: "Gandaki Province",
      projects: [
        "Pokhara University Civil Engineering Degree",
        "Geodetic Survey Camp & Highway Alignment Traversing",
      ],
      x: "42%",
      y: "52%",
    },
    {
      id: "lumbini",
      name: "Rupandehi / Butwal / Tilottama",
      region: "Lumbini Province",
      projects: [
        "Lumbini Engineering College (LEMSC Campus)",
        "Tilottama Secondary School & Academic Foundations",
      ],
      x: "36%",
      y: "65%",
    },
  ];

  const currentHub = hubs.find((h) => h.id === selectedHub) || hubs[0];

  return (
    <section className="py-20 bg-surface/30 border-t border-border/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <p className="text-xs font-mono uppercase text-accent font-semibold tracking-widest">
            GEOGRAPHIC IDENTITY // PROJECTS ACROSS NEPAL
          </p>
          <h2 className="text-3xl font-extrabold text-text-primary">
            Engineering Footprint in Nepal
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Authentic civil engineering projects, academic roots, and site operations across key provinces of Nepal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* SVG Map Container */}
          <div className="lg:col-span-8 bg-surface rounded-2xl border border-border p-6 shadow-xl relative min-h-[320px] flex items-center justify-center overflow-hidden">
            {/* Minimal Nepal Vector Map Graphic */}
            <svg
              viewBox="0 0 900 450"
              className="w-full h-auto max-h-[380px] drop-shadow-lg"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Generalized Nepal Silhouette */}
              <path
                d="M 50 180 L 150 140 L 280 160 L 400 120 L 550 140 L 680 180 L 820 230 L 850 300 L 760 320 L 650 330 L 520 360 L 400 340 L 300 370 L 180 340 L 80 290 Z"
                fill="#111827"
                stroke="#273244"
                strokeWidth="2.5"
              />

              {/* Grid Lat/Long Lines */}
              <line x1="50" y1="200" x2="850" y2="200" stroke="#F97316" strokeWidth="0.5" strokeDasharray="6 6" strokeOpacity="0.2"/>
              <line x1="50" y1="300" x2="850" y2="300" stroke="#F97316" strokeWidth="0.5" strokeDasharray="6 6" strokeOpacity="0.2"/>
              <line x1="300" y1="100" x2="300" y2="400" stroke="#F97316" strokeWidth="0.5" strokeDasharray="6 6" strokeOpacity="0.2"/>
              <line x1="500" y1="100" x2="500" y2="400" stroke="#F97316" strokeWidth="0.5" strokeDasharray="6 6" strokeOpacity="0.2"/>
              <line x1="700" y1="100" x2="700" y2="400" stroke="#F97316" strokeWidth="0.5" strokeDasharray="6 6" strokeOpacity="0.2"/>

              {/* Hub 1: Bhaktapur / Kathmandu Valley */}
              <g
                className="cursor-pointer group focus:outline-none"
                role="button"
                tabIndex={0}
                aria-label="View Bhaktapur and Kathmandu Valley projects and site operations"
                onClick={() => setSelectedHub("bhaktapur")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedHub("bhaktapur");
                  }
                }}
              >
                <circle cx="525" cy="225" r="22" fill="#F97316" fillOpacity="0.15" />
                <circle cx="525" cy="225" r="10" fill="#F97316" className="animate-pulse" />
                <circle cx="525" cy="225" r="4" fill="#FFFFFF" />
                <text x="540" y="222" fill="#F8FAFC" fontFamily="sans-serif" fontSize="13" fontWeight="bold">
                  Bhaktapur &amp; Valley
                </text>
                <text x="540" y="238" fill="#F97316" fontFamily="monospace" fontSize="10">
                  WWTP Sallaghari, Kodku &amp; Dhobighat
                </text>
              </g>

              {/* Hub 2: Pokhara */}
              <g
                className="cursor-pointer group focus:outline-none"
                role="button"
                tabIndex={0}
                aria-label="View Pokhara university and academic operations"
                onClick={() => setSelectedHub("pokhara")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedHub("pokhara");
                  }
                }}
              >
                <circle cx="410" cy="220" r="16" fill="#38BDF8" fillOpacity="0.15" />
                <circle cx="410" cy="220" r="8" fill="#38BDF8" />
                <circle cx="410" cy="220" r="3" fill="#FFFFFF" />
                <text x="425" y="215" fill="#F8FAFC" fontFamily="sans-serif" fontSize="12" fontWeight="bold">
                  Pokhara
                </text>
                <text x="425" y="230" fill="#38BDF8" fontFamily="monospace" fontSize="9">
                  University Degree
                </text>
              </g>

              {/* Hub 3: Butwal / Tilottama */}
              <g
                className="cursor-pointer group focus:outline-none"
                role="button"
                tabIndex={0}
                aria-label="View Rupandehi campus and academic foundations"
                onClick={() => setSelectedHub("lumbini")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedHub("lumbini");
                  }
                }}
              >
                <circle cx="345" cy="290" r="16" fill="#22C55E" fillOpacity="0.15" />
                <circle cx="345" cy="290" r="8" fill="#22C55E" />
                <circle cx="345" cy="290" r="3" fill="#FFFFFF" />
                <text x="235" y="292" fill="#F8FAFC" fontFamily="sans-serif" fontSize="12" fontWeight="bold">
                  Rupandehi
                </text>
                <text x="240" y="306" fill="#22C55E" fontFamily="monospace" fontSize="9">
                  LEMSC Campus
                </text>
              </g>
            </svg>


            {/* Instruction Tip */}
            <div className="absolute bottom-3 left-6 text-[11px] font-mono text-text-muted">
              Click a city node on the map to filter engineering footprint
            </div>
          </div>

          {/* Location Details Card */}
          <div className="lg:col-span-4 bg-surface rounded-2xl border border-border p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <span className="text-xs font-mono text-accent uppercase font-bold">
                {currentHub.region}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-light text-text-muted">
                COORDINATES ACTIVE
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent" />
                {currentHub.name}
              </h3>
              <p className="text-xs text-text-muted mt-1 font-mono">
                Key civil engineering operations and milestones:
              </p>
            </div>

            <div className="space-y-3">
              {currentHub.projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-surface-light/50 border border-border/80 text-xs text-text-secondary leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block mr-2" />
                  {proj}
                </div>
              ))}
            </div>

            <div className="pt-2">
              <a
                href="#projects"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-surface-light border border-border text-xs font-mono font-bold text-text-primary hover:border-accent hover:text-accent transition-colors"
              >
                <span>View Major Projects &amp; Field Records</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
