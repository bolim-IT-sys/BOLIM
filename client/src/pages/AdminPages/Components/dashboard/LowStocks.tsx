import { useState, type Dispatch, type SetStateAction } from "react";
import SecondaryButton from "../../../../components/button/SecondaryButton";
import { Modal } from "../../../../components/Modal";
import type { Part } from "../../../../services/Part.Service";
import { ModalDataTable } from "../ModalDataTable";

type Props = {
  lowStockParts: Part[];
  setParts: Dispatch<SetStateAction<Part[]>>;
  dataType: string;
};
export const LowStocks = ({ lowStockParts, setParts, dataType }: Props) => {
  const [modalShow, setModalShow] = useState(false);
  console.log(lowStockParts);
  return (
    <>
      <div
        className={`relative bg-yellow-400 hover:bg-yellow-500 transition duration-500 ease-in-out cursor-pointer text-neutral-50 rounded shadow p-3 md:p-6`}
        onClick={() => setModalShow(true)}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-neutral-50">Low Stock Alert</h3>
            <h1 className="font-bold text-neutral-0 mt-2">
              {`${lowStockParts.length}`}
              {/* {`₩${totalInventoryValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}`} */}
            </h1>
            <p className="text-neutral-100 mt-1">Parts below safety stocks</p>
          </div>
          <div
            className={`absolute top-5 right-5 size-10 lg:size-13 flex justify-center items-center p-3 rounded-full bg-neutral-50 text-yellow-400`}
          >
            <h3 className="mt-1">
              <i className="bx  bxs-alert-triangle"></i>
            </h3>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalShow}
        onClose={() => setModalShow(false)}
        title={
          <>
            <h4>MONTHLY STOCK VALUE TREND</h4>
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
        <div className="h-150 w-full overflow-auto border border-neutral-300">
          <ModalDataTable
            data={lowStockParts}
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
