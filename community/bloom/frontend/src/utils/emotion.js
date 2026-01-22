export function getEmotionLevel(score) {
  if (score >= 40) return "Calm";
  if (score >= 30) return "Stressed";
  if (score >= 20) return "Anxious";
  return "Overwhelmed"
}
