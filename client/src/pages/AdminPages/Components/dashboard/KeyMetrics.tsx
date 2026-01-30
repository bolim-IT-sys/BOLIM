import { Link } from "react-router-dom";
import {
  currentMonth,
  currentYear,
  getSafetyStock,
} from "../../../../helper/helper";
import type { Part } from "../../../../services/Part.Service";
import { StockValue } from "./StockValue";
import { LowStocks } from "./LowStocks";
import { useEffect, useState } from "react";
import { OutOfStocks } from "./OutOfStocks";
import { computeStocks } from "../../../../helper/table.helper";

type Props = {
  data: Part[];
  dataType: string;
};

export const KeyMetrics = ({ data, dataType }: Props) => {
  const [lowStockParts, setLowStockParts] = useState<Part[]>([]);
  const [outOfStockParts, setOutOfStockParts] = useState<Part[]>([]);
  const totalParts = data.length;

  useEffect(() => {
    const lowStockParts = data.filter((stock) => {
      const safetyStock = getSafetyStock(
        stock.outbounds!.map((o) => ({
          quantity: o.quantity,
          date: String(o.outboundDate),
        })),
        currentYear(),
        currentMonth()
      );
      return computeStocks(stock) > 0 && computeStocks(stock) < safetyStock;
    });
    setLowStockParts(lowStockParts);

    const outOfStockParts = data.filter((stock) => computeStocks(stock) === 0);
    setOutOfStockParts(outOfStockParts);
  }, [data]);
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
          setParts={setLowStockParts}
          dataType={dataType}
        />
        <OutOfStocks
          outOfStockParts={outOfStockParts}
          setParts={setOutOfStockParts}
          dataType={dataType}
        />
      </div>
    </>
  );
};
