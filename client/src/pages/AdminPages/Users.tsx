// USER MANAGEMENT PAGE
import { useEffect, useState } from "react";
import { DataPagination } from "./Components/DataPagination";
import InputField from "../../components/InputField";
import { DataTableLoader } from "../../components/loaders/DataTableLoader";
import DangerButton from "../../components/button/DangerButton";
import { AddingUser } from "../../components/modals/Users/AddingUser";
import { fetchUsers, removeUser, type User } from "../../services/User.Service";
import { EditingUser } from "../../components/modals/Users/EditingUser";
import Swal from "sweetalert2";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(0);
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
        import.meta.env.VITE_TIME_OUT,
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
        }),
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

  const handleDelete = async (id: number) => {
    const resultConfirm = await Swal.fire({
      icon: "warning",
      title: `Delete User?`,
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    });

    if (!resultConfirm.isConfirmed) {
      return;
    }

    try {
      setIsDeleting(id);
      // console.log("removing stock");
      const result = await removeUser(id);

      if (result.success) {
        setTimeout(
          () => {
            Swal.fire({
              icon: "success",
              title: "Deleted",
              text: `${result.message}`,
              timer: 5000,
              showConfirmButton: false,
            }).then(() => {
              fetchAllUsers();
            });
          },
          import.meta.env.VITE_TIME_OUT,
        );
      } else {
        setTimeout(
          () => {
            Swal.fire({
              icon: "error",
              title: "Delete Failed",
              text: result.message,
            });
          },
          import.meta.env.VITE_TIME_OUT,
        );
      }
    } catch (error) {
      console.error("Error occured: ", error);
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: `Error occured: ${error}`,
      });
    } finally {
      setTimeout(
        () => {
          setIsDeleting(0);
        },
        import.meta.env.VITE_TIME_OUT,
      );
    }
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
              <AddingUser fetchAllUsers={fetchAllUsers} />
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
                        <EditingUser
                          user={user}
                          fetchAllUsers={fetchAllUsers}
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
                          onClick={() => handleDelete(user.id)}
                          disabled={isDeleting === user.id}
                          isLoading={isDeleting === user.id}
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
