import { type Dispatch, type SetStateAction } from "react";
import PrimaryButton from "../../../components/button/PrimaryButton";
import type { Part } from "../../../services/Part.Service";

type Props = {
  parts: Part[];
  indexOfFirstItem: number;
  indexOfLastItem: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
};

export const PartsPagination = ({
  indexOfFirstItem,
  indexOfLastItem,
  parts,
  currentPage,
  setCurrentPage,
  totalPages,
}: Props) => {
  return (
    <>
      <div className="flex justify-between items-center p-4 border-t border-gray-300">
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstItem + 1} to{" "}
          {Math.min(indexOfLastItem, parts.length)} of {parts.length} parts
        </div>

        <div className="flex gap-2">
          <div>
            <PrimaryButton
              text="PREVIOUS"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
          </div>

          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>

          <div>
            <PrimaryButton
              text="NEXT"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            />
          </div>
        </div>
      </div>
    </>
  );
};
