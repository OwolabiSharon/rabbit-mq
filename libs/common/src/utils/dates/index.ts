
/**
 *
 * @param date
 * @returns date
 * @description this function returns back the first day of any current week(monday)
 */
export const getFirstDayOfWeek = (date: Date): Date => {
  const day = date.getDay();
  const diff = date.getDay() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(date.setDate(diff));
};

/**
 *
 * @param date
 * @returns date
 * @description this function returns back the first date of any current month
 */
export const getFirstMonthDate = (currentDate?: Date): Date => {
  let date: Date;
  if (currentDate) date = currentDate;
  else date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getFirstDateInCurrentYear = (currentDate?: Date): Date => {
  let date: Date;
  if (currentDate) date = currentDate;
  else date = new Date();
  return new Date(date.getFullYear(), 0, 1);
};

export const getDateRange = (
  startDate: Date,
  endDate: Date,
  steps = 1,
): Date[] => {
  const dateArray: Date[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dateArray.push(new Date(currentDate));
    // Use UTC date to prevent problems with time zones and DST
    currentDate.setUTCDate(currentDate.getUTCDate() + steps);
  }
  return dateArray;
};

/**
 *
 * @param period (30days, 60days, 90days, 1year, 2years, 3years, 5years, 10years)
 * @returns date
 * @description this function gets starting date of any period
 */
export const getRangePeriod = (period: any) => {
  let startDate: Date;
  let isCheck = true;
  if (period.includes('30'))
    startDate = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30);
  else if (period.includes('90'))
    startDate = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 90);
  else if (period.includes('This week'))
    startDate = getFirstDayOfWeek(new Date());
  else if (period.includes('Today')) startDate = new Date();
  else if (period.includes('This month')) startDate = getFirstMonthDate();
  else if (period.includes('This year'))
    startDate = getFirstDateInCurrentYear();
  else {
    startDate = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 365 * 1);
    isCheck = false;
  }

  return { startDate, isCheck };
};

export const removeWhiteSpace = (str: string): string =>
  str.replace(/\s\s+/g, ' ');
