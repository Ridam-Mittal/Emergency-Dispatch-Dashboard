import { Incident } from '../models/Incident.model.js';
import { classifySeverity } from './classifySeverity.js';
import { classifyUnitRequired } from './classifyUnitRequired.js';


let isProcessing = false;

export async function processNextIncident() {
  if (isProcessing) return; // guarantee: only one at a time

  const incident = await Incident.findOne({
    aiStatus: "PENDING"
  }).sort({ createdAt: 1 });

  if (!incident) return;

  isProcessing = true;

  try {
    incident.aiStatus = "PROCESSING";
    await incident.save();

    const result = await classifySeverity(incident.description);

    const { severity, unitRequired } = result;

    incident.severity = severity;
    incident.requiredUnitType = unitRequired;
    incident.aiStatus = "COMPLETED";
    await incident.save();

  } catch (err) {
    incident.aiStatus = "FAILED";
    const unitRequired = classifyUnitRequired(incident.description);
    incident.requiredUnitType = unitRequired;
    await incident.save();
  } finally {
    isProcessing = false;

    // trigger next item
    processNextIncident();
  }
}
