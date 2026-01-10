import { allowed_levels, new_system_prompt, model, allowed_units } from "../utils/constants.js";
import { client } from "../utils/AI.js";


export async function classifySeverity(description) {
  const prompt = `
    ${new_system_prompt}

    INCIDENT:
    ${description}

    OUTPUT:
  `;


  try {
    const result = await client.models.generateContent({
      model: model,
      contents: prompt,
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 4
      }
    });

    const rawOutput = result?.text?.trim()?.toUpperCase();
    console.log("AI severity output:", rawOutput, description);

    const [severityRaw, unitRaw] = rawOutput?.split(/\s+/) || [];
    const severity = allowed_levels.includes(severityRaw)
      ? severityRaw
      : "MEDIUM";

    const unitRequired = allowed_units.includes(unitRaw)
      ? unitRaw
      : "POLICE";

      return { severity, unitRequired };
  } catch (error) {
      // console.warn("AI classification error", error);
      throw error;
  }
}

