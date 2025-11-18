import { useState, type Dispatch, type SetStateAction } from "react";
import { Modal } from "../../Modal";
import SecondaryButton from "../../button/SecondaryButton";
import PrimaryButton from "../../button/PrimaryButton";
import type { Part } from "../../../services/Part.Service";
import WarningButton from "../../button/WarningButton";
import {
  fetchInbounds,
  fetchOutbounds,
  type Inbound,
  type InboundOutboundType,
  type Outbound,
} from "../../../services/InboundOutbound.Service";
import { Inbounding } from "./Inbounding";
import { Outbounding } from "./Outbounding";
import {
  currentMonth,
  currentYear,
  getAverageOutboundPerMonth,
  getInQuantity,
  getOutQuantity,
  getSafetyStock,
  getTotalByYear,
  getTotalByYearExcludingCurrentMonth,
} from "../../../helper/helper";

interface Props {
  part: Part;
  setParts: Dispatch<SetStateAction<Part[]>>;
}

export const ViewPartStocks = ({ part, setParts }: Props) => {
  const [modalShow, setModalShow] = useState<boolean>(false);

  const [inbounds, setInbounds] = useState<Inbound[]>([]);
  const [inboundShow, setInboundShow] = useState<boolean>(false);
  const [inbounding, setInBounding] = useState<boolean>(false);

  const [outbounds, setOutbounds] = useState<Outbound[]>([]);
  const [outboundShow, setOutboundShow] = useState<boolean>(false);
  const [outbounding, setOutBounding] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<InboundOutboundType>({
    partId: part.id!,
    currentQuantity: part.quantity,
    quantity: "",
    inboundDate: new Date().toISOString().split("T")[0],
    outboundDate: new Date().toISOString().split("T")[0],
  });

  const [month, setMonth] = useState<number>(currentMonth());

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const [inResult, outResult] = await Promise.all([
        fetchInbounds(part.id!),
        fetchOutbounds(part.id!),
      ]);

      if (inResult.success) {
        setInbounds(inResult.data!);
      }

      if (outResult.success) {
        setOutbounds(outResult.data!);
      }
    } catch (err) {
      console.error("Error fetching inbounds and outbounds: ", err);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleViewModal = () => {
    setModalShow(true);
    fetchTransactions();
  };

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

  const year = currentYear();

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
                {`${part.partNumber}`}:{" "}
                <span
                  className={`${
                    part.quantity <
                    getSafetyStock(
                      outbounds.map((o) => ({
                        quantity: o.quantity,
                        date: String(o.outboundDate),
                      })),
                      year,
                      month
                    )
                      ? "bg-red-100 text-red-900"
                      : "bg-emerald-100 text-emerald-800"
                  } rounded px-2`}
                >
                  <b>{part.quantity} </b>
                  <i className="text-sm">
                    {part.quantity <
                    getSafetyStock(
                      outbounds.map((o) => ({
                        quantity: o.quantity,
                        date: String(o.outboundDate),
                      })),
                      year,
                      month
                    ) ? (
                      <>Warning: Low stock!</>
                    ) : null}
                  </i>
                </span>
              </h3>
              <h4>
                {months[month]} - {year}
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
                        <p className="text-green-600">
                          {getInQuantity(inbounds, month) > 0
                            ? `+${getInQuantity(inbounds, month)}`
                            : 0}
                        </p>
                      </div>
                    </td>
                  ))}
                  <td className="border border-neutral-400 px-3 py-2">
                    <div className="flex justify-center items-center flex-col gap-1 text-green-600">
                      <p className="text-green-600">
                        {getTotalByYearExcludingCurrentMonth(
                          inbounds.map((o) => ({
                            quantity: o.quantity,
                            date: String(o.inboundDate),
                          })),
                          year,
                          month + 1
                        )}
                      </p>
                      <h6>
                        (SAFTETY STOCK:{" "}
                        {getSafetyStock(
                          outbounds.map((o) => ({
                            quantity: o.quantity,
                            date: String(o.outboundDate),
                          })),
                          year,
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
                        <p className="text-red-500">
                          {/* OUTBOUND PERMONTH */}
                          {getOutQuantity(outbounds, month) > 0
                            ? `-${getOutQuantity(outbounds, month)}`
                            : 0}
                        </p>
                      </div>
                    </td>
                  ))}
                  <td className="border border-neutral-400 px-3 py-2">
                    <div className="flex justify-center items-center flex-col text-red-500">
                      <p className="">
                        {/* TOTAL OUTBOUNDS BASED ON CURRENT MONTH */}
                        {getTotalByYearExcludingCurrentMonth(
                          outbounds.map((o) => ({
                            quantity: o.quantity,
                            date: String(o.outboundDate),
                          })),
                          year,
                          month + 1
                        )}
                      </p>
                      <h6>
                        (AVERAGE MONTHLY USAGE :{" "}
                        {Math.round(
                          getTotalByYearExcludingCurrentMonth(
                            outbounds.map((o) => ({
                              quantity: o.quantity,
                              date: String(o.outboundDate),
                            })),
                            year,
                            month
                          ) / month
                        )}
                        )
                      </h6>
                    </div>
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </Modal>

      {/* INBOUNDING */}
      <Inbounding
        part={part}
        setParts={setParts}
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
        part={part}
        setParts={setParts}
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
