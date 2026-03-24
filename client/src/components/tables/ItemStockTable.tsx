import { useState, type Dispatch, type SetStateAction } from "react";
import {
  updateItem,
  updateTrack,
  type ITStocks,
  type updateStatusType,
  type updateTrackType,
} from "../../services/InboundOutbound.Service";
import SuccessButton from "../button/SuccessButton";
import InputFieldSmall from "../InputFieldSmall";
import PrimaryButton from "../button/PrimaryButton";
import SecondaryButton from "../button/SecondaryButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatStockDate, formatLongDate } from "../../helper/date.helper";
import Swal from "sweetalert2";
import { getStatus } from "../../helper/helper";
import DangerButton from "../button/DangerButton";
import { removeStockItem } from "../../services/Part.Service";
import StatusModal from "../modals/Parts/StatusModal";

type Props = {
  setSerialNumber: Dispatch<SetStateAction<string>>;
  fetchAllParts: () => void;
  fetchTransactions: () => void;
  setModalShow: Dispatch<SetStateAction<boolean>>;
  setOutboundShow: Dispatch<SetStateAction<boolean>>;
  setUpdateData: Dispatch<SetStateAction<updateStatusType>>;
  setStatusModalShow: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  stockItems: ITStocks[];
};

export const ItemStockTable = ({
  setSerialNumber,
  fetchAllParts,
  fetchTransactions,
  setModalShow,
  setOutboundShow,
  setUpdateData,
  setStatusModalShow,
  isLoading,
  stockItems,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<updateTrackType>({
    stockId: 0,
    serialNumber: "",
    from: "",
    remarks: "",
    status: "",
    receivedDate: null,
    deployedDate: null,
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [toBeUpdated, setToBeUpdated] = useState<number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [formData, setFormData] = useState<ITStocks>({
    id: 0,
    stockId: 0,
    serialNumber: "",
    PRDate: "",
    receivedDate: null,
    deployedDate: null,
    station: "",
    department: "",
    reason: "",
    from: "",
    to: "",
    remarks: "",
  });

  // Tracking Modal
  const handleUpdate = async () => {
    const res = await updateTrack(selectedStock);

    if (res.success) {
      setTimeout(
        () => {
          fetchAllParts();
          fetchTransactions();
          setIsEditing(false)
          setIsOpen(false)
          Swal.fire({
            icon: "success",
            title: `UPDATE SUCCESS`,
            text: res.message,
            timer: 5000,
            showConfirmButton: false,
          });
        },
        import.meta.env.VITE_TIME_OUT,
      );
    } else {
      setTimeout(
        () => {
          Swal.fire({
            icon: "error",
            title: "UPDATE FAILED",
            text: res.message,
          });
        },
        import.meta.env.VITE_TIME_OUT,
      );
    }
  };
  // console.log("selectedStock: ", selectedStock)
  // useEffect(() => {
  //   console.log(formData);
  //   // console.log("Items: ", stockItems);
  // }, [formData]);
  const HandleSetUpdateStock = (stock: ITStocks) => {
    // SETTING FORMDATA TO BE VALUE OF THE SELECTED STOCKS
    setToBeUpdated(stock.id!);

    setFormData((prev) => ({
      ...prev,
      id: stock.id,
      stockId: stock.stockId,
      serialNumber: stock.serialNumber,
      PRDate: stock.PRDate,
      receivedDate: stock.receivedDate,
      deployedDate: stock.deployedDate,
      station: stock.station,
      department: stock.department,
      reason: stock.reason,
      from: stock.from,
      to: stock.to,
      remarks: stock.remarks,
    }));
  };

  const HandleSubmit = async () => {
    // HANDLES SENDING CHANGES TO THE BACKEND
    try {
      setIsSaving(true);
      const response = await updateItem(formData);

      if (response.success) {
        setTimeout(
          () => {
            fetchTransactions();
            setToBeUpdated(0);
            Swal.fire({
              icon: "success",
              title: `UPDATE SUCCESS`,
              text: response.message,
              timer: 5000,
              showConfirmButton: false,
            });
          },
          import.meta.env.VITE_TIME_OUT,
        );
      } else {
        setTimeout(
          () => {
            Swal.fire({
              icon: "error",
              title: "UPDATE FAILED",
              text: response.message,
            });
          },
          import.meta.env.VITE_TIME_OUT,
        );
      }
    } catch (err) {
      setTimeout(
        () => {
          console.log("Error: ", err);
        },
        import.meta.env.VITE_TIME_OUT,
      );
    } finally {
      setTimeout(
        () => {
          setIsSaving(false);
        },
        import.meta.env.VITE_TIME_OUT,
      );
    }
  };

  const HandleDelete = async (stocksID: number, partID: number) => {

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This item will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return
    // HANDLES DELETING ITEM
    await removeStockItem(stocksID, partID, fetchAllParts);
  }

  const UpdateItemStatus = async (stock: ITStocks) => {
    // HANDLES CHANGING ITEM'S REMARKS BETWEEN "AVAILABLE" AND "DEPLOYED"
    if (stock.remarks === "available") {
      setSerialNumber(stock.serialNumber);
      setModalShow(false);
      setOutboundShow(true);
      return;
    }

    // IF THE ITEM IS ALREADY DEPLOYED IT CAN BE PULLED OUT WITH DIFFERENT REMARKS
    if (stock.remarks === "deployed") {
      setModalShow(false)
      setStatusModalShow(true)
      setUpdateData((prev) => ({
        ...prev,
        stockId: stock.stockId,
        serialNumber: stock.serialNumber,
      }))
    }

    if (stock.remarks === "on-hold") {
      setModalShow(false)
      setStatusModalShow(true)
      setUpdateData((prev) => ({
        ...prev,
        to: stock.to,
        remarks: stock.remarks,
        status: stock.status,
        stockId: stock.stockId,
        serialNumber: stock.serialNumber,
      }))
    }

  };
  const handleChange = (field: string, value: string | Date | null) => {
    // console.log("field: ", value);
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // CHECKING IT THERE'S CHANGES TO ENABLE THE BUTTON
  const NoChanges = (stock: ITStocks) => {
    return (
      stock.serialNumber === formData.serialNumber &&
      stock.PRDate === formData.PRDate &&
      // new Date(stock.receivedDate).toLocaleDateString() ===
      //   new Date(formData.receivedDate).toLocaleDateString() &&
      new Date(stock.deployedDate!).toLocaleDateString() ===
      new Date(formData.deployedDate!).toLocaleDateString() &&
      stock.station === formData.station &&
      stock.department === formData.department &&
      stock.reason === formData.reason &&
      stock.from === formData.from &&
      stock.to === formData.to
    );
  };
  return (
    <>
      <table className="w-300 md:w-15/10 lg:w-10/10 table-fixed">
        <thead className="sticky top-0 bg-sky-200 ">
          <tr>
            <th className="w-[3%] bg-sky-200 border border-neutral-400 text-neutral-900 text-center">
              <h5>No.</h5>
            </th>
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
              <h5>AUTHORIZED PERSONEL</h5>
            </th>
            <th className="bg-sky-200 border border-neutral-400 px-3 py-2 text-neutral-900 text-center">
              <h5>RECIEVER</h5>
            </th>
            <th className="bg-sky-2 00 border border-neutral-400 px-3 py-2 text-neutral-900 text-center">
              <h5>REMARKS</h5>
            </th>
            <th className="md:w-3/20 lg:w-2/10  bg-sky-200 border border-neutral-400 px-3 py-2 text-neutral-900 text-center">
              <h5>REASON</h5>
            </th>
            {/*<th className="bg-sky-2 00 border border-neutral-400 px-3 py-2 text-neutral-900 text-center">
              <h5>PROGRESS</h5>
            </th>*/}
            <th className="bg-sky-600 border border-neutral-400 px-3 py-2 text-neutral-50 text-center">
              <h5>ACTIONS</h5>
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={11} className="border border-neutral-400 px-3 py-2">
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
                stockItems.map((stock, index) => (
                  <tr key={stock.id}>
                    <td className="border border-neutral-400">{index + 1}</td>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div className="flex justify-center items-center flex-col gap-1">
                        {toBeUpdated === stock.id ? (
                          <InputFieldSmall
                            label="SERIAL NUMBER"
                            type="text"
                            value={formData.serialNumber}
                            required={true}
                            onChange={(value: string) =>
                              handleChange("serialNumber", value)
                            }
                            autoComplete={`serialNumber`}
                          />
                        ) : (
                          <h6 className="break-all cursor-pointer hover:underline" onClick={() => {
                            setSelectedStock(stock);
                            setIsOpen(true);
                          }}>{stock.serialNumber}</h6>
                        )}
                      </div>
                    </td>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div className="flex justify-center items-center flex-col gap-1">
                        {toBeUpdated === stock.id ? (
                          <>
                            <InputFieldSmall
                              label="PR DATE"
                              type="text"
                              value={formData.PRDate!}
                              required={true}
                              onChange={(value: string) =>
                                handleChange("PRDate", value)
                              }
                              autoComplete={`PRDate`}
                            />
                          </>
                        ) : (
                          <h6
                            className={` ${stock.PRDate === "N/A" ? "text-neutral-400" : ""
                              }`}
                          >
                            {stock.PRDate === "N/A"
                              ? "N/A"
                              : String(stock.PRDate)}
                          </h6>
                        )}
                      </div>
                    </td>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div className="flex justify-center items-center flex-col gap-1">
                        {toBeUpdated === stock.id ? (
                          <DatePicker
                            className="w-full text-xs rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            selected={formData.receivedDate}
                            name={`${formData.receivedDate}`}
                            onChange={(value: Date | null) =>
                              handleChange("receivedDate", value)
                            }
                            placeholderText="Select a date"
                            dateFormat="MM/dd/yyyy"
                          />
                        ) : (
                          <h6>{formatStockDate(String(stock.receivedDate))}</h6>
                        )}
                      </div>
                    </td>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div
                        className={`flex justify-center items-center flex-col gap-1 ${stock.deployedDate ? null : "text-neutral-400"
                          }`}
                      >
                        {toBeUpdated === stock.id && formData.deployedDate ? (
                          <DatePicker
                            className="w-full text-xs rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            selected={formData.deployedDate}
                            name={`${formData.deployedDate}`}
                            onChange={(value: Date | null) =>
                              handleChange("deployedDate", value)
                            }
                            placeholderText="Select a date"
                            dateFormat="MM/dd/yyyy"
                          />
                        ) : (
                          <h6>
                            {stock.deployedDate
                              ? formatStockDate(String(stock.deployedDate))
                              : "N/A"}
                          </h6>
                        )}
                      </div>
                    </td>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div
                        className={`flex justify-center items-center flex-col gap-1 ${stock.station ? null : "text-neutral-400"
                          }`}
                      >
                        {toBeUpdated === stock.id && formData.station ? (
                          <InputFieldSmall
                            label="STATION"
                            type="text"
                            value={formData.station}
                            required={true}
                            onChange={(value: string) =>
                              handleChange("station", value)
                            }
                            autoComplete={`station`}
                          />
                        ) : (
                          <h6>{stock.station ? stock.station : "N/A"}</h6>
                        )}
                      </div>
                    </td>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div
                        className={`flex justify-center items-center flex-col gap-1 ${stock.department ? null : "text-neutral-400"
                          }`}
                      >
                        {toBeUpdated === stock.id && formData.department ? (
                          <InputFieldSmall
                            label="DEPARTMENT"
                            type="text"
                            value={formData.department}
                            required={true}
                            onChange={(value: string) =>
                              handleChange("department", value)
                            }
                            autoComplete={`department`}
                          />
                        ) : (
                          <h6>{stock.department ? stock.department : "N/A"}</h6>
                        )}
                      </div>
                    </td>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div
                        className={`flex justify-center items-center flex-col gap-1 `}
                      >
                        {(toBeUpdated === stock.id && formData.from) ||
                          (toBeUpdated === stock.id && stock.remarks) ===
                          "deployed" ? (
                          <InputFieldSmall
                            label="OUTBOUND PERSONEL"
                            type="text"
                            value={formData.from ? formData.from : ""}
                            required={true}
                            onChange={(value: string) =>
                              handleChange("from", value)
                            }
                            autoComplete={`from`}
                          />
                        ) : (
                          <h6
                            className={`${stock.from ? null : "text-neutral-400"
                              }`}
                          >
                            {stock.from ? stock.from : "N/A"}
                          </h6>
                        )}
                      </div>
                    </td>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div
                        className={`flex justify-center items-center flex-col gap-1`}
                      >
                        {(toBeUpdated === stock.id && formData.to) ||
                          (toBeUpdated === stock.id && stock.remarks) ===
                          "deployed" ? (
                          <InputFieldSmall
                            label="RECEIVER"
                            type="text"
                            value={formData.to ? formData.to : ""}
                            required={true}
                            onChange={(value: string) =>
                              handleChange("to", value)
                            }
                            autoComplete={`to`}
                          />
                        ) : (
                          <h6
                            className={`${stock.to ? null : "text-neutral-400"
                              }`}
                          >
                            {stock.to ? stock.to : "N/A"}
                          </h6>
                        )}
                      </div>
                    </td>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div
                        className={`flex justify-center items-center flex-col gap-1 hover:text-neutral-50 p-1.5 rounded 
                          transition duration-300 ease-in-out 
                          ${stock.remarks === "unavailable" ? "cursor-not-allowed" : "cursor-pointer"}
                           ${(stock.status === "ready" || stock.status === "used" || stock.status === "repaired") && stock.remarks === "available"
                            ? "hover:bg-yellow-500 text-yellow-700"
                            : stock.remarks === "available"
                              ? "hover:bg-emerald-500 text-green-700"
                              : stock.remarks === "on-hold"
                                ? "hover:bg-orange-500 text-orange-700"
                                : stock.remarks === "unavailable"
                                  ? "bg-neutral-200 text-neutral-600 hover:text-neutral-600"
                                  : "hover:bg-red-500 hover:text-neutral-50 text-red-600"
                          }`}
                        onClick={() =>
                          stock.remarks === "unavailable" ?
                            null : UpdateItemStatus(stock)}
                      >
                        <h6>
                          {stock.remarks ? `${getStatus(stock.status!)?.toUpperCase()}: ${stock.remarks.toUpperCase()}` : "N/A"}
                        </h6>
                      </div>
                    </td>
                    <td className="border border-neutral-400 px-3 py-2">
                      <div
                        className={`w-full flex justify-center items-center flex-col gap-1 `}
                      >
                        {toBeUpdated === stock.id && formData.department ? (
                          <InputFieldSmall
                            label="REASON"
                            type="text"
                            value={formData.reason ? formData.reason : ""}
                            required={true}
                            onChange={(value: string) =>
                              handleChange("reason", value)
                            }
                            autoComplete={`reason`}
                          />
                        ) : (
                          <h6
                            className={`${stock.reason ? null : "text-neutral-400"
                              }`}
                          >
                            {stock.reason ? stock.reason : "N/A"}
                          </h6>
                        )}
                      </div>
                    </td>
                    {/*<td className="border border-neutral-400 px-3 py-2">
                      <div
                        className={`flex justify-center items-center flex-col gap-1`}
                      ><div className="bg-green-400 p-2 rounded-4xl"><h6>completed</h6></div></div>
                    </td>*/}
                    <td className="border border-neutral-400 px-3 py-2">
                      <div
                        className={`flex justify-center items-center flex-col gap-1`}
                      >
                        {toBeUpdated === stock.id ? (
                          <>
                            <SuccessButton
                              text="SAVE"
                              loadingText="SAVING"
                              isLoading={isSaving}
                              disabled={isSaving || NoChanges(stock)}
                              onClick={HandleSubmit}
                            />
                            <SecondaryButton
                              text="CANCEL"
                              onClick={() => setToBeUpdated(0)}
                            />
                          </>
                        ) : (
                          <>
                            <PrimaryButton
                              text="UPDATE"
                              onClick={() => HandleSetUpdateStock(stock)}
                            />
                            <DangerButton
                              text="DELETE"
                              disabled={stock.remarks !== "available"}
                              onClick={() => HandleDelete(stock.id!, stock.stockId!)}
                            />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={11}
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
      <StatusModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex mb-4 items-center justify-center">
          <div className="w-auto p-2">Date Received:
            <p>{selectedStock.receivedDate
              ? formatLongDate(String(selectedStock?.receivedDate))
              : "N/A"}</p>
          </div>
          <div className="w-auto p-2">
            <p>Serial Number: </p>{selectedStock?.serialNumber || ""}
          </div>
          <div className="p-2 flex flex-col">
            <label htmlFor="update">Updated By: </label>
            <input
              className="w-fit py-2 px-4 border border-gray-300 outline-blue-400 rounded-md disabled:border-0 text-center"
              type="text"
              placeholder="Updated by"
              value={selectedStock?.from || ""}
              disabled={!isEditing}
              onChange={(e) =>
                setSelectedStock({
                  ...selectedStock,
                  from: e.target.value,
                })
              } />
          </div>
          <div className="p-2 flex flex-col">
            <label htmlFor="remarks">Remarks </label>
            <input
              type="text"
              placeholder="Reason"
              value={selectedStock?.status || ""}
              disabled={!isEditing}
              onChange={(e) =>
                setSelectedStock({
                  ...selectedStock,
                  status: e.target.value,
                })}
              className="w-full py-2 px-4 border border-gray-300 outline-blue-400 rounded-md disabled:border-0 text-center" />
          </div>
          <div className="p-2">
            <select
              className="border w-full p-2 mb-4 mt-1 appearance-none border-gray-300 outline-blue-400 rounded-3xl disabled:border-0 text-center focus:outline-none"
              value={selectedStock?.remarks || ""}
              disabled={!isEditing}
              onChange={(e) =>
                setSelectedStock({
                  ...selectedStock,
                  remarks: e.target.value,
                })
              }
            >
              <option value="">{selectedStock?.remarks || ""}</option>
              <option value="available">Available</option>
              <option value="deployed">Deployed</option>
              <option value="on-hold">On-hold</option>
            </select>
          </div>
        </div>

        {isEditing ?
          <div className="flex justify-end gap-2">
            <SecondaryButton
              text="Cancel"
              onClick={() => setIsEditing(false)}
            />
            <SuccessButton text="Save" onClick={handleUpdate} />
          </div> :
          <div className="flex justify-end gap-2">
            <SecondaryButton
              text="Cancel"
              onClick={() => setIsOpen(false)}
            />
            <PrimaryButton
              text="Edit"
              onClick={() => setIsEditing(true)}//HandleSetUpdateStock(stock)
            />
          </div>}
      </StatusModal>
    </>
  );
};
