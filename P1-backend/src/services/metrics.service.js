import { Incident } from "../models/Incident.model.js";
import { Unit } from "../models/Unit.model.js";

export const getDashboardMetricsService = async () => {
  const [
    totalIncidents,
    openIncidents,
    resolvedIncidents,
    incidentsBySeverity,
    responseTimes,
    resolutionTimes,
    totalUnits,
    availableUnits,
    busyUnits,
    offlineUnits
  ] = await Promise.all([
    Incident.countDocuments(),

    Incident.countDocuments({ status: { $ne: "RESOLVED" } }),

    Incident.countDocuments({ status: "RESOLVED" }),

    Incident.aggregate([
      {
        $group: {
          _id: "$severity",
          count: { $sum: 1 }
        }
      }
    ]),

    Incident.aggregate([
      {
        $match: { assignedAt: { $exists: true } }
      },
      {
        $project: {
          responseTime: {
            $divide: [
              { $subtract: ["$assignedAt", "$reportedAt"] },
              60000
            ]
          }
        }
      }
    ]),

    Incident.aggregate([
      {
        $match: { resolvedAt: { $exists: true } }
      },
      {
        $project: {
          resolutionTime: {
            $divide: [
              { $subtract: ["$resolvedAt", "$reportedAt"] },
              60000
            ]
          }
        }
      }
    ]),

    Unit.countDocuments(),

    Unit.countDocuments({ status: "AVAILABLE" }),

    Unit.countDocuments({ status: "BUSY" }),

    Unit.countDocuments({ status: "OFFLINE" })
  ]);

  const avgResponseTime =
    responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b.responseTime, 0) / responseTimes.length
      : 0;

  const avgResolutionTime =
    resolutionTimes.length > 0
      ? resolutionTimes.reduce((a, b) => a + b.resolutionTime, 0) / resolutionTimes.length
      : 0;

  return {
    incidents: {
      total: totalIncidents,
      open: openIncidents,
      resolved: resolvedIncidents,
      bySeverity: incidentsBySeverity.reduce((acc, cur) => {
        acc[cur._id] = cur.count;
        return acc;
      }, {}),
      avgResponseTimeMinutes: Number(avgResponseTime.toFixed(2)),
      avgResolutionTimeMinutes: Number(avgResolutionTime.toFixed(2))
    },
    units: {
      total: totalUnits,
      available: availableUnits,
      busy: busyUnits,
      offline: offlineUnits
    }
  };
};
