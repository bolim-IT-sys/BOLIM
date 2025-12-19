import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  currentMonth,
  currentYear,
  getSafetyStock,
} from "../../../helper/helper";
import { type Part } from "../../../services/Part.Service";
import {
  sortByExcessInsufficient,
  sortByOrderQuantity,
  sortByPartNumber,
  sortByPrice,
  sortBySecurementRate,
  sortByStocks,
  sortByUrgentRequest,
} from "../../../helper/sorting.helper";
import { useSearchParams } from "react-router-dom";
import { ImageModal } from "../../../components/modals/Parts/ImageModal";
import {
  computeExcessInsufficient,
  computeOrderQuantity,
  computeSecurementRate,
  computeStocks,
  computeUrgentRequest,
} from "../../../helper/table.helper";

type Props = {
  data: Part[];
  setData: Dispatch<SetStateAction<Part[]>>;
  type: string;
};

export const ModalDataTable = ({ data, setData, type }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort") || "partNumber";
  const order = searchParams.get("order") || "asc";

  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | string>(
    `${order}`
  );
  const [sortBy, setSortBy] = useState<string>(sort);

  const year = currentYear();
  const month = currentMonth();

  const [currentData, setCurrentData] = useState<Part[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);

  const [searchedParts, setSearchedParts] = useState<Part[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const [totalPages, setTotalPages] = useState<number>(0);

  const displayParts = searchTerm === "" ? data : searchedParts;

  useEffect(() => {
    setItemsPerPage(50);
    setCurrentData(displayParts.slice(indexOfFirstItem, indexOfLastItem));

    setTotalPages(Math.ceil(data.length / itemsPerPage));
  }, [
    displayParts,
    data,
    currentPage,
    indexOfFirstItem,
    indexOfLastItem,
    itemsPerPage,
  ]);

  const handleSortByPartNumber = () => {
    const sorted = sortByPartNumber(
      data,
      sortBy === "partNumber" && sortOrder === "asc" ? "desc" : "asc"
    );
    // console.log("Sorted Parts by Part Number: ", sorted);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", "partNumber");
    newParams.set(
      "order",
      sortBy === "partNumber" && sortOrder === "asc" ? "desc" : "asc"
    );
    setSearchParams(newParams);

    setSortBy("partNumber");
    setData(sorted);
    setSortOrder(
      sortBy === "partNumber" && sortOrder === "asc" ? "desc" : "asc"
    );
  };

  const handleSortByUnitPrice = () => {
    const sorted = sortByPrice(
      data,
      sortBy === "unitPrice" && sortOrder === "asc" ? "asc" : "desc"
    );
    // console.log("Sorted Parts by Unit Price: ", sorted, " by: ", sortOrder);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", "unitPrice");
    newParams.set(
      "order",
      sortBy === "unitPrice" && sortOrder === "asc" ? "desc" : "asc"
    );
    setSearchParams(newParams);

    setSortBy("unitPrice");
    setData(sorted);
    setSortOrder(
      sortBy === "unitPrice" && sortOrder === "asc" ? "desc" : "asc"
    );
  };

  const handleSortByStocks = () => {
    const sorted = sortByStocks(
      data,
      sortBy === "stocks" && sortOrder === "asc" ? "asc" : "desc"
    );
    // console.log("Sorted Parts by QTY: ", sorted);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", "stocks");
    newParams.set(
      "order",
      sortBy === "stocks" && sortOrder === "asc" ? "desc" : "asc"
    );
    setSearchParams(newParams);

    setSortBy("stocks");
    setData(sorted);
    setSortOrder(sortBy === "stocks" && sortOrder === "asc" ? "desc" : "asc");
  };

  const handleSortBySecurementRate = () => {
    const sorted = sortBySecurementRate(
      data,
      sortBy === "securementRate" && sortOrder === "asc" ? "asc" : "desc"
    );
    // console.log("Sorted Parts by QTY: ", sorted);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", "securementRate");
    newParams.set(
      "order",
      sortBy === "securementRate" && sortOrder === "asc" ? "desc" : "asc"
    );
    setSearchParams(newParams);

    setSortBy("securementRate");
    setData(sorted);
    setSortOrder(
      sortBy === "securementRate" && sortOrder === "asc" ? "desc" : "asc"
    );
  };

  const handleSortByExcessInsufficient = () => {
    const sorted = sortByExcessInsufficient(
      data,
      sortBy === "excessInsufficient" && sortOrder === "asc" ? "asc" : "desc"
    );
    // console.log("Sorted Parts by QTY: ", sorted);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", "excessInsufficient");
    newParams.set(
      "order",
      sortBy === "excessInsufficient" && sortOrder === "asc" ? "desc" : "asc"
    );
    setSearchParams(newParams);

    setSortBy("excessInsufficient");
    setData(sorted);
    setSortOrder(
      sortBy === "excessInsufficient" && sortOrder === "asc" ? "desc" : "asc"
    );
  };

  const handleSortByUrgentRequest = () => {
    const sorted = sortByUrgentRequest(
      data,
      sortBy === "urgentRequest" && sortOrder === "asc" ? "asc" : "desc"
    );
    // console.log("Sorted Parts by QTY: ", sorted);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", "urgentRequest");
    newParams.set(
      "order",
      sortBy === "urgentRequest" && sortOrder === "asc" ? "desc" : "asc"
    );
    setSearchParams(newParams);

    setSortBy("urgentRequest");
    setData(sorted);
    setSortOrder(
      sortBy === "urgentRequest" && sortOrder === "asc" ? "desc" : "asc"
    );
  };

  const handleSortByOrderQuantity = () => {
    const sorted = sortByOrderQuantity(
      data,
      sortBy === "orderQuantity" && sortOrder === "asc" ? "asc" : "desc"
    );
    // console.log("Sorted Parts by QTY: ", sorted);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", "orderQuantity");
    newParams.set(
      "order",
      sortBy === "orderQuantity" && sortOrder === "asc" ? "desc" : "asc"
    );
    setSearchParams(newParams);

    setSortBy("orderQuantity");
    setData(sorted);
    setSortOrder(
      sortBy === "orderQuantity" && sortOrder === "asc" ? "desc" : "asc"
    );
  };

  return (
    <>
      {data.length === 0 ? (
        <div className="h-full w-full absolute flex justify-center items-center flex-col text-neutral-500 bg-neutral-50/70 backdrop-blur">
          <h1 className="flex">
            <i className="bx  bx-confused"></i>
          </h1>
          <h3>No data found.</h3>
        </div>
      ) : (
        <div className="w-150">
          <table className={`h-full w-650`}>
            <thead
              className="h-15 bg-sky-600 sticky text-neutral-50"
              style={{ zIndex: 5, top: "-.1px" }}
            >
              <tr>
                <th
                  className="hover:bg-sky-700 transition duration-200 border border-neutral-300 text-center px-2 py-3 cursor-pointer"
                  onClick={handleSortByPartNumber}
                >
                  <div className="h-10 flex justify-center items-center">
                    <h5>IMAGE</h5>
                  </div>
                </th>
                <th
                  className="w-50 hover:bg-sky-700 transition duration-200 border border-neutral-300 text-center px-2 py-3 cursor-pointer"
                  onClick={handleSortByPartNumber}
                >
                  <div className="h-10 flex justify-center items-center flex-col">
                    <h5>
                      {type === "pin"
                        ? "PIN NUMBER"
                        : type === "it"
                          ? "ITEM NAME"
                          : type === "material"
                            ? "MATERIAL NAME"
                            : "INVALID TYPE"}{" "}
                      {sortBy === "partNumber"
                        ? sortOrder === "asc"
                          ? "▲"
                          : "▼"
                        : "⇅"}
                    </h5>
                  </div>
                </th>
                <th className="w-70 border border-neutral-300 text-center px-2 py-3">
                  <div className="h-10 flex justify-center items-center flex-col">
                    <h5>SPECIFICATIONS (Description)</h5>
                    <h6>규격(설명)</h6>
                  </div>
                </th>
                <th className="border border-neutral-300 text-center px-2 py-3">
                  <div className="h-10 flex justify-center items-center flex-col">
                    <h5>CATEGORY</h5>
                    <h6>유형</h6>
                  </div>
                </th>
                <th
                  className="hover:bg-sky-700 transition duration-200 border border-neutral-300 text-center px-2 py-3 cursor-pointer"
                  onClick={handleSortByUnitPrice}
                >
                  <div className="h-10 flex justify-center items-center">
                    <h5>
                      UNIT PRICE (₩){" "}
                      {sortBy === "unitPrice"
                        ? sortOrder === "asc"
                          ? "▲"
                          : "▼"
                        : "⇅"}
                    </h5>
                  </div>
                </th>
                <th className="border border-neutral-300 text-center px-2 py-3">
                  <div className="h-10 flex justify-center items-center flex-col">
                    <h5>COMPANY</h5>
                    <h6>업체</h6>
                  </div>
                </th>
                <th
                  className="hover:bg-sky-700 transition duration-200 border border-neutral-300 text-center px-2 py-3 cursor-pointer"
                  onClick={handleSortByStocks}
                >
                  <div className="h-10 flex justify-center items-center">
                    <h5>
                      {" "}
                      CURRENT STOCKS{" "}
                      {sortBy === "stocks"
                        ? sortOrder === "asc"
                          ? "▲"
                          : "▼"
                        : "⇅"}
                    </h5>
                  </div>
                </th>
                <th
                  className="hover:bg-sky-700 transition duration-200 cursor-pointer w-50 border border-neutral-300 text-center px-2 py-3"
                  onClick={handleSortBySecurementRate}
                >
                  <div className="h-10 flex justify-center items-center flex-col">
                    <h5 className="uppercase">
                      Securement rate{" "}
                      {sortBy === "securementRate"
                        ? sortOrder === "asc"
                          ? "▲"
                          : "▼"
                        : "⇅"}
                    </h5>
                    <h6>(확보율)</h6>
                  </div>
                </th>
                <th
                  className="hover:bg-sky-700 transition duration-200 cursor-pointer w-75 border border-neutral-300 text-center px-2 py-3"
                  onClick={handleSortByExcessInsufficient}
                >
                  <div className="h-10 flex justify-center items-center flex-col">
                    <h5 className="uppercase">
                      Excess/insufficient quantity{" "}
                      {sortBy === "excessInsufficient"
                        ? sortOrder === "asc"
                          ? "▲"
                          : "▼"
                        : "⇅"}
                    </h5>
                    <h6>(과/부족수량)</h6>
                  </div>
                </th>
                <th
                  className="hover:bg-sky-700 transition duration-200 cursor-pointer w-110 border border-neutral-300 text-center px-2 py-3"
                  onClick={handleSortByUrgentRequest}
                >
                  <div className="h-10 flex justify-center items-center flex-col">
                    <h5 className="uppercase">
                      Urgent Request (Secure Rate Less than 50%){" "}
                      {sortBy === "urgentRequest"
                        ? sortOrder === "asc"
                          ? "▲"
                          : "▼"
                        : "⇅"}
                    </h5>
                    <h6>긴급 요청(확보율 50%이하)</h6>
                  </div>
                </th>
                <th
                  className="hover:bg-sky-700 transition duration-200 cursor-pointer border border-neutral-300 text-center px-2 py-3"
                  onClick={handleSortByOrderQuantity}
                >
                  <div className="h-10 flex justify-center items-center flex-col">
                    <h5 className="uppercase">
                      Order Quantity (Regular Order){" "}
                      {sortBy === "orderQuantity"
                        ? sortOrder === "asc"
                          ? "▲"
                          : "▼"
                        : "⇅"}
                    </h5>
                    <h6>발주 수량(정기발주)</h6>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                <>
                  {currentData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="text-center border border-neutral-300 px-3 py-2">
                        <div className="h-18 flex justify-center items-center">
                          <ImageModal part={item} />
                        </div>
                      </td>
                      <td className="text-center border border-neutral-300 px-3 py-2">
                        <h6>{item.partNumber}</h6>
                      </td>
                      <td className="text-center border border-neutral-300 px-3 py-2">
                        <h6>{item.specs}</h6>
                      </td>
                      <td className="text-center border border-neutral-300 px-3 py-2">
                        <h6>{item.category}</h6>
                      </td>
                      <td className="text-center border border-neutral-300 px-3 py-2">
                        <h6>{Number(item.unitPrice).toLocaleString()}</h6>
                      </td>
                      <td className="text-center border border-neutral-300 px-3 py-2">
                        <h6>{item.company}</h6>
                      </td>
                      <td
                        className={`${
                          computeStocks(item) <
                          getSafetyStock(
                            item.outbounds!.map((o) => ({
                              quantity: o.quantity,
                              date: String(o.outboundDate),
                            })),
                            year,
                            month
                          )
                            ? "bg-red-100 text-red-900"
                            : "bg-emerald-100 text-emerald-800"
                        } text-center border border-neutral-300  px-3 py-2`}
                      >
                        <div>
                          <h6 className={`rounded px-1`}>
                            <b>{computeStocks(item)}</b>
                          </h6>
                        </div>
                      </td>

                      <td className="text-center border border-neutral-300 px-3 py-2">
                        <h6>{computeSecurementRate(item)}%</h6>
                      </td>
                      <td className="text-center border border-neutral-300 px-3 py-2">
                        <h6>{computeExcessInsufficient(item)}</h6>
                      </td>
                      <td className="text-center border border-neutral-300 px-3 py-2">
                        <h6>{computeUrgentRequest(item)}</h6>
                      </td>
                      <td
                        className={`${computeOrderQuantity(item) > 0 ? "bg-red-100 text-red-900 font-bold" : ""} text-center border border-neutral-300 px-3 py-2`}
                      >
                        <h6>{computeOrderQuantity(item)}</h6>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <>
                  <tr className="hover:bg-gray-50">
                    <td
                      colSpan={12}
                      className="text-center border border-neutral-300 px-3 py-2"
                    >
                      NO PART AVAILABLE
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};
