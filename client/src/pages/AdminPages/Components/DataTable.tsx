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
  fetchAllParts: () => void;
  isFetching: boolean;
  currentData: Part[];
};

export const DataTable = ({
  data,
  setData,
  type,
  fetchAllParts,
  isFetching,
  currentData,
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

  const handleDelete = async (partId: number) => {
    const isConfirm = window.confirm(
      `Are you sure you want to delete this ${
        type === "pin"
          ? "pin"
          : type === "it"
            ? "item"
            : type === "material"
              ? "material"
              : "INVALID TYPE"
      }? This action cannot be undone.`
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
      <table className="w-600">
        <thead
          className="h-15 bg-sky-600 sticky text-neutral-50"
          style={{ zIndex: 5, top: "-.1px" }}
        >
          <tr>
            <th
              className="hover:bg-sky-600 transition duration-200 border border-neutral-300 text-center px-2 py-3 cursor-pointer"
              onClick={handleSortByPartNumber}
            >
              <div className="h-10 flex justify-center items-center">
                <h5>IMAGE</h5>
              </div>
            </th>
            <th
              className="hover:bg-sky-600 transition duration-200 border border-neutral-300 text-center px-2 py-3 cursor-pointer"
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
            <th className="border border-neutral-300 text-center px-2 py-3">
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
              className="hover:bg-sky-600 transition duration-200 border border-neutral-300 text-center px-2 py-3 cursor-pointer"
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
              className="hover:bg-sky-600 transition duration-200 border border-neutral-300 text-center px-2 py-3 cursor-pointer"
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
            <th className="w-30 border border-neutral-300 text-center px-2 py-3">
              <div className="h-10 flex justify-center items-center">
                <h5>ACTION</h5>
              </div>
            </th>
            <th className="border border-neutral-300 text-center px-2 py-3">
              <div className="h-10 flex justify-center items-center flex-col">
                <h5 className="uppercase">Securement rate</h5>
                <h6>(확보율)</h6>
              </div>
            </th>
            <th className="border border-neutral-300 text-center px-2 py-3">
              <div className="h-10 flex justify-center items-center flex-col">
                <h5 className="uppercase">Excess/insufficient quantity</h5>
                <h6>(과/부족수량)</h6>
              </div>
            </th>
            <th className="border border-neutral-300 text-center px-2 py-3">
              <div className="h-10 flex justify-center items-center flex-col">
                <h5 className="uppercase">
                  Urgent Request (Secure Rate Less than 50%)
                </h5>
                <h6>긴급 요청(확보율 50%이하)</h6>
              </div>
            </th>
            <th className="border border-neutral-300 text-center px-2 py-3">
              <div className="h-10 flex justify-center items-center flex-col">
                <h5 className="uppercase">Order Quantity (Regular Order)</h5>
                <h6>발주 수량(정기발주)</h6>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {isFetching ? (
            <>
              <tr className="hover:bg-gray-50">
                <td
                  colSpan={12}
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
                        <h6>{item.unitPrice}</h6>
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
                      <td
                        className=" text-center border border-neutral-300 p-2"
                        style={{ zIndex: -10 }}
                      >
                        <div className="flex flex-col gap-1">
                          <ViewPartStocks
                            item={item}
                            setData={setData}
                            type={type}
                          />
                          <div className="flex gap-1">
                            <EditingPart
                              fetchAllParts={fetchAllParts}
                              item={item}
                              type={type}
                            />
                            <DangerButton
                              text={
                                <>
                                  <span className="my-.5">
                                    <i className="bx  bxs-trash"></i>
                                  </span>
                                </>
                              }
                              loadingText={
                                <>
                                  <span className="my-.5">
                                    <i className="bx bx-loader-dots bx-spin" />
                                  </span>
                                </>
                              }
                              onClick={() => handleDelete(item.id!)}
                              isLoading={isDeleting === item.id}
                              disabled={isDeleting === item.id}
                            />
                          </div>
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
            </>
          )}
        </tbody>
      </table>
    </>
  );
};
