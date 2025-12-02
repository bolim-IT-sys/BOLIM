import type { Part } from "../services/Part.Service";
import { currentMonth, currentYear, getSafetyStock, getTotal } from "./helper";

export const computeStocks = (part: Part) => {
  const overallInboundsWithCurrentMonth = getTotal(
    part.inbounds!.map((i) => ({
      quantity: i.quantity,
      date: String(i.inboundDate),
    })),
    currentYear(),
    currentMonth() + 1
  );
  const overallOutboundsWithCurrentMonth = getTotal(
    part.outbounds!.map((o) => ({
      quantity: o.quantity,
      date: String(o.outboundDate),
    })),
    currentYear(),
    currentMonth() + 1
  );
  const stocks =
    overallInboundsWithCurrentMonth - overallOutboundsWithCurrentMonth;

  return stocks;
};

export const computeSecurementRate = (part: Part) => {
  const stocksLeft = computeStocks(part);

  const safetyStock = getSafetyStock(
    part.outbounds!.map((o) => ({
      quantity: o.quantity,
      date: String(o.outboundDate),
    })),
    currentYear(),
    currentMonth()
  );

  const securementRate = Math.round((stocksLeft / safetyStock) * 100);

  return securementRate;
};

export const computeExcessInsufficient = (part: Part) => {
  const stocksLeft = computeStocks(part);

  const safetyStock = getSafetyStock(
    part.outbounds!.map((o) => ({
      quantity: o.quantity,
      date: String(o.outboundDate),
    })),
    currentYear(),
    currentMonth()
  );

  const excessInsufficient = stocksLeft - safetyStock;

  return stocksLeft !== 0 ? excessInsufficient : 0;
};

export const computeUrgentRequest = (part: Part) => {
  const securementRate = computeSecurementRate(part);

  const urgentRequest =
    securementRate < 50 && securementRate !== 0
      ? Math.abs(computeExcessInsufficient(part))
      : 0;

  return urgentRequest;
};

export const computeOrderQuantity = (part: Part) => {
  const securementRate = computeSecurementRate(part);

  const orderQuantity =
    securementRate < 100 && securementRate !== 0
      ? Math.abs(computeExcessInsufficient(part))
      : 0;

  return orderQuantity;
};
