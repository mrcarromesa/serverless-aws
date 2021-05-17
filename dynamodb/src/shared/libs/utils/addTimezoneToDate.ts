import { addHours, format, formatISO } from 'date-fns';

export const addTimeZoneToDate = (date: Date, timezone = 0): string => {
  let parseDate = new Date(date);

  parseDate = addHours(parseDate, timezone);

  return format(parseDate, 'dd/MM/yyyy');
};

export const addTimeZoneToDateInISOString = (
  date: Date,
  timezone = 0,
): string => {
  let parseDate = new Date(date);

  parseDate = addHours(parseDate, timezone);

  return formatISO(parseDate);
};
