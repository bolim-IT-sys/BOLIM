import { useEffect, useState } from "react";
import { DataPagination } from "./Components/DataPagination";
import InputField from "../../components/InputField";
import { DataTableLoader } from "../../components/loaders/DataTableLoader";
import DangerButton from "../../components/button/DangerButton";
import { AddingUser } from "../../components/modals/Users/AddingUser";
import { fetchUsers, type User } from "../../services/User.Service";
import { EditingUser } from "../../components/modals/Users/EditingUser";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentData, setCurrentData] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);

  const [searchedParts, setSearchedParts] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const [totalPages, setTotalPages] = useState<number>(0);

  const displayedData = searchTerm === "" ? users : searchedParts;

  const fetchAllUsers = async () => {
    try {
      setIsLoading(true);
      const result = await fetchUsers();
      // console.log("Users Fetched: ", result.data);

      if (result.success) {
        setUsers(result.data!);
      }
    } catch (err) {
      alert(err);
    } finally {
      setTimeout(
        () => {
          setIsLoading(false);
        },
        import.meta.env.VITE_TIME_OUT
      );
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (searchTerm !== "") {
      setSearchedParts(
        users.filter((user) => {
          const term = searchTerm.toLowerCase();

          return user.username.toLowerCase().includes(term);
        })
      );
    } else {
      return;
    }
    // console.log("Search Term: ", searchedParts);
  }, [searchTerm, users]);

  useEffect(() => {
    setItemsPerPage(50);
    setCurrentData(displayedData.slice(indexOfFirstItem, indexOfLastItem));

    setTotalPages(Math.ceil(users.length / itemsPerPage));
  }, [
    displayedData,
    users,
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
            label={`Search user`}
            type="text"
            value={searchTerm}
            onChange={(value: string) => setSearchTerm(value)}
          />
        </div>
        <div className="w-3/10 flex gap-2">
          <AddingUser fetchAllUsers={fetchAllUsers} />
        </div>
      </div>
      <div
        className={`h-87/100 w-full ${isLoading ? "overflow-hidden" : "overflow-auto"} border border-gray-300 relative`}
      >
        {isLoading ? <DataTableLoader /> : null}
        <div className="">
          <table className={`h-full w-10/10`}>
            <thead
              className="h-15 bg-sky-600 sticky text-neutral-50"
              style={{ zIndex: 5, top: "-.1px" }}
            >
              <tr>
                <th className="hover:bg-sky-700 transition duration-200 border border-neutral-300 text-center px-2 py-3 cursor-pointer">
                  <div className="h-10 flex justify-center items-center">
                    <h5>USERNAME</h5>
                  </div>
                </th>

                <th className="border border-neutral-300 text-center px-2 py-3">
                  <div className="h-10 flex justify-center items-center flex-col">
                    <h5>PINS</h5>
                  </div>
                </th>
                <th className="border border-neutral-300 text-center px-2 py-3">
                  <div className="h-10 flex justify-center items-center flex-col">
                    <h5>IT STOCKS</h5>
                  </div>
                </th>
                <th className="border border-neutral-300 text-center px-2 py-3">
                  <div className="h-10 flex justify-center items-center flex-col">
                    <h5>MATERIAL CONTROL</h5>
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
              {currentData.map((user, index) => (
                <tr key={index}>
                  <td className="text-center border border-neutral-300 px-3 py-2">
                    <h6>{user.username}</h6>
                  </td>
                  <td
                    className={`${user.pins ? "text-green-700" : "text-neutral-500"} text-center border border-neutral-300 px-3 py-2`}
                  >
                    <h6>{user.pins ? "ADMIN" : "NOT ADMIN"}</h6>
                  </td>
                  <td
                    className={`${user.it_stocks ? "text-green-700" : "text-neutral-500"} text-center border border-neutral-300 px-3 py-2`}
                  >
                    <h6>{user.it_stocks ? "ADMIN" : "NOT ADMIN"}</h6>
                  </td>
                  <td
                    className={`${user.materials ? "text-green-700" : "text-neutral-500"} text-center border border-neutral-300 px-3 py-2`}
                  >
                    <h6>{user.materials ? "ADMIN" : "NOT ADMIN"}</h6>
                  </td>
                  <td
                    className=" text-center border border-neutral-300 p-2"
                    style={{ zIndex: -10 }}
                  >
                    <div className="flex flex-col gap-1">
                      <EditingUser user={user} fetchAllUsers={fetchAllUsers} />

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
                              <i className="bx bx-loader-dots bx-spin" />{" "}
                              DELETING
                            </span>
                          </>
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <DataPagination
        data={displayedData}
        indexOfFirstItem={indexOfFirstItem}
        indexOfLastItem={indexOfLastItem}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </>
  );
}
