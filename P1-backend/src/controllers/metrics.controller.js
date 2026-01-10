import { getDashboardMetricsService } from "../services/metrics.service.js";


export const getDashboardMetricsController = async (req, res) => {
  try {
    const metrics = await getDashboardMetricsService();

    res.status(200).json({
      message: "Dashboard metrics fetched successfully",
      metrics
    });
  } catch (error) {
    console.error("Metrics error:", error);
    res.status(500).json({
      message: "Failed to fetch dashboard metrics",
      error: error.message
    });
  }
}