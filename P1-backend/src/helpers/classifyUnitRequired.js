// we need a robust function to classify the required unit type based on the description
import { unitKeywords } from "../utils/constants.js";


export const classifyUnitRequired = (description) => {
    const desc = description.toLowerCase();
    
    for (const {unit, keywords} of unitKeywords) {
        for (const keyword of keywords) {
            if (desc.includes(keyword.toLowerCase())) {
                return unit;
            }
        }
    }

    // default to POLICE if no keywords matched
    return "POLICE";
}