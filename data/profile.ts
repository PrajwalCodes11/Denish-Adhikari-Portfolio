export interface ProfileData {
  name: string;
  title: string;
  specializations: string[];
  necRegistration: string;
  necDate: string;
  phone: string;
  email: string;
  location: string;
  whatsapp: string;
  linkedin: string;
  github: string;
  bioSummary: string;
  bioQuote: string;
  workforceCount: string;
  surveyCount: string;
  experienceYears: string;
  education: {
    degree: string;
    institution: string;
    period: string;
  }[];
}

export const profileData: ProfileData = {
  name: "Er. Denish Adhikari",
  title: "Civil Site Engineer & Surveyor",
  specializations: [
    "Civil Site Engineer",
    "Surveyor (Total Station / Auto Level)",
    "RCC Structural Execution Specialist",
    "Construction Quality Control & BBS",
  ],
  necRegistration: "NEC Reg. No. 79422 \"Civil\"",
  necDate: "October 2024",
  phone: "+977 9867730557",
  email: "den.adh0709@gmail.com",
  location: "Kathmandu, Nepal",
  whatsapp: "https://wa.me/9779867730557",
  linkedin: "https://www.linkedin.com/in/denish-adhikari/",
  github: "https://github.com/JholeyCodes",
  bioSummary:
    "Civil Engineer with practical experience in wastewater treatment plant construction, reinforced concrete works, surveying, and construction quality control. Skilled in Total Station and Auto Level operations, reinforcement inspection, concrete testing, and site supervision. Capable of managing workforce activities, verifying structural drawings, and maintaining technical compliance on construction sites. Seeking opportunities in construction engineering and site operations.",
  bioQuote:
    "Designing and executing safe, compliant, and durable infrastructure where technical precision and structural safety come first.",
  workforceCount: "40–50+",
  surveyCount: "100+",
  experienceYears: "2+",
  education: [
    {
      degree: "Bachelor in Civil Engineering",
      institution: "Lumbini Engineering, Management and Science College, Pokhara University",
      period: "September 2018 A.D. to February 2024 A.D.",
    },
    {
      degree: "+2 / High School (Science)",
      institution: "Tilottama Secondary School, Rupandehi",
      period: "Completed: 2018 A.D.",
    },
    {
      degree: "School Leaving Certificate (SLC)",
      institution: "Bethel English Boarding Secondary School",
      period: "Completed: 2016 A.D.",
    },
  ],
};
