import { useState, type Dispatch, type SetStateAction } from "react";
import { Modal } from "../../Modal";
import SecondaryButton from "../../button/SecondaryButton";
import PrimaryButton from "../../button/PrimaryButton";
import type { Part } from "../../../services/Part.Service";
import WarningButton from "../../button/WarningButton";
import {
  fetchInbounds,
  fetchITStocks,
  fetchOutbounds,
  type Inbound,
  type InboundOutboundType,
  type ITStocks,
  type Outbound,
} from "../../../services/InboundOutbound.Service";
import { Inbounding } from "./Inbounding";
import { Outbounding } from "./Outbounding";
import {
  currentMonth,
  currentYear,
  getInQuantity,
  getOutQuantity,
  getSafetyStock,
  getTotalByYearExcludingCurrentMonth,
} from "../../../helper/helper";
import { useOutletContext } from "react-router-dom";

interface Props {
  item: Part;
  setData: Dispatch<SetStateAction<Part[]>>;
  type: string;
}

interface ContextType {
  fetchAllParts: () => void;
}

export const ViewPartStocks = ({ item, setData, type }: Props) => {
  const { fetchAllParts } = useOutletContext<ContextType>();

  const [modalShow, setModalShow] = useState<boolean>(false);

  const [inbounds, setInbounds] = useState<Inbound[]>([]);
  const [inboundShow, setInboundShow] = useState<boolean>(false);
  const [inbounding, setInBounding] = useState<boolean>(false);

  const [outbounds, setOutbounds] = useState<Outbound[]>([]);
  const [outboundShow, setOutboundShow] = useState<boolean>(false);
  const [outbounding, setOutBounding] = useState<boolean>(false);

  const [stockItems, setStockItems] = useState<ITStocks[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<InboundOutboundType>({
    partId: item.id!,
    currentQuantity: item.quantity,
    quantity: type === "it" ? "1" : "",
    inboundDate: new Date().toISOString().split("T")[0],
    outboundDate: new Date().toISOString().split("T")[0],
  });

  const currentMonthOption = currentMonth();
  const [month, setMonth] = useState<number>(currentMonthOption);
  const currentYearOption = currentYear();
  const [chosenYear, setYear] = useState<number>(currentYearOption);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);

      const [inResult, outResult, itemResult] = await Promise.all([
        fetchInbounds(item.id!),
        fetchOutbounds(item.id!),
        fetchITStocks(item.id!),
      ]);

      if (inResult.success) {
        setInbounds(inResult.data!);
      }

      if (outResult.success) {
        setOutbounds(outResult.data!);
      }

      if (itemResult.success) {
        setStockItems(itemResult.data!);
      }
    } catch (err) {
      console.error("Error fetching inbounds and outbounds: ", err);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 0);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleViewModal = () => {
    setModalShow(true);
    fetchTransactions();
  };

  const startYear = currentYearOption - 5;

  const years = [];

  for (let y = startYear; y <= currentYearOption; y++) {
    years.push(y);
  }

  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  return (
    <>
      <PrimaryButton text="VIEW" onClick={() => handleViewModal()} />

      <Modal
        isOpen={modalShow}
        onClose={() => setModalShow(false)}
        title={
          <>
            <div className="flex items-center gap-2">
              <h3 className="">
                {`${item.partNumber}`}:{" "}
                <span
                  className={`${
                    item.quantity <
                    getSafetyStock(
                      outbounds.map((o) => ({
                        quantity: o.quantity,
                        date: String(o.outboundDate),
                      })),
                      chosenYear,
                      month
                    )
                      ? "bg-red-100 text-red-900"
                      : "bg-emerald-100 text-emerald-800"
                  } rounded px-2`}
                >
                  <b>{item.quantity} </b>
                  <i className="text-sm">
                    {item.quantity <
                    getSafetyStock(
                      outbounds.map((o) => ({
                        quantity: o.quantity,
                        date: String(o.outboundDate),
                      })),
                      chosenYear,
                      month
                    ) ? (
                      <>Warning: Low stock!</>
                    ) : null}
                  </i>
                </span>
              </h3>
              <h4>
                <select
                  className="no-arrow rounded-lg hover:bg-neutral-200 transition duration-350 cursor-pointer px-2 py-.5 focus:bg-neutral-50  focus:ring-1 focus:ring-neutral-300 focus:outline-none"
                  value={month}
                  id="monthSelect"
                  onChange={(e) => setMonth(Number(e.target.value))}
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>{" "}
                -{" "}
                <select
                  className="no-arrow rounded-lg hover:bg-neutral-200 transition duration-350 cursor-pointer px-2 py-.5 focus:bg-neutral-50  focus:ring-1 focus:ring-neutral-300 focus:outline-none"
                  value={chosenYear}
                  id="yearSelect"
                  onChange={(e) => setYear(Number(e.target.value))}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </h4>
            </div>
          </>
        }
        size="2xl"
        footer={
          <>
            <div className="flex gap-2">
              {/* <ItemData part={part} /> */}
              <PrimaryButton
                text={`INBOUND`}
                onClick={() => {
                  setModalShow(false);
                  setInboundShow(true);
                }}
              />
              <WarningButton
                text="OUTBOUND"
                onClick={() => {
                  setModalShow(false);
                  setOutboundShow(true);
                }}
              />
            </div>
            <SecondaryButton text="CLOSE" onClick={() => setModalShow(false)} />
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <table className="min-w-full table-fixed border border-gray-300 text-sm">
            <thead className="bg-sky-100">
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
                <th className="bg-sky-400 border border-neutral-400 px-3 py-2 text-neutral-50 text-center">
                  <h5>TOTAL</h5>
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={13}
                    className="border border-neutral-400 px-3 py-2"
                  >
                    <div className="flex justify-center items-center gap-1">
                      <h5>
                        <i className="bx bx-loader-dots bx-spin" />
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
          {type === "it" ? (
            <table className="min-w-full table-fixed border border-gray-300">
              <thead className="bg-sky-100">
                <tr>
                  <th className="bg-sky-100 border border-neutral-400 px-3 py-2 text-neutral-900 text-center">
                    <h5>SERIAL NUMBER</h5>
                  </th>
                  <th className="bg-sky-100 border border-neutral-400 px-3 py-2 text-neutral-900 text-center">
                    <h5>PR DATE</h5>
                  </th>
                  <th className="bg-sky-100 border border-neutral-400 px-3 py-2 text-neutral-900 text-center">
                    <h5>RECIEVED DATE</h5>
                  </th>
                  <th className="bg-sky-100 border border-neutral-400 px-3 py-2 text-neutral-900 text-center">
                    <h5>DEPLOYED DATE</h5>
                  </th>
                  <th className="bg-sky-100 border border-neutral-400 px-3 py-2 text-neutral-900 text-center">
                    <h5>STATION</h5>
                  </th>
                  <th className="bg-sky-100 border border-neutral-400 px-3 py-2 text-neutral-900 text-center">
                    <h5>DEPARTMENT</h5>
                  </th>
                  <th className="bg-sky-400 border border-neutral-400 px-3 py-2 text-neutral-50 text-center">
                    <h5>REMARKS</h5>
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={13}
                      className="border border-neutral-400 px-3 py-2"
                    >
                      <div className="flex justify-center items-center gap-1">
                        <h5>
                          <i className="bx bx-loader-dots bx-spin" />
                        </h5>
                        <p>Loading</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {stockItems.map((item) => (
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
                              item.remarks === "available"
                                ? "text-green-700"
                                : "text-red-600"
                            }`}
                          >
                            <h6>
                              {item.remarks
                                ? item.remarks.toUpperCase()
                                : "N/A"}
                            </h6>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          ) : null}
        </div>
      </Modal>

      {/* INBOUNDING */}
      <Inbounding
        item={item}
        type={type}
        fetchAllParts={fetchAllParts!}
        setData={setData}
        formData={formData}
        setFormData={setFormData}
        fetchTransactions={fetchTransactions}
        inboundShow={inboundShow}
        setInboundShow={setInboundShow}
        inbounding={inbounding}
        setInBounding={setInBounding}
        setModalShow={setModalShow}
        handleChange={handleChange}
      />

      {/* OUTBOUNDING */}
      <Outbounding
        item={item}
        type={type}
        fetchAllParts={fetchAllParts!}
        setData={setData}
        formData={formData}
        setFormData={setFormData}
        fetchTransactions={fetchTransactions}
        outboundShow={outboundShow}
        setOutboundShow={setOutboundShow}
        outbounding={outbounding}
        setOutBounding={setOutBounding}
        setModalShow={setModalShow}
        handleChange={handleChange}
      />
    </>
  );
};
