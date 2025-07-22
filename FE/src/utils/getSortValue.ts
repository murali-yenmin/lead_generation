export const getSortValue = (value: string): string => {
  if (value === 'ascending') return 'asc';
  if (value === 'descending') return 'desc';
  return 'desc';
};
