import type { Part } from "../services/Part.Service";
import {
  computeExcessInsufficient,
  computeOrderQuantity,
  computeSecurementRate,
  computeUrgentRequest,
} from "./table.helper";

export const sortByStocks = (parts: Part[], order: "asc" | "desc") => {
  return [...parts].sort((a, b) => {
    const primary =
      order === "asc" ? a.quantity - b.quantity : b.quantity - a.quantity;

    //SORTING BY PARTNUMBER WHEN QUANTITY IS THE SAME
    if (primary === 0) {
      return a.partNumber.localeCompare(b.partNumber);
    }

    return primary;
  });
};

export const sortByPartNumber = (parts: Part[], order: "asc" | "desc") => {
  return [...parts].sort((a, b) => {
    return order === "asc"
      ? String(a.partNumber).localeCompare(String(b.partNumber))
      : String(b.partNumber).localeCompare(String(a.partNumber));
  });
};

export const sortByPrice = (parts: Part[], order: "asc" | "desc") => {
  return [...parts].sort((a, b) => {
    const primary =
      order === "asc"
        ? Number(a.unitPrice) - Number(b.unitPrice)
        : Number(b.unitPrice) - Number(a.unitPrice);

    //SORTING BY PARTNUMBER WHEN UNIT PRICE IS THE SAME
    if (primary === 0) {
      return a.partNumber.localeCompare(b.partNumber);
    }

    return primary;
  });
};

export const sortBySecurementRate = (parts: Part[], order: "asc" | "desc") => {
  return [...parts].sort((a, b) => {
    const primary =
      order === "asc"
        ? computeSecurementRate(a) - computeSecurementRate(b)
        : computeSecurementRate(b) - computeSecurementRate(a);

    //SORTING BY PARTNUMBER WHEN UNIT PRICE IS THE SAME
    if (primary === 0) {
      return a.partNumber.localeCompare(b.partNumber);
    }

    return primary;
  });
};

export const sortByExcessInsufficient = (
  parts: Part[],
  order: "asc" | "desc"
) => {
  return [...parts].sort((a, b) => {
    const primary =
      order === "asc"
        ? computeExcessInsufficient(a) - computeExcessInsufficient(b)
        : computeExcessInsufficient(b) - computeExcessInsufficient(a);

    //SORTING BY PARTNUMBER WHEN UNIT PRICE IS THE SAME
    if (primary === 0) {
      return a.partNumber.localeCompare(b.partNumber);
    }

    return primary;
  });
};

export const sortByUrgentRequest = (parts: Part[], order: "asc" | "desc") => {
  return [...parts].sort((a, b) => {
    const primary =
      order === "asc"
        ? computeUrgentRequest(a) - computeUrgentRequest(b)
        : computeUrgentRequest(b) - computeUrgentRequest(a);

    //SORTING BY PARTNUMBER WHEN UNIT PRICE IS THE SAME
    if (primary === 0) {
      return a.partNumber.localeCompare(b.partNumber);
    }

    return primary;
  });
};

export const sortByOrderQuantity = (parts: Part[], order: "asc" | "desc") => {
  return [...parts].sort((a, b) => {
    const primary =
      order === "asc"
        ? computeOrderQuantity(a) - computeOrderQuantity(b)
        : computeOrderQuantity(b) - computeOrderQuantity(a);

    //SORTING BY PARTNUMBER WHEN UNIT PRICE IS THE SAME
    if (primary === 0) {
      return a.partNumber.localeCompare(b.partNumber);
    }

    return primary;
  });
};
