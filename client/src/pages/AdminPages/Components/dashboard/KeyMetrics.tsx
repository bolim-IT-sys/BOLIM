import { Link } from "react-router-dom";
import {
  currentMonth,
  currentYear,
  getSafetyStock,
} from "../../../../helper/helper";
import type { Part } from "../../../../services/Part.Service";
import { StockValue } from "./StockValue";
import { LowStocks } from "./LowStocks";
import type { Dispatch, SetStateAction } from "react";
import { OutOfStocks } from "./OutOfStocks";

type Props = {
  setParts: Dispatch<SetStateAction<Part[]>>;
  data: Part[];
  dataType: string;
};

export const KeyMetrics = ({ setParts, data, dataType }: Props) => {
  const totalParts = data.length;

  const lowStockParts = data.filter((stock) => {
    const safetyStock = getSafetyStock(
      stock.outbounds!.map((o) => ({
        quantity: o.quantity,
        date: String(o.outboundDate),
      })),
      currentYear(),
      currentMonth()
    );
    const lowStockParts = stock.quantity > 0 && stock.quantity < safetyStock;
    // console.log("Low Stock Parts: ", lowStockParts);
    return lowStockParts;
  });
  const outOfStockParts = data.filter((stock) => stock.quantity === 0);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
        <Link
          to={`/stocks/${dataType === "Pins" ? `pins` : dataType === "ITStocks" ? `it-stocks` : dataType === "MaterialControl" ? `material-control` : ``}`}
          className={`relative bg-sky-600 hover:bg-sky-700 transition duration-500 ease-in-out cursor-pointer text-neutral-50 rounded shadow p-3 md:p-6`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-neutral-50">Total Stocks</h3>
              <h1 className="font-bold text-neutral-0 mt-2">{totalParts}</h1>
              <p className="text-neutral-100 mt-1">Number of stock items</p>
            </div>
            <div
              className={`absolute top-5 right-5 size-10 lg:size-13 flex justify-center items-center p-3 rounded-full bg-neutral-50 text-sky-600`}
            >
              <h2 className="">
                <i className="bx bxs-package"></i>
              </h2>
            </div>
          </div>
        </Link>
        <StockValue data={data} />
        <LowStocks
          lowStockParts={lowStockParts}
          setParts={setParts}
          dataType={dataType}
        />
        <OutOfStocks
          outOfStockParts={outOfStockParts}
          setParts={setParts}
          dataType={dataType}
        />
      </div>
    </>
  );
};
