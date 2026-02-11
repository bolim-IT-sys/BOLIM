import { useState, type Dispatch, type SetStateAction } from "react";
import { Modal } from "../../Modal";
import SecondaryButton from "../../button/SecondaryButton";
import Swal from "sweetalert2";
import { updateItemStatus, type updateStatusType } from "../../../services/InboundOutbound.Service";
import InputField from "../../InputField";
import SuccessButton from "../../button/SuccessButton";
import { getStatus } from "../../../helper/helper";



type Props = {
  updateData: updateStatusType;
  setUpdateData: Dispatch<SetStateAction<updateStatusType>>
  setModalShow: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  fetchTransactions: () => void;
  fetchAllParts: () => void;
};

export const ChangeStatusModal = ({
  updateData,
  setUpdateData,
  setModalShow,
  isOpen,
  setIsOpen,
  fetchTransactions,
  fetchAllParts
}: Props) => {
  const [isLoading, setIsLoading] = useState(false)


  const handleUpdateStatus = async () => {
    try {
      const status = getStatus(updateData.newStatus!).toUpperCase()
      const resultConfirm = await Swal.fire({
        icon: "warning",
        title: `UPDATE STATUS?`,
        text: `Mark this stock as ${status}.`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, update it",
        confirmButtonColor: "#00b36b",
      });

      if (!resultConfirm.isConfirmed) {
        return;
      }
      setIsLoading(true)

      const response = await updateItemStatus(updateData);
      if (response.success) {
        // FETCHED LATEST DATA
        fetchTransactions();
        fetchAllParts();
        setIsOpen(false)
        setModalShow(true)
        // CLEARING PREV DATA
        setUpdateData({
          stockId: 0,
          from: "",
          serialNumber: "",
          newStatus: "",
          reason: "",
        })
        Swal.fire({
          icon: "success",
          title: `UPDATE SUCCESS`,
          text: `Stock ${updateData.serialNumber} is now marked as ${status}.`,
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
    } catch {
      console.error("Error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setModalShow(true);
        }}
        title={
          <>
            <h3 className="text-start">
              UPDATE STATUS
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
                  setIsOpen(false);
                  setModalShow(true);
                }}
              />
              <SuccessButton
                text="UPDATE"
                loadingText="UPDATING"
                isLoading={isLoading}
                disabled={isLoading}
                onClick={() => handleUpdateStatus()}
              />
            </div>
          </>
        }
      >
        <div className="flex flex-col gap-2">
          <div className="mb-1 text-start">
            <label
              htmlFor="Updated By"
              className="block font-medium text-gray-700"
            >
              <p>UPDATED BY:</p>
            </label>
            <InputField
              label="UPDATED BY"
              type="text"
              value={updateData.from!}
              required={true}
              onChange={(value: string) => setUpdateData((prev) => ({ ...prev, from: value }))}
              autoComplete={`Updated By`}
            />
          </div>
          <div className="mb-1 text-start">
            <label
              htmlFor="reason"
              className="block font-medium text-gray-700"
            >
              <p>REASON:</p>
            </label>
            <InputField
              label="REASON"
              type="text"
              value={updateData.reason!}
              required={true}
              onChange={(value: string) => setUpdateData((prev) => ({ ...prev, reason: value }))}
              autoComplete={`reason`}
            />
          </div>

          {updateData.remarks === "on-hold" ? (<>
            <p className="block font-medium text-gray-700 text-start">
              CURRENT STATUS: {getStatus(updateData.status!).toUpperCase()}
            </p>
            <div className="flex flex-col gap-2">
              <div className={`border-2 border-sky-500 ${updateData.newStatus === "used" ? "border-sky-500 bg-sky-500 text-neutral-50 hover:bg-sky-600 hover:border-sky-600" : "text-sky-700 hover:bg-sky-500"} hover:text-neutral-50 transition-300 duration-300 ease-in-out rounded py-2 cursor-pointer`}
                onClick={() => setUpdateData((prev) => ({ ...prev, newStatus: updateData.newStatus === "used" ? "" : "used", newRemarks: "available" }))}
              >
                <p>MARK AS AVAILABLE</p>
              </div>

              <div className={`border-2 border-sky-500 ${updateData.newStatus === "repaired" ? "border-sky-500 bg-sky-500 text-neutral-50 hover:bg-sky-600 hover:border-sky-600" : "text-sky-700 hover:bg-sky-500"} hover:text-neutral-50 transition-300 duration-300 ease-in-out rounded py-2 cursor-pointer`}
                onClick={() => setUpdateData((prev) => ({ ...prev, newStatus: updateData.newStatus === "repaired" ? "" : "repaired", newRemarks: "available" }))}
              >
                <p>REPAIRED</p>
              </div>

              <div className={`border-2 border-sky-500 ${updateData.newStatus === "disposed" ? "border-sky-500 bg-sky-500 text-neutral-50 hover:bg-sky-600 hover:border-sky-600" : "text-sky-700 hover:bg-sky-500"} hover:text-neutral-50 transition-300 duration-300 ease-in-out rounded py-2 cursor-pointer`}
                onClick={() => setUpdateData((prev) => ({ ...prev, newStatus: updateData.newStatus === "disposed" ? "" : "disposed", newRemarks: "unavailable" }))}
              >
                <p>DISPOSED</p>
              </div>
            </div>
          </>) : (<>
            {/* IF THE STOCK IS NOT ON-HOLD THIS WILL BE THE OPTIONS */}
            <p className="block font-medium text-gray-700 text-start">
              NEW STATUS:
            </p>
            <div className="flex flex-col gap-2">
              <div className={`border-2 border-sky-500 ${updateData.newStatus === "ready" ? "border-sky-500 bg-sky-500 text-neutral-50 hover:bg-sky-600 hover:border-sky-600" : "text-sky-700 hover:bg-sky-500"} hover:text-neutral-50 transition-300 duration-300 ease-in-out rounded py-2 cursor-pointer`} onClick={() => setUpdateData((prev) => ({ ...prev, newStatus: updateData.newStatus === "ready" ? "" : "ready" }))}>
                <p>READY TO USE</p>
              </div>

              <div className={`border-2 border-sky-500 ${updateData.newStatus === "forChecking" ? "border-sky-500 bg-sky-500 text-neutral-50 hover:bg-sky-600 hover:border-sky-600" : "text-sky-700 hover:bg-sky-500"} hover:text-neutral-50 transition-300 duration-300 ease-in-out rounded py-2 cursor-pointer`} onClick={() => setUpdateData((prev) => ({ ...prev, newStatus: updateData.newStatus === "forChecking" ? "" : "forChecking" }))}>
                <p>FOR CHECKING</p>
              </div>

              <div className={`border-2 border-sky-500 ${updateData.newStatus === "forRepair" ? "border-sky-500 bg-sky-500 text-neutral-50 hover:bg-sky-600 hover:border-sky-600" : "text-sky-700 hover:bg-sky-500"} hover:text-neutral-50 transition-300 duration-300 ease-in-out rounded py-2 cursor-pointer`} onClick={() => setUpdateData((prev) => ({ ...prev, newStatus: updateData.newStatus === "forRepair" ? "" : "forRepair" }))}>
                <p>FOR REPAIR</p>
              </div>

              <div className={`border-2 border-sky-500 ${updateData.newStatus === "forDisposal" ? "border-sky-500 bg-sky-500 text-neutral-50 hover:bg-sky-600 hover:border-sky-600" : "text-sky-700 hover:bg-sky-500"} hover:text-neutral-50 transition-300 duration-300 ease-in-out rounded py-2 cursor-pointer`} onClick={() => setUpdateData((prev) => ({ ...prev, newStatus: updateData.newStatus === "forDisposal" ? "" : "forDisposal" }))}>
                <p>FOR DISPOSAL</p>
              </div>
            </div>
          </>)}


        </div>
      </Modal>
    </>
  );
};
