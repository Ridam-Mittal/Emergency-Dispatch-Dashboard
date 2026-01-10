import mongoose from "mongoose";


const IncidentSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },

  severity: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH"],
    default: "MEDIUM"
  },

  aiStatus: {
    type: String,
    enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
    default: "PENDING"
  },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point"
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

  reportedAt: {
    type: Date,
    default: Date.now
  },

  assignedUnitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Unit",
    default: null
  },

  assignedAt: {
    type: Date,
    default: null
  },

  resolvedAt: {
    type: Date,
    default: null
  },

  status: {
    type: String,
    enum: ["REPORTED", "ASSIGNED", "RESOLVED"],
    default: "REPORTED"
  },
  requiredUnitType: {
    type: String,
    enum: ["AMBULANCE", "FIRE", "POLICE"],
    default: "POLICE"
  }
}, { timestamps: true });

// Geospatial index
IncidentSchema.index({ location: "2dsphere" });

export const Incident = mongoose.model("Incident", IncidentSchema);