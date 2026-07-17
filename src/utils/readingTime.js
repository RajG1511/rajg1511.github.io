// readingTime: word count ÷ 215 wpm, floored at 1 minute.
export function readingTime(markdown) {
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 215));
}
