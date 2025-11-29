import {
  currentMonth,
  currentYear,
  getSafetyStock,
} from "../../../../helper/helper";
import type { Part } from "../../../../services/Part.Service";
import { StockValue } from "./StockValue";

type Props = {
  parts: Part[];
};

export const KeyMetrics = ({ parts }: Props) => {
  const totalParts = parts.length;

  const lowStockParts = parts.filter((part) => {
    const safetyStock = getSafetyStock(
      part.outbounds!.map((o) => ({
        quantity: o.quantity,
        date: String(o.outboundDate),
      })),
      currentYear(),
      currentMonth()
    );
    const lowStockParts = part.quantity > 0 && part.quantity < safetyStock;
    // console.log("Low Stock Parts: ", lowStockParts);
    return lowStockParts;
  });
  const outOfStockParts = parts.filter((part) => part.quantity === 0);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
        <div className={`bg-sky-500 text-neutral-50 rounded shadow p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-50">Total Parts</p>
              <p className="text-2xl font-bold text-neutral-0 mt-2">
                {totalParts}
              </p>
              <p className="text-sm text-neutral-100 mt-1">
                Number of spare parts
              </p>
            </div>
            <div
              className={`size-13 flex justify-center items-center p-3 rounded-full bg-neutral-50 text-sky-500`}
            >
              <h3 className="">
                <i className="bx  bxs-package"></i>
              </h3>
            </div>
          </div>
        </div>
        <StockValue parts={parts} />
        <div className={`bg-yellow-400 text-neutral-50 rounded shadow p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-50">
                Low Stock Alert
              </p>
              <p className="text-2xl font-bold text-neutral-0 mt-2">
                {`${lowStockParts.length}`}
                {/* {`₩${totalInventoryValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}`} */}
              </p>
              <p className="text-sm text-neutral-100 mt-1">
                Parts below safety stocks
              </p>
            </div>
            <div
              className={`size-13 flex justify-center items-center p-3 rounded-full bg-neutral-50 text-yellow-400`}
            >
              <h3 className="mt-1">
                <i className="bx  bxs-alert-triangle"></i>
              </h3>
            </div>
          </div>
        </div>
        <div className={`bg-red-500 text-neutral-50 rounded shadow p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-50">
                Out of Stock
              </p>
              <p className="text-2xl font-bold text-neutral-0 mt-2">
                {`${outOfStockParts.length}`}
                {/* {`₩${totalInventoryValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}`} */}
              </p>
              <p className="text-sm text-neutral-100 mt-1">
                Immediate attention needed
              </p>
            </div>
            <div
              className={`size-13 flex justify-center items-center p-3 rounded-full bg-neutral-50 text-red-500`}
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
