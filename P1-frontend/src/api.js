import axios from "axios";

const BASE = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: BASE,
});

/* ---------- INCIDENTS ---------- */

export const getIncidents = async () => {
  const res = await api.get("/api/incidents");
  return res.data.data || res.data.incidents || [];
};

export const dispatchNearest = async (id) => {
    const res = await api.patch(`/api/incidents/${id}/dispatch`);
    return res.data;
};

/* ---------- UNITS ---------- */

export const getUnits = async () => {
  const res = await api.get("/api/units/all");
  return res.data.units || [];
};

/* ---------- METRICS ---------- */

export const getMetrics = async () => {
  const res = await api.get("/api/metrics");
  return res.data;
};

/* ---------- DASHBOARD (ALL TOGETHER) ---------- */

export const getDashboardData = async () => {
  const [incidents, units] = await Promise.all([
    getIncidents(),
    getUnits(),
  ]);

  return { incidents, units };
};


export const resolveIncident = async (id) => {
  const res = await api.patch(`/api/incidents/${id}/resolve`);
  return res.data;
}


export const getNearestUnits = async (incidentId) => {
    const res = await api.get(`/api/incidents/${incidentId}/nearest-units`);
    return res.data;
}
