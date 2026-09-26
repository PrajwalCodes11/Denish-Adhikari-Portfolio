export interface ProjectPhase {
  phaseNumber: string;
  title: string;
  category?: string;
  summary: string;
  keyTasks: string[];
  toolsUsed: string[];
  image?: string;
}

export interface ProjectDrawing {
  title: string;
  description: string;
  type: string;
  image?: string;
  sheetNo?: string;
  scale?: string;
}

export interface ProjectCaseStudy {
  id: string;
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  category: "INFRASTRUCTURE" | "BUILDINGS" | "SURVEYING" | "ACADEMIC";
  location: string;
  firm: string;
  duration: string;
  role: string;
  tools: string[];
  image: string;
  summary: string;
  facts: {
    label: string;
    value: string;
  }[];
  overview: string;
  myRole: string;
  responsibilities: string[];
  technicalApproach: string[];
  challenges: string[];
  solutions: string[];
  outcomes: string[];
  phases?: ProjectPhase[];
  drawings: ProjectDrawing[];
  sitePhotos: {
    caption: string;
    stage: string;
    image?: string;
  }[];
}

export const projectsData: ProjectCaseStudy[] = [
  {
    id: "wwtp-sallaghari-kodku-dhobighat",
    slug: "construction-of-wastewater-treatment-plant-sallaghari-kodku-dhobighat",
    number: "01",
    title: "Construction of Wastewater Treatment Plant at Sallaghari, Kodku and Dhobighat",
    subtitle: "Heavy Water-Retaining RCC Tanks, Bored Cast-in-Situ Piling, Geomatics Alignment & Material Quality Control",
    category: "INFRASTRUCTURE",
    location: "Sallaghari (Bhaktapur), Kodku & Dhobighat (Lalitpur), Nepal",
    firm: "Sarathi Construction Private Limited",
    duration: "Contract Duration (2024 — Present)",
    role: "Civil Site Engineer / Surveyor",
    tools: [
      "Total Station",
      "Auto Level",
      "AutoCAD 2D",
      "Rotary Piling Rig",
      "Tremie Pipe",
      "MS Excel (BBS)",
      "Cube Testing Machine",
      "Sieve Shaker",
    ],
    image: "/images/site/site-24.jpg",
    summary:
      "Comprehensive municipal wastewater treatment plant engineering consolidating high-precision geomatic setting out, deep bored cast-in-situ piling foundations, mass earthwork dewatering, heavy water-retaining reinforced concrete (RCC) tank casting, waterstop joint sealing, and full-spectrum material quality testing across Sallaghari, Kodku, and Dhobighat packages.",
    facts: [
      {
        label: "PROJECT TYPE",
        value: "Sanitary / Heavy RCC Infrastructure",
      },
      {
        label: "LOCATIONS",
        value: "Sallaghari (Bhaktapur), Kodku & Dhobighat (Lalitpur)",
      },
      {
        label: "CONTRACTOR",
        value: "Sarathi Construction Pvt. Ltd.",
      },
      {
        label: "ROLE",
        value: "Civil Site Engineer & Field Surveyor",
      },
      {
        label: "WORKFORCE",
        value: "40–50 Site Laborers & Specialized Operators",
      },
      {
        label: "KEY SCOPE",
        value: "Survey, Bored Piling, Raft/Tanks Concreting & QA",
      },
    ],
    overview:
      "The Construction of Wastewater Treatment Plant at Sallaghari, Kodku and Dhobighat is a critical municipal infrastructure program designed to intercept, treat, and purify urban wastewater flows before safe environmental discharge into Kathmandu Valley river basins. The structural works demanded exceptionally stringent water-tight concrete specifications, strict reinforcement cover controls, deep rotary bored cast-in-situ piling through alluvial strata, and zero tolerance for benchmark deviation in foundation tanks.",
    myRole:
      "Civil Site Engineer and Lead Field Surveyor for Sarathi Construction Pvt. Ltd. Directly led on-site survey operations and day-to-day engineering execution across Sallaghari, Kodku, and Dhobighat packages. Responsible for horizontal and vertical setting out using Total Station, structural drawing verification, reinforcement inspection, quality testing of aggregates and fresh concrete, bored piling supervision, and coordinating daily site workflows for 40–50 construction workers.",
    responsibilities: [
      "Executed setting out, benchmark transfer, and level control for RCC tanks, retaining walls, and underground pipeline trenches using Total Station and Auto Level.",
      "Supervised rotary hydraulic crawler piling operations, bentonite slurry borehole stabilization, and continuous underwater tremie concrete pouring.",
      "Supervised deep earthwork excavation, staged perimeter dewatering sumps, and Plain Cement Concrete (PCC) mud-mat lean concrete casting.",
      "Conducted thorough reinforcement rebar inspections against structural drawings and verified Bar Bending Schedules (BBS) to minimize steel wastage.",
      "Inspected heavy steel shuttering panels, tie-rod bracing, and hydro-expansive PVC water-stop placement at all horizontal and vertical cold joints.",
      "Monitored concrete mix pouring, slump consistency at 25-minute intervals, mechanical vibration compaction, and curing regimes for water-retaining structures.",
      "Prepared standard 150mm concrete test cubes, managed water curing, and supervised laboratory compressive strength testing at 3, 7, and 28-day intervals.",
      "Conducted sieve analysis for coarse and fine aggregates to ensure strict compliance with fineness modulus and grading envelope curves.",
      "Coordinated daily workflows for 40–50 workers, maintaining stringent site safety and preparing Daily Progress Reports (DPR).",
    ],
    technicalApproach: [
      "Station establishment using permanent concrete survey pillars with dual-run leveling from municipal geodetic benchmarks.",
      "Gridline coordinates plotted in CAD and uploaded directly to Total Station for precise tank corner and circular clarifier setting out.",
      "Bored pile verticality checking and continuous tremie pipe embedment of at least 2.0m during underwater concrete displacement.",
      "Systematic pre-pour checklists for formwork alignment, cover block placement (50mm clear cover for water-retaining elements), and tie wire security.",
      "Controlled slump testing (180 ± 20mm for tremie concrete, 100 ± 25mm for structural tanks) followed by standard cube sampling.",
    ],
    challenges: [
      "High groundwater table and unconsolidated alluvial soil instability during deep excavation adjacent to natural drainage channels.",
      "Strict water-tightness tolerances requiring defect-free monolithic pours and careful construction joint treatment with water-bars.",
      "Borehole collapse hazards during deep piling operations requiring constant hydrostatic head maintenance.",
      "Logistical coordination of heavy concrete deliveries within congested access roads during night pours.",
    ],
    solutions: [
      "Implemented staged dewatering sumps and perimeter trench drainage with submersible trash pumps to maintain a dry subgrade for PCC casting.",
      "Maintained bentonite slurry suspension throughout drilling to prevent borehole sidewall caving prior to cage lowering.",
      "Enforced hydro-expansive waterstop installation and meticulous surface preparation at all horizontal and vertical cold joints.",
      "Organized phased night and early morning concrete pours with synchronized batching plant dispatches.",
    ],
    outcomes: [
      "Achieved 100% structural drawing compliance across all RCC tank units, bored pile foundations, and pipeline alignments.",
      "All 28-day concrete compressive test cubes satisfied or exceeded target characteristic strength criteria.",
      "Integrity tests (PIT) confirmed continuous, defect-free concrete shaft geometry throughout all bored piles.",
      "Steel cutting wastage reduced by ~4% through optimized BBS rebar utilization.",
      "Zero site safety lost-time incidents recorded under direct shift supervision of 40–50 laborers.",
    ],
    phases: [
      {
        phaseNumber: "01",
        title: "Precision Setting Out & Geomatic Alignment",
        category: "SURVEYING & GEOMATICS",
        summary:
          "Establishment of permanent geodetic survey pillars, closed-traverse coordinate transfer, and high-accuracy horizontal/vertical setting out for all structural units, boundary lines, and hydraulic pipelines across Sallaghari, Kodku, and Dhobighat sites.",
        keyTasks: [
          "Established permanent concrete survey pillars with brass center pins away from construction haul routes.",
          "Transferred National Geodetic Benchmarks to internal site benchmarks using double-run differential leveling with Auto Level.",
          "Plotted structural coordinate grids in AutoCAD and uploaded layout data to Total Station for millimeter-precise staking.",
          "Staked out excavation boundaries, tank centers, retaining wall footings, and pipeline slope profiles with invert levels.",
        ],
        toolsUsed: ["Electronic Total Station", "Auto Level", "AutoCAD", "Prism Poles"],
        image: "/images/site/site-10.jpg",
      },
      {
        phaseNumber: "02",
        title: "Bored Cast-in-Situ Foundation Piling",
        category: "DEEP FOUNDATIONS",
        summary:
          "Execution of bored cast-in-situ reinforced concrete piles to transfer heavy hydraulic tank and superstructure loads through soft alluvial strata to competent bearing layers.",
        keyTasks: [
          "Borehole drilling using crawler rotary hydraulic piling rig with bentonite slurry stabilization against borehole wall collapse.",
          "Fabricated 12-meter circular rebar cages with helical spiral ties and concrete roller cover spacers.",
          "Lowered reinforcement cages with mobile crane, ensuring precise vertical alignment and cut-off levels.",
          "Submerged tremie pipe continuous concrete pouring maintaining minimum 2.0m embedment in fresh concrete throughout night pours.",
          "Executed pile integrity testing (PIT) to verify sound shaft geometry and concrete continuity without necking.",
        ],
        toolsUsed: ["Rotary Piling Rig", "Tremie Pipe", "Slump Cone", "Transit Mixers"],
        image: "/images/site/site-44.jpg",
      },
      {
        phaseNumber: "03",
        title: "Deep Excavation, Dewatering & PCC Mud-Mat",
        category: "EARTHWORK & DRAINAGE",
        summary:
          "Systematic mass earthwork excavation, high groundwater table management, and casting of level Plain Cement Concrete (PCC) mud-mats for foundation rafts.",
        keyTasks: [
          "Supervised mechanical excavator cutting following batter slopes and verified bed invert levels using Auto Level.",
          "Installed perimeter interception trenches and staged dewatering sump pits with submersible trash pumps.",
          "Compacted native subgrade and placed geotextile separation layers where required by soil conditions.",
          "Cast 100mm thick Plain Cement Concrete (PCC) lean concrete mud-mat to provide an immaculate working platform for rebar tying.",
        ],
        toolsUsed: ["Excavators", "Submersible Pumps", "Auto Level", "Plate Compactors"],
        image: "/images/site/site-40.jpg",
      },
      {
        phaseNumber: "04",
        title: "Water-Retaining RCC Rafts, Aeration Tanks & Clarifiers",
        category: "REINFORCED CONCRETE",
        summary:
          "Fabrication and casting of heavy water-retaining reinforced concrete structural elements with stringent water-tightness tolerances, heavy rebar mats, and specialized expansion/construction joints.",
        keyTasks: [
          "Verified Bar Bending Schedules (BBS) and tied top and bottom high-yield Fe500 rebar mats with rigid steel chair supports.",
          "Placed 50mm heavy-duty concrete cover blocks to ensure absolute corrosion protection for submerged reinforcement.",
          "Assembled rigid steel shuttering panels with external diagonal pipe props and heavy tie-rods to withstand fresh concrete lateral pressure.",
          "Installed hydro-expansive PVC water-stop seals at all horizontal footing-to-wall and vertical wall construction cold joints.",
          "Supervised monolithic concrete pouring with needle immersion vibrators to eliminate honeycombing and ensure water-tight density.",
        ],
        toolsUsed: ["Steel Shuttering", "Needle Vibrators", "BBS Sheets", "Waterstop Profiles"],
        image: "/images/site/site-24.jpg",
      },
      {
        phaseNumber: "05",
        title: "Quality Control, Cube & Sieve Testing & Labor Coordination",
        category: "QUALITY ASSURANCE & MANAGEMENT",
        summary:
          "Daily quality compliance, fresh and hardened concrete testing, aggregate grading verification, and workforce safety coordination for 40–50 site laborers.",
        keyTasks: [
          "Checked every transit mixer delivery ticket, verified water-cement ratio, and conducted slump tests at 25-minute pour intervals.",
          "Casted standard 150mm test cubes per batch (3, 7, and 28-day sets); maintained temperature-controlled curing tanks and compressive break testing.",
          "Conducted sieve analysis for coarse and fine aggregates to verify fineness modulus and conformance to standard grading curves.",
          "Prepared Daily Progress Reports (DPR), material reconciliation logs, and tracked bar bending scrap rates.",
          "Organized daily shift briefings, PPE enforcement, and task allocation for 40–50 site laborers and specialized machine operators.",
        ],
        toolsUsed: ["Compression Testing Machine", "Cube Moulds", "Sieve Shaker", "DPR Logs"],
        image: "/images/site/site-05.jpg",
      },
    ],
    drawings: [
      {
        title: "2D Engineering Drawing & Process Layout — Sallaghari WWTP",
        description:
          "Detailed 2D engineering drawing and process flow schematic showing primary settling tanks, aeration basins, secondary clarifiers, sludge handling units, and inter-tank pipeline profiles at Sallaghari.",
        type: "2D Engineering Drawing / CAD Layout",
        image: "/images/2d-drawing-sallaghari.jpeg",
        sheetNo: "DWG-SLG-WWTP-01",
      },
      {
        title: "Wastewater Treatment Plant Layout & Hydraulic Scheme",
        description:
          "Overall wastewater treatment plant layout showing unit arrangements, influent distribution chambers, hydraulic flow lines, and site road network.",
        type: "Process & Hydraulic Plan",
        image: "/images/wastewater-treatment-plan.jpg",
        sheetNo: "DWG-WWTP-GEN-02",
      },
    ],
    sitePhotos: [
      {
        caption: "Aeration tank formwork and vertical wall rebar shuttering at Sallaghari WWTP",
        stage: "Formwork & Shuttering",
        image: "/images/site/site-24.jpg",
      },
      {
        caption: "Rotary hydraulic piling rig hoisting circular rebar cage with concrete roller spacers",
        stage: "Bored Piling Operations",
        image: "/images/site/site-44.jpg",
      },
      {
        caption: "Massive RCC raft reinforcement mat inspection with perimeter dewatering channels",
        stage: "Raft Slab Rebar",
        image: "/images/site/site-28.jpg",
      },
      {
        caption: "Hydro-expansive PVC water-stop seal installation at wall construction joint",
        stage: "Waterproofing Joint",
        image: "/images/site/site-32.jpg",
      },
      {
        caption: "Standard 150mm concrete test cubes with casting batch labels for QA testing",
        stage: "Compressive QC Test",
        image: "/images/site/site-05.jpg",
      },
      {
        caption: "Night concreting and pile cage alignment under floodlights with transit mixer dispatch",
        stage: "Night Concreting",
        image: "/images/site/site-46.jpg",
      },
    ],
  },
];
