import { useState, type Dispatch, type SetStateAction } from "react";
import {
  currentMonth,
  currentYear,
  getSafetyStock,
} from "../../../helper/helper";
import { removePart, type Part } from "../../../services/Part.Service";
import {
  sortByPartNumber,
  sortByPrice,
  sortByStocks,
} from "../../../helper/sorting.helper";
import { ViewPartStocks } from "../../../components/modals/Parts/ViewPartStocks";
import { EditingPart } from "../../../components/modals/Parts/EditingPart";
import DangerButton from "../../../components/button/DangerButton";
import { useSearchParams } from "react-router-dom";

type Props = {
  parts: Part[];
  setParts: Dispatch<SetStateAction<Part[]>>;
  fetchAllParts: () => void;
  isFetching: boolean;
  currentParts: Part[];
};

export const PartsTable = ({
  parts,
  setParts,
  fetchAllParts,
  isFetching,
  currentParts,
}: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort") || "partNumber";
  const order = searchParams.get("order") || "asc";

  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | string>(
    `${order}`
  );
  const [sortBy, setSortBy] = useState<string>(sort);
  const [isDeleting, setIsDeleting] = useState<number>(0);

  const year = currentYear();
  const month = currentMonth();

  const handleSortByPartNumber = () => {
    const sorted = sortByPartNumber(
      parts,
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
    setParts(sorted);
    setSortOrder(
      sortBy === "partNumber" && sortOrder === "asc" ? "desc" : "asc"
    );
  };

  const handleSortByUnitPrice = () => {
    const sorted = sortByPrice(
      parts,
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
    setParts(sorted);
    setSortOrder(
      sortBy === "unitPrice" && sortOrder === "asc" ? "desc" : "asc"
    );
  };

  const handleSortByStocks = () => {
    const sorted = sortByStocks(
      parts,
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
    setParts(sorted);
    setSortOrder(sortBy === "stocks" && sortOrder === "asc" ? "desc" : "asc");
  };

  const handleDelete = async (partId: number) => {
    const isConfirm = window.confirm(
      "Are you sure you want to delete this stock? This action cannot be undone."
    );

    if (!isConfirm) {
      return;
    }

    try {
      setIsDeleting(partId);
      console.log("removing stock");
      const result = await removePart(partId);

      if (result.success) {
        setTimeout(
          () => {
            alert(result.message);
            fetchAllParts();
          },
          import.meta.env.VITE_TIME_OUT
        );
      } else {
        setTimeout(
          () => {
            alert(result.message);
          },
          import.meta.env.VITE_TIME_OUT
        );
      }
    } catch (error) {
      console.error("Error occured: ", error);
    } finally {
      setTimeout(
        () => {
          setIsDeleting(0);
        },
        import.meta.env.VITE_TIME_OUT
      );
    }
  };
  return (
    <>
      <table className="min-w-full border-2 border-gray-300">
        <thead
          className="h-full bg-sky-500  sticky top-0 text-neutral-50"
          style={{ zIndex: 5 }}
        >
          <tr>
            <th
              className="hover:bg-sky-600 transition duration-200 border border-neutral-300 text-center cursor-pointer"
              onClick={handleSortByPartNumber}
            >
              <div className="h-10 flex justify-center items-center border border-neutral-300">
                <h5>
                  PART NUMBER{" "}
                  {sortBy === "partNumber"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : "⇅"}
                </h5>
              </div>
            </th>
            <th className="border border-neutral-300 text-center">
              <div className="h-10 flex justify-center items-center border border-neutral-300">
                <h5>SPECIFICATIONS (Description)</h5>
              </div>
            </th>
            <th className="border border-neutral-300 text-center">
              <div className="h-10 flex justify-center items-center border border-neutral-300">
                <h5>CATEGORY</h5>
              </div>
            </th>
            <th
              className="hover:bg-sky-600 transition duration-200 border border-neutral-300 text-center cursor-pointer"
              onClick={handleSortByUnitPrice}
            >
              <div className="h-10 flex justify-center items-center border border-neutral-300">
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
            <th className="border border-neutral-300 text-center">
              <div className="h-10 flex justify-center items-center border border-neutral-300">
                <h5>COMPANY</h5>
              </div>
            </th>
            <th
              className="hover:bg-sky-600 transition duration-200 border border-neutral-300 text-center cursor-pointer"
              onClick={handleSortByStocks}
            >
              <div className="h-10 flex justify-center items-center border border-neutral-300">
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
            <th className="w-30 border border-neutral-300 text-center">
              <div className="h-10 flex justify-center items-center border border-neutral-300">
                <h5>ACTION</h5>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {isFetching ? (
            <>
              <tr className="hover:bg-gray-50">
                <td
                  colSpan={7}
                  className="text-center border border-neutral-300 px-3 py-2"
                >
                  <div className="flex justify-center items-center gap-1">
                    <h4>
                      <i className="bx bx-loader-dots bx-spin" />
                    </h4>
                    <h5 className="">LOADING PARTS DATA</h5>
                  </div>
                </td>
              </tr>
            </>
          ) : (
            <>
              {currentParts.length > 0 ? (
                <>
                  {currentParts.map((part) => (
                    <tr key={part.id} className="hover:bg-gray-50">
                      <td className="text-center border border-neutral-300 px-3 py-2">
                        {part.partNumber}
                      </td>
                      <td className="text-center border border-neutral-300 px-3 py-2">
                        {part.specs}
                      </td>
                      <td className="text-center border border-neutral-300 px-3 py-2">
                        {part.category}
                      </td>
                      <td className="text-center border border-neutral-300 px-3 py-2">
                        {part.unitPrice}
                      </td>
                      <td className="text-center border border-neutral-300 px-3 py-2">
                        {part.company}
                      </td>
                      <td className="text-center border border-neutral-300 px-3 py-2">
                        <p
                          className={`${
                            part.quantity <
                            getSafetyStock(
                              part.outbounds!.map((o) => ({
                                quantity: o.quantity,
                                date: String(o.outboundDate),
                              })),
                              year,
                              month
                            )
                              ? "bg-red-100 text-red-900"
                              : "bg-emerald-100 text-emerald-800"
                          } rounded px-1`}
                        >
                          <b>{part.quantity} </b>
                        </p>
                      </td>
                      <td
                        className=" text-center border border-neutral-300 p-2"
                        style={{ zIndex: -10 }}
                      >
                        <div className="flex flex-col gap-1">
                          <ViewPartStocks part={part} setParts={setParts} />
                          <div className="flex gap-1">
                            <EditingPart
                              fetchAllParts={fetchAllParts}
                              part={part}
                            />
                            <DangerButton
                              text={<i className="bx  bxs-trash"></i>}
                              loadingText=""
                              onClick={() => handleDelete(part.id!)}
                              isLoading={isDeleting === part.id}
                              disabled={isDeleting === part.id}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <>
                  <tr className="hover:bg-gray-50">
                    <td
                      colSpan={7}
                      className="text-center border border-neutral-300 px-3 py-2"
                    >
                      NO PART AVAILABLE
                    </td>
                  </tr>
                </>
              )}
            </>
          )}
        </tbody>
      </table>
    </>
  );
};
