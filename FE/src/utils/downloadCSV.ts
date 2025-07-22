import { unparse } from 'papaparse';
import { formatUTCDateWithTime } from './dateFormat';
import { toastError } from 'UI-Library';
import { generateFileName } from './generateFileName';

type JsonData = { [key: string]: any };

// Format field headers
const formatHeader = (key: string): string => {
  return key
    .split('.')
    .pop()!
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const isDateField = (key: string): boolean => {
  return /(^.*date$|^date.*$)/i.test(key);
};

export const capitalizeStatus = (status: string): string => {
  return status.replace(/\b\w/g, (char) => char.toUpperCase());
};

// Clean and transform the input JSON
const processObject = (obj: JsonData, ignoreFields: string[] = []): JsonData => {
  const unwantedKeys = ['updated_at', '__v', 'created_at', 'id', '_id', 'Id', 'rental_id'];

  return Object.entries(obj).reduce<JsonData>((acc, [key, value]) => {
    if (unwantedKeys.includes(key) || ignoreFields.includes(key)) return acc;

    if (key === 'status' && typeof value === 'string') {
      acc[key] = capitalizeStatus(value);
    } else if (isDateField(key) && value) {
      acc[key] = formatUTCDateWithTime(value);
    } else if (typeof value === 'object' && value !== null) {
      acc[key] = Array.isArray(value)
        ? value.map((val) => processObject(val, ignoreFields))
        : processObject(value, ignoreFields);
    } else {
      acc[key] = value;
    }

    return acc;
  }, {});
};

export const cleanJsonData = (data: JsonData[], ignoreFields: string[] = []): JsonData[] => {
  return data.map((item) => processObject(item, ignoreFields));
};

// Flatten nested JSON objects into single level
const flattenObject = (
  obj: any,
  parentKey: string = '',
  keyCount: Record<string, number> = {},
  ignoreFields: string[] = [],
): Record<string, any> => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (ignoreFields.includes(key)) return acc;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(acc, flattenObject(value, newKey, keyCount, ignoreFields));
    } else {
      const rawField = formatHeader(key);
      const parentHeader = parentKey ? formatHeader(parentKey.split('.').pop()!) : '';

      let finalHeader: string;

      if (!keyCount[rawField]) {
        keyCount[rawField] = 1;
        finalHeader = rawField;
      } else {
        keyCount[rawField]++;
        finalHeader = parentHeader ? `${parentHeader} ${rawField}` : rawField;
      }

      acc[finalHeader] = value;
    }

    return acc;
  }, {} as Record<string, any>);
};

// Main function to export cleaned and ordered JSON data as CSV
export const exportJsonToCSV = (
  jsonData: JsonData[],
  fileName: string = 'download.csv',
  columnOrder?: string[],
  ignoreFields: string[] = [],
) => {
  try {
    const cleanedData = cleanJsonData(jsonData, ignoreFields);
    const name = generateFileName(fileName, 'csv');

    const flattenedRows: Record<string, any>[] = [];
    const allHeadersSet = new Set<string>();

    cleanedData.forEach((item) => {
      const keyCount: Record<string, number> = {};
      const flat = flattenObject(item, '', keyCount, ignoreFields);
      flattenedRows.push(flat);
      Object.keys(flat).forEach((key) => allHeadersSet.add(key));
    });

    let finalHeaders: string[];

    if (columnOrder && columnOrder.length > 0) {
      const seenHeaders: Record<string, number> = {};
      const mappedHeaders = columnOrder.map((colPath) => {
        const parts = colPath.split('.');
        const key = parts[parts.length - 1];
        const parent = parts.length > 1 ? parts[parts.length - 2] : '';
        const rawHeader = formatHeader(key);
        const parentHeader = formatHeader(parent);

        if (!seenHeaders[rawHeader]) {
          seenHeaders[rawHeader] = 1;
          return rawHeader;
        } else {
          return `${parentHeader} ${rawHeader}`;
        }
      });

      finalHeaders = mappedHeaders.filter((col) => allHeadersSet.has(col));
    } else {
      finalHeaders = Array.from(allHeadersSet);
    }

    if (finalHeaders.length === 0) {
      throw new Error('No valid headers found to generate CSV.');
    }

    const formattedRows = flattenedRows.map((row) => {
      const filledRow: Record<string, any> = {};
      finalHeaders.forEach((header) => {
        filledRow[header] = row[header] ?? '';
      });
      return filledRow;
    });

    const csv = unparse(formattedRows, { columns: finalHeaders });

    // Create a hidden link element
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', name);

    // Simulate a click to start the download
    link.click();

    // Clean up the URL object
    URL.revokeObjectURL(url);
  } catch (error) {
    toastError('Your Export failed! Please try again.');
  }
};
