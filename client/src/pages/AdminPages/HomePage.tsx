import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import SideNavBar from "../../components/SideNavBar";
import type { User } from "../../services/userService";
import { fetchParts, removePart, type Part } from "../../services/Part.Service";
import DangerButton from "../../components/button/DangerButton";
import { AddingPart } from "../../components/modals/Parts/AddingPart";
import { EditingPart } from "../../components/modals/Parts/EditingPart";
import { ViewPartStocks } from "../../components/modals/Parts/ViewPartStocks";
import PrimaryButton from "../../components/button/PrimaryButton";
import {
  fetchAllInbounds,
  fetchAllOutbounds,
} from "../../services/InboundOutbound.Service";
import { currentMonth, currentYear, getSafetyStock } from "../../helper/helper";
import { sortByPartNumber, sortByStocks } from "../../helper/sorting.helper";

interface HomeProps {
  user: User;
}

export default function HomePage({ user }: HomeProps) {
  const [parts, setParts] = useState<Part[]>([]);
  const [currentParts, setCurrentParts] = useState<Part[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState<string>("partNumber");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<number>(0);

  const year = currentYear();
  const month = currentMonth();

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

  const fetchAllParts = async () => {
    try {
      setIsLoading(true);
      const [inResult, outResult, result] = await Promise.all([
        fetchAllInbounds(),
        fetchAllOutbounds(),
        fetchParts(),
      ]);

      if (result.success) {
        const inbounds = inResult.success ? inResult.data : [];
        const outbounds = outResult.success ? outResult.data : [];

        // GETTING PART INBOUNDS AND OUTBOUNDS
        const partWithInboundOutbound = result.data!.map((part) => ({
          ...part,
          inbounds:
            inbounds?.filter((inbound) => inbound.partId === part.id) || [],
          outbounds:
            outbounds?.filter((outbound) => outbound.partId === part.id) || [],
        }));

        setParts(partWithInboundOutbound);
        console.log("Fetched Parts: ", partWithInboundOutbound);
      } else {
        console.log("No parts found.");
        setParts([]);
      }
    } catch (err) {
      console.log("Unexpected error occured: ", err);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  useEffect(() => {
    fetchAllParts();
  }, []);

  const handleSortByStocks = () => {
    const sorted = sortByStocks(
      parts,
      sortBy === "stocks" && sortOrder === "asc" ? "asc" : "desc"
    );
    console.log("Sorted Parts by QTY: ", sorted);
    setSortBy("stocks");
    setParts(sorted);
    setSortOrder(sortBy === "stocks" && sortOrder === "asc" ? "desc" : "asc");
  };

  const handleSortByPartNumber = () => {
    const sorted = sortByPartNumber(
      parts,
      sortBy === "partNumber" && sortOrder === "asc" ? "desc" : "asc"
    );
    console.log("Sorted Parts by Part Number: ", sorted);
    setSortBy("partNumber");
    setParts(sorted);
    setSortOrder(
      sortBy === "partNumber" && sortOrder === "asc" ? "desc" : "asc"
    );
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
        setTimeout(() => {
          alert(result.message);
          fetchAllParts();
        }, 1500);
      } else {
        setTimeout(() => {
          alert(result.message);
        }, 1500);
      }
    } catch (error) {
      console.error("Error occured: ", error);
    } finally {
      setTimeout(() => {
        setIsDeleting(0);
      }, 1500);
    }
  };

  return (
    <div className="flex justify-center relative" style={{ height: "100dvh" }}>
      <NavBar user={user} />
      <div className="flex justify-start w-dvw pt-15 ">
        <SideNavBar user={user} />
        <div className="h-full w-9/10 ">
          <div className="bg-neutral-50 h-95/100 my-7 mx-5 p-5 rounded-sm">
            <div className="mb-2">
              <AddingPart fetchAllParts={fetchAllParts} />
            </div>
            <div className="h-89/100 overflow-auto border-y border-gray-300">
              <table className="min-w-full border-2 border-gray-300">
                <thead
                  className="h-full bg-sky-500 sticky top-0 text-neutral-50"
                  style={{ zIndex: 5 }}
                >
                  <tr>
                    <th
                      className="border border-neutral-300 text-center cursor-pointer"
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
                        <h5>PART NUMBER</h5>
                      </div>
                    </th>
                    <th className="border border-neutral-300 text-center">
                      <div className="h-10 flex justify-center items-center border border-neutral-300">
                        <h5>UNIT PRICE (₩)</h5>
                      </div>
                    </th>
                    <th className="border border-neutral-300 text-center">
                      <div className="h-10 flex justify-center items-center border border-neutral-300">
                        <h5>COMPANY</h5>
                      </div>
                    </th>
                    <th
                      className="border border-neutral-300 text-center cursor-pointer"
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
                  {isLoading ? (
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
                                  <ViewPartStocks
                                    part={part}
                                    setParts={setParts}
                                  />
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
            </div>
            <div className="flex justify-between items-center p-4 border-t border-gray-300">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, parts.length)} of {parts.length}{" "}
                parts
              </div>

              <div className="flex gap-2">
                <div>
                  <PrimaryButton
                    text="PREVIOUS"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
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
          </div>
        </div>
      </div>
    </div>
  );
}
