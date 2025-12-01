import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { type Part } from "../../services/Part.Service";
import { AddingPart } from "../../components/modals/Parts/AddingPart";
import { useOutletContext } from "react-router-dom";
import { PinTable } from "./Components/PinTable";
import { DataPagination } from "./Components/DataPagination";
import InputField from "../../components/InputField";
import { DownloadPartData } from "../../components/downloadButton/DownloadPartData";

interface ContextType {
  parts: Part[];
  setParts: Dispatch<SetStateAction<Part[]>>;
  fetchAllParts: () => void;
  isFetching: boolean;
}

export default function Pins() {
  const { parts, setParts, fetchAllParts, isFetching } =
    useOutletContext<ContextType>();
  const [currentParts, setCurrentParts] = useState<Part[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);

  const [searchedParts, setSearchedParts] = useState<Part[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const [totalPages, setTotalPages] = useState<number>(0);

  const displayParts = searchTerm === "" ? parts : searchedParts;

  useEffect(() => {
    if (searchTerm !== "") {
      setSearchedParts(
        parts.filter((part) => {
          const term = searchTerm.toLowerCase();

          return (
            part.partNumber.toLowerCase().includes(term) ||
            part.specs.toLowerCase().includes(term) ||
            part.company.toLowerCase().includes(term) ||
            part.category.toLowerCase().includes(term) ||
            String(part.unitPrice).toLowerCase().includes(term)
          );
        })
      );
    } else {
      return;
    }
    // console.log("Search Term: ", searchedParts);
  }, [searchTerm, parts]);

  useEffect(() => {
    setItemsPerPage(50);
    setCurrentParts(displayParts.slice(indexOfFirstItem, indexOfLastItem));

    setTotalPages(Math.ceil(parts.length / itemsPerPage));
  }, [
    displayParts,
    parts,
    currentPage,
    indexOfFirstItem,
    indexOfLastItem,
    itemsPerPage,
  ]);

  return (
    <>
      <div className="mb-2 flex gap-2">
        <div className="w-7/10">
          <InputField
            label="Search(part number, specifications, category, unit price, company)"
            type="text"
            value={searchTerm}
            onChange={(value: string) => setSearchTerm(value)}
          />
        </div>
        <div className="w-3/10 flex gap-2">
          <AddingPart fetchAllParts={fetchAllParts} />
          <DownloadPartData parts={displayParts} />
        </div>
      </div>
      <div className="h-87/100 overflow-auto border-y border-gray-300">
        <PinTable
          parts={displayParts}
          setParts={setParts}
          fetchAllParts={fetchAllParts}
          isFetching={isFetching}
          currentParts={currentParts}
        />
      </div>
      <DataPagination
        parts={displayParts}
        indexOfFirstItem={indexOfFirstItem}
        indexOfLastItem={indexOfLastItem}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </>
  );
}
