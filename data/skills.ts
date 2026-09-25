export interface SkillCategory {
  category: string;
  description: string;
  skills: {
    name: string;
    level?: string;
    note: string;
  }[];
}

export const skillsData: SkillCategory[] = [
  {
    category: "SURVEYING & GEOMATICS INSTRUMENTS",
    description: "Hands-on instrumental operation for precision alignment, leveling, and setting out.",
    skills: [
      {
        name: "Electronic Total Station",
        note: "Station setup, coordinate staking, traverse & topography",
      },
      {
        name: "Auto Level",
        note: "Differential leveling, benchmark transfer & gradient control",
      },
      {
        name: "Prism & Optical Targets",
        note: "Precision centering, backsight/foresight observations",
      },
      {
        name: "Setting Out & Alignment",
        note: "Column grids, tank corners, pipeline invert levels",
      },
    ],
  },
  {
    category: "CONSTRUCTION SITE & RCC SUPERVISION",
    description: "Direct field supervision of heavy reinforced concrete works and structural elements.",
    skills: [
      {
        name: "RCC Structure Concreting",
        note: "Tanks, deep foundations, slabs, columns & retaining walls",
      },
      {
        name: "Reinforcement Inspection",
        note: "Rebar diameter, spacing, lap length & cover block checks",
      },
      {
        name: "Formwork & Shuttering",
        note: "Alignment, bracing, release agents & line-plumbness checks",
      },
      {
        name: "Excavation & Sub-base",
        note: "Deep trenching, dewatering sumps, PCC casting supervision",
      },
    ],
  },
  {
    category: "MATERIALS TESTING & QUALITY CONTROL",
    description: "Standard sampling and testing protocols ensuring adherence to design specifications.",
    skills: [
      {
        name: "Concrete Cube Testing",
        note: "Cube mold casting, curing tank management & compressive tests",
      },
      {
        name: "Sieve Analysis",
        note: "Coarse and fine aggregate particle grading & fineness modulus",
      },
      {
        name: "Slump Cone Test",
        note: "Workability & water-cement ratio verification on transit mixers",
      },
      {
        name: "QC Compliance & Records",
        note: "Maintaining laboratory registers & batch verification",
      },
    ],
  },
  {
    category: "ENGINEERING SOFTWARE & ESTIMATION",
    description: "Drafting, technical spreadsheets, and contract quantity calculations.",
    skills: [
      {
        name: "AutoCAD 2D",
        note: "Architectural floor plans, municipal sets & structural details",
      },
      {
        name: "Microsoft Excel (Advanced)",
        note: "Automated BBS spreadsheets, BOQ takeoffs & progress logs",
      },
      {
        name: "Bar Bending Schedule (BBS)",
        note: "Steel schedule preparation, cutting optimization & reconciliation",
      },
      {
        name: "Bill of Quantities (BOQ)",
        note: "Item-rate measurement sheets conforming to standard norms",
      },
      {
        name: "Microsoft Word & Office",
        note: "Daily progress reporting (DPR), site inspection memos",
      },
    ],
  },
  {
    category: "CORE PROFESSIONAL COMPETENCIES",
    description: "Site leadership, technical coordination, and problem-solving abilities.",
    skills: [
      {
        name: "Leadership & Team Coordination",
        note: "Daily deployment and task coordination for 40–50 site laborers",
      },
      {
        name: "Problem Solving & Critical Thinking",
        note: "On-site troubleshooting, drawing verification & structural compliance",
      },
      {
        name: "Attention to Technical Detail",
        note: "Strict adherence to structural drawings, rebar schedules & specifications",
      },
      {
        name: "Time Management & DPR",
        note: "Compiling daily progress reports, milestone tracking & schedule adherence",
      },
      {
        name: "Communication Skills",
        note: "Effective coordination between consultants, contractors, and field workforce",
      },
    ],
  },
];
