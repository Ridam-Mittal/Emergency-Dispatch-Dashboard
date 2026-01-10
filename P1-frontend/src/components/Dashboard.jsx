import { useState } from "react";
import MapView from "./MapView";
import RightPanel from "./RightPanel";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [selectedIncident, setSelectedIncident] = useState(null);

  return (
    <div className="dashboard-wrapper">

      {/* MAP PANEL */}
      <div className="map-panel">

        <div className="map-header">
          Emergency Dispatch System
        </div>

        <div className="map-legend">
          <Legend color="red" label="High" />
          <Legend color="orange" label="Medium" />
          <Legend color="blue" label="Low" />
        </div>

        <MapView selectedIncident={selectedIncident} />
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <RightPanel
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedIncident={selectedIncident}
          setSelectedIncident={setSelectedIncident}
        />
      </div>
    </div>
  );
};

const Legend = ({ color, label }) => (
  <div className="legend-item">
    <span
      className="legend-dot"
      style={{ background: color }}
    ></span>
    <span style={{ fontSize: "13px" }}>{label}</span>
  </div>
);

export default Dashboard;
