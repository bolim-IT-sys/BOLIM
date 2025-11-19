import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { type Part } from "../../services/Part.Service";
import { AddingPart } from "../../components/modals/Parts/AddingPart";
import PrimaryButton from "../../components/button/PrimaryButton";
import { useOutletContext } from "react-router-dom";
import { PartsTable } from "./Components/PartsTable";

interface ContextType {
  parts: Part[];
  setParts: Dispatch<SetStateAction<Part[]>>;
  fetchAllParts: () => void;
  isFetching: boolean;
}

export default function HomePage() {
  const { parts, setParts, fetchAllParts, isFetching } =
    useOutletContext<ContextType>();
  const [currentParts, setCurrentParts] = useState<Part[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    setItemsPerPage(20);
    setCurrentParts(parts.slice(indexOfFirstItem, indexOfLastItem));
    console.log(
      "Current parts: ",
      parts.slice(indexOfFirstItem, indexOfLastItem)
    );
    setTotalPages(Math.ceil(parts.length / itemsPerPage));
  }, [parts, currentPage, indexOfFirstItem, indexOfLastItem, itemsPerPage]);

  return (
    <>
      <div className="mb-2">
        <AddingPart fetchAllParts={fetchAllParts} />
      </div>
      <div className="h-89/100 overflow-auto border-y border-gray-300">
        <PartsTable
          parts={parts}
          setParts={setParts}
          fetchAllParts={fetchAllParts}
          isFetching={isFetching}
          currentParts={currentParts}
        />
      </div>
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
}
