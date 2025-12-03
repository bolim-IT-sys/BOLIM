import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { type Part } from "../../services/Part.Service";
import { AddingPart } from "../../components/modals/Parts/AddingPart";
import { useOutletContext } from "react-router-dom";
import { DataTable } from "./Components/DataTable";
import { DataPagination } from "./Components/DataPagination";
import InputField from "../../components/InputField";
import { DownloadPartData } from "../../components/downloadButton/DownloadPartData";

interface ContextType {
  materials: Part[];
  setMaterials: Dispatch<SetStateAction<Part[]>>;
  fetchAllParts: () => void;
  isFetching: boolean;
}

export default function MaterialControl() {
  const { materials, setMaterials, fetchAllParts, isFetching } =
    useOutletContext<ContextType>();
  const [currentParts, setCurrentParts] = useState<Part[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);

  const [searchedParts, setSearchedParts] = useState<Part[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const [totalPages, setTotalPages] = useState<number>(0);

  const displayParts = searchTerm === "" ? materials : searchedParts;

  useEffect(() => {
    if (searchTerm !== "") {
      setSearchedParts(
        materials.filter((item) => {
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
  }, [searchTerm, materials]);

  useEffect(() => {
    setItemsPerPage(50);
    setCurrentParts(displayParts.slice(indexOfFirstItem, indexOfLastItem));

    setTotalPages(Math.ceil(materials.length / itemsPerPage));
  }, [
    displayParts,
    materials,
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
            label={`Search(part number, specifications, category, unit price, company)`}
            type="text"
            value={searchTerm}
            onChange={(value: string) => setSearchTerm(value)}
          />
        </div>
        <div className="w-3/10 flex gap-2">
          <AddingPart fetchAllParts={fetchAllParts} type="material" />
          <DownloadPartData parts={displayParts} />
        </div>
      </div>
      <div className="h-87/100 overflow-auto border border-gray-300">
        <DataTable
          data={displayParts}
          setData={setMaterials}
          type={"material"}
          fetchAllParts={fetchAllParts}
          isFetching={isFetching}
          currentParts={currentParts}
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
