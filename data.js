// ExpatAce City Database - Minimal Test Version
// This is a minimal version for testing - production version has 102 cities

const CITIES = [
  {
    city: "Lisbon",
    country: "Portugal",
    rent_1br_city: 950,
    rent_3br_city: 1800,
    monthly_single: 850,
    monthly_family: 3200,
    safety_score: 83,
    gpi_rank: 6,
    climate: "mediterranean",
    healthcare: "excellent",
    visa_notes: "D7 passive income visa available"
  },
  {
    city: "Porto",
    country: "Portugal",
    rent_1br_city: 750,
    rent_3br_city: 1400,
    monthly_single: 750,
    monthly_family: 2800,
    safety_score: 85,
    gpi_rank: 6,
    climate: "mediterranean",
    healthcare: "excellent",
    visa_notes: "D7 passive income visa available"
  },
  {
    city: "Barcelona",
    country: "Spain",
    rent_1br_city: 1200,
    rent_3br_city: 2200,
    monthly_single: 1000,
    monthly_family: 3500,
    safety_score: 78,
    gpi_rank: 29,
    climate: "mediterranean",
    healthcare: "excellent",
    visa_notes: "Non-lucrative visa for retirees"
  },
  {
    city: "Valencia",
    country: "Spain",
    rent_1br_city: 850,
    rent_3br_city: 1600,
    monthly_single: 800,
    monthly_family: 3000,
    safety_score: 80,
    gpi_rank: 29,
    climate: "mediterranean",
    healthcare: "excellent",
    visa_notes: "Non-lucrative visa for retirees"
  },
  {
    city: "Mexico City",
    country: "Mexico",
    rent_1br_city: 600,
    rent_3br_city: 1200,
    monthly_single: 700,
    monthly_family: 2500,
    safety_score: 65,
    gpi_rank: 137,
    climate: "temperate",
    healthcare: "good",
    visa_notes: "Temporary resident visa available"
  },
  {
    city: "Playa del Carmen",
    country: "Mexico",
    rent_1br_city: 700,
    rent_3br_city: 1400,
    monthly_single: 900,
    monthly_family: 2800,
    safety_score: 70,
    gpi_rank: 137,
    climate: "tropical",
    healthcare: "good",
    visa_notes: "Temporary resident visa available"
  }
];

// Make CITIES available globally
if (typeof window !== 'undefined') {
  window.CITIES = CITIES;
}
