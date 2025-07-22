import { formatDateWithTime } from './dateFormat';

export const generateFileName = (prefix: string, extension: string): string => {
  const APP_NAME = 'Renzy';
  const formattedDate = formatDateWithTime(new Date().toISOString());
  return `${APP_NAME}-${prefix}_${formattedDate}.${extension}`;
};
