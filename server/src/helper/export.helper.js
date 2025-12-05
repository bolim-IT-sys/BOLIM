export const formatNumberShort = (num) => {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(2) + "K";
  return num.toString();
};

// GETTING CURRENT YEAR
export const currentYear = () => {
  return new Date().getFullYear();
};

export const monthList = [
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

// GETTING CURRENT MONTH
export const currentMonth = () => {
  return new Date().getMonth();
};

// FORMATTING DATE
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// COMPUTING INBOUND PER MONTH
export const getInQuantity = (data, monthAbb, year) => {
  return data.reduce((sum, item) => {
    const date = new Date(item.inboundDate);
    const month = new Date(item.inboundDate)
      .toLocaleString("en-US", { month: "short" })
      .toUpperCase();
    const itemYear = date.getFullYear();

    return month === monthAbb.toUpperCase() && itemYear === year
      ? sum + item.quantity
      : sum;
  }, 0);
};

// COMPUTING OUTBOUND PER MONTH
export const getOutQuantity = (data, monthAbb, year) => {
  return data.reduce((sum, item) => {
    const date = new Date(item.outboundDate);
    const month = new Date(item.outboundDate)
      .toLocaleString("en-US", { month: "short" })
      .toUpperCase();
    const itemYear = date.getFullYear();

    return month === monthAbb.toUpperCase() && itemYear === year
      ? sum + item.quantity
      : sum;
  }, 0);
};

// FOR COMPUTING OVERALL INBOUND AND OUTBOUND UNTIL CURRENT MONTH AND YEAR
export const getTotal = (
  data,
  year,
  month // 0-based month (Jan = 0)
) => {
  return data
    .filter((item) => {
      const d = new Date(item.date);
      const itemYear = d.getFullYear();
      const itemMonth = d.getMonth();

      return itemYear < year || (itemYear === year && itemMonth < month);
    })
    .reduce((sum, item) => sum + item.quantity, 0);
};

// FOR COMPUTING TOTAL INBOUND AND OUTBOUND PER YEAR
export const getTotalByYear = (data, year) => {
  return data
    .filter((item) => new Date(item.date).getFullYear() === year)
    .reduce((sum, item) => sum + item.quantity, 0);
};

// FOR COMPUTING OUTBOUND AVERAGE WITHOUT CURRENT MONTH
export const getTotalByYearExcludingCurrentMonth = (data, year, month) => {
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
export const getAverageOutboundPerMonth = (data, year, month) => {
  return currentMonth() > 0
    ? Math.round(getTotalByYearExcludingCurrentMonth(data, year, month) / month)
    : 0;
};

// COMPUTING SAFETY STOCK
export const getSafetyStock = (data, year, month) => {
  const averageOutboundPerMonth = getAverageOutboundPerMonth(data, year, month);

  if (averageOutboundPerMonth * 2 > 10) {
    return averageOutboundPerMonth * 2;
  } else {
    return 10;
  }
};
