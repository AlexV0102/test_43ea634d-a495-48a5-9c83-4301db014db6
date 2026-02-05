export function parseCsvToRows(csv: string): Record<string, string>[] {
  const lines = csv.trim().split('\n').filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim());
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row: Record<string, string> = {};
    headers.forEach((h, j) => {
      row[h] = values[j]?.trim() ?? '';
    });
    rows.push(row);
  }
  return rows;
}
