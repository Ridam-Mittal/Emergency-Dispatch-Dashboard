import { useEffect, useState } from "react";
import { getMetrics } from "../api";
import "../styles/metrics.css";

const Metrics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    getMetrics().then((res) => setData(res.metrics));
  }, []);

  if (!data) return <p style={{ textAlign: "center" }}>Loading metrics...</p>;

  const { incidents, units } = data;

  return (
    <div className="metrics-wrapper">
      <p className="metrics-title">System Overview</p>

      {/* HERO KPIs */}
      <div className="hero-grid">
        <Hero label="Total Incidents" value={incidents.total} />
        <Hero label="Open Cases" value={incidents.open} />
        <Hero label="Units Available" value={units.available} />
      </div>

      {/* PERFORMANCE */}
      <div className="metric-section">
        <p className="section-title">Performance</p>

        <div className="performance-grid">
          <Perf
            label="Avg Response Time"
            value={`${incidents.avgResponseTimeMinutes} min`}
          />
          <Perf
            label="Avg Resolution Time"
            value={`${incidents.avgResolutionTimeMinutes} min`}
          />
        </div>
      </div>

      {/* SEVERITY */}
      <div className="metric-section">
        <p className="section-title">Severity Distribution</p>

        <Severity
          label="High"
          value={incidents.bySeverity.HIGH}
          color="high"
        />
        <Severity
          label="Medium"
          value={incidents.bySeverity.MEDIUM}
          color="medium"
        />
        <Severity
          label="Low"
          value={incidents.bySeverity.LOW}
          color="low"
        />
      </div>

      {/* UNITS */}
    <div className="metric-section">
    <p className="section-title">Units Status</p>

    <div className="performance-grid">
        <Perf label="Total Units" value={units.total} />
        <Perf label="Available" value={units.available} />
        <Perf label="Busy" value={units.busy} />
        <Perf label="Offline" value={units.offline} />
    </div>
    </div>

    </div>
  );
};

export default Metrics;

/* Components */

const Hero = ({ label, value }) => (
  <div className="hero-card">
    <div className="hero-value">{value}</div>
    <div className="hero-label">{label}</div>
  </div>
);

const Perf = ({ label, value }) => (
  <div className="perf-card">
    <div style={{ fontSize: "12px", color: "#6b7280" }}>{label}</div>
    <div style={{ fontSize: "18px", fontWeight: 700 }}>{value}</div>
  </div>
);

const Severity = ({ label, value, color }) => (
  <div className="severity-row">
    <span style={{ width: 60 }}>{label}</span>
    <div className="bar">
      <div
        className={`fill ${color}`}
        style={{ width: `${value * 10}%` }}
      />
    </div>
    <span>{value}</span>
  </div>
);
