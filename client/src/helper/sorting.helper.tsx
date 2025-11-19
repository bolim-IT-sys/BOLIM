import type { Part } from "../services/Part.Service";

export const sortByStocks = (parts: Part[], order: "asc" | "desc") => {
  return [...parts].sort((a, b) => {
    return order === "asc" ? a.quantity - b.quantity : b.quantity - a.quantity;
  });
};

export const sortByPartNumber = (parts: Part[], order: "asc" | "desc") => {
  return [...parts].sort((a, b) => {
    return order === "asc"
      ? String(a.partNumber).localeCompare(String(b.partNumber))
      : String(b.partNumber).localeCompare(String(a.partNumber));
  });
};
