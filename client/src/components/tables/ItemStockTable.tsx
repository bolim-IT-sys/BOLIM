import { useState, type Dispatch, type SetStateAction } from "react";
import {
  markItemAsAvailable,
  updateItem,
  type ITStocks,
} from "../../services/InboundOutbound.Service";
import SuccessButton from "../button/SuccessButton";
import InputFieldSmall from "../InputFieldSmall";
import PrimaryButton from "../button/PrimaryButton";
import SecondaryButton from "../button/SecondaryButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatStockDate } from "../../helper/date.helper";
import Swal from "sweetalert2";

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

  const UpdateItemStatus = async (stock: ITStocks) => {
    // HANDLES CHANGING ITEM'S REMARKS BETWEEN "AVAILABLE" AND "DEPLOYED"
    if (stock.remarks === "available") {
      setSerialNumber(stock.serialNumber);
      setModalShow(false);
      setOutboundShow(true);
      return;
    }

    const resultConfirm = await Swal.fire({
      icon: "warning",
      title: `UPDATE STATUS?`,
      text: "Mark this stock as avaiable.",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    });

    if (!resultConfirm.isConfirmed) {
      return;
    }

    const response = await markItemAsAvailable(stock);
    if (response.success) {
      // FETCHED LATEST DATA
      fetchTransactions();
      fetchAllParts();
      Swal.fire({
        icon: "success",
        title: `UPDATE SUCCESS`,
        text: `Stock ${stock.serialNumber} is now available for outbound.`,
        timer: 5000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "UPDATE FAILED",
        text: response.message,
      });
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
      <table className="w-400 md:w-20/10 lg:w-15/10 table-fixed border border-gray-300">
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
            <th className="md:w-3/20 lg:w-2/10  bg-sky-200 border border-neutral-400 px-3 py-2 text-neutral-900 text-center">
              <h5>REASON</h5>
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
                stockItems.map((stock) => (
                  <tr key={stock.id}>
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
                          <h6 className="break-all">{stock.serialNumber}</h6>
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
                            className={` ${
                              stock.PRDate === "N/A" ? "text-neutral-400" : ""
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
                        className={`flex justify-center items-center flex-col gap-1 ${
                          stock.deployedDate ? null : "text-neutral-400"
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
                        className={`flex justify-center items-center flex-col gap-1 ${
                          stock.station ? null : "text-neutral-400"
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
                        className={`flex justify-center items-center flex-col gap-1 ${
                          stock.department ? null : "text-neutral-400"
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
                            className={`${
                              stock.from ? null : "text-neutral-400"
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
                            className={`${
                              stock.to ? null : "text-neutral-400"
                            }`}
                          >
                            {stock.to ? stock.to : "N/A"}
                          </h6>
                        )}
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
                            className={`${
                              stock.reason ? null : "text-neutral-400"
                            }`}
                          >
                            {stock.reason ? stock.reason : "N/A"}
                          </h6>
                        )}
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
                          <PrimaryButton
                            text="UPDATE"
                            onClick={() => HandleSetUpdateStock(stock)}
                          />
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
    </>
  );
};
