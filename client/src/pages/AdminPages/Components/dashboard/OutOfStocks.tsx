import { useState, type Dispatch, type SetStateAction } from "react";
import SecondaryButton from "../../../../components/button/SecondaryButton";
import { Modal } from "../../../../components/Modal";
import type { Part } from "../../../../services/Part.Service";
import { ModalDataTable } from "../ModalDataTable";

type Props = {
  outOfStockParts: Part[];
  setParts: Dispatch<SetStateAction<Part[]>>;
  dataType: string;
};
export const OutOfStocks = ({ outOfStockParts, setParts, dataType }: Props) => {
  const [modalShow, setModalShow] = useState(false);
  return (
    <>
      <div
        className={`relative bg-red-500 hover:bg-red-600 transition duration-500 ease-in-out cursor-pointer text-neutral-50 rounded shadow p-3 md:p-6`}
        onClick={() => setModalShow(true)}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-neutral-50">Out of Stock</h3>
            <h1 className="font-bold text-neutral-0 mt-2">
              {`${outOfStockParts.length}`}
              {/* {`₩${totalInventoryValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}`} */}
            </h1>
            <p className="text-neutral-100 mt-1">Immediate attention needed</p>
          </div>
          <div
            className={`absolute top-5 right-5 size-10 lg:size-13 flex justify-center items-center p-3 rounded-full bg-neutral-50 text-red-500`}
          >
            <h3 className="mt-1">
              <i className="bx  bxs-trending-down"></i>
            </h3>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalShow}
        onClose={() => setModalShow(false)}
        title={
          <>
            <h4>
              OUT OF STOCKS{" "}
              <b className="text-red-500">({outOfStockParts.length})</b>
            </h4>
          </>
        }
        size="2xl"
        footer={
          <>
            <SecondaryButton
              text={
                <>
                  <span className="my-1">CLOSE</span>
                </>
              }
              onClick={() => setModalShow(false)}
            />
          </>
        }
      >
        <div className="relative h-150 w-10/10 overflow-auto border border-neutral-300">
          <ModalDataTable
            data={outOfStockParts}
            setData={setParts}
            type={
              dataType === "Pins"
                ? "pin"
                : dataType === "ITStocks"
                  ? "it"
                  : dataType === "MaterialControl"
                    ? "material"
                    : ""
            }
          />
        </div>
      </Modal>
    </>
  );
};
