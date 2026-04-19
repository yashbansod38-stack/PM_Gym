// lib/parser.js
// Parse by label, not by position (per architecture requirement)

export function parseFeedback(text) {
  const result = {
    score: null,
    scoreRaw: null,
    whatWorked: null,
    whatDidntWork: null,
    mentalModelCorrection: null,
    raw: text,
  };

  if (!text) return result;

  // Extract Score
  const scoreMatch = text.match(/Score:\s*([\d.]+)\s*\/\s*10/i);
  if (scoreMatch) {
    result.scoreRaw = scoreMatch[1];
    result.score = parseFloat(scoreMatch[1]);
  }

  // Extract sections by label
  const sections = {
    whatWorked: /What Worked:\s*([\s\S]*?)(?=What Didn't Work:|What Didnt Work:|Mental Model Correction:|$)/i,
    whatDidntWork: /What Didn't Work:\s*([\s\S]*?)(?=Mental Model Correction:|$)/i,
    mentalModelCorrection: /Mental Model Correction:\s*([\s\S]*?)$/i,
  };

  for (const [key, pattern] of Object.entries(sections)) {
    const match = text.match(pattern);
    if (match) {
      result[key] = match[1].trim();
    }
  }

  return result;
}

export function extractMentalModelCorrection(text) {
  if (!text) return null;
  const match = text.match(/Mental Model Correction:\s*([\s\S]*?)$/i);
  return match ? match[1].trim() : null;
}

export function extractScore(text) {
  if (!text) return null;
  const match = text.match(/Score:\s*([\d.]+)\s*\/\s*10/i);
  return match ? parseFloat(match[1]) : null;
}
