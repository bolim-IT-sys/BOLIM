import type { Inbound, Outbound } from "../services/InboundOutbound.Service";

// GETTING CURRENT YEAR
export const currentYear = () => {
  return new Date().getFullYear();
};

// GETTING CURRENT MONTH
export const currentMonth = () => {
  return new Date().getMonth();
};

// FORMATTING DATE
export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// COMPUTING INBOUND PER MONTH
export const getInQuantity = (data: Inbound[], monthAbb: string): number => {
  return data.reduce((sum, item) => {
    const month = new Date(item.inboundDate)
      .toLocaleString("en-US", { month: "short" })
      .toUpperCase();
    return month === monthAbb.toUpperCase() ? sum + item.quantity : sum;
  }, 0);
};

// COMPUTING OUTBOUND PER MONTH
export const getOutQuantity = (data: Outbound[], monthAbb: string): number => {
  return data.reduce((sum, item) => {
    const month = new Date(item.outboundDate)
      .toLocaleString("en-US", { month: "short" })
      .toUpperCase();
    return month === monthAbb.toUpperCase() ? sum + item.quantity : sum;
  }, 0);
};

// FOR COMPUTING TOTAL INBOUND AND OUTBOUND PER YEAR
export const getTotalByYear = (
  data: { quantity: number; date: string }[],
  year: number
) => {
  return data
    .filter((item) => new Date(item.date).getFullYear() === year)
    .reduce((sum, item) => sum + item.quantity, 0);
};

// FOR COMPUTING OUTBOUND AVERAGE WITHOUT CURRENT MONTH
export const getTotalByYearExcludingCurrentMonth = (
  data: { quantity: number; date: string }[],
  year: number,
  month: number
) => {
  const currentMonth = month; // 0-based (Jan = 0)

  return data
    .filter((item) => {
      const d = new Date(item.date);
      return (
        d.getFullYear() === year && d.getMonth() < currentMonth // exclude current month
      );
    })
    .reduce((sum, item) => sum + item.quantity, 0);
};

// COMPUTING OUTBOUND AVERAGE PER MONTH
export const getAverageOutboundPerMonth = (
  data: { quantity: number; date: string }[],
  year: number,
  month: number
) => {
  return currentMonth() > 0
    ? Math.round(getTotalByYearExcludingCurrentMonth(data, year, month) / month)
    : 0;
};

// COMPUTING SAFETY STOCK
export const getSafetyStock = (
  data: { quantity: number; date: string }[],
  year: number,
  month: number
) => {
  const averageOutboundPerMonth = getAverageOutboundPerMonth(data, year, month);

  if (averageOutboundPerMonth * 2 > 10) {
    return averageOutboundPerMonth * 2;
  } else {
    return 10;
  }
};
