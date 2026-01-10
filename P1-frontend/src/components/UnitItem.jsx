import "../styles/incident.css";

const UnitItem = ({ unit }) => {
  return (
    <div className="incident-card">

      <div className="incident-header">
        <p className="incident-title">{unit.unitName}</p>
      </div>

      <div className="badge-row">
        <span className={`badge ${unit.unitType.toLowerCase()}`}>
          {unit.unitType}
        </span>

        <span className={`badge ${unit.status.toLowerCase()}`}>
          {unit.status}
        </span>
      </div>

      <p className="time">
        Last updated:{" "}
        {new Date(unit.lastUpdated).toLocaleString()}
      </p>
    </div>
  );
};

export default UnitItem;
