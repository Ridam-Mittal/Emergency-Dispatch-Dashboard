import "../styles/incident.css";
import { useState } from "react";

const UnitItem = ({ unit }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="incident-card">

      {/* HEADER */}
      <div
        className="incident-header"
        onClick={() => setExpanded(!expanded)}
      >
        <p className="incident-title">{unit.unitName}</p>
        <span>{expanded ? "▴" : "▾"}</span>
      </div>

      {/* BADGES */}
      <div className="badge-row">
        <span className={`badge ${unit.unitType.toLowerCase()}`}>
          {unit.unitType}
        </span>

        <span className={`badge ${unit.status.toLowerCase()}`}>
          {unit.status}
        </span>
      </div>

      {/* EXPANDED VIEW */}
      {expanded && (
        <div className="unit-details">

          {/* LOCATION */}
          <p className="detail-row">
            📍 Location:
            <span>
              {unit.location.coordinates[1].toFixed(5)},{" "}
              {unit.location.coordinates[0].toFixed(5)}
            </span>
          </p>

          {/* ASSIGNMENT */}
          {unit.assignedIncident ? (
            <div className="assigned-box">
              <p className="detail-title">Assigned Incident</p>

              <p className="detail-row">
                📝 {unit.assignedIncident.description}
              </p>

              <p className="detail-row">
                Status:
                <span className="assigned-status">
                  {unit.assignedIncident.status}
                </span>
              </p>
            </div>
          ) : (
            <p className="detail-row muted">
              No incident assigned
            </p>
          )}

          {/* UPDATED */}
          <p className="detail-row">
            🕒 Last updated:
            <span>
              {new Date(unit.updatedAt).toLocaleString()}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default UnitItem;
