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
  return await Unit.find();
};




export const updateUnitLocationService = async (id, updateData) => {
  return await Unit.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }
  );
};
