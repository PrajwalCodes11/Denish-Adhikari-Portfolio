export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  achievements: string[];
  skills: string[];
}

export const experienceData: ExperienceItem[] = [
  {
    period: "2024 — PRESENT",
    role: "Civil Site Engineer / Surveyor",
    company: "Sarathi Construction Private Limited",
    location: "Sallaghari (Bhaktapur), Kodku & Dhobighat (Lalitpur), Nepal",
    description:
      "Leading on-site engineering execution, setting out, and quality control on the Construction of Wastewater Treatment Plant at Sallaghari, Kodku and Dhobighat — covering heavy reinforced concrete tanks, deep bored piling, and underground pipeline installations.",
    achievements: [
      "Performed setting out, leveling, and structural alignment for RCC tanks, foundations, and pipeline works using Total Station and Auto Level.",
      "Supervised excavation, PCC, RCC slab, and wall concreting activities following structural drawings and specifications.",
      "Conducted reinforcement inspection, formwork checking, and concrete quality monitoring during pouring operations.",
      "Coordinated construction activities with 40–50 laborers to ensure smooth workflow and daily progress.",
      "Prepared concrete cube samples and supported compressive strength testing procedures.",
      "Conducted sieve analysis to ensure aggregate grading quality.",
      "Verified Bar Bending Schedules (BBS), calculated material quantities, and prepared daily site progress reports.",
    ],
    skills: [
      "Total Station",
      "Auto Level",
      "RCC Construction",
      "BBS Verification",
      "Quality Testing",
      "Site Management",
    ],
  },
  {
    period: "Mar 2024 A.D. – Jul 2024 A.D.",
    role: "Engineering Intern",
    company: "Ujyalo Engineering Consultancy",
    location: "Kathmandu Valley, Nepal",
    description:
      "Developed 2D architectural drawings for residential structures using AutoCAD, assisted in foundation layout planning, and observed surveying and site inspection practices.",
    achievements: [
      "Developed 2D architectural drawings for residential structures using AutoCAD.",
      "Assisted in foundation layout planning, structural detailing, and quantity estimation.",
      "Observed surveying, site inspection, and construction supervision practices.",
    ],
    skills: [
      "AutoCAD 2D",
      "Structural Detailing",
      "Quantity Estimation",
      "Surveying & Inspection",
    ],
  },
];
