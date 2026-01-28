import type { Dispatch, SetStateAction } from "react";
import type { User } from "../services/User.Service";

export const getDataType = (
  user: User,
  setDataType: Dispatch<SetStateAction<string>>
) => {
  const stored = localStorage.getItem("dataType"); //CHECKING IF DATA TYPE EXIST IN LOCAL STORAGE
  // console.log(stored ? "has" : "none");

  //IF DATA TYPE EXIST IN LOCAL STORAGE 
  if (stored) {
    const parsedData = JSON.parse(stored); //PARSING STORED DATA TYPE
    if (parsedData === "Pins" && user.pins) {
      setDataType("Pins");
    } else if (parsedData === "ITStocks" && user.it_stocks) {
      setDataType("ITStocks");
    } else if (parsedData === "MaterialControl" && user.materials) {
      setDataType("MaterialControl");
    }
  // IF THERES NO DATA TYPE SAVED IN LOCAL STORAGE
  } else if (user.pins) { // CHECKING IF USER IS AUTHORIZED IN PINS
    setDataType("Pins");
  } else if (user.it_stocks) { // CHECKING IF USER IS AUTHORIZED IN PINS
    setDataType("ITStocks");
  } else if (user.materials) { // CHECKING IF USER IS AUTHORIZED IN PINS
    setDataType("MaterialControl");
  }
};
