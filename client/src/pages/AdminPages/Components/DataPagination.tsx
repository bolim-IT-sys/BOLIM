import { type Dispatch, type SetStateAction } from "react";
import PrimaryButton from "../../../components/button/PrimaryButton";
import type { Part } from "../../../services/Part.Service";
import type { User } from "../../../services/User.Service";

type Props = {
  data: Part[] | User[];
  indexOfFirstItem: number;
  indexOfLastItem: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
};

export const DataPagination = ({
  indexOfFirstItem,
  indexOfLastItem,
  data,
  currentPage,
  setCurrentPage,
  totalPages,
}: Props) => {
  return (
    <>
      <div className="h-10 w-full flex justify-between items-end sm:items-center">
        <div className="hidden sm:block text-sm text-gray-600">
          Showing {indexOfFirstItem + 1} to{" "}
          {Math.min(indexOfLastItem, data.length)} of {data.length} data
        </div>

        <div className="flex w-full sm:w-max justify-between items-center gap-2">
          <div className="">
            <PrimaryButton
              text={
                <>
                  <span className="py-1">PREVIOUS</span>
                </>
              }
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
          </div>

          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>

          <div>
            <PrimaryButton
              text={
                <>
                  <span className="py-1">NEXT</span>
                </>
              }
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
