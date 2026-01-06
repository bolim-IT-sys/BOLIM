import { useEffect, useState } from "react";
import { DataPagination } from "./Components/DataPagination";
import InputField from "../../components/InputField";
import { DataTableLoader } from "../../components/loaders/DataTableLoader";
import DangerButton from "../../components/button/DangerButton";
import { AddingInventory } from "../../components/modals/Inventory/AddingInventory";
import { useOutletContext } from "react-router-dom";
import {
  removeInventory,
  type Inventory,
} from "../../services/Inventory.Service";
import { EditingInventory } from "../../components/modals/Inventory/EditingInventory";

type ContextType = {
  inventories: Inventory[];
  load_inventories: () => void;
};

export default function InventoryManagement() {
  const { inventories, load_inventories } = useOutletContext<ContextType>();
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(0);
  const [currentData, setCurrentData] = useState<Inventory[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);

  const [searchedParts, setSearchedParts] = useState<Inventory[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const [totalPages, setTotalPages] = useState<number>(0);

  const displayedData = searchTerm === "" ? inventories : searchedParts;

  useEffect(() => {
    if (inventories) {
      setIsLoading(false);
    }
    if (searchTerm !== "") {
      setSearchedParts(
        inventories.filter((inventory) => {
          const term = searchTerm.toLowerCase();

          return inventory.inventory_name.toLowerCase().includes(term);
        })
      );
    } else {
      return;
    }
    // console.log("Search Term: ", searchedParts);
  }, [searchTerm, inventories]);

  useEffect(() => {
    setItemsPerPage(50);
    setCurrentData(displayedData.slice(indexOfFirstItem, indexOfLastItem));

    setTotalPages(Math.ceil(inventories.length / itemsPerPage));
  }, [
    displayedData,
    inventories,
    currentPage,
    indexOfFirstItem,
    indexOfLastItem,
    itemsPerPage,
  ]);

  const handleDelete = async (id: number) => {
    const isConfirm = window.confirm(
      `Are you sure you want to remove this inventory? This action cannot be undone.`
    );

    if (!isConfirm) {
      return;
    }

    // console.log("removing inventory");
    await removeInventory(id, load_inventories, setIsDeleting);
  };

  return (
    <>
      <div className="h-full flex flex-col justify-between">
        <div className="">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="md:w-7/10">
              <InputField
                label={`Search user`}
                type="text"
                value={searchTerm}
                onChange={(value: string) => setSearchTerm(value)}
              />
            </div>
            <div className="h-10 md:w-3/10 flex gap-2">
              <AddingInventory load_inventories={load_inventories} />
            </div>
          </div>
        </div>
        <div
          className={`h-15/20 sm:h-17/20 w-10/10 ${isLoading ? "overflow-hidden" : "overflow-auto"} border border-gray-300 relative`}
        >
          {isLoading ? <DataTableLoader /> : null}
          <div className="w-full overflow-x-auto">
            <table className={`h-full w-150 sm:w-full`}>
              <thead
                className="h-15 bg-sky-600 sticky text-neutral-50"
                style={{ zIndex: 5, top: "-.1px" }}
              >
                <tr>
                  <th className="hover:bg-sky-700 transition duration-200 border border-neutral-300 text-center px-2 py-3 cursor-pointer">
                    <div className="h-10 flex justify-center items-center">
                      <h5>INVENTORY NAME</h5>
                    </div>
                  </th>

                  <th className="border border-neutral-300 text-center px-2 py-3">
                    <div className="h-10 flex justify-center items-center flex-col">
                      <h5>ITEM NAME</h5>
                    </div>
                  </th>
                  <th className="border border-neutral-300 text-center px-2 py-3">
                    <div className="h-10 flex justify-center items-center flex-col">
                      <h5>UNIQUE ITEM</h5>
                    </div>
                  </th>
                  <th className="border border-neutral-300 text-center px-2 py-3">
                    <div className="h-10 flex justify-center items-center">
                      <h5>ACTION</h5>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((inventory, index) => (
                  <tr key={index}>
                    <td className="text-center border border-neutral-300 px-3 py-2">
                      <h6>{inventory.inventory_name}</h6>
                    </td>
                    <td className="text-center border border-neutral-300 px-3 py-2">
                      <h6>{inventory.item_name}</h6>
                    </td>
                    <td
                      className={`${inventory.unique_item ? "text-green-700" : "text-neutral-500"} text-center border border-neutral-300 px-3 py-2`}
                    >
                      <h6>
                        {inventory.unique_item ? "REQUIRED" : "NOT REQUIRED"}
                      </h6>
                    </td>
                    <td
                      className=" text-center border border-neutral-300 p-2"
                      style={{ zIndex: -10 }}
                    >
                      <div className="flex flex-col gap-1">
                        <EditingInventory
                          inventory={inventory}
                          load_inventories={load_inventories}
                        />

                        <DangerButton
                          text={
                            <>
                              <span className="my-.5">
                                <i className="bx  bxs-trash"></i> DELETE
                              </span>
                            </>
                          }
                          loadingText={
                            <>
                              <span className="my-.5">
                                <i className="bx bx-loader-circle bx-spin" />{" "}
                                DELETING
                              </span>
                            </>
                          }
                          onClick={() => handleDelete(inventory.id)}
                          disabled={isDeleting === inventory.id}
                          isLoading={isDeleting === inventory.id}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <DataPagination
            data={displayedData}
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
