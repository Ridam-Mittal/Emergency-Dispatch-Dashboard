import mongoose from "mongoose";

const UnitSchema = new mongoose.Schema(
  {
    unitName: {
      type: String,
      required: true,
      unique: true
    },

    unitType: {
      type: String,
      enum: ["AMBULANCE", "FIRE", "POLICE"],
      required: true
    },

    status: {
      type: String,
      enum: ["AVAILABLE", "BUSY", "OFFLINE"],
      default: "AVAILABLE"
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: function (v) {
            return (
              v.length === 2 &&
              v[0] >= -180 && v[0] <= 180 &&
              v[1] >= -90 && v[1] <= 90
            );
          },
          message: "Coordinates must be [longitude, latitude]"
        }
      }
    },
  },
  { timestamps: true }
);

// Geospatial index for nearest-unit search
UnitSchema.index({ location: "2dsphere" });

export const Unit = mongoose.model("Unit", UnitSchema);
