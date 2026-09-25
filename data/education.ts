export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
  highlights: string[];
  type: "DEGREE" | "LICENSE" | "SCHOOL";
}

export const educationData: EducationItem[] = [
  {
    degree: "Registered Civil Engineer",
    institution: "Nepal Engineering Council (NEC)",
    location: "Kathmandu, Nepal",
    period: "Licensed: October 23, 2024 A.D.",
    highlights: [
      "Official Engineering License issued by Nepal Engineering Council",
      "Authorized for professional civil engineering practice across Nepal",
      "Certified in structural compliance and civil engineering ethics",
    ],
    type: "LICENSE",
  },
  {
    degree: "Bachelor in Civil Engineering",
    institution: "Lumbini Engineering, Management and Science College (Pokhara University)",
    location: "Rupandehi / Pokhara University, Nepal",
    period: "September 2018 A.D. to February 2024 A.D.",
    highlights: [
      "Core coursework: Structural Analysis, Design of RCC Structures, Surveying I & II, Fluid Mechanics, Soil Mechanics & Foundation Engineering, Highway & Transportation Engineering, Estimation & Costing",
      "Survey Camp: 10-day comprehensive field surveying camp covering closed theodolite traverse, leveling, contouring, and road alignment layout",
      "Major Capstone Project: Comprehensive structural analysis and seismic design of a multi-storey RCC framed building",
    ],
    type: "DEGREE",
  },
  {
    degree: "+2 High School (Science)",
    institution: "Tilottama Secondary School",
    location: "Rupandehi, Nepal",
    period: "Completed: 2018 A.D.",
    highlights: [
      "Majors in Physics, Chemistry, and Mathematics",
      "Strong foundation in mechanics, applied calculus, and analytical geometry",
    ],
    type: "SCHOOL",
  },
  {
    degree: "School Leaving Certificate (SLC)",
    institution: "Bethel English Boarding Secondary School",
    location: "Nepal",
    period: "Completed: 2016 A.D.",
    highlights: [
      "Graduated with Distinction",
      "Active participant in science exhibitions, athletics, and academic competitions",
    ],
    type: "SCHOOL",
  },
];
