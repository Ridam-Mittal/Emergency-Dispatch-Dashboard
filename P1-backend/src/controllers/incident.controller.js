import { createIncidentService, dispatchNearestUnitService, getIncidentNearestUnitsService, getIncidentsService, resolveIncidentService } from "../services/incident.service.js";


export const createIncidentController = async (req, res) => {
    try {
        const { description, coordinates } = req.body;
        
        if (!description || !coordinates) {
            return res.status(400).json({
                message: "Description and coordinates are required"
            });
        }

        if (!Array.isArray(coordinates) || coordinates.length !== 2) {
            return res.status(400).json({
                message: "Coordinates must be [longitude, latitude]"
            });
        }

        const incident = await createIncidentService({
            description,
            coordinates
        });

        if (incident?.error) {
            return res.status(400).json({
                success: false,
                message: incident.message
            });
        }

        res.status(200).json({
            message: "Incident reported successfully",
            incident: { 
                description: incident.description,
                coordinates: incident.location.coordinates,
                status: incident.status,
                reportedAt: incident.reportedAt.toLocaleString(),
                aiStatus: incident.aiStatus
            }
        });
    } catch (error) {
        console.log("Internal server error:", error);
        res.status(500).json({
            message: 'Failed to create incident',
            error: error.message
        });
    }
}



export const getIncidentsController = async (req, res) => {
    try {
        
        const incidents = await getIncidentsService(req.query);

        if (incidents?.error) {
            return res.status(400).json({
                success: false,
                message: incidents.message
            });
        }

        return res.status(200).json({
            message: "Incidents retrieved successfully",
            incidents
        });
    } catch (error) {
        console.log("Internal server error:", error);
        res.status(500).json({
            message: 'Failed to get incidents',
            error: error.message
        });
    }
}




export const getIncidentNearestUnitsController = async (req, res) => {
    try {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Incident ID is required"
            });
        }

        const nearestUnits = await getIncidentNearestUnitsService(id);

        if (nearestUnits?.error) {
            return res.status(400).json({
                success: false,
                message: nearestUnits.message
            });
        }

        if (nearestUnits.length === 0) {
            return res.status(200).json({
                message: "No available units found near the incident",
                nearestUnits: []
            });
        }

        return res.status(200).json({
            message: "Nearest units retrieved successfully",
            nearestUnits: nearestUnits.map(unit => ({
                ...unit, 
                distance: parseFloat((unit.distance / 1000).toFixed(2)) 
            }))
        });
    } catch (error) {
        console.log("Internal server error:", error);
        res.status(500).json({
            message: 'Failed to get nearest units',
            error: error.message
        });
    }
}




export const dispatchNearestUnitController = async (req, res) => {
   try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Incident ID is required"
            });
        }

        const result = await dispatchNearestUnitService(id);

        if (result?.error) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }

        return res.status(200).json({
            message: "Unit dispatched successfully",
            incident: result
        });
   } catch (error) {
        console.log("Internal server error:", error);
        res.status(500).json({
            message: 'Failed to dispatch unit',
            error: error.message
        });
   }
}




export const resolveIncidentController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Incident ID is required"
      });
    }

    const result = await resolveIncidentService(id);

    if (result?.error) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    return res.status(200).json({
      message: "Incident resolved successfully",
      incident: result
    });

  } catch (error) {
    console.error("Resolve incident error:", error);
    res.status(500).json({
      message: "Failed to resolve incident",
      error: error.message
    });
  }
};