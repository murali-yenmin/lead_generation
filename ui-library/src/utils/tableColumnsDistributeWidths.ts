import { columns } from '../interfaces/table';

export function distributeColumnWidths(columns: columns[]) {
  const percentCols = columns.filter((col) => col.width?.includes('%'));
  const pixelCols = columns.filter((col) => col.width?.includes('px'));
  const unsetCols = columns.filter((col) => !col.width);

  const totalPercentUsed = percentCols.reduce((sum, col) => {
    const val = parseFloat(col.width!.replace('%', ''));
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const remainingPercent = 100 - totalPercentUsed;
  const equallyDistributed = unsetCols.length
    ? (remainingPercent / unsetCols.length).toFixed(2) + '%'
    : '0%';

  return columns.map((col) => {
    if (col.width) return col; // already has width
    return {
      ...col,
      width: equallyDistributed,
    };
  });
}
