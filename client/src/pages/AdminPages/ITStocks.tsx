import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { type Part } from "../../services/Part.Service";
import { AddingPart } from "../../components/modals/Parts/AddingPart";
import { useOutletContext } from "react-router-dom";
import { DataTable } from "./Components/DataTable";
import { DataPagination } from "./Components/DataPagination";
import InputField from "../../components/InputField";
import { DownloadPartData } from "../../components/downloadButton/DownloadPartData";
import { DataTableLoader } from "../../components/loaders/DataTableLoader";

interface ContextType {
  ITStocks: Part[];
  setITStocks: Dispatch<SetStateAction<Part[]>>;
  fetchAllParts: () => void;
  isFetching: boolean;
}

export default function ITStocks() {
  const { ITStocks, setITStocks, fetchAllParts, isFetching } =
    useOutletContext<ContextType>();
  const [currentData, setCurrentData] = useState<Part[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);

  const [searchedParts, setSearchedParts] = useState<Part[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const [totalPages, setTotalPages] = useState<number>(0);

  const displayParts = searchTerm === "" ? ITStocks : searchedParts;

  useEffect(() => {
    if (searchTerm !== "") {
      setSearchedParts(
        ITStocks.filter((item) => {
          const term = searchTerm.toLowerCase();

          return (
            item.partNumber.toLowerCase().includes(term) ||
            item.specs.toLowerCase().includes(term) ||
            item.company.toLowerCase().includes(term) ||
            item.category.toLowerCase().includes(term) ||
            String(item.unitPrice).toLowerCase().includes(term)
          );
        })
      );
    } else {
      return;
    }
    // console.log("Search Term: ", searchedParts);
  }, [searchTerm, ITStocks]);

  useEffect(() => {
    setItemsPerPage(50);
    setCurrentData(displayParts.slice(indexOfFirstItem, indexOfLastItem));

    setTotalPages(Math.ceil(ITStocks.length / itemsPerPage));
  }, [
    displayParts,
    ITStocks,
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
          <AddingPart fetchAllParts={fetchAllParts} type="it" />
          <DownloadPartData parts={displayParts} />
        </div>
      </div>
      <div
        className={`h-87/100 w-full ${isFetching ? "overflow-hidden" : "overflow-auto"} border border-gray-300 relative`}
      >
        {isFetching ? <DataTableLoader /> : null}
        <DataTable
          data={displayParts}
          setData={setITStocks}
          type={"it"}
          fetchAllParts={fetchAllParts}
          isFetching={isFetching}
          currentData={currentData}
        />
      </div>
      <DataPagination
        data={displayParts}
        indexOfFirstItem={indexOfFirstItem}
        indexOfLastItem={indexOfLastItem}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </>
  );
}
