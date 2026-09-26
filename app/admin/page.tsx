"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Save,
  Download,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  HardHat,
  Compass,
  FileText,
  Layers,
  Image as ImageIcon,
  UserCheck,
  RefreshCw,
  GitBranch,
  Key,
  Mail,
  ArrowUp,
  ArrowDown,
  Copy,
  RotateCcw,
  Inbox,
  Sparkles,
  Check,
  ChevronRight,
  Sliders,
  Search,
  MessageSquare,
  X,
  Camera,
  Ruler,
} from "lucide-react";

import { siteData as defaultSiteData } from "@/data/siteData";
import { ProjectCaseStudy, ProjectPhase, ProjectDrawing, projectsData as defaultProjects } from "@/data/projects";
import { ExperienceItem, experienceData as defaultExperience } from "@/data/experience";
import { SkillCategory, skillsData as defaultSkills } from "@/data/skills";
import { GalleryItem, galleryData as defaultGallery } from "@/data/gallery";
import { STORAGE_KEY, UPDATE_EVENT, DATA_VERSION, BROADCAST_CHANNEL } from "@/data/PortfolioContext";

type TabKey = "profile" | "projects" | "experience" | "gallery" | "skills" | "inbox" | "media" | "sync";

interface MediaAssetItem {
  path: string;
  name: string;
  category: "site" | "drawings" | "profile" | "schematics";
  categoryLabel: string;
}

// Complete Catalog of all Media Assets across the project (site photos 1-46, drawings, profiles, schematics)
const mediaAssetsList: MediaAssetItem[] = [
  // 46 High-Resolution Construction Site Photos
  ...Array.from({ length: 46 }, (_, i) => {
    const num = String(i + 1).padStart(2, "0");
    return {
      path: `/images/site/site-${num}.jpg`,
      name: `site-${num}.jpg`,
      category: "site" as const,
      categoryLabel: "Site Photography",
    };
  }),
  // Technical Drawings & CAD Layouts
  {
    path: "/images/2d-drawing-sallaghari.jpeg",
    name: "2d-drawing-sallaghari.jpeg",
    category: "drawings",
    categoryLabel: "2D Engineering CAD Layout",
  },
  {
    path: "/images/wastewater-treatment-plan.jpg",
    name: "wastewater-treatment-plan.jpg",
    category: "drawings",
    categoryLabel: "WWTP Hydraulic & Process Plan",
  },
  // Profile & Professional Portraits
  {
    path: "/images/profile/profile-1.jpg",
    name: "profile-1.jpg",
    category: "profile",
    categoryLabel: "Site PPE Portrait",
  },
  {
    path: "/images/profile/profile-2.jpg",
    name: "profile-2.jpg",
    category: "profile",
    categoryLabel: "Field Supervision Portrait",
  },
  {
    path: "/images/engineer-portrait.svg",
    name: "engineer-portrait.svg",
    category: "profile",
    categoryLabel: "CAD Vector Portrait",
  },
  // CAD Schematics & QA Vectors
  {
    path: "/images/project-wwtp.svg",
    name: "project-wwtp.svg",
    category: "schematics",
    categoryLabel: "WWTP Hydraulic Schematic",
  },
  {
    path: "/images/project-residential.svg",
    name: "project-residential.svg",
    category: "schematics",
    categoryLabel: "RCC Structural Frame",
  },
  {
    path: "/images/project-structural.svg",
    name: "project-structural.svg",
    category: "schematics",
    categoryLabel: "Shear Wall Rebar Detail",
  },
  {
    path: "/images/project-survey.svg",
    name: "project-survey.svg",
    category: "schematics",
    categoryLabel: "Total Station Grid",
  },
  {
    path: "/images/gallery-survey-1.svg",
    name: "gallery-survey-1.svg",
    category: "schematics",
    categoryLabel: "Survey Alignment Vector",
  },
  {
    path: "/images/gallery-rebar-1.svg",
    name: "gallery-rebar-1.svg",
    category: "schematics",
    categoryLabel: "Rebar Inspection Vector",
  },
  {
    path: "/images/gallery-formwork-1.svg",
    name: "gallery-formwork-1.svg",
    category: "schematics",
    categoryLabel: "Formwork Shuttering Vector",
  },
  {
    path: "/images/gallery-qc-1.svg",
    name: "gallery-qc-1.svg",
    category: "schematics",
    categoryLabel: "Slump Cone QC Vector",
  },
  {
    path: "/images/gallery-sieve-1.svg",
    name: "gallery-sieve-1.svg",
    category: "schematics",
    categoryLabel: "Sieve Analysis Vector",
  },
  {
    path: "/images/gallery-level-1.svg",
    name: "gallery-level-1.svg",
    category: "schematics",
    categoryLabel: "Auto Level Vector",
  },
  {
    path: "/og-image.png",
    name: "og-image.png",
    category: "schematics",
    categoryLabel: "Social Share Card",
  },
];

const availableImages = mediaAssetsList.map((m) => m.path);

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  serviceType?: string;
  subject: string;
  message: string;
  date: string;
  read?: boolean;
}

export default function AdminPage() {
  // Authentication & Dynamic Email 2FA State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authStep, setAuthStep] = useState<1 | 2>(1);
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [challengeToken, setChallengeToken] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Search & Filters in Admin
  const [adminProjectSearch, setAdminProjectSearch] = useState("");
  const [adminProjectCategory, setAdminProjectCategory] = useState("ALL");

  // Navigation & Save State
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [saveLoading, setSaveLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Editable Portfolio Data
  const [site, setSite] = useState<typeof defaultSiteData>(defaultSiteData);
  const [projects, setProjects] = useState<ProjectCaseStudy[]>(defaultProjects);
  const [experience, setExperience] = useState<ExperienceItem[]>(defaultExperience);
  const [gallery, setGallery] = useState<GalleryItem[]>(defaultGallery);
  const [skills, setSkills] = useState<SkillCategory[]>(defaultSkills);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);

  // GitHub Sync & Settings
  const [githubToken, setGithubToken] = useState("");

  // Project Modal & Sub-states
  const [editingProject, setEditingProject] = useState<ProjectCaseStudy | null>(null);
  const [projectModalTab, setProjectModalTab] = useState<
    "info" | "facts" | "phases" | "drawings" | "photos" | "technical"
  >("info");
  const [isNewProject, setIsNewProject] = useState(false);
  const [newRoleInput, setNewRoleInput] = useState("");

  // Universal Media Picker Modal State
  const [mediaPicker, setMediaPicker] = useState<{
    isOpen: boolean;
    title: string;
    onSelect: (path: string) => void;
  } | null>(null);
  const [mediaPickerCategory, setMediaPickerCategory] = useState<string>("ALL");
  const [mediaPickerSearch, setMediaPickerSearch] = useState<string>("");

  // Media Tab Browser State
  const [mediaTabCategory, setMediaTabCategory] = useState<string>("ALL");
  const [mediaTabSearch, setMediaTabSearch] = useState<string>("");

  // 1. Initial Authentication Check & Load
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "check" }),
        });
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          loadExistingContent();
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      }
    }
    checkAuth();

    // Check stored GitHub token
    try {
      const savedToken = localStorage.getItem("denish_gh_pat");
      if (savedToken) setGithubToken(savedToken);
    } catch (e) {}

    // Load Inquiries
    loadInquiries();

    // Real-time simultaneous cross-tab synchronization
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        channel = new BroadcastChannel(BROADCAST_CHANNEL);
        channel.onmessage = (event) => {
          if (event.data) {
            if (event.data.siteData) setSite(event.data.siteData);
            if (event.data.projectsData) setProjects(event.data.projectsData);
            if (event.data.experienceData) setExperience(event.data.experienceData);
            if (event.data.galleryData) setGallery(event.data.galleryData);
            if (event.data.skillsData) setSkills(event.data.skillsData);
          }
        };
      }
    } catch (e) {}

    const handleSyncUpdate = (e: any) => {
      if (e.detail) {
        if (e.detail.siteData) setSite(e.detail.siteData);
        if (e.detail.projectsData) setProjects(e.detail.projectsData);
        if (e.detail.experienceData) setExperience(e.detail.experienceData);
        if (e.detail.galleryData) setGallery(e.detail.galleryData);
        if (e.detail.skillsData) setSkills(e.detail.skillsData);
      }
    };

    window.addEventListener(UPDATE_EVENT, handleSyncUpdate);
    window.addEventListener("storage", handleSyncUpdate);

    return () => {
      window.removeEventListener(UPDATE_EVENT, handleSyncUpdate);
      window.removeEventListener("storage", handleSyncUpdate);
      if (channel) {
        channel.close();
      }
    };
  }, []);

  // Cooldown countdown timer for OTP resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  function loadInquiries() {
    try {
      const storedInq = localStorage.getItem("denish_contact_inquiries");
      if (storedInq) {
        setInquiries(JSON.parse(storedInq));
      }
    } catch (e) {}
  }

  function toggleInquiryRead(id: string) {
    const updated = inquiries.map((inq) =>
      inq.id === id ? { ...inq, read: !inq.read } : inq
    );
    setInquiries(updated);
    try {
      localStorage.setItem("denish_contact_inquiries", JSON.stringify(updated));
    } catch (e) {}
  }

  function deleteInquiry(id: string) {
    if (!confirm("Are you sure you want to delete this message?")) return;
    const updated = inquiries.filter((inq) => inq.id !== id);
    setInquiries(updated);
    try {
      localStorage.setItem("denish_contact_inquiries", JSON.stringify(updated));
    } catch (e) {}
  }

  function exportInquiriesToCsv() {
    if (inquiries.length === 0) return;
    const headers = ["ID", "Date", "Name", "Email", "Phone", "Service", "Subject", "Message", "Status"];
    const rows = inquiries.map((inq) => [
      `"${inq.id}"`,
      `"${inq.date}"`,
      `"${(inq.name || "").replace(/"/g, '""')}"`,
      `"${(inq.email || "").replace(/"/g, '""')}"`,
      `"${(inq.phone || "").replace(/"/g, '""')}"`,
      `"${(inq.serviceType || "").replace(/"/g, '""')}"`,
      `"${(inq.subject || "").replace(/"/g, '""')}"`,
      `"${(inq.message || "").replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${inq.read ? "Read" : "Unread"}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `denish_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function loadExistingContent() {
    // 1. Try loading from localStorage with strict version and structure validation
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const isCurrentVersion = parsed.version === DATA_VERSION;
        const hasValidConsolidatedProject =
          Array.isArray(parsed.projectsData) &&
          parsed.projectsData.length === defaultProjects.length &&
          parsed.projectsData.some((p: any) => p.id === "wwtp-sallaghari-kodku-dhobighat");

        if (isCurrentVersion && hasValidConsolidatedProject) {
          if (parsed.siteData) setSite(parsed.siteData);
          setProjects(parsed.projectsData);
          if (parsed.experienceData) setExperience(parsed.experienceData);
          if (parsed.galleryData) setGallery(parsed.galleryData);
          if (parsed.skillsData) setSkills(parsed.skillsData);
          return;
        } else {
          // Stale or legacy cache detected: reset to verified defaults
          console.info("Admin: Purging stale cache, initializing with verified data version:", DATA_VERSION);
          setSite(defaultSiteData);
          setProjects(defaultProjects);
          setExperience(defaultExperience);
          setGallery(defaultGallery);
          setSkills(defaultSkills);
          const freshData = {
            siteData: defaultSiteData,
            projectsData: defaultProjects,
            experienceData: defaultExperience,
            galleryData: defaultGallery,
            skillsData: defaultSkills,
            version: DATA_VERSION,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(freshData));
          return;
        }
      }
    } catch (e) {}

    // 2. Fetch from backend API
    fetch("/api/admin/content", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.siteData) setSite(data.siteData);
        if (data.projects) setProjects(data.projects);
        if (data.experience) setExperience(data.experience);
        if (data.gallery) setGallery(data.gallery);
        if (data.skills) setSkills(data.skills);
      })
      .catch((err) => console.warn("Could not fetch remote content:", err));
  }

  // 2-Step Authentication: Step 1 (Password -> Generate & Email OTP)
  async function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "step1_verify", password }),
      });

      const data = await res.json();
      if (res.ok && data.step === 2) {
        setChallengeToken(data.challengeToken);
        setMaskedEmail(data.maskedEmail || "apr***@gmail.com");
        setResendCooldown(60);
        setAuthStep(2);
      } else {
        setLoginError(data.error || "Incorrect master password");
      }
    } catch (err) {
      setLoginError("Failed to communicate with authentication server");
    } finally {
      setLoginLoading(false);
    }
  }

  // Resend OTP via Email
  async function handleResendOtp() {
    if (resendCooldown > 0 || resendLoading) return;
    setResendLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resend_otp", password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setChallengeToken(data.challengeToken);
        setMaskedEmail(data.maskedEmail || maskedEmail);
        setResendCooldown(60);
        setStatusMessage({ text: `New code dispatched to ${data.maskedEmail}`, type: "success" });
      } else {
        setLoginError(data.error || "Failed to resend code");
      }
    } catch (err) {
      setLoginError("Failed to resend code. Please retry.");
    } finally {
      setResendLoading(false);
    }
  }

  // 2-Step Authentication: Step 2 (6-Digit Email OTP)
  async function handleStep2(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "step2_verify", challengeToken, otp }),
      });

      const data = await res.json();
      if (res.ok && data.authenticated) {
        setIsAuthenticated(true);
        loadExistingContent();
      } else {
        setLoginError(data.error || "Invalid 6-digit verification code");
      }
    } catch (err) {
      setLoginError("Verification failed. Please retry.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      setIsAuthenticated(false);
      setAuthStep(1);
      setPassword("");
      setOtp("");
    } catch (e) {
      setIsAuthenticated(false);
    }
  }

  async function handleSaveContent() {
    setSaveLoading(true);
    setStatusMessage(null);

    const unifiedPayload = {
      siteData: site,
      projectsData: projects,
      experienceData: experience,
      galleryData: gallery,
      skillsData: skills,
      version: DATA_VERSION,
    };

    // 1. Instant client-side persistence & cross-tab real-time dispatch
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(unifiedPayload));
      window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: unifiedPayload }));
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const ch = new BroadcastChannel(BROADCAST_CHANNEL);
        ch.postMessage(unifiedPayload);
        ch.close();
      }
    } catch (err) {
      console.error("Storage error:", err);
    }

    // 2. Server & GitHub API sync
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteData: site,
          projects,
          experience,
          skills,
          gallery,
          githubToken: githubToken.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({
          text: data.message || "Edits successfully applied and synchronized across the website!",
          type: "success",
        });
      } else {
        setStatusMessage({
          text: "Edits applied to your live session! (Backend notice: " + (data.error || "Saved locally") + ")",
          type: "success",
        });
      }
    } catch (err) {
      setStatusMessage({
        text: "Edits successfully updated on your browser session and live preview!",
        type: "success",
      });
    } finally {
      setSaveLoading(false);
    }
  }

  function handleRestoreDefaults() {
    if (
      confirm(
        "Are you sure you want to restore all original verified portfolio data? This will reset custom edits."
      )
    ) {
      setSite(defaultSiteData);
      setProjects(defaultProjects);
      setExperience(defaultExperience);
      setGallery(defaultGallery);
      setSkills(defaultSkills);

      const freshData = {
        siteData: defaultSiteData,
        projectsData: defaultProjects,
        experienceData: defaultExperience,
        galleryData: defaultGallery,
        skillsData: defaultSkills,
        version: DATA_VERSION,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(freshData));
      window.dispatchEvent(
        new CustomEvent(UPDATE_EVENT, {
          detail: freshData,
        })
      );
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const ch = new BroadcastChannel(BROADCAST_CHANNEL);
        ch.postMessage(freshData);
        ch.close();
      }
      setStatusMessage({ text: "Portfolio restored to verified default configuration.", type: "success" });
    }
  }

  function handleForceSync() {
    setSite(defaultSiteData);
    setProjects(defaultProjects);
    setExperience(defaultExperience);
    setGallery(defaultGallery);
    setSkills(defaultSkills);

    const freshData = {
      siteData: defaultSiteData,
      projectsData: defaultProjects,
      experienceData: defaultExperience,
      galleryData: defaultGallery,
      skillsData: defaultSkills,
      version: DATA_VERSION,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(freshData));
    window.dispatchEvent(
      new CustomEvent(UPDATE_EVENT, {
        detail: freshData,
      })
    );
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const ch = new BroadcastChannel(BROADCAST_CHANNEL);
      ch.postMessage(freshData);
      ch.close();
    }
    setStatusMessage({
      text: "Admin dashboard and live portfolio synchronized simultaneously with verified codebase data!",
      type: "success",
    });
  }

  function handleSaveGithubToken(tokenVal: string) {
    setGithubToken(tokenVal);
    try {
      if (tokenVal.trim()) {
        localStorage.setItem("denish_gh_pat", tokenVal.trim());
      } else {
        localStorage.removeItem("denish_gh_pat");
      }
    } catch (e) {}
  }

  function handleExportBackup() {
    const backupData = {
      siteData: site,
      projects,
      experience,
      skills,
      gallery,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `denish_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  }

  // Loading State
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <div className="flex items-center gap-3 font-mono text-accent text-sm">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Verifying Civil Engineering Credentials...</span>
        </div>
      </div>
    );
  }

  // Two-Step Double Verification Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-[size:32px_32px] opacity-30 pointer-events-none" />
        <div className="max-w-md w-full relative z-10">
          <div className="bg-surface rounded-2xl border border-border p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-surface-light border border-border mx-auto flex items-center justify-center text-accent shadow-inner">
                {authStep === 1 ? <Lock className="w-6 h-6 text-accent" /> : <KeyRound className="w-6 h-6 text-emerald-400" />}
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-[11px] font-mono font-semibold text-emerald-400 mt-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>NEC NO. 79422 // 2-STEP AUTHENTICATION</span>
              </div>
              <h1 className="text-2xl font-bold text-text-primary">
                {authStep === 1 ? "Engineer Administration" : "Email Two-Factor Security"}
              </h1>
              <p className="text-xs text-text-muted font-mono">
                {authStep === 1
                  ? "Step 1: Enter Master Passcode"
                  : "Step 2: Enter 6-Digit Code Dispatched to Your Email"}
              </p>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <div className={`h-1.5 w-16 rounded-full transition-all ${authStep === 1 ? "bg-accent" : "bg-emerald-500"}`} />
              <div className={`h-1.5 w-16 rounded-full transition-all ${authStep === 2 ? "bg-accent" : "bg-surface-dark border border-border"}`} />
            </div>

            {loginError && (
              <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800/60 flex items-start gap-2.5 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* STEP 1 FORM */}
            {authStep === 1 && (
              <form onSubmit={handleStep1} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-text-secondary mb-1.5">
                    Master Admin Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter master password..."
                      className="w-full px-4 py-3 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:outline-none focus:border-accent font-mono transition-colors"
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-text-muted hover:text-text-primary transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-text-muted font-mono mt-1">Default: denish2026!</p>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3.5 rounded-xl bg-accent hover:bg-accent-soft text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-accent/25 flex items-center justify-center gap-2"
                >
                  {loginLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Step 1...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue to Step 2</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2 FORM: EMAIL OTP VERIFICATION */}
            {authStep === 2 && (
              <form onSubmit={handleStep2} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono font-semibold uppercase text-text-secondary">
                      6-Digit Email OTP
                    </label>
                    <span className="text-[10px] font-mono text-emerald-400">Single-Use Code</span>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="• • • • • •"
                    className="w-full px-4 py-3 rounded-xl bg-surface-dark border border-border text-center text-xl tracking-[0.5em] font-mono font-bold text-accent focus:outline-none focus:border-accent transition-colors placeholder:tracking-normal placeholder:text-text-muted"
                    required
                    autoFocus
                  />
                  <p className="text-[11px] text-text-muted font-mono text-center mt-2">
                    Code sent to <span className="text-text-primary font-semibold">{maskedEmail || "apr***@gmail.com"}</span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading || otp.length < 6}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loginLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify Code &amp; Unlock Console</span>
                    </>
                  )}
                </button>

                {/* Resend Code Button with Cooldown */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || resendLoading}
                    className="text-xs font-mono text-accent hover:text-accent-soft disabled:text-text-muted transition-colors flex items-center gap-1.5"
                  >
                    {resendLoading ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : resendCooldown > 0 ? (
                      <span>Resend Code ({resendCooldown}s)</span>
                    ) : (
                      <>
                        <Mail className="w-3 h-3" />
                        <span>Resend OTP via Email</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthStep(1);
                      setOtp("");
                      setLoginError("");
                    }}
                    className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors"
                  >
                    ← Back to Step 1
                  </button>
                </div>
              </form>
            )}

            <div className="pt-2 text-center">
              <Link href="/" className="text-xs font-mono text-text-muted hover:text-accent transition-colors">
                ← Return to Public Portfolio
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-[#0B0F14] text-text-primary">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-[#0B0F14]/90 backdrop-blur-md border-b border-border/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center text-accent font-mono font-bold text-sm">
              CE
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-text-primary text-sm">{site.personal.name}</span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> 2FA SECURED
                </span>
              </div>
              <p className="text-[11px] text-text-muted font-mono">{site.personal.license}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-accent text-xs font-semibold text-text-secondary hover:text-text-primary transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-accent" />
              <span>View Live Site</span>
            </Link>

            <button
              onClick={handleExportBackup}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-accent text-xs font-semibold text-text-secondary hover:text-text-primary transition-all"
              title="Download full JSON backup of portfolio"
            >
              <Download className="w-3.5 h-3.5 text-accent" />
              <span className="hidden md:inline">Backup</span>
            </button>

            <button
              onClick={handleRestoreDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-amber-500 text-xs font-semibold text-text-secondary hover:text-amber-400 transition-all"
              title="Restore default verified data"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Reset Defaults</span>
            </button>

            <button
              onClick={handleSaveContent}
              disabled={saveLoading}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-emerald-600/20"
            >
              {saveLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving &amp; Publishing...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save &amp; Publish Changes</span>
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-surface border border-border hover:border-red-500 text-text-muted hover:text-red-400 transition-colors"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Status Alert */}
      {statusMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-4">
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
              statusMessage.type === "success"
                ? "bg-emerald-950/60 border-emerald-800/60 text-emerald-300"
                : "bg-red-950/60 border-red-800/60 text-red-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-text-muted hover:text-text-primary text-xs">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Tabs Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border/70 pb-3">
          <button
            onClick={() => setActiveTab("profile")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
              activeTab === "profile"
                ? "bg-accent text-white shadow-md shadow-accent/20"
                : "bg-surface border border-border text-text-secondary hover:text-text-primary"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>PROFILE &amp; STATS</span>
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
              activeTab === "projects"
                ? "bg-accent text-white shadow-md shadow-accent/20"
                : "bg-surface border border-border text-text-secondary hover:text-text-primary"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>PROJECTS ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("experience")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
              activeTab === "experience"
                ? "bg-accent text-white shadow-md shadow-accent/20"
                : "bg-surface border border-border text-text-secondary hover:text-text-primary"
            }`}
          >
            <HardHat className="w-3.5 h-3.5" />
            <span>EXPERIENCE ({experience.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
              activeTab === "gallery"
                ? "bg-accent text-white shadow-md shadow-accent/20"
                : "bg-surface border border-border text-text-secondary hover:text-text-primary"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>GALLERY ({gallery.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("skills")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
              activeTab === "skills"
                ? "bg-accent text-white shadow-md shadow-accent/20"
                : "bg-surface border border-border text-text-secondary hover:text-text-primary"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>SKILLS &amp; CODES</span>
          </button>

          <button
            onClick={() => setActiveTab("media")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
              activeTab === "media"
                ? "bg-accent text-white shadow-md shadow-accent/20"
                : "bg-surface border border-border text-text-secondary hover:text-text-primary"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>MEDIA ASSETS ({availableImages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("inbox")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all relative ${
              activeTab === "inbox"
                ? "bg-accent text-white shadow-md shadow-accent/20"
                : "bg-surface border border-border text-text-secondary hover:text-text-primary"
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>INBOX</span>
            {inquiries.filter((i) => !i.read).length > 0 ? (
              <span className="px-1.5 py-0.2 rounded-full bg-accent text-white text-[10px] font-bold">
                {inquiries.filter((i) => !i.read).length} NEW
              </span>
            ) : (
              <span className="text-[10px] text-text-muted">({inquiries.length})</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("sync")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
              activeTab === "sync"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-surface border border-border text-emerald-400 hover:text-emerald-300"
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>GLOBAL SYNC</span>
          </button>
        </div>

        {/* TAB 1: Profile, Rotating Roles & Stats */}
        {activeTab === "profile" && (
          <div className="space-y-8">
            <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6">
              <div className="border-b border-border/70 pb-4">
                <h2 className="text-lg font-bold text-text-primary">Profile Credentials &amp; Contact Details</h2>
                <p className="text-xs text-text-secondary">
                  These fields dynamically update your Navigation header, Hero headline, About section, Contact channels, and Footer.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-text-secondary mb-1">
                    Full Engineer Name
                  </label>
                  <input
                    type="text"
                    value={site.personal.name}
                    onChange={(e) =>
                      setSite({ ...site, personal: { ...site.personal, name: e.target.value } })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-text-secondary mb-1">
                    Professional Role / Title
                  </label>
                  <input
                    type="text"
                    value={site.personal.role}
                    onChange={(e) =>
                      setSite({ ...site, personal: { ...site.personal, role: e.target.value } })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-text-secondary mb-1">
                    Official Phone / WhatsApp Voice
                  </label>
                  <input
                    type="text"
                    value={site.personal.phone}
                    onChange={(e) =>
                      setSite({ ...site, personal: { ...site.personal, phone: e.target.value } })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-text-secondary mb-1">
                    Official Email Address
                  </label>
                  <input
                    type="email"
                    value={site.personal.email}
                    onChange={(e) =>
                      setSite({ ...site, personal: { ...site.personal, email: e.target.value } })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-text-secondary mb-1">
                    Primary Location Base
                  </label>
                  <input
                    type="text"
                    value={site.personal.location}
                    onChange={(e) =>
                      setSite({ ...site, personal: { ...site.personal, location: e.target.value } })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-text-secondary mb-1">
                    Nepal Engineering Council License
                  </label>
                  <input
                    type="text"
                    value={site.personal.license}
                    onChange={(e) =>
                      setSite({ ...site, personal: { ...site.personal, license: e.target.value } })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              {/* Rotating Specializations Tag Editor */}
              <div className="pt-2 border-t border-border/60">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono uppercase text-text-secondary">
                    Hero Rotating Specialization Ticker ({site.personal.rotatingRoles.length})
                  </label>
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {site.personal.rotatingRoles.map((role, rIdx) => (
                    <span
                      key={rIdx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-dark border border-border text-xs font-mono text-accent"
                    >
                      <span>{role}</span>
                      <button
                        onClick={() => {
                          const updated = site.personal.rotatingRoles.filter((_, i) => i !== rIdx);
                          setSite({ ...site, personal: { ...site.personal, rotatingRoles: updated } });
                        }}
                        className="text-text-muted hover:text-red-400 ml-1"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newRoleInput}
                    onChange={(e) => setNewRoleInput(e.target.value)}
                    placeholder="Add new specialization (e.g. Geotechnical Analysis)..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-surface-dark border border-border text-xs text-text-primary focus:border-accent focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newRoleInput.trim()) {
                        e.preventDefault();
                        setSite({
                          ...site,
                          personal: {
                            ...site.personal,
                            rotatingRoles: [...site.personal.rotatingRoles, newRoleInput.trim()],
                          },
                        });
                        setNewRoleInput("");
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (newRoleInput.trim()) {
                        setSite({
                          ...site,
                          personal: {
                            ...site.personal,
                            rotatingRoles: [...site.personal.rotatingRoles, newRoleInput.trim()],
                          },
                        });
                        setNewRoleInput("");
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-mono font-semibold"
                  >
                    Add Role
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1">
                  Hero Short Introduction
                </label>
                <textarea
                  rows={2}
                  value={site.personal.shortBio}
                  onChange={(e) =>
                    setSite({ ...site, personal: { ...site.personal, shortBio: e.target.value } })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1">
                  About Section Detailed Bio
                </label>
                <textarea
                  rows={3}
                  value={site.personal.fullBio}
                  onChange={(e) =>
                    setSite({ ...site, personal: { ...site.personal, fullBio: e.target.value } })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:border-accent focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1">
                  Engineering Philosophy Quote
                </label>
                <input
                  type="text"
                  value={site.personal.philosophy}
                  onChange={(e) =>
                    setSite({ ...site, personal: { ...site.personal, philosophy: e.target.value } })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            {/* Live Stats Customizer */}
            <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6">
              <div className="border-b border-border/70 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-accent" />
                    <span>Verified Metrics &amp; Practice Highlights</span>
                  </h2>
                  <p className="text-xs text-text-secondary">
                    Customize the 4 numerical highlight badges displayed in the "Engineering at a Glance" strip.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {site.stats.map((st, sIdx) => (
                  <div key={sIdx} className="bg-surface-dark p-4 rounded-xl border border-border space-y-3">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-text-muted mb-1">
                        Stat Value
                      </label>
                      <input
                        type="text"
                        value={st.value}
                        onChange={(e) => {
                          const updated = [...site.stats];
                          updated[sIdx].value = e.target.value;
                          setSite({ ...site, stats: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-base font-bold text-accent focus:border-accent focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-text-muted mb-1">
                        Label Title
                      </label>
                      <input
                        type="text"
                        value={st.label}
                        onChange={(e) => {
                          const updated = [...site.stats];
                          updated[sIdx].label = e.target.value;
                          setSite({ ...site, stats: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-text-primary focus:border-accent focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-text-muted mb-1">
                        Subtext Detail
                      </label>
                      <input
                        type="text"
                        value={st.subtext}
                        onChange={(e) => {
                          const updated = [...site.stats];
                          updated[sIdx].subtext = e.target.value;
                          setSite({ ...site, stats: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-[11px] text-text-muted focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Projects Management (Enhanced with Reordering & Media Picker) */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-border">
              <div>
                <h2 className="text-lg font-bold text-text-primary">Project Case Studies ({projects.length})</h2>
                <p className="text-xs text-text-secondary">
                  Add, edit, reorder, or duplicate engineering case studies. Use the Move Up/Down buttons to customize display order.
                </p>
              </div>
              <button
                onClick={() => {
                  const newProj: ProjectCaseStudy = {
                    id: `proj-${Date.now()}`,
                    slug: `new-civil-project-${Date.now()}`,
                    number: `0${projects.length + 1}`,
                    title: "New Civil Engineering Project",
                    subtitle: "RCC Execution & Quality Control",
                    category: "INFRASTRUCTURE",
                    location: "Kathmandu, Nepal",
                    firm: "Sarathi Construction Pvt. Ltd.",
                    duration: "2024",
                    role: "Civil Site Engineer",
                    tools: ["Total Station", "AutoCAD", "Auto Level"],
                    image: "/images/site/site-24.jpg",
                    summary: "Project overview and structural execution description.",
                    facts: [
                      { label: "Execution Standard", value: "NBC 105:2020" },
                      { label: "Material Grade", value: "M25 RCC / Fe500" },
                    ],
                    overview: "Detailed engineering overview of the site operations.",
                    myRole: "Direct field supervision and instrumental setting out.",
                    responsibilities: [
                      "Conducted layout alignment and level checks.",
                      "Supervised concrete placement and vibration.",
                    ],
                    technicalApproach: ["Grid transfer from permanent benchmark."],
                    challenges: ["Water table fluctuations during deep excavation."],
                    solutions: ["Installed dewatering submersible pump network."],
                    outcomes: ["Achieved 100% structural tolerance compliance."],
                    phases: [],
                    drawings: [],
                    sitePhotos: [],
                  };
                  setEditingProject(newProj);
                  setIsNewProject(true);
                  setProjectModalTab("info");
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent hover:bg-accent-soft text-white text-xs font-semibold shadow-lg shadow-accent/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Project</span>
              </button>
            </div>

            {/* Search & Filter Bar for Projects */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface p-3.5 rounded-xl border border-border">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={adminProjectCategory}
                  onChange={(e) => setAdminProjectCategory(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-surface-dark border border-border text-xs font-mono text-text-primary focus:outline-none focus:border-accent"
                >
                  <option value="ALL">All Categories ({projects.length})</option>
                  {Array.from(new Set(projects.map((p) => p.category))).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat} ({projects.filter((p) => p.category === cat).length})
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-text-muted" />
                <input
                  type="text"
                  value={adminProjectSearch}
                  onChange={(e) => setAdminProjectSearch(e.target.value)}
                  placeholder="Filter by title, tool, location..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface-dark border border-border text-xs font-mono text-text-primary focus:outline-none focus:border-accent placeholder:text-text-muted"
                />
                {adminProjectSearch && (
                  <button
                    onClick={() => setAdminProjectSearch("")}
                    className="absolute right-2.5 top-2 text-text-muted hover:text-text-primary text-xs"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects
                .filter((proj) => {
                  const matchCat = adminProjectCategory === "ALL" || proj.category === adminProjectCategory;
                  if (!matchCat) return false;
                  if (!adminProjectSearch.trim()) return true;
                  const q = adminProjectSearch.toLowerCase();
                  return (
                    proj.title.toLowerCase().includes(q) ||
                    proj.location.toLowerCase().includes(q) ||
                    proj.tools.some((t) => t.toLowerCase().includes(q))
                  );
                })
                .map((proj, idx) => (
                <div
                  key={proj.id}
                  className="bg-surface rounded-2xl border border-border p-5 flex flex-col justify-between space-y-4 hover:border-accent/40 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-accent px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
                        {proj.category}
                      </span>
                      <div className="flex items-center gap-1">
                        {/* Reorder Buttons */}
                        <button
                          disabled={idx === 0}
                          onClick={() => {
                            if (idx > 0) {
                              const updated = [...projects];
                              const temp = updated[idx - 1];
                              updated[idx - 1] = updated[idx];
                              updated[idx] = temp;
                              setProjects(updated);
                            }
                          }}
                          className="p-1 rounded bg-surface-dark border border-border text-text-muted hover:text-text-primary disabled:opacity-30"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          disabled={idx === projects.length - 1}
                          onClick={() => {
                            if (idx < projects.length - 1) {
                              const updated = [...projects];
                              const temp = updated[idx + 1];
                              updated[idx + 1] = updated[idx];
                              updated[idx] = temp;
                              setProjects(updated);
                            }
                          }}
                          className="p-1 rounded bg-surface-dark border border-border text-text-muted hover:text-text-primary disabled:opacity-30"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs text-text-muted ml-1">#{proj.number}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-16 h-12 rounded-lg bg-surface-dark overflow-hidden border border-border shrink-0">
                        <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary text-base leading-snug">{proj.title}</h3>
                        <p className="text-xs text-text-muted">{proj.subtitle}</p>
                        {proj.phases && (
                          <div className="flex flex-wrap items-center gap-2 pt-1.5 font-mono text-xs">
                            <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-[10px] font-semibold">
                              {proj.phases.length} Execution Phases
                            </span>
                            <span className="px-2 py-0.5 rounded bg-sky-950/60 border border-sky-800/40 text-sky-400 text-[10px] font-semibold">
                              {proj.drawings?.length || 0} Technical Drawings
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.tools.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded bg-surface-dark text-[11px] font-mono text-text-secondary border border-border/60"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/70 flex items-center justify-between">
                    <span className="text-xs font-mono text-text-muted">{proj.location}</span>
                    <div className="flex items-center gap-2">
                      {/* View Live Link */}
                      <Link
                        href={`/projects/${proj.slug}`}
                        target="_blank"
                        className="p-2 rounded-lg bg-surface-dark hover:bg-surface border border-border text-text-secondary hover:text-accent transition-colors"
                        title="View Live Case Study"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      {/* Clone Button */}
                      <button
                        onClick={() => {
                          const cloned: ProjectCaseStudy = {
                            ...proj,
                            id: `proj-${Date.now()}`,
                            slug: `${proj.slug}-copy`,
                            title: `${proj.title} (Copy)`,
                            number: `0${projects.length + 1}`,
                          };
                          setProjects([...projects, cloned]);
                        }}
                        className="p-2 rounded-lg bg-surface-dark hover:bg-surface border border-border text-text-secondary hover:text-text-primary transition-colors"
                        title="Duplicate Project"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => {
                          setEditingProject({
                            ...proj,
                            tools: proj.tools || [],
                            facts: proj.facts || [],
                            phases: proj.phases || [],
                            drawings: proj.drawings || [],
                            sitePhotos: proj.sitePhotos || [],
                            responsibilities: proj.responsibilities || [],
                            technicalApproach: proj.technicalApproach || [],
                            challenges: proj.challenges || [],
                            solutions: proj.solutions || [],
                            outcomes: proj.outcomes || [],
                          });
                          setIsNewProject(false);
                          setProjectModalTab("info");
                        }}
                        className="p-2 rounded-lg bg-surface-dark hover:bg-accent/10 border border-border hover:border-accent text-text-secondary hover:text-accent transition-colors"
                        title="Edit Project"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${proj.title}"?`)) {
                            setProjects(projects.filter((p) => p.id !== proj.id));
                          }
                        }}
                        className="p-2 rounded-lg bg-surface-dark hover:bg-red-950/40 border border-border hover:border-red-500 text-text-muted hover:text-red-400 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Experience Management */}
        {activeTab === "experience" && (
          <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
              <div>
                <h2 className="text-lg font-bold text-text-primary">Professional Work Experience</h2>
                <p className="text-xs text-text-secondary">
                  Manage engineering appointments, key accomplishments, and supervised operations.
                </p>
              </div>
              <button
                onClick={() => {
                  const newExp: ExperienceItem = {
                    period: "2025 — PRESENT",
                    role: "Senior Civil Site Engineer",
                    company: "Engineering Construction Firm",
                    location: "Kathmandu, Nepal",
                    description: "Site engineering supervision and structural execution.",
                    achievements: ["Supervised RCC casting and structural compliance."],
                    skills: ["Total Station", "RCC Supervision"],
                  };
                  setExperience([...experience, newExp]);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent hover:bg-accent-soft text-white text-xs font-semibold shadow-lg shadow-accent/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Position</span>
              </button>
            </div>

            <div className="space-y-6">
              {experience.map((exp, idx) => (
                <div key={idx} className="bg-surface-dark p-6 rounded-xl border border-border space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-text-muted mb-1">
                        Role Title
                      </label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => {
                          const updated = [...experience];
                          updated[idx].role = e.target.value;
                          setExperience(updated);
                        }}
                        className="w-full px-3.5 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary focus:border-accent focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-text-muted mb-1">
                        Company / Contractor
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...experience];
                          updated[idx].company = e.target.value;
                          setExperience(updated);
                        }}
                        className="w-full px-3.5 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary focus:border-accent focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-text-muted mb-1">
                        Period / Duration
                      </label>
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) => {
                          const updated = [...experience];
                          updated[idx].period = e.target.value;
                          setExperience(updated);
                        }}
                        className="w-full px-3.5 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary focus:border-accent focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-text-muted mb-1">
                        Site Location
                      </label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => {
                          const updated = [...experience];
                          updated[idx].location = e.target.value;
                          setExperience(updated);
                        }}
                        className="w-full px-3.5 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-text-muted mb-1">
                      Role Overview Description
                    </label>
                    <textarea
                      rows={2}
                      value={exp.description}
                      onChange={(e) => {
                        const updated = [...experience];
                        updated[idx].description = e.target.value;
                        setExperience(updated);
                      }}
                      className="w-full px-3.5 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[11px] font-mono uppercase text-text-muted">
                        Key Responsibilities &amp; Achievements ({exp.achievements.length})
                      </label>
                      <button
                        onClick={() => {
                          const updated = [...experience];
                          updated[idx].achievements.push("New verified field responsibility.");
                          setExperience(updated);
                        }}
                        className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Item
                      </button>
                    </div>

                    <div className="space-y-2">
                      {exp.achievements.map((ach, achIdx) => (
                        <div key={achIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={ach}
                            onChange={(e) => {
                              const updated = [...experience];
                              updated[idx].achievements[achIdx] = e.target.value;
                              setExperience(updated);
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-text-secondary focus:border-accent focus:outline-none"
                          />
                          <button
                            onClick={() => {
                              const updated = [...experience];
                              updated[idx].achievements.splice(achIdx, 1);
                              setExperience(updated);
                            }}
                            className="p-1.5 text-text-muted hover:text-red-400"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        if (confirm(`Delete position "${exp.role}"?`)) {
                          setExperience(experience.filter((_, i) => i !== idx));
                        }
                      }}
                      className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Remove Position
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Gallery Records */}
        {activeTab === "gallery" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-border">
              <div>
                <h2 className="text-lg font-bold text-text-primary">Construction &amp; Survey Records ({gallery.length})</h2>
                <p className="text-xs text-text-secondary">
                  Photographic field documentation. Click any photo thumbnail or choose from Media Assets.
                </p>
              </div>
              <button
                onClick={() => {
                  const newPhoto: GalleryItem = {
                    id: `g-${Date.now()}`,
                    title: "New Site Inspection Record",
                    category: "CONSTRUCTION",
                    location: "Sallaghari WWTP, Bhaktapur",
                    date: "Ongoing Phase",
                    caption: "Photographic inspection of reinforcement and concrete placement.",
                    image: "/images/site/site-12.jpg",
                    tags: ["Site Supervision", "Quality Control"],
                  };
                  setGallery([newPhoto, ...gallery]);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent hover:bg-accent-soft text-white text-xs font-semibold shadow-lg shadow-accent/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Photo Record</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-surface rounded-2xl border border-border overflow-hidden p-4 space-y-3"
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-surface-dark border border-border group">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#0B0F14]/90 border border-border text-[10px] font-mono text-accent">
                      {item.category}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-text-muted mb-0.5">
                      Record Title
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...gallery];
                        updated[idx].title = e.target.value;
                        setGallery(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-surface-dark border border-border text-xs text-text-primary focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-text-muted mb-0.5">
                      Image URL / Path
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={item.image}
                        onChange={(e) => {
                          const updated = [...gallery];
                          updated[idx].image = e.target.value;
                          setGallery(updated);
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-surface-dark border border-border text-xs text-text-secondary focus:border-accent focus:outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setMediaPicker({
                            isOpen: true,
                            title: `Select Photo for: ${item.title}`,
                            onSelect: (p) => {
                              const updated = [...gallery];
                              updated[idx].image = p;
                              setGallery(updated);
                            },
                          })
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-surface-dark border border-border hover:border-accent text-accent text-xs font-mono flex items-center gap-1 shrink-0"
                        title="Choose from Media Library"
                      >
                        <ImageIcon className="w-3 h-3" />
                        <span>Choose</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-text-muted mb-0.5">
                      Caption Description
                    </label>
                    <textarea
                      rows={2}
                      value={item.caption}
                      onChange={(e) => {
                        const updated = [...gallery];
                        updated[idx].caption = e.target.value;
                        setGallery(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-surface-dark border border-border text-xs text-text-secondary focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-border/60">
                    <span className="text-[11px] font-mono text-text-muted">{item.location}</span>
                    <button
                      onClick={() => {
                        if (confirm(`Remove record "${item.title}"?`)) {
                          setGallery(gallery.filter((g) => g.id !== item.id));
                        }
                      }}
                      className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Skills & Competencies */}
        {activeTab === "skills" && (
          <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6">
            <div className="border-b border-border/70 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-text-primary">Skills, Software &amp; Building Codes</h2>
                <p className="text-xs text-text-secondary">
                  Technical competencies, surveying instruments, materials testing protocols, and code standards.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skills.map((cat, catIdx) => (
                <div key={catIdx} className="bg-surface-dark p-5 rounded-xl border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono text-xs font-bold text-accent tracking-wide uppercase">
                      {cat.category}
                    </h3>
                    <button
                      onClick={() => {
                        const updated = [...skills];
                        updated[catIdx].skills.push({
                          name: "New Competency",
                          note: "Field application note",
                        });
                        setSkills(updated);
                      }}
                      className="text-[11px] font-mono text-text-muted hover:text-accent flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Skill
                    </button>
                  </div>
                  <p className="text-xs text-text-muted">{cat.description}</p>

                  <div className="space-y-2 pt-2">
                    {cat.skills.map((s, sIdx) => (
                      <div key={sIdx} className="bg-surface p-2.5 rounded-lg border border-border/80 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={s.name}
                            onChange={(e) => {
                              const updated = [...skills];
                              updated[catIdx].skills[sIdx].name = e.target.value;
                              setSkills(updated);
                            }}
                            className="font-semibold text-xs text-text-primary bg-transparent focus:outline-none flex-1 border-b border-transparent focus:border-accent"
                          />
                          <button
                            onClick={() => {
                              const updated = [...skills];
                              updated[catIdx].skills.splice(sIdx, 1);
                              setSkills(updated);
                            }}
                            className="text-text-muted hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={s.note}
                          onChange={(e) => {
                            const updated = [...skills];
                            updated[catIdx].skills[sIdx].note = e.target.value;
                            setSkills(updated);
                          }}
                          className="w-full text-[11px] text-text-muted bg-transparent focus:outline-none border-b border-transparent focus:border-border"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: Media Asset Manager */}
        {activeTab === "media" && (
          <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6">
            <div className="border-b border-border/70 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-accent" />
                  <span>Media Asset Browser ({mediaAssetsList.length} Files)</span>
                </h2>
                <p className="text-xs text-text-secondary mt-1">
                  Complete repository of verified site photography, CAD drawings, profile portraits, and vector diagrams. Click &quot;Copy Path&quot; to use in any project, phase, drawing, or gallery record.
                </p>
              </div>

              {/* Quick Summary Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg bg-surface-dark border border-border text-[11px] font-mono text-emerald-400">
                  46 Site Photos
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-surface-dark border border-border text-[11px] font-mono text-sky-400">
                  2 CAD Drawings
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-surface-dark border border-border text-[11px] font-mono text-amber-400">
                  3 Portraits
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-surface-dark border border-border text-[11px] font-mono text-purple-400">
                  11 Schematics
                </span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface-dark p-3.5 rounded-xl border border-border">
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { key: "ALL", label: `All (${mediaAssetsList.length})` },
                  { key: "site", label: `Site Photos (${mediaAssetsList.filter((m) => m.category === "site").length})` },
                  { key: "drawings", label: `Drawings (${mediaAssetsList.filter((m) => m.category === "drawings").length})` },
                  { key: "profile", label: `Profile (${mediaAssetsList.filter((m) => m.category === "profile").length})` },
                  { key: "schematics", label: `Schematics (${mediaAssetsList.filter((m) => m.category === "schematics").length})` },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setMediaTabCategory(tab.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                      mediaTabCategory === tab.key
                        ? "bg-accent text-white shadow-md shadow-accent/20"
                        : "bg-surface border border-border text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-text-muted" />
                <input
                  type="text"
                  value={mediaTabSearch}
                  onChange={(e) => setMediaTabSearch(e.target.value)}
                  placeholder="Filter by name or path..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-mono text-text-primary focus:outline-none focus:border-accent placeholder:text-text-muted"
                />
                {mediaTabSearch && (
                  <button
                    onClick={() => setMediaTabSearch("")}
                    className="absolute right-2.5 top-2 text-text-muted hover:text-text-primary text-xs"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
              {mediaAssetsList
                .filter((asset) => {
                  const matchCat = mediaTabCategory === "ALL" || asset.category === mediaTabCategory;
                  if (!matchCat) return false;
                  if (!mediaTabSearch.trim()) return true;
                  const q = mediaTabSearch.toLowerCase();
                  return (
                    asset.name.toLowerCase().includes(q) ||
                    asset.path.toLowerCase().includes(q) ||
                    asset.categoryLabel.toLowerCase().includes(q)
                  );
                })
                .map((asset, iIdx) => (
                  <div
                    key={iIdx}
                    className="bg-surface-dark rounded-xl border border-border overflow-hidden p-2.5 space-y-2 group hover:border-accent/50 transition-all hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-black/50 border border-border/80">
                      <img
                        src={asset.path}
                        alt={asset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[9px] font-mono text-accent">
                        {asset.categoryLabel}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-mono text-text-primary truncate font-semibold" title={asset.name}>
                        {asset.name}
                      </p>
                      <div className="flex items-center justify-between text-[10px] font-mono text-text-muted">
                        <span className="truncate max-w-[90px]" title={asset.path}>
                          {asset.path}
                        </span>
                        <button
                          onClick={() => copyToClipboard(asset.path)}
                          className="px-2 py-1 rounded bg-surface border border-border hover:border-accent text-text-secondary hover:text-accent flex items-center gap-1 shrink-0"
                          title="Copy file path"
                        >
                          {copiedText === asset.path ? (
                            <span className="text-emerald-400 flex items-center gap-0.5 font-bold">
                              <Check className="w-3 h-3" /> Copied
                            </span>
                          ) : (
                            <span className="flex items-center gap-0.5">
                              <Copy className="w-3 h-3" /> Copy
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 7: Inquiries Inbox (Upgraded with CSV Export, Read Toggles, and WhatsApp Reply) */}
        {activeTab === "inbox" && (
          <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6">
            <div className="border-b border-border/70 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-accent" />
                  <span>Client Inquiries &amp; Messages ({inquiries.length})</span>
                </h2>
                <p className="text-xs text-text-secondary">
                  Messages submitted by prospective clients and contractors through your public Contact section.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {inquiries.length > 0 && (
                  <>
                    <button
                      onClick={exportInquiriesToCsv}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-dark border border-border hover:border-accent text-xs font-mono text-text-primary transition-colors shadow-sm"
                      title="Download CSV spreadsheet of inquiries"
                    >
                      <Download className="w-3.5 h-3.5 text-accent" />
                      <span>Export CSV</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Are you sure you want to clear all received messages?")) {
                          setInquiries([]);
                          try {
                            localStorage.removeItem("denish_contact_inquiries");
                          } catch (e) {}
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-800/50 hover:border-red-500 text-xs font-mono text-red-400 hover:text-red-300 transition-colors"
                    >
                      Clear All
                    </button>
                  </>
                )}
              </div>
            </div>

            {inquiries.length === 0 ? (
              <div className="p-12 text-center space-y-3 rounded-xl bg-surface-dark/50 border border-border/60">
                <Mail className="w-10 h-10 text-text-muted mx-auto" />
                <h3 className="text-sm font-semibold text-text-primary">No inquiries received yet</h3>
                <p className="text-xs text-text-muted max-w-sm mx-auto">
                  When clients or contractors submit the contact form on your live website, their messages will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => {
                  const cleanPhone = inq.phone ? inq.phone.replace(/[^0-9]/g, "") : null;
                  return (
                    <div
                      key={inq.id}
                      className={`p-5 rounded-xl border transition-all space-y-3 ${
                        inq.read
                          ? "bg-surface-dark/60 border-border/70 opacity-90"
                          : "bg-surface-dark border-accent/40 shadow-md shadow-accent/5"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                              inq.read
                                ? "bg-surface border border-border text-text-muted"
                                : "bg-accent/20 border border-accent/40 text-accent"
                            }`}
                          >
                            {inq.read ? "READ" : "NEW MESSAGE"}
                          </span>
                          <span className="font-bold text-sm text-text-primary">{inq.name}</span>
                          <span className="text-xs font-mono text-accent">({inq.email})</span>
                          {inq.phone && inq.phone !== "Not provided" && (
                            <span className="text-xs font-mono text-text-muted">| {inq.phone}</span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-text-muted">{inq.date}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                        {inq.serviceType && (
                          <span className="px-2 py-0.5 rounded bg-surface border border-border/60 text-text-secondary text-[11px]">
                            Service: <strong className="text-text-primary">{inq.serviceType}</strong>
                          </span>
                        )}
                        <span className="text-text-secondary">
                          Subject: <strong className="text-text-primary">{inq.subject}</strong>
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-text-primary leading-relaxed bg-surface p-3.5 rounded-lg border border-border/70 whitespace-pre-wrap">
                        {inq.message}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => toggleInquiryRead(inq.id)}
                            className="text-xs font-mono text-text-muted hover:text-accent transition-colors"
                          >
                            {inq.read ? "Mark as Unread" : "Mark as Read"}
                          </button>
                          <span className="text-border">|</span>
                          <button
                            type="button"
                            onClick={() => deleteInquiry(inq.id)}
                            className="text-xs font-mono text-text-muted hover:text-red-400 transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          {cleanPhone && cleanPhone.length >= 7 && (
                            <a
                              href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(
                                inq.name
                              )},%20this%20is%20Er.%20Denish%20Adhikari%20responding%20to%20your%20inquiry.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          )}
                          <a
                            href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject)}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent-soft transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Reply by Email</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 8: GitHub & Vercel Global Sync */}
        {activeTab === "sync" && (
          <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6">
            <div className="border-b border-border/70 pb-4">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-text-primary">Global Internet Deployment (GitHub &amp; Vercel)</h2>
              </div>
              <p className="text-xs text-text-secondary mt-1">
                Your edits immediately update on your browser. To make changes permanent for <strong>all visitors across the world</strong> on Vercel, connect your GitHub token.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-dark border border-border space-y-4">
              <div className="flex items-start gap-3">
                <Key className="w-5 h-5 text-accent mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-mono font-bold uppercase text-text-primary">
                    GitHub Personal Access Token (PAT)
                  </h4>
                  <p className="text-xs text-text-muted">
                    Allows this admin console to commit updated data directly to <code className="text-accent">JholeyCodes/Denish-Adhikari-Portfolio</code> on branch <code className="text-accent">main</code>, triggering automatic Vercel redeployment.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => handleSaveGithubToken(e.target.value)}
                  placeholder="Paste GitHub Personal Access Token (ghp_...)"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-xs text-text-primary font-mono focus:border-accent focus:outline-none"
                />
                <div className="flex items-center justify-between text-[11px] text-text-muted">
                  <span>Saved locally in your browser so you don't have to re-enter it.</span>
                  <a
                    href="https://github.com/settings/tokens/new?scopes=repo&description=Denish+Portfolio+CMS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline flex items-center gap-1"
                  >
                    <span>Generate GitHub Token (requires 'repo' scope)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 space-y-3">
              <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase">
                How Live Publishing Works:
              </h4>
              <ol className="text-xs text-text-secondary space-y-1.5 list-decimal pl-4">
                <li>Make your desired edits in the tabs above (Profile, Projects, Experience, Gallery, Skills).</li>
                <li>Enter your GitHub token above (only needed once).</li>
                <li>Click <strong>"Save &amp; Apply Edits"</strong> at the top right.</li>
                <li>The admin portal commits the updated TypeScript files directly to your GitHub repo.</li>
                <li>Vercel automatically catches the commit and updates the live website in ~30 seconds!</li>
              </ol>
            </div>
          </div>
        )}
      </main>

      {/* Comprehensive Multi-Tab Project Editor Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="bg-surface rounded-2xl border border-border max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-border/80 flex items-center justify-between bg-surface-dark/60">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-accent px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
                    {editingProject.category}
                  </span>
                  <span className="text-xs font-mono text-text-muted">#{editingProject.number || "01"}</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-text-primary mt-1 line-clamp-1">
                  {isNewProject ? "Add New Civil Engineering Project" : editingProject.title}
                </h2>
              </div>
              <button
                onClick={() => setEditingProject(null)}
                className="p-1.5 rounded-lg bg-surface border border-border text-text-muted hover:text-text-primary transition-colors text-sm font-mono"
              >
                ✕ Close
              </button>
            </div>

            {/* Sub-Tab Navigation Bar */}
            <div className="flex items-center gap-1 overflow-x-auto px-5 py-2.5 bg-surface-dark border-b border-border/70 scrollbar-none">
              {[
                { key: "info", label: "Overview & Roles", icon: FileText },
                { key: "facts", label: `Key Specs (${editingProject.facts?.length || 0})`, icon: Sliders },
                { key: "phases", label: `Sub-Works / Phases (${editingProject.phases?.length || 0})`, icon: Layers },
                { key: "drawings", label: `Drawings (${editingProject.drawings?.length || 0})`, icon: Compass },
                { key: "photos", label: `Field Photos (${editingProject.sitePhotos?.length || 0})`, icon: Camera },
                { key: "technical", label: "Engineering Depth", icon: HardHat },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = projectModalTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setProjectModalTab(tab.key as any)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap shrink-0 ${
                      isActive
                        ? "bg-accent text-white shadow-md shadow-accent/20"
                        : "bg-surface border border-border/70 text-text-secondary hover:text-text-primary hover:border-accent/40"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Scrollable Content Area */}
            <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
              {/* SUB-TAB 1: General Info & Roles */}
              {projectModalTab === "info" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block font-mono uppercase text-text-muted mb-1">Project Title</label>
                      <input
                        type="text"
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-lg bg-surface-dark border border-border text-text-primary focus:border-accent focus:outline-none text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-mono uppercase text-text-muted mb-1">Category</label>
                      <select
                        value={editingProject.category}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            category: e.target.value as any,
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-lg bg-surface-dark border border-border text-text-primary focus:border-accent focus:outline-none font-mono text-xs"
                      >
                        <option value="INFRASTRUCTURE">INFRASTRUCTURE</option>
                        <option value="BUILDINGS">BUILDINGS</option>
                        <option value="SURVEYING">SURVEYING</option>
                        <option value="ACADEMIC">ACADEMIC</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-mono uppercase text-text-muted mb-1">Project Number / Code</label>
                      <input
                        type="text"
                        value={editingProject.number}
                        onChange={(e) => setEditingProject({ ...editingProject, number: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-lg bg-surface-dark border border-border text-text-primary focus:border-accent focus:outline-none text-xs font-mono"
                        placeholder="01"
                      />
                    </div>

                    <div>
                      <label className="block font-mono uppercase text-text-muted mb-1">Contractor / Firm</label>
                      <input
                        type="text"
                        value={editingProject.firm}
                        onChange={(e) => setEditingProject({ ...editingProject, firm: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-lg bg-surface-dark border border-border text-text-primary focus:border-accent focus:outline-none text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-mono uppercase text-text-muted mb-1">Location Packages</label>
                      <input
                        type="text"
                        value={editingProject.location}
                        onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-lg bg-surface-dark border border-border text-text-primary focus:border-accent focus:outline-none text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-mono uppercase text-text-muted mb-1">Duration / Period</label>
                      <input
                        type="text"
                        value={editingProject.duration}
                        onChange={(e) => setEditingProject({ ...editingProject, duration: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-lg bg-surface-dark border border-border text-text-primary focus:border-accent focus:outline-none text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-mono uppercase text-text-muted mb-1">Role Title</label>
                      <input
                        type="text"
                        value={editingProject.role}
                        onChange={(e) => setEditingProject({ ...editingProject, role: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-lg bg-surface-dark border border-border text-text-primary focus:border-accent focus:outline-none text-xs"
                      />
                    </div>
                  </div>

                  {/* Thumbnail Image Picker */}
                  <div className="p-4 rounded-xl bg-surface-dark border border-border space-y-2">
                    <label className="block text-xs font-mono uppercase text-text-muted">
                      Main Project Showcase Thumbnail Image
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <input
                        type="text"
                        value={editingProject.image}
                        onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                        className="flex-1 px-3.5 py-2 rounded-lg bg-surface border border-border text-text-primary font-mono text-xs focus:border-accent focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setMediaPicker({
                            isOpen: true,
                            title: `Select Thumbnail for: ${editingProject.title}`,
                            onSelect: (p) => setEditingProject({ ...editingProject, image: p }),
                          })
                        }
                        className="px-3.5 py-2 rounded-lg bg-accent/15 border border-accent/40 hover:border-accent text-accent text-xs font-mono font-semibold flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Choose from Library</span>
                      </button>
                      {editingProject.image && (
                        <div className="w-16 h-11 rounded-lg bg-black/50 border border-border overflow-hidden shrink-0">
                          <img src={editingProject.image} alt="Thumbnail" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-text-muted mb-1">Subtitle / Headline</label>
                    <input
                      type="text"
                      value={editingProject.subtitle}
                      onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg bg-surface-dark border border-border text-text-primary focus:border-accent focus:outline-none text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-text-muted mb-1">Summary Description</label>
                    <textarea
                      rows={3}
                      value={editingProject.summary}
                      onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg bg-surface-dark border border-border text-text-primary focus:border-accent focus:outline-none leading-relaxed text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-text-muted mb-1">Full Engineering Overview</label>
                    <textarea
                      rows={3}
                      value={editingProject.overview}
                      onChange={(e) => setEditingProject({ ...editingProject, overview: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg bg-surface-dark border border-border text-text-primary focus:border-accent focus:outline-none leading-relaxed text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-text-muted mb-1">My Direct Engineering Role</label>
                    <textarea
                      rows={3}
                      value={editingProject.myRole}
                      onChange={(e) => setEditingProject({ ...editingProject, myRole: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg bg-surface-dark border border-border text-text-primary focus:border-accent focus:outline-none leading-relaxed text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-text-muted mb-1">
                      Tools, Instruments &amp; Software (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={editingProject.tools?.join(", ") || ""}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          tools: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-lg bg-surface-dark border border-border text-text-primary focus:border-accent focus:outline-none text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: Key Facts & Specifications */}
              {projectModalTab === "facts" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-text-primary">Key Engineering Facts &amp; Specifications</h3>
                      <p className="text-xs text-text-muted">
                        Highlight badges displayed in project details (e.g. Capacity, Standard, Foundation Depth).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...(editingProject.facts || [])];
                        updated.push({ label: "NEW SPECIFICATION", value: "Verified Value" });
                        setEditingProject({ ...editingProject, facts: updated });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent hover:bg-accent-soft text-white text-xs font-mono font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Fact</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {editingProject.facts?.map((fact, fIdx) => (
                      <div
                        key={fIdx}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-3 rounded-xl bg-surface-dark border border-border"
                      >
                        <div className="w-full sm:w-1/3">
                          <label className="block text-[10px] font-mono uppercase text-text-muted mb-0.5">Label Title</label>
                          <input
                            type="text"
                            value={fact.label}
                            onChange={(e) => {
                              const updated = [...(editingProject.facts || [])];
                              updated[fIdx].label = e.target.value;
                              setEditingProject({ ...editingProject, facts: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-mono font-bold text-accent focus:border-accent focus:outline-none"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-[10px] font-mono uppercase text-text-muted mb-0.5">Specification Value</label>
                          <input
                            type="text"
                            value={fact.value}
                            onChange={(e) => {
                              const updated = [...(editingProject.facts || [])];
                              updated[fIdx].value = e.target.value;
                              setEditingProject({ ...editingProject, facts: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-text-primary focus:border-accent focus:outline-none"
                          />
                        </div>
                        <div className="flex items-center gap-1 self-end sm:self-center pt-1 sm:pt-4">
                          <button
                            type="button"
                            disabled={fIdx === 0}
                            onClick={() => {
                              if (fIdx > 0) {
                                const updated = [...(editingProject.facts || [])];
                                const temp = updated[fIdx - 1];
                                updated[fIdx - 1] = updated[fIdx];
                                updated[fIdx] = temp;
                                setEditingProject({ ...editingProject, facts: updated });
                              }
                            }}
                            className="p-1.5 rounded bg-surface border border-border text-text-muted hover:text-text-primary disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={fIdx === (editingProject.facts?.length || 1) - 1}
                            onClick={() => {
                              if (fIdx < (editingProject.facts?.length || 1) - 1) {
                                const updated = [...(editingProject.facts || [])];
                                const temp = updated[fIdx + 1];
                                updated[fIdx + 1] = updated[fIdx];
                                updated[fIdx] = temp;
                                setEditingProject({ ...editingProject, facts: updated });
                              }
                            }}
                            className="p-1.5 rounded bg-surface border border-border text-text-muted hover:text-text-primary disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingProject.facts?.filter((_, i) => i !== fIdx);
                              setEditingProject({ ...editingProject, facts: updated });
                            }}
                            className="p-1.5 rounded bg-surface border border-border text-text-muted hover:text-red-400"
                            title="Delete Fact"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB 3: Sub-Works / Execution Phases */}
              {projectModalTab === "phases" && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/70 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-text-primary">Execution Phases &amp; Sub-Works ({editingProject.phases?.length || 0})</h3>
                      <p className="text-xs text-text-muted">
                        All individual works, packages, and technical operations executed under this flagship project.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newPhase: ProjectPhase = {
                          phaseNumber: String((editingProject.phases?.length || 0) + 1).padStart(2, "0"),
                          title: "New Sub-Work Operation",
                          category: "CONSTRUCTION EXECUTION",
                          summary: "Scope description of this specific engineering phase.",
                          keyTasks: ["Site setting out and inspection.", "Quality verification against drawings."],
                          toolsUsed: ["Total Station", "Auto Level"],
                          image: "/images/site/site-12.jpg",
                        };
                        setEditingProject({
                          ...editingProject,
                          phases: [...(editingProject.phases || []), newPhase],
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent hover:bg-accent-soft text-white text-xs font-mono font-semibold shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Sub-Work Phase</span>
                    </button>
                  </div>

                  <div className="space-y-5">
                    {editingProject.phases?.map((ph, phIdx) => (
                      <div
                        key={phIdx}
                        className="p-5 rounded-2xl bg-surface-dark border border-border space-y-4 shadow-sm"
                      >
                        {/* Phase Header */}
                        <div className="flex items-center justify-between border-b border-border/60 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-accent px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
                              Phase {ph.phaseNumber}
                            </span>
                            <span className="font-bold text-text-primary text-sm line-clamp-1">{ph.title}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              disabled={phIdx === 0}
                              onClick={() => {
                                if (phIdx > 0) {
                                  const updated = [...(editingProject.phases || [])];
                                  const temp = updated[phIdx - 1];
                                  updated[phIdx - 1] = updated[phIdx];
                                  updated[phIdx] = temp;
                                  setEditingProject({ ...editingProject, phases: updated });
                                }
                              }}
                              className="p-1.5 rounded bg-surface border border-border text-text-muted hover:text-text-primary disabled:opacity-30"
                              title="Move Phase Up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              disabled={phIdx === (editingProject.phases?.length || 1) - 1}
                              onClick={() => {
                                if (phIdx < (editingProject.phases?.length || 1) - 1) {
                                  const updated = [...(editingProject.phases || [])];
                                  const temp = updated[phIdx + 1];
                                  updated[phIdx + 1] = updated[phIdx];
                                  updated[phIdx] = temp;
                                  setEditingProject({ ...editingProject, phases: updated });
                                }
                              }}
                              className="p-1.5 rounded bg-surface border border-border text-text-muted hover:text-text-primary disabled:opacity-30"
                              title="Move Phase Down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Delete Phase ${ph.phaseNumber}: "${ph.title}"?`)) {
                                  const updated = editingProject.phases?.filter((_, i) => i !== phIdx);
                                  setEditingProject({ ...editingProject, phases: updated });
                                }
                              }}
                              className="p-1.5 rounded bg-surface border border-border hover:border-red-500 text-text-muted hover:text-red-400"
                              title="Delete Phase"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Phase Inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div>
                            <label className="block font-mono uppercase text-text-muted mb-1">Phase Number</label>
                            <input
                              type="text"
                              value={ph.phaseNumber}
                              onChange={(e) => {
                                const updated = [...(editingProject.phases || [])];
                                updated[phIdx].phaseNumber = e.target.value;
                                setEditingProject({ ...editingProject, phases: updated });
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-text-primary font-mono text-xs focus:border-accent focus:outline-none"
                              placeholder="01"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block font-mono uppercase text-text-muted mb-1">Phase Title</label>
                            <input
                              type="text"
                              value={ph.title}
                              onChange={(e) => {
                                const updated = [...(editingProject.phases || [])];
                                updated[phIdx].title = e.target.value;
                                setEditingProject({ ...editingProject, phases: updated });
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-text-primary font-semibold text-xs focus:border-accent focus:outline-none"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="block font-mono uppercase text-text-muted mb-1">Category / Discipline Tag</label>
                            <input
                              type="text"
                              value={ph.category || ""}
                              onChange={(e) => {
                                const updated = [...(editingProject.phases || [])];
                                updated[phIdx].category = e.target.value;
                                setEditingProject({ ...editingProject, phases: updated });
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-text-primary font-mono text-xs focus:border-accent focus:outline-none"
                              placeholder="e.g. SURVEYING & GEOMATICS, DEEP FOUNDATIONS"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="block font-mono uppercase text-text-muted mb-1">Phase Summary</label>
                            <textarea
                              rows={2}
                              value={ph.summary}
                              onChange={(e) => {
                                const updated = [...(editingProject.phases || [])];
                                updated[phIdx].summary = e.target.value;
                                setEditingProject({ ...editingProject, phases: updated });
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-text-primary text-xs leading-relaxed focus:border-accent focus:outline-none"
                            />
                          </div>

                          {/* Phase Inspection Image */}
                          <div className="sm:col-span-3">
                            <label className="block font-mono uppercase text-text-muted mb-1">Phase Site Photo</label>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                              <input
                                type="text"
                                value={ph.image || ""}
                                onChange={(e) => {
                                  const updated = [...(editingProject.phases || [])];
                                  updated[phIdx].image = e.target.value;
                                  setEditingProject({ ...editingProject, phases: updated });
                                }}
                                placeholder="/images/site/site-XX.jpg"
                                className="flex-1 px-3 py-1.5 rounded-lg bg-surface border border-border text-text-primary font-mono text-xs focus:border-accent focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setMediaPicker({
                                    isOpen: true,
                                    title: `Select Image for Phase ${ph.phaseNumber}: ${ph.title}`,
                                    onSelect: (p) => {
                                      const updated = [...(editingProject.phases || [])];
                                      updated[phIdx].image = p;
                                      setEditingProject({ ...editingProject, phases: updated });
                                    },
                                  })
                                }
                                className="px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-accent text-accent text-xs font-mono flex items-center justify-center gap-1 shrink-0"
                              >
                                <ImageIcon className="w-3.5 h-3.5" />
                                <span>Choose Image</span>
                              </button>
                              {ph.image && (
                                <div className="w-10 h-8 rounded bg-black/50 border border-border overflow-hidden shrink-0">
                                  <img src={ph.image} alt="Phase" className="w-full h-full object-cover" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Key Tasks List */}
                        <div className="space-y-2 pt-2 border-t border-border/50">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-mono uppercase text-text-muted">
                              Key Field Tasks ({ph.keyTasks?.length || 0})
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...(editingProject.phases || [])];
                                updated[phIdx].keyTasks = [...(ph.keyTasks || []), "New specific site execution task."];
                                setEditingProject({ ...editingProject, phases: updated });
                              }}
                              className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" /> Add Task
                            </button>
                          </div>
                          <div className="space-y-1.5">
                            {ph.keyTasks?.map((task, tIdx) => (
                              <div key={tIdx} className="flex items-center gap-2">
                                <span className="text-accent font-mono text-xs">•</span>
                                <input
                                  type="text"
                                  value={task}
                                  onChange={(e) => {
                                    const updated = [...(editingProject.phases || [])];
                                    updated[phIdx].keyTasks[tIdx] = e.target.value;
                                    setEditingProject({ ...editingProject, phases: updated });
                                  }}
                                  className="flex-1 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-text-secondary focus:border-accent focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...(editingProject.phases || [])];
                                    updated[phIdx].keyTasks.splice(tIdx, 1);
                                    setEditingProject({ ...editingProject, phases: updated });
                                  }}
                                  className="p-1 text-text-muted hover:text-red-400"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tools Used in Phase */}
                        <div className="pt-2 border-t border-border/50">
                          <label className="block text-[11px] font-mono uppercase text-text-muted mb-1">
                            Instruments &amp; Equipment Used (Comma separated)
                          </label>
                          <input
                            type="text"
                            value={ph.toolsUsed?.join(", ") || ""}
                            onChange={(e) => {
                              const updated = [...(editingProject.phases || [])];
                              updated[phIdx].toolsUsed = e.target.value
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean);
                              setEditingProject({ ...editingProject, phases: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-mono text-text-secondary focus:border-accent focus:outline-none"
                            placeholder="Total Station, Auto Level, Piling Rig"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB 4: Technical Drawings & CAD */}
              {projectModalTab === "drawings" && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/70 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-text-primary">
                        Technical Drawings &amp; CAD Schematics ({editingProject.drawings?.length || 0})
                      </h3>
                      <p className="text-xs text-text-muted">
                        Designated blueprints, site plans, and process schematics for this project.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newDwg: ProjectDrawing = {
                          sheetNo: `DWG-WWTP-0${(editingProject.drawings?.length || 0) + 1}`,
                          title: "New Technical Blueprint",
                          type: "2D Engineering Drawing / Layout",
                          scale: "1:100",
                          description: "Engineering layout and dimensional detailing.",
                          image: "/images/2d-drawing-sallaghari.jpeg",
                        };
                        setEditingProject({
                          ...editingProject,
                          drawings: [...(editingProject.drawings || []), newDwg],
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent hover:bg-accent-soft text-white text-xs font-mono font-semibold shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Drawing</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {editingProject.drawings?.map((dwg, dIdx) => (
                      <div
                        key={dIdx}
                        className="p-5 rounded-2xl bg-surface-dark border border-border space-y-4"
                      >
                        <div className="flex items-center justify-between border-b border-border/60 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-sky-400 px-2 py-0.5 rounded bg-sky-950/60 border border-sky-800/40">
                              {dwg.sheetNo || "DWG"}
                            </span>
                            <span className="font-bold text-text-primary text-sm">{dwg.title}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete drawing "${dwg.title}"?`)) {
                                const updated = editingProject.drawings?.filter((_, i) => i !== dIdx);
                                setEditingProject({ ...editingProject, drawings: updated });
                              }
                            }}
                            className="p-1.5 rounded bg-surface border border-border hover:border-red-500 text-text-muted hover:text-red-400"
                            title="Delete Drawing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div>
                            <label className="block font-mono uppercase text-text-muted mb-1">Sheet Number</label>
                            <input
                              type="text"
                              value={dwg.sheetNo || ""}
                              onChange={(e) => {
                                const updated = [...(editingProject.drawings || [])];
                                updated[dIdx].sheetNo = e.target.value;
                                setEditingProject({ ...editingProject, drawings: updated });
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-text-primary font-mono text-xs focus:border-accent focus:outline-none"
                              placeholder="DWG-SLG-WWTP-01"
                            />
                          </div>

                          <div>
                            <label className="block font-mono uppercase text-text-muted mb-1">Drawing Type</label>
                            <input
                              type="text"
                              value={dwg.type || ""}
                              onChange={(e) => {
                                const updated = [...(editingProject.drawings || [])];
                                updated[dIdx].type = e.target.value;
                                setEditingProject({ ...editingProject, drawings: updated });
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-text-primary text-xs focus:border-accent focus:outline-none"
                              placeholder="e.g. Process & Hydraulic Plan"
                            />
                          </div>

                          <div>
                            <label className="block font-mono uppercase text-text-muted mb-1">Drawing Scale</label>
                            <input
                              type="text"
                              value={dwg.scale || ""}
                              onChange={(e) => {
                                const updated = [...(editingProject.drawings || [])];
                                updated[dIdx].scale = e.target.value;
                                setEditingProject({ ...editingProject, drawings: updated });
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-text-primary font-mono text-xs focus:border-accent focus:outline-none"
                              placeholder="1:100 or NTS"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="block font-mono uppercase text-text-muted mb-1">Drawing Title</label>
                            <input
                              type="text"
                              value={dwg.title}
                              onChange={(e) => {
                                const updated = [...(editingProject.drawings || [])];
                                updated[dIdx].title = e.target.value;
                                setEditingProject({ ...editingProject, drawings: updated });
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-text-primary font-semibold text-xs focus:border-accent focus:outline-none"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="block font-mono uppercase text-text-muted mb-1">Description</label>
                            <textarea
                              rows={2}
                              value={dwg.description}
                              onChange={(e) => {
                                const updated = [...(editingProject.drawings || [])];
                                updated[dIdx].description = e.target.value;
                                setEditingProject({ ...editingProject, drawings: updated });
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-text-primary text-xs leading-relaxed focus:border-accent focus:outline-none"
                            />
                          </div>

                          {/* Drawing Image Picker */}
                          <div className="sm:col-span-3">
                            <label className="block font-mono uppercase text-text-muted mb-1">CAD Blueprint Image</label>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                              <input
                                type="text"
                                value={dwg.image || ""}
                                onChange={(e) => {
                                  const updated = [...(editingProject.drawings || [])];
                                  updated[dIdx].image = e.target.value;
                                  setEditingProject({ ...editingProject, drawings: updated });
                                }}
                                placeholder="/images/2d-drawing-sallaghari.jpeg"
                                className="flex-1 px-3 py-1.5 rounded-lg bg-surface border border-border text-text-primary font-mono text-xs focus:border-accent focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setMediaPicker({
                                    isOpen: true,
                                    title: `Select Drawing Image for: ${dwg.title}`,
                                    onSelect: (p) => {
                                      const updated = [...(editingProject.drawings || [])];
                                      updated[dIdx].image = p;
                                      setEditingProject({ ...editingProject, drawings: updated });
                                    },
                                  })
                                }
                                className="px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-accent text-accent text-xs font-mono flex items-center justify-center gap-1 shrink-0"
                              >
                                <ImageIcon className="w-3.5 h-3.5" />
                                <span>Choose Drawing</span>
                              </button>
                              {dwg.image && (
                                <div className="w-14 h-9 rounded bg-black/60 border border-border overflow-hidden shrink-0">
                                  <img src={dwg.image} alt="Drawing" className="w-full h-full object-cover" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB 5: Field Photos & Stage Records */}
              {projectModalTab === "photos" && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/70 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-text-primary">
                        Field Photography &amp; Construction Stage Records ({editingProject.sitePhotos?.length || 0})
                      </h3>
                      <p className="text-xs text-text-muted">
                        Visual field documentation for major milestones (piling, formwork, rebar, QA).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newPhoto = {
                          stage: "Reinforcement & Concreting",
                          caption: "Field inspection of concrete pour and structural cover.",
                          image: "/images/site/site-24.jpg",
                        };
                        setEditingProject({
                          ...editingProject,
                          sitePhotos: [...(editingProject.sitePhotos || []), newPhoto],
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent hover:bg-accent-soft text-white text-xs font-mono font-semibold shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Site Photo</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {editingProject.sitePhotos?.map((sp, spIdx) => (
                      <div
                        key={spIdx}
                        className="p-4 rounded-xl bg-surface-dark border border-border space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40">
                            {sp.stage}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingProject.sitePhotos?.filter((_, i) => i !== spIdx);
                              setEditingProject({ ...editingProject, sitePhotos: updated });
                            }}
                            className="p-1 rounded bg-surface border border-border text-text-muted hover:text-red-400"
                            title="Remove Photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase text-text-muted mb-0.5">
                            Stage / Milestone Tag
                          </label>
                          <input
                            type="text"
                            value={sp.stage}
                            onChange={(e) => {
                              const updated = [...(editingProject.sitePhotos || [])];
                              updated[spIdx].stage = e.target.value;
                              setEditingProject({ ...editingProject, sitePhotos: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-text-primary focus:border-accent focus:outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase text-text-muted mb-0.5">
                            Caption Description
                          </label>
                          <textarea
                            rows={2}
                            value={sp.caption}
                            onChange={(e) => {
                              const updated = [...(editingProject.sitePhotos || [])];
                              updated[spIdx].caption = e.target.value;
                              setEditingProject({ ...editingProject, sitePhotos: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-text-primary focus:border-accent focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase text-text-muted mb-0.5">
                            Image Path
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={sp.image || ""}
                              onChange={(e) => {
                                const updated = [...(editingProject.sitePhotos || [])];
                                updated[spIdx].image = e.target.value;
                                setEditingProject({ ...editingProject, sitePhotos: updated });
                              }}
                              className="flex-1 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-text-primary font-mono focus:border-accent focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setMediaPicker({
                                  isOpen: true,
                                  title: `Select Site Photo for: ${sp.stage}`,
                                  onSelect: (p) => {
                                    const updated = [...(editingProject.sitePhotos || [])];
                                    updated[spIdx].image = p;
                                    setEditingProject({ ...editingProject, sitePhotos: updated });
                                  },
                                })
                              }
                              className="px-2.5 py-1.5 rounded-lg bg-surface border border-border hover:border-accent text-accent text-xs font-mono flex items-center gap-1 shrink-0"
                            >
                              <ImageIcon className="w-3 h-3" />
                              <span>Choose</span>
                            </button>
                            {sp.image && (
                              <div className="w-10 h-8 rounded bg-black/60 border border-border overflow-hidden shrink-0">
                                <img src={sp.image} alt="Site" className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB 6: Engineering Depth (Challenges, Solutions, Outcomes, Responsibilities) */}
              {projectModalTab === "technical" && (
                <div className="space-y-6">
                  {/* Challenges Section */}
                  <div className="p-5 rounded-2xl bg-surface-dark border border-border space-y-3">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <div>
                        <h4 className="font-bold text-sm text-text-primary">Engineering Challenges ({editingProject.challenges?.length || 0})</h4>
                        <p className="text-[11px] text-text-muted">Technical difficulties encountered in the field.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(editingProject.challenges || []), "New site challenge description."];
                          setEditingProject({ ...editingProject, challenges: updated });
                        }}
                        className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Challenge
                      </button>
                    </div>
                    <div className="space-y-2">
                      {editingProject.challenges?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const updated = [...(editingProject.challenges || [])];
                              updated[idx] = e.target.value;
                              setEditingProject({ ...editingProject, challenges: updated });
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-text-secondary focus:border-accent focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingProject.challenges?.filter((_, i) => i !== idx);
                              setEditingProject({ ...editingProject, challenges: updated });
                            }}
                            className="p-1.5 text-text-muted hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Solutions Section */}
                  <div className="p-5 rounded-2xl bg-surface-dark border border-border space-y-3">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <div>
                        <h4 className="font-bold text-sm text-text-primary">Applied Engineering Solutions ({editingProject.solutions?.length || 0})</h4>
                        <p className="text-[11px] text-text-muted">Direct engineering countermeasures implemented.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(editingProject.solutions || []), "New implemented technical solution."];
                          setEditingProject({ ...editingProject, solutions: updated });
                        }}
                        className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Solution
                      </button>
                    </div>
                    <div className="space-y-2">
                      {editingProject.solutions?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const updated = [...(editingProject.solutions || [])];
                              updated[idx] = e.target.value;
                              setEditingProject({ ...editingProject, solutions: updated });
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-text-secondary focus:border-accent focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingProject.solutions?.filter((_, i) => i !== idx);
                              setEditingProject({ ...editingProject, solutions: updated });
                            }}
                            className="p-1.5 text-text-muted hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Outcomes Section */}
                  <div className="p-5 rounded-2xl bg-surface-dark border border-border space-y-3">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <div>
                        <h4 className="font-bold text-sm text-text-primary">Measurable Outcomes &amp; Tolerances ({editingProject.outcomes?.length || 0})</h4>
                        <p className="text-[11px] text-text-muted">Verified quality compliance results and material test milestones.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(editingProject.outcomes || []), "Achieved 100% compliance with structural specifications."];
                          setEditingProject({ ...editingProject, outcomes: updated });
                        }}
                        className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Outcome
                      </button>
                    </div>
                    <div className="space-y-2">
                      {editingProject.outcomes?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const updated = [...(editingProject.outcomes || [])];
                              updated[idx] = e.target.value;
                              setEditingProject({ ...editingProject, outcomes: updated });
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-text-secondary focus:border-accent focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingProject.outcomes?.filter((_, i) => i !== idx);
                              setEditingProject({ ...editingProject, outcomes: updated });
                            }}
                            className="p-1.5 text-text-muted hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Site Responsibilities */}
                  <div className="p-5 rounded-2xl bg-surface-dark border border-border space-y-3">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <div>
                        <h4 className="font-bold text-sm text-text-primary">Direct Field Responsibilities ({editingProject.responsibilities?.length || 0})</h4>
                        <p className="text-[11px] text-text-muted">Day-to-day duties executed on site.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(editingProject.responsibilities || []), "Supervised on-site construction operations."];
                          setEditingProject({ ...editingProject, responsibilities: updated });
                        }}
                        className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Duty
                      </button>
                    </div>
                    <div className="space-y-2">
                      {editingProject.responsibilities?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const updated = [...(editingProject.responsibilities || [])];
                              updated[idx] = e.target.value;
                              setEditingProject({ ...editingProject, responsibilities: updated });
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-text-secondary focus:border-accent focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingProject.responsibilities?.filter((_, i) => i !== idx);
                              setEditingProject({ ...editingProject, responsibilities: updated });
                            }}
                            className="p-1.5 text-text-muted hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technical Approach */}
                  <div className="p-5 rounded-2xl bg-surface-dark border border-border space-y-3">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <div>
                        <h4 className="font-bold text-sm text-text-primary">Technical Methodology &amp; Approach ({editingProject.technicalApproach?.length || 0})</h4>
                        <p className="text-[11px] text-text-muted">Engineering procedures and precision techniques applied.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(editingProject.technicalApproach || []), "Applied precision instrumental setting out."];
                          setEditingProject({ ...editingProject, technicalApproach: updated });
                        }}
                        className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Approach
                      </button>
                    </div>
                    <div className="space-y-2">
                      {editingProject.technicalApproach?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const updated = [...(editingProject.technicalApproach || [])];
                              updated[idx] = e.target.value;
                              setEditingProject({ ...editingProject, technicalApproach: updated });
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-text-secondary focus:border-accent focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingProject.technicalApproach?.filter((_, i) => i !== idx);
                              setEditingProject({ ...editingProject, technicalApproach: updated });
                            }}
                            className="p-1.5 text-text-muted hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Action Footer */}
            <div className="p-4 sm:p-5 border-t border-border/80 flex items-center justify-between bg-surface-dark/80">
              <span className="text-xs font-mono text-text-muted hidden sm:inline">
                {editingProject.phases?.length || 0} Phases • {editingProject.drawings?.length || 0} Drawings • {editingProject.facts?.length || 0} Specs
              </span>
              <div className="flex items-center gap-3 ml-auto">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-xl bg-surface border border-border text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (isNewProject) {
                      setProjects([...projects, editingProject]);
                    } else {
                      setProjects(projects.map((p) => (p.id === editingProject.id ? editingProject : p)));
                    }
                    setEditingProject(null);
                    setStatusMessage({
                      text: `Project "${editingProject.title}" updated in working memory. Click "Save & Publish Changes" to commit!`,
                      type: "success",
                    });
                  }}
                  className="px-5 py-2 rounded-xl bg-accent hover:bg-accent-soft text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-accent/20 transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Apply Project Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Universal Media Picker Modal */}
      {mediaPicker && (
        <div className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="bg-surface rounded-2xl border border-border max-w-4xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Picker Header */}
            <div className="p-5 border-b border-border/80 flex items-center justify-between bg-surface-dark/70">
              <div>
                <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-accent" />
                  <span>{mediaPicker.title || "Choose Image from Media Assets"}</span>
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Click any image thumbnail to select it instantly.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMediaPicker(null)}
                className="p-1.5 rounded-lg bg-surface border border-border text-text-muted hover:text-text-primary transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 bg-surface-dark/40 border-b border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { key: "ALL", label: `All (${mediaAssetsList.length})` },
                  { key: "site", label: `Site Photos (${mediaAssetsList.filter((m) => m.category === "site").length})` },
                  { key: "drawings", label: `Drawings (${mediaAssetsList.filter((m) => m.category === "drawings").length})` },
                  { key: "profile", label: `Profile (${mediaAssetsList.filter((m) => m.category === "profile").length})` },
                  { key: "schematics", label: `Schematics (${mediaAssetsList.filter((m) => m.category === "schematics").length})` },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setMediaPickerCategory(tab.key)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                      mediaPickerCategory === tab.key
                        ? "bg-accent text-white"
                        : "bg-surface border border-border text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-text-muted" />
                <input
                  type="text"
                  value={mediaPickerSearch}
                  onChange={(e) => setMediaPickerSearch(e.target.value)}
                  placeholder="Search filename..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-mono text-text-primary focus:outline-none focus:border-accent placeholder:text-text-muted"
                />
              </div>
            </div>

            {/* Images Grid */}
            <div className="p-5 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {mediaAssetsList
                .filter((asset) => {
                  const matchCat = mediaPickerCategory === "ALL" || asset.category === mediaPickerCategory;
                  if (!matchCat) return false;
                  if (!mediaPickerSearch.trim()) return true;
                  const q = mediaPickerSearch.toLowerCase();
                  return (
                    asset.name.toLowerCase().includes(q) ||
                    asset.path.toLowerCase().includes(q) ||
                    asset.categoryLabel.toLowerCase().includes(q)
                  );
                })
                .map((asset, aIdx) => (
                  <button
                    key={aIdx}
                    type="button"
                    onClick={() => {
                      mediaPicker.onSelect(asset.path);
                      setMediaPicker(null);
                    }}
                    className="group flex flex-col text-left bg-surface-dark rounded-xl border border-border hover:border-accent p-2 transition-all hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:border-accent"
                  >
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-black/50 border border-border/70 mb-2">
                      <img
                        src={asset.path}
                        alt={asset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[9px] font-mono text-accent">
                        {asset.categoryLabel}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-text-primary truncate w-full group-hover:text-accent font-semibold">
                      {asset.name}
                    </span>
                    <span className="text-[10px] font-mono text-text-muted truncate w-full">
                      {asset.path}
                    </span>
                  </button>
                ))}
            </div>

            {/* Picker Footer */}
            <div className="p-4 border-t border-border/80 flex items-center justify-between bg-surface-dark">
              <span className="text-xs font-mono text-text-muted">
                Showing media assets
              </span>
              <button
                type="button"
                onClick={() => setMediaPicker(null)}
                className="px-4 py-1.5 rounded-lg bg-surface border border-border text-xs text-text-secondary hover:text-text-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
