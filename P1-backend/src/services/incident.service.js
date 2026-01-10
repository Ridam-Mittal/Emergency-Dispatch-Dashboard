import { Incident } from "../models/Incident.model.js";
import { processNextIncident } from "../helpers/processNextIncident.js";
import { Unit } from "../models/Unit.model.js";


export const createIncidentService = async ({ description, coordinates }) => {
    const location = {
        type: "Point",
        coordinates
    };

    const incident = await Incident.create({
        description,
        severity: "MEDIUM",
        location,
        aiStatus: "PENDING"
    });

    // fire-and-forget trigger
    processNextIncident();

    return incident;
}



export const getIncidentsService = async (query) => {
    const {
        severity,
        status,
        from,
        to,
        page = 1,
        limit = 10,
        assignedUnitId
    } = query;

    const filter = {};

    if (severity) {
        filter.severity = severity.toUpperCase();
    }

    if (status) {
        filter.status = status.toUpperCase();
    }

    if (from || to) {
        filter.reportedAt = {};
        if (from) {
            filter.reportedAt.$gte = new Date(from);
        }
        if (to) {
            filter.reportedAt.$lte = new Date(to);
        }
    }

    if (assignedUnitId) {
        filter.assignedUnitId = assignedUnitId;
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const incidents = await Incident.find(filter)
        .populate("assignedUnitId", "unitName unitType location status")
        .sort({ reportedAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)

    return incidents;
};




export const getIncidentNearestUnitsService = async (id) => {
    const incident = await Incident.findById(id);
    if (!incident) {
        return { error: true, message: "Incident not found" };
    }

    if (!incident.location || !incident.location.coordinates) {
        return { error: true, message: "Incident location not available" };
    }

    if (!incident.requiredUnitType) {
        return { error: true, message: "Incident required unit type not specified" };
    }

    // now finding nearest units using geospatial query
    const units = await Unit.aggregate([
        {
            $geoNear: {
                near: incident.location,
                distanceField: "distance", 
                spherical: true,
                query: { 
                    status: "AVAILABLE",
                    unitType: incident.requiredUnitType 
                },
            }
        },
        { $limit: 5 } // limit to 5 nearest units
    ]);
           
    return units
};



export const dispatchNearestUnitService = async (id) => {
    const incident = await Incident.findById(id);
    if (!incident) {
        return { error: true, message: "Incident not found" };
    }

    if (incident.status !== "REPORTED") {
        return { error: true, message: `Incident is in ${incident.status} status` };
    }
    const nearestUnits = await getIncidentNearestUnitsService(id);

    if (nearestUnits?.error) {
        return { error: true, message: nearestUnits.message };
    }

    if (nearestUnits.length === 0) {
        return { error: true, message: "No available units found for this incident" };
    }

    const unitToAssign = nearestUnits[0]; // Pick the closest most suitable unit

    // update Unit status to BUSY
    await Unit.findByIdAndUpdate(unitToAssign._id, { status: "BUSY" });

    // Update Incident with assigned unit
    incident.assignedUnitId = unitToAssign._id;
    incident.status = "ASSIGNED";
    incident.assignedAt = new Date();

    await incident.save();
    return incident;
}




export const resolveIncidentService = async (incidentId) => {
  const incident = await Incident.findById(incidentId);

  if (!incident) {
    return { error: true, message: "Incident not found" };
  }

  if (incident.status !== "ASSIGNED") {
    return { error: true, message: "Incident is not in ASSIGNED state" };
  }

  if (!incident.assignedUnitId) {
    return { error: true, message: "No unit assigned to this incident" };
  }

  // Free the unit
  await Unit.findByIdAndUpdate(
    incident.assignedUnitId,
    { status: "AVAILABLE" }
  );

  // Resolve incident
  incident.status = "RESOLVED";
  incident.resolvedAt = new Date();

  await incident.save();

  return incident;
};