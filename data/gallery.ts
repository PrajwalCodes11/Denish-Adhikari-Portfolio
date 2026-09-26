export interface GalleryItem {
  id: string;
  title: string;
  category: "CONSTRUCTION" | "SURVEYING" | "STRUCTURES" | "TESTING";
  location: string;
  date: string;
  caption: string;
  image: string;
  tags: string[];
}

export const galleryData: GalleryItem[] = [
  {
    "id": "g-1",
    "title": "Bored Pile Reinforcement Cage Lowering",
    "category": "STRUCTURES",
    "location": "Sallaghari WWTP Site, Bhaktapur",
    "date": "Deep Foundation Phase",
    "caption": "Rotary crawler drilling rig hoisting and lowering a 12-meter cylindrical rebar pile cage with integrated concrete roller spacers to maintain structural cover.",
    "image": "/images/site/site-44.jpg",
    "tags": [
      "Bored Piling",
      "Rotary Rig",
      "Deep Foundation"
    ]
  },
  {
    "id": "g-2",
    "title": "Sallaghari Aeration Tank Shuttering & Wall Formwork",
    "category": "CONSTRUCTION",
    "location": "Sallaghari WWTP, Bhaktapur",
    "date": "RCC Superstructure Phase",
    "caption": "Panoramic view of the primary wastewater treatment tank showing steel panel shuttering, external diagonal pipe props, and vertical wall reinforcement cages.",
    "image": "/images/site/site-24.jpg",
    "tags": [
      "RCC Tanks",
      "Formwork",
      "Shuttering"
    ]
  },
  {
    "id": "g-3",
    "title": "Massive RCC Raft Foundation Rebar Mesh",
    "category": "STRUCTURES",
    "location": "Sarathi Construction Site, Sallaghari",
    "date": "Foundation Stage",
    "caption": "Inspection of top and bottom reinforcement rebar mats, chair supports, and side shuttering prior to casting monolithic water-retaining base raft.",
    "image": "/images/site/site-28.jpg",
    "tags": [
      "Raft Foundation",
      "Rebar Inspection",
      "Cover Blocks"
    ]
  },
  {
    "id": "g-4",
    "title": "Standard Concrete Test Cubes for QC Testing",
    "category": "TESTING",
    "location": "Site Quality Control Laboratory",
    "date": "Continuous QA",
    "caption": "Standard 150mm x 150mm concrete test cubes with casting identification labels prepared for 7-day and 28-day compressive failure strength testing.",
    "image": "/images/site/site-05.jpg",
    "tags": [
      "Concrete QC",
      "Cube Testing",
      "Compressive Strength"
    ]
  },
  {
    "id": "g-5",
    "title": "Hydro-Expansive PVC Waterstop Installation",
    "category": "CONSTRUCTION",
    "location": "Sallaghari Tank Wall Joint, Bhaktapur",
    "date": "Waterproofing Stage",
    "caption": "Blue PVC ribbed waterstop seal positioned at the construction cold joint between the base raft and the vertical tank wall to guarantee zero water seepage.",
    "image": "/images/site/site-32.jpg",
    "tags": [
      "Waterstop",
      "Cold Joint",
      "Waterproofing"
    ]
  },
  {
    "id": "g-6",
    "title": "Night Bored Piling & Cage Alignment Operations",
    "category": "CONSTRUCTION",
    "location": "Sallaghari Deep Foundation Site, Bhaktapur",
    "date": "Night Shift Execution",
    "caption": "Continuous night operation: rotary hydraulic piling rig aligning reinforcement cage under high-intensity floodlights to ensure seamless tremie concrete pouring.",
    "image": "/images/site/site-46.jpg",
    "tags": [
      "Night Concreting",
      "Bored Piles",
      "Workforce Coordination"
    ]
  },
  {
    "id": "g-7",
    "title": "Vertical Retaining Wall Rebar & Scaffolding",
    "category": "STRUCTURES",
    "location": "Sallaghari WWTP Deep Tank, Bhaktapur",
    "date": "Wall Reinforcement",
    "caption": "Vertical rebar cage erection, horizontal distribution steel, and tubular steel scaffolding with perimeter dewatering channel along the base.",
    "image": "/images/site/site-20.jpg",
    "tags": [
      "Retaining Wall",
      "Rebar Cages",
      "Dewatering"
    ]
  },
  {
    "id": "g-8",
    "title": "Column Box Shuttering & Bracing Alignment",
    "category": "CONSTRUCTION",
    "location": "Urban Residential Build, Kathmandu",
    "date": "Superstructure Phase",
    "caption": "Inspection of column shuttering box, external steel clamps, diagonal screw jacks, and plumb bob verticality check prior to concrete pour.",
    "image": "/images/site/site-36.jpg",
    "tags": [
      "Column Shuttering",
      "Bracing",
      "Formwork"
    ]
  },
  {
    "id": "g-9",
    "title": "Structural Steel Fe500D Material Delivery Check",
    "category": "TESTING",
    "location": "Sarathi Construction Stockyard",
    "date": "Material Verification",
    "caption": "Supervising the arrival and physical inspection of bundled TMT reinforcement steel bars on transport trailer before unloading and mill certificate sign-off.",
    "image": "/images/site/site-08.jpg",
    "tags": [
      "Rebar Delivery",
      "Fe500D Steel",
      "Material QA"
    ]
  },
  {
    "id": "g-10",
    "title": "Concrete Cover Block Placement on PCC Bed",
    "category": "STRUCTURES",
    "location": "Sallaghari Tank Foundation, Bhaktapur",
    "date": "Pre-pour Inspection",
    "caption": "Verification of precast 50mm concrete cover blocks placed uniformly under bottom reinforcement bars to protect steel against subsoil moisture corrosion.",
    "image": "/images/site/site-19.jpg",
    "tags": [
      "Cover Blocks",
      "Clear Cover",
      "Durability"
    ]
  },
  {
    "id": "g-11",
    "title": "Rebar Cold Bend & Tensile Test Specimens",
    "category": "TESTING",
    "location": "Materials Testing Yard",
    "date": "Quality Compliance",
    "caption": "Sample reinforcement bars bent to standard pin diameters for 180-degree cold bend test to check for surface fissures and ductility compliance.",
    "image": "/images/site/site-01.jpg",
    "tags": [
      "Bend Test",
      "Ductility",
      "Rebar QA"
    ]
  },
  {
    "id": "g-12",
    "title": "Excavation Bed Setting Out & Level Alignment",
    "category": "SURVEYING",
    "location": "Sallaghari Main Foundation Bed, Bhaktapur",
    "date": "Earthwork Phase",
    "caption": "Establishing center-line string markers and level pegs across the excavated formation level to guide structural PCC casting boundaries.",
    "image": "/images/site/site-10.jpg",
    "tags": [
      "Setting Out",
      "Level Alignment",
      "Earthwork"
    ]
  }
];
