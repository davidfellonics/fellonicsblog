export function calculateReadingTime(content: string): number {
  const plainText = content.replace(/<[^>]+>/g, " ");
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}
