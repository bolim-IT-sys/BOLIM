import { currentYear } from "./helper";

export const getDateRange = (range: string) => {
  const today = new Date();

  if (range === "week") {
    const day = today.getDay(); // 0 = Sunday
    const diffToMonday = day === 0 ? -6 : 2 - day;

    const start = new Date(today);
    start.setDate(today.getDate() + diffToMonday); // Monday
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 5); // Sunday
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  if (range === "month") {
    const start = new Date(today.getFullYear(), today.getMonth(), 2);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0); // last day of month
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  if (range === "year") {
    const start = new Date(today.getFullYear(), 0, 2); // Jan 1
    const end = new Date(today.getFullYear(), 11, 31); // Dec 31
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  return null;
};

export const formatStockDate = (dateStr: string): string => {
  const date = new Date(dateStr);

  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${mm}/${dd}/${yyyy}`;
};

export const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

export const getYears = () => {
  const startYear = currentYear() - 5;

  const years = [];

  for (let y = startYear; y <= currentYear(); y++) {
    years.push(y);
  }
  return years
}

