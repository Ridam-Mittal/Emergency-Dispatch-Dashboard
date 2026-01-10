import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const INCIDENT_DESCRIPTIONS = [
  "Person fell off bike",
  "Fire in a building",
  "Car accident on main street",
  "Robbery in progress",
  "Heart attack reported",
  "Tree fell on road",
  "Gas leak detected",
  "Minor traffic collision",
  "Flooded street",
  "Suspicious package found",
  "Domestic dispute reported",
  "Power outage in area",
  "Medical emergency at home",
  "Dog attack on pedestrian",
  "Building collapse reported",
  "Child stuck in elevator",
  "Road blockage due to debris",
  "Water pipe burst",
  "Illegal construction activity",
  "Smoke detected in warehouse",
  "Shoplifting in progress",
  "Traffic signal malfunction",
  "Gas cylinder explosion",
  "Person trapped in vehicle",
  "Suspicious person loitering",
  "Vehicle fire reported",
  "Public protest gathering",
  "Chemical spill in lab",
  "Tree on power lines"
];

// Predefined city coordinates [lng, lat]
const COMMON_COORDINATES = [
  [77.5946, 12.9716],
  [77.6100, 12.9800],
  [77.5800, 12.9650],
  [77.6000, 12.9900],
  [77.6200, 12.9750],
  [77.6050, 12.9650]
];

// Helper: random coordinate
function getRandomCoordinate() {
  return COMMON_COORDINATES[Math.floor(Math.random() * COMMON_COORDINATES.length)];
}

// Helper: random description
function getRandomDescription() {
  return INCIDENT_DESCRIPTIONS[Math.floor(Math.random() * INCIDENT_DESCRIPTIONS.length)];
}


async function generateIncidentsGradually(count = 30, intervalMs = 60000) {
  for (let i = 0; i < count; i++) {
    const payload = {
      description: getRandomDescription(),
      coordinates: getRandomCoordinate()
    };

    try {
      const res = await axios.post(
        `${process.env.BACKEND_URL}/api/incidents`,
        payload
      );
      console.log(`${i + 1}. Incident created successfully:`, res.data);
    } catch (err) {
      console.error(`${i + 1}. Error:`, err.response?.data || err.message);
    }

    if (i < count - 1) {
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }

  console.log(`✅ Finished sending ${count} incidents.`);
}


generateIncidentsGradually(10, 5000);  
