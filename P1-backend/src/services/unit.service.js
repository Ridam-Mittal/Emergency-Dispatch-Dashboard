import { Unit } from "../models/Unit.model.js";

export const createUnitService = async ({ unitName, unitType, coordinates }) => {

  const UnitExists = await Unit.findOne({ unitName });
  if (UnitExists) {
    return { error: true, message: 'Unit with this name already exists' };
  }

  const location = {
    type: "Point",
    coordinates
  };

  const unit = new Unit({
    unitName,
    unitType,
    location
  });

  return await unit.save();
};




export const getAllUnitsService = async () => {
  const units = await Unit.find();

  // populate the incident data to which it is assigned to if  status is 'busy'
  return await Unit.find().populate({
    path: 'assignedIncident',
    select: 'description status location createdAt updatedAt',
  });
};




export const updateUnitLocationService = async (id, updateData) => {
  return await Unit.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }
  );
};
