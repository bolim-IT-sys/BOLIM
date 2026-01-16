import type { Dispatch, SetStateAction } from "react";
import {
  markItemAsAvailable,
  type ITStocks,
} from "../../services/InboundOutbound.Service";
import SuccessButton from "../button/SuccessButton";

type Props = {
  setSerialNumber: Dispatch<SetStateAction<string>>;
  fetchAllParts: () => void;
  fetchTransactions: () => void;
  setModalShow: Dispatch<SetStateAction<boolean>>;
  setOutboundShow: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  stockItems: ITStocks[];
};

export const ItemStockTable = ({
  setSerialNumber,
  fetchAllParts,
  fetchTransactions,
  setModalShow,
  setOutboundShow,
  isLoading,
  stockItems,
}: Props) => {
  const UpdateItemStatus = async (stock: ITStocks) => {
    if (stock.remarks === "available") {
      setSerialNumber(stock.serialNumber);
      setModalShow(false);
      setOutboundShow(true);
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to mark this stock as avaiable?"
    );

    if (!confirmed) return;

    const response = await markItemAsAvailable(stock);
    if (response.success) {
      // FETCHED LATEST DATA
      fetchTransactions();
      fetchAllParts();
      alert(`stock ${stock.serialNumber} is now available for outbound.`);
    } else {
      alert(response.message);
    }
  };
  return (
    <>
      <table className="w-250 md:w-full table-fixed border border-gray-300">
        <thead className="sticky top-0 bg-sky-200 ">
          <tr>
            <th className="w-4/30 bg-sky-200 border border-neutral-400 px-3 py-2 text-neutral-900 text-center">
              <h5>SERIAL NUMBER</h5>
            </th>
            <th className="bg-sky-200 border border-neutral-400 px-3 py-2 text-neutral-900 text-center">
              <h5>PR DATE</h5>
            </th>
            <th className="bg-sky-200 border border-neutral-400 px-3 py-2 text-neutral-900 text-center">
              <h5>RECIEVED DATE</h5>
            </th>
            <th className="bg-sky-200 border border-neutral-400 px-3 py-2 text-neutral-900 text-center">
              <h5>DEPLOYED DATE</h5>
            </th>
            <th className="bg-sky-200 border border-neutral-400 px-3 py-2 text-neutral-900 text-center">
              <h5>STATION</h5>
            </th>
            <th className="bg-sky-200 border border-neutral-400 px-3 py-2 text-neutral-900 text-center">
              <h5>DEPARTMENT</h5>
            </th>
            <th className="bg-sky-200 border border-neutral-400 px-3 py-2 text-neutral-900 text-center">
              <h5>OUTBOUND PERSONEL</h5>
            </th>
            <th className="bg-sky-200 border border-neutral-400 px-3 py-2 text-neutral-900 text-center">
              <h5>RECIEVER</h5>
            </th>
            <th className="bg-sky-2 00 border border-neutral-400 px-3 py-2 text-neutral-900 text-center">
              <h5>REMARKS</h5>
            </th>
            <th className="bg-sky-600 border border-neutral-400 px-3 py-2 text-neutral-50 text-center">
              <h5>ACTIONS</h5>
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={10} className="border border-neutral-400 px-3 py-2">
                <div className="flex justify-center items-center gap-1">
                  <h5>
                    <i className="bx bx-loader-circle bx-spin" />
                  </h5>
                  <p>Loading</p>
                </div>
              </td>
            </tr>
          ) : (
            <>
              {stockItems.length > 0 ? (
                stockItems.map((stock) => (
                  <tr key={stock.id}>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div className="flex justify-center items-center flex-col gap-1">
                        <h6 className="break-all">{stock.serialNumber}</h6>
                      </div>
                    </td>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div className="flex justify-center items-center flex-col gap-1">
                        <h6>{String(stock.PRDate)}</h6>
                      </div>
                    </td>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div className="flex justify-center items-center flex-col gap-1">
                        <h6>{String(stock.receivedDate)}</h6>
                      </div>
                    </td>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div
                        className={`flex justify-center items-center flex-col gap-1 ${
                          stock.deployedDate ? null : "text-neutral-400"
                        }`}
                      >
                        <h6>
                          {stock.deployedDate
                            ? String(stock.deployedDate)
                            : "N/A"}
                        </h6>
                      </div>
                    </td>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div
                        className={`flex justify-center items-center flex-col gap-1 ${
                          stock.station ? null : "text-neutral-400"
                        }`}
                      >
                        <h6>{stock.station ? stock.station : "N/A"}</h6>
                      </div>
                    </td>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div
                        className={`flex justify-center items-center flex-col gap-1 ${
                          stock.department ? null : "text-neutral-400"
                        }`}
                      >
                        <h6>{stock.department ? stock.department : "N/A"}</h6>
                      </div>
                    </td>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div
                        className={`flex justify-center items-center flex-col gap-1 ${
                          stock.from ? null : "text-neutral-400"
                        }`}
                      >
                        <h6>{stock.from ? stock.from : "N/A"}</h6>
                      </div>
                    </td>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div
                        className={`flex justify-center items-center flex-col gap-1 ${
                          stock.to ? null : "text-neutral-400"
                        }`}
                      >
                        <h6>{stock.to ? stock.to : "N/A"}</h6>
                      </div>
                    </td>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div
                        className={`flex justify-center items-center flex-col gap-1 p-1.5 rounded ${
                          stock.remarks === "available"
                            ? "hover:bg-emerald-500 hover:text-neutral-50 text-green-700"
                            : "hover:bg-red-500 hover:text-neutral-50 text-red-600"
                        } transition duration-300 ease-in-out cursor-pointer`}
                        onClick={() => UpdateItemStatus(stock)}
                      >
                        <h6>
                          {stock.remarks ? stock.remarks.toUpperCase() : "N/A"}
                        </h6>
                      </div>
                    </td>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div
                        className={`flex justify-center items-center flex-col gap-1`}
                      >
                        <SuccessButton text="UPDATE" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    className="border border-neutral-400 px-3 py-2"
                  >
                    <div className="flex justify-center items-center gap-1">
                      <p>No data found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>
    </>
  );
};
