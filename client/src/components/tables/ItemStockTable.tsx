import type { ITStocks } from "../../services/InboundOutbound.Service";

type Props = {
  isLoading: boolean;
  stockItems: ITStocks[];
};

export const ItemStockTable = ({ isLoading, stockItems }: Props) => {
  return (
    <>
      <table className="w-250 md:w-full table-fixed border border-gray-300">
        <thead className="sticky top-0 bg-sky-200 ">
          <tr>
            <th className="bg-sky-200 border border-neutral-400 px-3 py-2 text-neutral-900 text-center">
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
            <th className="bg-sky-600 border border-neutral-400 px-3 py-2 text-neutral-50 text-center">
              <h5>REMARKS</h5>
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={9} className="border border-neutral-400 px-3 py-2">
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
                stockItems.map((item) => (
                  <tr key={item.id}>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div className="flex justify-center items-center flex-col gap-1">
                        <h6>{item.serialNumber}</h6>
                      </div>
                    </td>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div className="flex justify-center items-center flex-col gap-1">
                        <h6>{String(item.PRDate)}</h6>
                      </div>
                    </td>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div className="flex justify-center items-center flex-col gap-1">
                        <h6>{String(item.receivedDate)}</h6>
                      </div>
                    </td>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div
                        className={`flex justify-center items-center flex-col gap-1 ${
                          item.deployedDate ? null : "text-neutral-400"
                        }`}
                      >
                        <h6>
                          {item.deployedDate
                            ? String(item.deployedDate)
                            : "N/A"}
                        </h6>
                      </div>
                    </td>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div
                        className={`flex justify-center items-center flex-col gap-1 ${
                          item.station ? null : "text-neutral-400"
                        }`}
                      >
                        <h6>{item.station ? item.station : "N/A"}</h6>
                      </div>
                    </td>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div
                        className={`flex justify-center items-center flex-col gap-1 ${
                          item.department ? null : "text-neutral-400"
                        }`}
                      >
                        <h6>{item.department ? item.department : "N/A"}</h6>
                      </div>
                    </td>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div
                        className={`flex justify-center items-center flex-col gap-1 ${
                          item.from ? null : "text-neutral-400"
                        }`}
                      >
                        <h6>{item.from ? item.from : "N/A"}</h6>
                      </div>
                    </td>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div
                        className={`flex justify-center items-center flex-col gap-1 ${
                          item.to ? null : "text-neutral-400"
                        }`}
                      >
                        <h6>{item.to ? item.to : "N/A"}</h6>
                      </div>
                    </td>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div
                        className={`flex justify-center items-center flex-col gap-1 ${
                          item.remarks === "available"
                            ? "text-green-700"
                            : "text-red-600"
                        }`}
                      >
                        <h6>
                          {item.remarks ? item.remarks.toUpperCase() : "N/A"}
                        </h6>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
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
