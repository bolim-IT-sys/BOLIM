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
              className={`absolute top-5 right-5 size-10 lg:size-13 flex justify-center items-center p-3 rounded-full bg-neutral-50 text-sky-500`}
            >
              <h3 className="">
                <i className="bx  bxs-package"></i>
              </h3>
            </div>
          </div>
        </Link>
        <StockValue data={data} />
        <LowStocks
          lowStockParts={lowStockParts}
          setParts={setParts}
          dataType={dataType}
        />
        <div
          className={`relative bg-red-500 text-neutral-50 rounded shadow p-3 md:p-6`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-neutral-50">Out of Stock</h3>
              <h1 className="font-bold text-neutral-0 mt-2">
                {`${outOfStockParts.length}`}
                {/* {`₩${totalInventoryValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}`} */}
              </h1>
              <p className="text-neutral-100 mt-1">
                Immediate attention needed
              </p>
            </div>
            <div
              className={`absolute top-5 right-5 size-10 lg:size-13 flex justify-center items-center p-3 rounded-full bg-neutral-50 text-red-500`}
            >
              <h3 className="mt-1">
                <i className="bx  bxs-trending-down"></i>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
