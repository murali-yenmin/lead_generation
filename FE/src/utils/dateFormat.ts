import { format } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { DEFAULT_PLACEHOLDER } from './crypto';

export const formatDate = (isoDate: string): string => {
  if (!isoDate) return DEFAULT_PLACEHOLDER;
  const date = new Date(isoDate);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
};

export const formatDateWithTime = (dateString?: string): string => {
  if (!dateString) return 'N/A';

  const timeZone = 'America/New_York';
  const utcDate = new Date(dateString);
  const zonedDate = toZonedTime(utcDate, timeZone);

  return format(zonedDate, 'MM/dd/yyyy hh:mm:ss a');
};

export const formatUTCDateWithTime = (dateString?: string): string => {
  return dateString
    ? formatInTimeZone(dateString, 'America/New_York', 'MM-dd-yyyy hh:mm:ss a')
    : 'N/A';
};

export const formatDate_MDY_To_YMD = (inputDate: string): string => {
  // Split the input into parts
  const [month, day, year] = inputDate.split('/');

  // Reformat the date
  const formattedDate = `${year}/${month}/${day}`;
  return formattedDate; // Output: yyyy-mm-dd
};

export const formatDate_ISO_To_MDY = (isoDate: string): string => {
  // Create a Date object
  const date = new Date(isoDate);

  // Extract parts
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getUTCDate()).padStart(2, '0');
  const year = date.getUTCFullYear();

  // Format to MM/DD/YYYY
  const formattedDate = `${month}/${day}/${year}`;

  return formattedDate; // Output: mm/dd/yyyy
};

export const formatDateMonthText = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}; // Output: "Jan 30, 2025"

const formatDateToYMD = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0'); // month is 0-indexed
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const toStartOfDayISOString = (date: Date | string): string => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return formatDateToYMD(d);
};

export const toEndOfDayISOString = (date: Date | string): string => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return formatDateToYMD(d);
};

// last one month
export const getStartAndEndDate = () => {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999); // end of today

  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - 28);
  startDate.setHours(0, 0, 0, 0); // start of startDate

  return {
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10),
  };
};
