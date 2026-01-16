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
  getSafetyStock,
} from "../../../helper/helper";
import { useOutletContext } from "react-router-dom";
import { computeStocks } from "../../../helper/table.helper";
import { ItemStockTable } from "../../tables/ItemStockTable";
import { InboundOutboundHistoryTable } from "../../tables/InboundOutboundHistoryTable";
import { TransactionHistory } from "./TransactionHistory";

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

  const [showPrinter, setShowPrinter] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const [stockItems, setStockItems] = useState<ITStocks[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<InboundOutboundType>({
    partNumber: item.partNumber,
    partId: item.id!,
    lotNo: "",
    from: "",
    to: "",
    currentQuantity: computeStocks(item),
    quantity: type === "it" ? "1" : "",
    inboundDate: new Date().toISOString().split("T")[0],
    outboundDate: new Date().toISOString().split("T")[0],
  });

  const [serialNumber, setSerialNumber] = useState<string>("");

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

      setTimeout(
        () => {
          if (inResult.success) {
            setInbounds(inResult.data!);
          }

          if (outResult.success) {
            setOutbounds(outResult.data!);
          }

          if (itemResult.success) {
            setStockItems(itemResult.data!);
          }
        },
        import.meta.env.VITE_TIME_OUT
      );
    } catch (err) {
      console.error("Error fetching inbounds and outbounds: ", err);
    } finally {
      setTimeout(
        () => {
          setIsLoading(false);
        },
        import.meta.env.VITE_TIME_OUT
      );
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

      {/* MAIN MODAL */}
      <Modal
        isOpen={modalShow}
        onClose={() => setModalShow(false)}
        title={
          <>
            <div className="flex justify-between me-3">
              <div className="flex items-center gap-2 ">
                <h3 className="text-start">
                  {`${item.partNumber}`}:{" "}
                  <span
                    className={`${
                      computeStocks(item) <
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
                    <b>{computeStocks(item)} </b>
                    <i className="text-sm hidden sm:inline">
                      {computeStocks(item) <
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
                <h4 className="hidden md:block">
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
              <div
                className="size-8 rounded hover:bg-neutral-200 transition duration-300 ease-in-out cursor-pointer"
                onClick={() => {
                  setShowHistoryModal(true);
                  setModalShow(false);
                }}
              >
                <h2 className="relative flex h-full w-full">
                  <i className="absolute transform left-[47%] translate-x-[-50%] top-[52%] translate-y-[-50%] bx bx-history"></i>
                </h2>
              </div>
            </div>
          </>
        }
        size="2xl"
        footer={
          <>
            <div className="h-10 flex gap-2">
              {/* INBOUND MODAL */}
              <PrimaryButton
                text={`INBOUND`}
                onClick={() => {
                  setModalShow(false);
                  setInboundShow(true);
                }}
              />
              {/* OUTBOUND MODAL */}
              <WarningButton
                text="OUTBOUND"
                onClick={() => {
                  setModalShow(false);
                  setOutboundShow(true);
                }}
              />
            </div>
            <div className="h-10">
              {/* CLOSE BUTTON */}
              <SecondaryButton
                text={
                  <>
                    <span className="my-1">CLOSE</span>
                  </>
                }
                onClick={() => setModalShow(false)}
              />
            </div>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <div className="w-10/10 overflow-x-auto border border-gray-400">
            {/* INBOUND OUTBOUND DATA TABLE */}
            <InboundOutboundHistoryTable
              isLoading={isLoading}
              inbounds={inbounds}
              outbounds={outbounds}
              chosenYear={chosenYear}
              months={months}
              month={month}
              setMonth={setMonth}
            />
          </div>

          {/* STOCK DEPLOYMENT RECORD TABLE */}
          {type === "it" ? (
            <div className="relative w-10/10 max-h-60 overflow-x-auto border border-gray-400">
              <ItemStockTable
                setSerialNumber={setSerialNumber}
                fetchAllParts={fetchAllParts}
                fetchTransactions={fetchTransactions}
                setModalShow={setModalShow}
                setOutboundShow={setOutboundShow}
                isLoading={isLoading}
                stockItems={stockItems}
              />
            </div>
          ) : null}
        </div>
      </Modal>

      <TransactionHistory
        item={item}
        inbounds={inbounds}
        outbounds={outbounds}
        setModalShow={setModalShow}
        showHistoryModal={showHistoryModal}
        setShowHistoryModal={setShowHistoryModal}
      />

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
        showPrinter={showPrinter}
        setShowPrinter={setShowPrinter}
      />

      {/* OUTBOUNDING */}
      <Outbounding
        item={item}
        type={type}
        serialNumber={serialNumber}
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
