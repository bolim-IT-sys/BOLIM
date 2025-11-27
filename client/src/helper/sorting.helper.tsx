import type { Part } from "../services/Part.Service";

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
