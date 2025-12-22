import type { Dispatch, SetStateAction } from "react";
import type { User } from "../services/User.Service";

export const getDataType = (
  user: User,
  setDataType: Dispatch<SetStateAction<string>>
) => {
  const stored = localStorage.getItem("dataType");
  console.log(stored ? "has" : "none");

  if (stored) {
    const parsedData = JSON.parse(stored);
    // console.log("Parsed: ", parsedData);
    if (parsedData === "Pins" && user.pins) {
      setDataType("Pins");
      // console.log("11INITIAL DATA TYPE: ", "Pins");
    } else if (parsedData === "ITStocks" && user.it_stocks) {
      setDataType("ITStocks");
      // console.log("12INITIAL DATA TYPE: ", "ITStocks");
    } else if (parsedData === "MaterialControl" && user.materials) {
      setDataType("MaterialControl");
      // console.log("13INITIAL DATA TYPE: ", "MaterialControl");
    }
    // console.log("1INITIAL DATA TYPE: ", JSON.parse(stored));
  } else if (user.pins) {
    setDataType("Pins");
    // console.log("2INITIAL DATA TYPE: ", "Pins");
  } else if (user.it_stocks) {
    setDataType("ITStocks");
    // console.log("3INITIAL DATA TYPE: ", "ITStocks");
  } else if (user.materials) {
    setDataType("MaterialControl");
    // console.log("4INITIAL DATA TYPE: ", "MaterialControl");
  }
};
