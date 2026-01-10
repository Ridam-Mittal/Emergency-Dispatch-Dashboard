import { allowedStatuses } from "../utils/constants.js";
import { createUnitService, getAllUnitsService, updateUnitLocationService } from "../services/unit.service.js";

export const createUnitController = async (req, res) => {
  try {
    const { unitName, unitType, coordinates } = req.body;

    if (!unitName || !unitType || !coordinates) {
      return res.status(400).json({ message: 'unitName, unitType and coordinates are required' });
    }

    if(!Array.isArray(coordinates) || coordinates.length !== 2) {
      return res.status(400).json({ message: 'Coordinates must be [longitude, latitude]' });
    }
    const newUnit = await createUnitService({ unitName, unitType, coordinates});

    if (newUnit?.error) {
      return res.status(400).json({
        success: false,
        message: newUnit.message 
      });
    }

    res.status(200).json({ 
        message: 'Unit registered successfully',
        unit: {
          unitName: newUnit.unitName,
          unitType: newUnit.unitType,
          status: newUnit.status,
          location: newUnit.location
        }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
        message: 'Failed to register unit',
        error: error.message
    });
  }
}




export const getAllUnitsController = async (req, res) => {
    try {
        const units = await getAllUnitsService();

        res.status(200).json({
            message: 'Units fetched successfully',
            units
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Failed to fetch units',
            error: error.message
        });
    }
}




export const updateUnitLocationController = async (req, res) => {
  try {
    const { id } = req.params;
    const { coordinates, status } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Unit id is required" });
    }

    if (coordinates && (!Array.isArray(coordinates) || coordinates.length !== 2)) {
      return res.status(400).json({
        message: "Coordinates must be [longitude, latitude]"
      });
    }

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed: ${allowedStatuses.join(", ")}`
      });
    }

    const updateData = {};

    if (coordinates) {
      updateData.location = {
        type: "Point",
        coordinates
      };
    }

    if (status) {
      updateData.status = status;
    }

    const updatedUnit = await updateUnitLocationService(id, updateData);
   
    if (!updatedUnit) {
      return res.status(404).json({ message: "Unit not found" });
    }

    res.status(200).json({
      message: "Unit updated successfully",
      unit: {
        unitName: updatedUnit.unitName,
        unitType: updatedUnit.unitType,
        status: updatedUnit.status,
        location: updatedUnit.location
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update unit",
      error: error.message
    });
  }
};
