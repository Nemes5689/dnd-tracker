// Compute how many grid cells a creature occupies based on its size category.
// D&D 2024: Tiny/Small/Medium = 1, Large = 2, Huge = 3, Gargantuan = 4

export function tokenCellSize(size: string | null | undefined): number {
  if (!size) return 1;
  const s = size.toLowerCase();
  if (s.includes('gargantuan')) return 4;
  if (s.includes('huge')) return 3;
  if (s.includes('large')) return 2;
  return 1; // Tiny, Small, Medium
}
