import {
  currentMonth,
  currentYear,
  getSafetyStock,
} from "../../../../helper/helper";
import type { Part } from "../../../../services/Part.Service";
import { StockValue } from "./StockValue";

type Props = {
  data: Part[];
};

export const KeyMetrics = ({ data }: Props) => {
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
        <div
          className={`relative bg-sky-600 text-neutral-50 rounded shadow p-3 md:p-6`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-neutral-50">Total Parts</h3>
              <h1 className="font-bold text-neutral-0 mt-2">{totalParts}</h1>
              <p className="text-neutral-100 mt-1">Number of spare parts</p>
            </div>
            <div
              className={`absolute top-5 right-5 size-10 lg:size-13 flex justify-center items-center p-3 rounded-full bg-neutral-50 text-sky-500`}
            >
              <h3 className="">
                <i className="bx  bxs-package"></i>
              </h3>
            </div>
          </div>
        </div>
        <StockValue data={data} />
        <div
          className={`relative bg-yellow-400 text-neutral-50 rounded shadow p-3 md:p-6`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-neutral-50">Low Stock Alert</h3>
              <h1 className="font-bold text-neutral-0 mt-2">
                {`${lowStockParts.length}`}
                {/* {`₩${totalInventoryValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}`} */}
              </h1>
              <p className="text-neutral-100 mt-1">Parts below safety stocks</p>
            </div>
            <div
              className={`absolute top-5 right-5 size-10 lg:size-13 flex justify-center items-center p-3 rounded-full bg-neutral-50 text-yellow-400`}
            >
              <h3 className="mt-1">
                <i className="bx  bxs-alert-triangle"></i>
              </h3>
            </div>
          </div>
        </div>
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
