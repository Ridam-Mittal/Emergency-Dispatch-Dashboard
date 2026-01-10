import L from "leaflet";

/* ---------------- INCIDENT CONFIG ---------------- */

export const INCIDENT_COLORS = {
  high: "#dc2626",    // red
  medium: "#f59e0b",  // amber
  low: "#2563eb",     // deep blue
};

export const getIncidentIcon = (severity) => {
  const color = INCIDENT_COLORS[severity.toLowerCase()] || "blue";
//   console.log("🎯 Creating icon for severity:", severity, "with color:", color);

  return L.divIcon({
    className: "",
    html: `
      <div style="
        width:16px;
        height:16px;
        border-radius:50%;
        background:${color};
        border:2px solid white;
        box-shadow:0 0 4px rgba(0,0,0,0.5);
      "></div>
    `,
  });
};

/* ---------------- UNIT CONFIG ---------------- */

export const UNIT_ICONS = {
  ambulance: "🚑",
  fire: "🚒",
  police: "🚓",
};

export const getUnitIcon = (type) => {
  const icon = UNIT_ICONS[type.toLowerCase()] || "🚓";

  return L.divIcon({
    className: "",
    html: `<div style="font-size:22px">${icon}</div>`,
  });
};
