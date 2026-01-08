import {
  getInQuantity,
  getOutQuantity,
  getSafetyStock,
  getTotalByYearExcludingCurrentMonth,
} from "../../helper/helper";
import type { Inbound, Outbound } from "../../services/InboundOutbound.Service";

type Props = {
  isLoading: boolean;
  inbounds: Inbound[];
  outbounds: Outbound[];
  chosenYear: number;
  months: string[];
  month: number;
  setMonth: (value: number) => void;
};
export const InboundOutboundHistoryTable = ({
  isLoading,
  inbounds,
  outbounds,
  chosenYear,
  months,
  month,
  setMonth,
}: Props) => {
  return (
    <>
      <table className="w-250 md:w-full table-fixed border border-gray-300 text-sm">
        <thead className="bg-sky-200">
          <tr>
            {months.map((monthHead, index) => (
              <th
                key={index}
                className={`border ${month === index ? "border-emerald-700 bg-emerald-500 text-neutral-50" : "border-neutral-400"} px-3 py-2 text-center cursor-pointer`}
                onClick={() => setMonth(index)}
              >
                <h5>{monthHead}</h5>
              </th>
            ))}
            <th className="w-50 bg-sky-600 border border-neutral-400 px-3 py-2 text-neutral-50 text-center">
              <h5>TOTAL</h5>
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={13} className="border border-neutral-400 px-3 py-2">
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
              <tr>
                {months.map((month, index) => (
                  <td
                    key={index}
                    className="border border-neutral-400 px-3 py-2"
                  >
                    <div className="flex justify-center items-center gap-1">
                      <h6 className="text-green-600">
                        {/* INBOUND QUANTITY PER MONTH */}
                        {getInQuantity(inbounds, month, chosenYear) > 0
                          ? `+${getInQuantity(inbounds, month, chosenYear)}`
                          : 0}
                      </h6>
                    </div>
                  </td>
                ))}
                <td className="border border-neutral-400 px-3 py-2">
                  <div className="flex justify-center items-center flex-col gap-1 text-green-600">
                    <h6 className="text-green-600">
                      {/* TOTAL QUANTITY */}
                      {getTotalByYearExcludingCurrentMonth(
                        inbounds.map((o) => ({
                          quantity: o.quantity,
                          date: String(o.inboundDate),
                        })),
                        chosenYear,
                        month + 1
                      )}
                    </h6>
                    <h6>
                      (SAFTETY STOCK:{" "}
                      {getSafetyStock(
                        outbounds.map((o) => ({
                          quantity: o.quantity,
                          date: String(o.outboundDate),
                        })),
                        chosenYear,
                        month
                      )}
                      )
                    </h6>
                  </div>
                </td>
              </tr>
              <tr>
                {months.map((month, index) => (
                  <td
                    key={index}
                    className="border border-neutral-400 px-3 py-2"
                  >
                    <div className="flex justify-center items-center gap-1">
                      <h6 className="text-red-500">
                        {/* OUTBOUND PERMONTH */}
                        {getOutQuantity(outbounds, month, chosenYear) > 0
                          ? `-${getOutQuantity(outbounds, month, chosenYear)}`
                          : 0}
                      </h6>
                    </div>
                  </td>
                ))}
                <td className="border border-neutral-400 px-3 py-2">
                  <div className="flex justify-center items-center flex-col text-red-500">
                    <h6 className="">
                      {/* TOTAL OUTBOUNDS BASED ON CURRENT MONTH */}
                      {getTotalByYearExcludingCurrentMonth(
                        outbounds.map((o) => ({
                          quantity: o.quantity,
                          date: String(o.outboundDate),
                        })),
                        chosenYear,
                        month + 1
                      )}
                    </h6>
                    <h6>
                      (AVERAGE MONTHLY USAGE :{" "}
                      {Math.round(
                        getTotalByYearExcludingCurrentMonth(
                          outbounds.map((o) => ({
                            quantity: o.quantity,
                            date: String(o.outboundDate),
                          })),
                          chosenYear,
                          month
                        ) / month
                      ) > 0
                        ? Math.round(
                            getTotalByYearExcludingCurrentMonth(
                              outbounds.map((o) => ({
                                quantity: o.quantity,
                                date: String(o.outboundDate),
                              })),
                              chosenYear,
                              month
                            ) / month
                          )
                        : 0}
                      )
                    </h6>
                  </div>
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </>
  );
};
