import { useEffect, useState } from "react";
import { getIncidents } from "../api";
import IncidentItem from "./IncidentItem";

const severityOrder = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

const IncidentList = ({
  selectedIncident,
  setSelectedIncident,
  type,
}) => {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetchIncidents();
    const i = setInterval(fetchIncidents, 5000);
    return () => clearInterval(i);
  }, []);

  const fetchIncidents = async () => {
    const res = await getIncidents();
    setIncidents(res || []);
  };

  const filtered = incidents.filter((i) => {
    if (type === "resolved") return i.status === "RESOLVED";
    return i.status !== "RESOLVED";
  });

  const sorted = [...filtered].sort((a, b) => {
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return new Date(a.reportedAt) - new Date(b.reportedAt);
  });

  return (
    <div className="list-wrapper">
      {!sorted.length && (
        <p className="empty-text">No incidents</p>
      )}

      {sorted.map((i) => (
        <IncidentItem
          key={i._id}
          incident={i}
          expanded={selectedIncident?._id === i._id}
          onToggle={() =>
            setSelectedIncident(
              selectedIncident?._id === i._id ? null : i
            )
          }
        />
      ))}
    </div>
  );
};

export default IncidentList;
