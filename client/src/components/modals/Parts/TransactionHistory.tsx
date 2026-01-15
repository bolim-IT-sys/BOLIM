import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Modal } from "../../Modal";
import type { Part } from "../../../services/Part.Service";
import SecondaryButton from "../../button/SecondaryButton";
import InputField from "../../InputField";

export interface Transactions {
  id?: number;
  from?: string;
  to?: string;
  partId: number;
  quantity: number;
  inboundDate?: Date;
  outboundDate?: Date;
  createdAt?: Date;
}

type Props = {
  item: Part;
  inbounds: Transactions[];
  outbounds: Transactions[];
  setModalShow: Dispatch<SetStateAction<boolean>>;
  showHistoryModal: boolean;
  setShowHistoryModal: Dispatch<SetStateAction<boolean>>;
};

export const TransactionHistory = ({
  item,
  inbounds,
  outbounds,
  setModalShow,
  showHistoryModal,
  setShowHistoryModal,
}: Props) => {
  const [transactions, setTransactions] = useState<Transactions[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transactions[]
  >([]);
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();

  const FilterByDate = (
    transactions: Transactions[],
    startDate: Date | string,
    endDate: Date | string
  ) => {
    if (!startDate || !endDate || !transactions) return;

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const filteredTransactions = transactions.filter((transaction) => {
      const date = new Date(transaction.createdAt!);
      date.setHours(0, 0, 0, 0);
      return date >= start && date <= end;
    });
    console.log("Filtered transactions: ", filteredTransactions);
    return filteredTransactions;
  };

  useEffect(() => {
    if (!startDate || !endDate) return;
    console.log("Triggered by date");
    setFilteredTransactions(FilterByDate(transactions, startDate, endDate)!);
  }, [transactions, startDate, endDate]);

  useEffect(() => {
    if ((!inbounds && !outbounds) || !showHistoryModal) return;
    console.log("triggered by button");

    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 2);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);

    console.log("Procesing transactions...");
    const toTimestamp = (value?: string | Date) =>
      value ? new Date(value).getTime() : 0;

    const transations = [...inbounds, ...outbounds].sort(
      (a, b) => toTimestamp(b.createdAt) - toTimestamp(a.createdAt)
    );

    setTransactions(FilterByDate(transations, start, end)!);
  }, [inbounds, outbounds, showHistoryModal]);
  return (
    <>
      <Modal
        isOpen={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false);
          setModalShow(true);
        }}
        title={
          <>
            <h3 className="text-start">
              {item.partNumber} Transaction History
            </h3>
          </>
        }
        size="sm"
        footer={
          <>
            <div className="h-10 flex gap-2">
              <SecondaryButton
                text="CLOSE"
                onClick={() => {
                  setShowHistoryModal(false);
                  setModalShow(true);
                }}
              />
            </div>
          </>
        }
      >
        <div className="w-full flex gap-2 text-start mb-2">
          <div className="w-5/10">
            <label htmlFor="START DATE" className="block text-gray-700">
              <h6>START DATE:</h6>
            </label>
            <InputField
              label="START DATE"
              type="date"
              value={startDate!}
              required={true}
              onChange={(value: string) => {
                setStartDate(value);
              }}
              autoComplete={`Previous date`}
            />
          </div>
          <div className="w-5/10">
            <label htmlFor="END DATE" className="block text-gray-700">
              <h6>END DATE:</h6>
            </label>
            <InputField
              label="END DATE"
              type="date"
              value={endDate!}
              required={true}
              onChange={(value: string) => {
                setEndDate(value);
              }}
              autoComplete={`Previous date`}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 h-80 overflow-y-auto">
          {filteredTransactions?.map((transaction, index) => (
            <div
              className={`rounded flex gap-4 ${transaction.inboundDate ? "bg-green-100 text-green-800 border-s-2 border-green-500" : "bg-red-100 text-red-800 border-s-2 border-red-500"} p-3`}
              key={index}
            >
              <h3 className="w-3/20 flex justify-center items-center ">
                {transaction.inboundDate ? "+" : "-"}
                {transaction.quantity}
              </h3>
              <div className="text-start">
                <p>
                  INBOUND PERSONEL:{" "}
                  {transaction.from ? transaction.from : "N/A"}
                </p>
                {transaction.outboundDate ? (
                  <p>RECEIVER: {transaction.to ? transaction.to : "N/A"}</p>
                ) : null}
                <p>
                  DATE:{" "}
                  {transaction.createdAt
                    ? new Date(transaction.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};
