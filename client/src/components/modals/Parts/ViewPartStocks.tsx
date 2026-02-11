import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
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
  type updateStatusType,
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
import InputField from "../../InputField";
import { DownloadStockData } from "../../downloadButton/DownloadStockData";
import { getYears, months } from "../../../helper/date.helper";
import { ChangeStatusModal } from "./ChangeStatusModal";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // FOR DISPLAYING MAIN MODAL
  const [modalShow, setModalShow] = useState<boolean>(false);

  // DATA FOR INBOUND AND OUTBOUND
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

  // FOR DATE SELECTION IN INBOUND OUTBOUND
  const currentMonthOption = currentMonth();
  const [month, setMonth] = useState<number>(currentMonthOption);
  const currentYearOption = currentYear();
  const [chosenYear, setYear] = useState<number>(currentYearOption);
  const years = getYears();


  // FOR INBOUNDING MODAL
  const [inbounds, setInbounds] = useState<Inbound[]>([]);
  const [inboundShow, setInboundShow] = useState<boolean>(false);
  const [inbounding, setInBounding] = useState<boolean>(false);

  // FOR OUTBOUNDING MODAL
  const [outbounds, setOutbounds] = useState<Outbound[]>([]);
  const [outboundShow, setOutboundShow] = useState<boolean>(false);
  const [outbounding, setOutBounding] = useState<boolean>(false);

  // FOR PRINTER CONFIGURATION MODAL AND TRANSACTION HISTORY MODAL
  const [showPrinter, setShowPrinter] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // INITIAL STORAGE OF STOCK ITEM DATA
  const [stockItems, setStockItems] = useState<ITStocks[]>([]);
  const [filteredStockItems, setFilteredStockItems] = useState<ITStocks[]>([]);



  // USED FOR SENDING THE SERIAL NUMBER ON OUTBOUND FORM
  const [serialNumber, setSerialNumber] = useState<string>("");

  // FOR SEACHING FEATURE
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedParts, setSearchedParts] = useState<ITStocks[]>([]);

  // USEEFFECT TO AUTOMATICALLY ADD SEARCHED TERMS ON SEARCHED DATA
  useEffect(() => {
    if (searchTerm !== "") {
      setSearchedParts(
        stockItems.filter((item) => {
          const term = searchTerm.toLowerCase();

          return (
            item.serialNumber.toLowerCase().includes(term) ||
            item.station?.toLowerCase().includes(term) ||
            item.department?.toLowerCase().includes(term) ||
            item.from?.toLowerCase().includes(term) ||
            item.to?.toLowerCase().includes(term) ||
            item.status?.toLowerCase().includes(term) ||
            item.remarks?.toLowerCase().includes(term)
          );
        }),
      );
    } else {
      return;
    }
  }, [searchTerm, stockItems]);

  // FETCHING INBOUNDS, OUTBOUNDS AND STOCK ITEMS
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
        import.meta.env.VITE_TIME_OUT,
      );
    } catch (err) {
      console.error("Error fetching inbounds and outbounds: ", err);
    } finally {
      setTimeout(
        () => {
          setIsLoading(false);
        },
        import.meta.env.VITE_TIME_OUT,
      );
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // TO REFRESH TRANSACTIONS EVERY TIME THE MAIN MODAL IS OPENED 
  const handleViewModal = () => {
    setModalShow(true);
    fetchTransactions();
  };

  // GETTING THE DEFAULT START AND END DATE FOR STOCK ITEM DATE SELECTION
  const today = new Date();
  // First day of previous month
  const firstDayPrevMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    2
  );
  // Last day of current month
  const lastDayCurrentMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    1
  );
  const [startDate, setStartDate] = useState<string>(
    firstDayPrevMonth.toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    lastDayCurrentMonth.toISOString().split("T")[0]
  );

  useEffect(() => {
    if (!startDate || !endDate) {
      return;
    }
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // FILTERING OUTBOUNDS BASED ON START AND END DATE
    const filteredStocks = stockItems.filter((stock) => {
      const date = new Date(stock.updatedAt!);
      date.setHours(0, 0, 0, 0); // Normalize to start of day
      return date >= start && date <= end;
    })
    setFilteredStockItems(filteredStocks)
  }, [stockItems, startDate, endDate]);

  // FOR UPDATING STATUS  
  const [statusModalShow, setStatusModalShow] = useState(false)
  const [updateData, setUpdateData] = useState<updateStatusType>({
    stockId: 0,
    from: "",
    newRemarks: "",
    newStatus: "",
    serialNumber: "",
    remarks: "",
    status: "",
    reason: "",
  })

  // useEffect(() => {
  //   console.log("Update Data: ", updateData)
  // }, [updateData])

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
                    className={`${computeStocks(item) <
                      getSafetyStock(
                        outbounds.map((o) => ({
                          quantity: o.quantity,
                          date: String(o.outboundDate),
                        })),
                        chosenYear,
                        month,
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
                          month,
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
            <>
              <div>
                <div className="mb-1">
                  <div className="flex flex-col sm:flex-row gap-1 md:gap-2">
                    <div className="relative mb-1">
                      <label
                        htmlFor="Previous date"
                        className="absolute -top-2 left-2 block font-medium text-gray-700 bg-neutral-50 px-1"
                      >
                        <h6>START DATE:</h6>
                      </label>
                      <InputField
                        label="Previous date"
                        type="date"
                        value={startDate}
                        required={true}
                        onChange={(value: string) => setStartDate(value)}
                        autoComplete={`Previous date`}
                      />
                    </div>
                    <div className="relative mb-1">
                      <label
                        htmlFor="Latest date"
                        className="absolute -top-2 left-2 block font-medium text-gray-700 bg-neutral-50 px-1"
                      >
                        <h6>END DATE:</h6>
                      </label>
                      <InputField
                        label="Latest date"
                        type="date"
                        value={endDate}
                        required={true}
                        onChange={(value: string) => setEndDate(value)}
                        autoComplete={`Latest date`}
                      />
                    </div>
                    <div className="w-full sm:w-7/10">
                      <InputField
                        label="Search(serial number, station, department, outbound personel, receiver, remarks)"
                        type="text"
                        value={searchTerm}
                        onChange={(value: string) => setSearchTerm(value)}
                      />
                    </div>
                    <div className="w-full h-10 sm:w-3/10 flex gap-2">
                      <DownloadStockData
                        data={searchTerm ? searchedParts : filteredStockItems}
                        item={item}
                        isLoading={isLoading}
                      />
                    </div>
                  </div>
                </div>
                <div className="relative w-10/10 h-60 md:h-80 overflow-y-scroll custom_scroll border border-gray-400">
                  <ItemStockTable
                    setSerialNumber={setSerialNumber}
                    fetchAllParts={fetchAllParts}
                    fetchTransactions={fetchTransactions}
                    setModalShow={setModalShow}
                    setOutboundShow={setOutboundShow}
                    setUpdateData={setUpdateData}
                    setStatusModalShow={setStatusModalShow}
                    isLoading={isLoading}
                    stockItems={searchTerm ? searchedParts : filteredStockItems}
                  />
                </div>
              </div>
            </>
          ) : null}
        </div>
      </Modal>

      <ChangeStatusModal updateData={updateData} setUpdateData={setUpdateData} setModalShow={setModalShow} isOpen={statusModalShow} setIsOpen={setStatusModalShow} fetchAllParts={fetchAllParts}
        fetchTransactions={fetchTransactions} />

      {/* TRANSACTION HISTORY MODAL */}
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
