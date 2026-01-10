import "../styles/tabs.css";
import "../styles/rightPanel.css";
import IncidentList from "./IncidentList";
import Metrics from "./Metrics";
import UnitList from "./UnitList";

const RightPanel = ({
  activeTab,
  setActiveTab,
  selectedIncident,
  setSelectedIncident,
}) => {
  return (
    <div className="panel-wrapper">

      {/* TABS */}
      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab==="active" ? "active":""}`}
          onClick={() => setActiveTab("active")}
        >
          Active
        </button>

        <button
          className={`tab-btn ${activeTab==="resolved" ? "active":""}`}
          onClick={() => setActiveTab("resolved")}
        >
          Resolved
        </button>

        <button
          className={`tab-btn ${activeTab==="units" ? "active":""}`}
          onClick={() => setActiveTab("units")}
        >
          Units
        </button>

        <button
          className={`tab-btn ${activeTab==="metrics" ? "active":""}`}
          onClick={() => setActiveTab("metrics")}
        >
          Metrics
        </button>
      </div>

      {/* CONTENT */}
      <div className="panel-content">

        {activeTab==="active" && (
          <IncidentList
            type="active"
            selectedIncident={selectedIncident}
            setSelectedIncident={setSelectedIncident}
          />
        )}

        {activeTab==="resolved" && (
          <IncidentList
            type="resolved"
            selectedIncident={selectedIncident}
            setSelectedIncident={setSelectedIncident}
          />
        )}

        {activeTab==="units" && <UnitList />}

        {activeTab==="metrics" && <Metrics />}

      </div>
    </div>
  );
};

export default RightPanel;
