import { useState, type Dispatch, type SetStateAction } from "react";
import {
  currentMonth,
  currentYear,
  getSafetyStock,
} from "../../../helper/helper";
import { type Part } from "../../../services/Part.Service";
import {
  sortByPartNumber,
  sortByPrice,
  sortByStocks,
} from "../../../helper/sorting.helper";
import { useSearchParams } from "react-router-dom";
import { computeStocks } from "../../../helper/table.helper";

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
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                <>
                  {data.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
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
