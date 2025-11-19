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

export const sortByPrice = (parts: Part[], order: "asc" | "desc") => {
  console.log(typeof parts[0].unitPrice, parts[0].unitPrice);

  return [...parts].sort((a, b) => {
    return order === "asc"
      ? String(a.unitPrice).localeCompare(String(b.unitPrice))
      : String(b.unitPrice).localeCompare(String(a.unitPrice));
  });
};
