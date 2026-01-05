import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { type Part } from "../../services/Part.Service";
import { AddingPart } from "../../components/modals/Parts/AddingPart";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { DataTable } from "./Components/DataTable";
import { DataPagination } from "./Components/DataPagination";
import InputField from "../../components/InputField";
import { DownloadPartData } from "../../components/downloadButton/DownloadPartData";
import { DataTableLoader } from "../../components/loaders/DataTableLoader";
import type { User } from "../../services/User.Service";

interface ContextType {
  user: User;
  parts: Part[];
  setParts: Dispatch<SetStateAction<Part[]>>;
  fetchAllParts: () => void;
  isFetching: boolean;
}

export default function Others() {
  const { inventoryName } = useParams<{ inventoryName: string }>();
  const { user, parts, setParts, fetchAllParts, isFetching } =
    useOutletContext<ContextType>();
  const [currentData, setCurrentData] = useState<Part[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);

  const [searchedParts, setSearchedParts] = useState<Part[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const [totalPages, setTotalPages] = useState<number>(0);

  const displayParts = searchTerm === "" ? parts : searchedParts;
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (!user?.pins) {
        alert("You're not authorized to access this page.");
        navigate("/dashboard");
      }
    }
  }, [navigate, user]);

  console.log(inventoryName);

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
    setCurrentData(displayParts.slice(indexOfFirstItem, indexOfLastItem));

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
      <div className="h-full flex flex-col justify-between">
        <div className="">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="w-full sm:w-6/10">
              <InputField
                label="Search(part number, specifications, category, unit price, company)"
                type="text"
                value={searchTerm}
                onChange={(value: string) => setSearchTerm(value)}
              />
            </div>
            <div className="w-full h-10 sm:w-4/10 flex gap-2">
              <AddingPart fetchAllParts={fetchAllParts} type="pin" />
              <DownloadPartData parts={displayParts} />
            </div>
          </div>
        </div>

        {/* <div className="h-87/100 w-full overflow-hidden border border-gray-300 relative"></div> */}
        <div
          className={`h-15/20 sm:h-17/20 w-10/10 ${isFetching ? "overflow-hidden" : "overflow-auto"} border border-gray-300 relative`}
          // style={{ height: "clamp(30rem, 50dvw, 60rem)" }}
        >
          {isFetching ? <DataTableLoader /> : null}

          <DataTable
            data={displayParts}
            setData={setParts}
            type={"pin"}
            fetchAllParts={fetchAllParts}
            currentData={currentData}
          />
        </div>
        <div className="flex items-end justify-between">
          <DataPagination
            data={displayParts}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      </div>
    </>
  );
}
