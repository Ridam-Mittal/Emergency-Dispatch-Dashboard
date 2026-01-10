import "../styles/incident.css";
import { dispatchNearest, resolveIncident, getNearestUnits } from "../api";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

const IncidentItem = ({ incident, expanded, onToggle }) => {
  const [units, setUnits] = useState([]);

  useEffect(() => {
    if (expanded && incident.status === "REPORTED") {
      const fetchUnits = async () => {
        try {
          const res = await getNearestUnits(incident._id);
          console.log("📡 Nearest units fetched:", res);
          setUnits(res.nearestUnits || []);
        } catch (err) {
          console.error(err);
          setUnits([]);
        }
      };
      fetchUnits();
    }
  }, [expanded, incident._id]);

  return (
    <div className="incident-card">

      <div className="incident-header" onClick={onToggle}>
        <p className="incident-title">{incident.description}</p>
        <span>{expanded ? "▴" : "▾"}</span>
      </div>

      <div className="badge-row">
        <span className={`badge ${incident.severity.toLowerCase()}`}>
          {incident.severity}
        </span>
        <span className={`badge ${incident.status.toLowerCase()}`}>
          {incident.status}
        </span>
      </div>

      <p className="time">
        {new Date(incident.reportedAt).toLocaleString()}
      </p>

      {expanded && (
        <>
          {/* NEAREST UNITS */}
          {incident.status === "REPORTED" && (
            <div className="unit-list">
              <p className="section-label">Nearest Units</p>

              {units.map((u) => (
                <div key={u._id} className="unit-row">
                  <span className="unit-name">{u.unitName}</span>
                  <span className="unit-distance">
                    {u.distance.toFixed(2)} km
                  </span>
                </div>
              ))}

              {!units.length && (
                <p className="empty-text">
                  No nearby units available
                </p>
              )}
            </div>
          )}

          {/* ASSIGNED */}
          {incident.status === "ASSIGNED" && (
            <p className="info-text">
              Assigned Unit – {incident.assignedUnitId?.unitName}
            </p>
          )}

          {/* RESOLVED */}
          {incident.status === "RESOLVED" && (
            <p className="info-text">
              Resolved By – {incident.assignedUnitId?.unitName}
            </p>
          )}

          {/* ACTIONS */}
          <div className="action-row">

            {incident.status === "REPORTED" && (
              <button
                className="dispatch-btn"
                onClick={() =>
                  dispatchNearest(incident._id)
                    .then(() => toast.success("Unit dispatched"))
                    .catch((e) =>
                      toast.error(e?.response?.data?.message)
                    )
                }
              >
                Dispatch Nearest
              </button>
            )}

            <button
              className="resolve-btn"
              disabled={incident.status === "RESOLVED"}
              onClick={() =>
                resolveIncident(incident._id)
                  .then(() => toast.success("Incident resolved"))
                  .catch((e) =>
                    toast.error(e?.response?.data?.message)
                  )
              }
            >
              {incident.status === "RESOLVED"
                ? "Incident Resolved"
                : "Resolve Incident"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default IncidentItem;
