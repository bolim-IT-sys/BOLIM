// FOR MATERIAL CONTROL MANAGEMENT PAGE
import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { type Part } from "../../services/Part.Service";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { User } from "../../services/User.Service";
import axios from "axios";
//import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

interface ContextType {
    user: User;
    materials: Part[];
    setMaterials: Dispatch<SetStateAction<Part[]>>;
    fetchAllParts: () => void;
    //isFetching: boolean;
}
type MovementFormData = {
    personnel: string;
    date: string;
    description: string;
    serial: string;
    quantity: number;
    from: string;
    to: string;
    condition: string;
    remarks: string;
};

export default function EquipmentMovement() {
    //const [isFetching, setIsFetching] = useState<boolean>();
    //const { t } = useTranslation();
    const { user } = useOutletContext<ContextType>();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
    const [movements, setMovements] = useState<MovementFormData[]>([]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const initialForm = {
        personnel: "",
        date: "",
        description: "",
        serial: "",
        quantity: 0,
        from: "",
        to: "",
        condition: "",
        remarks: "",
    };
    const [form, setForm] = useState<MovementFormData>(initialForm);

    const handleExport = async () => {
        try {
            if (!fromDate || !toDate) {
                Swal.fire({
                    icon: "error",
                    title: `Please select date range`,
                    timer: 3000,
                    showConfirmButton: false,
                });
                return;
            }
            const res = await axios.post(
                `${API_URL}/movement/export-items-to-excel`,
                {
                    fromDate, toDate
                },
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(new Blob([res.data]));

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Equipment Transfer ${fromDate} to ${toDate}.xlsx`);

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url); // cleanup
        } catch (error) {
            console.error("Export failed ❌", error);
        }
    };

    const fetchMovements = useCallback(async () => {
        try {
            const res = await axios.get(`${API_URL}/movement/view`);
            setMovements(res.data.data);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }, [API_URL])

    useEffect(() => {
        fetchMovements();
    }, [fetchMovements]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: name === "quantity" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/movement`, form);
            Swal.fire({
                icon: "success",
                title: `Saved!`,
                timer: 3000,
                showConfirmButton: true,
            });
            setForm(initialForm);
            fetchMovements();
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: `Error saving!`,
                timer: 3000,
                showConfirmButton: false,
            });
        }
    }

    useEffect(() => {
        if (user) {
            if (!user?.movement) {
                alert("You're not authorized to access this page.");
                navigate("/dashboard");
            }
        }
    }, [navigate, user]);

    return (
        <div className="h-full flex flex-col gap-4">
            <div className="w-full flex flex-col sm:flex-row sm:items-end gap-3">
                <div className="flex flex-col w-full sm:w-auto">
                    <label htmlFor="from" className="text-sm font-medium text-gray-700 mb-1">
                        From
                    </label>
                    <input
                        id="from"
                        name="from"
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                    />
                </div>

                <div className="flex flex-col w-full sm:w-auto">
                    <label htmlFor="to" className="text-sm font-medium text-gray-700 mb-1">
                        To
                    </label>
                    <input
                        id="to"
                        name="to"
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                    />
                </div>

                <button
                    onClick={handleExport}
                    className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
                >
                    Export to Excel
                </button>
            </div>

            <div
                className={`h-15/20 sm:h-17/20 w-10/10 border border-gray-300 relative overflow-y-auto`}
            >
                <div className="w-full">
                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 m-2"
                    >
                        <div>
                            <label className="block text-sm font-medium mb-1">Name of Personnel</label>
                            <input
                                type="text"
                                name="personnel"
                                value={form.personnel}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Item Description</label>
                            <input
                                type="text"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Asset Tag / Serial No.</label>
                            <input
                                type="text"
                                name="serial"
                                value={form.serial}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={form.quantity}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">From Location / Line</label>
                            <input
                                type="text"
                                name="from"
                                value={form.from}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">To Location / Line</label>
                            <input
                                type="text"
                                name="to"
                                value={form.to}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Reason for Transfer</label>
                            <input
                                type="text"
                                name="condition"
                                value={form.condition}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                                required
                            />
                        </div>

                        <div className="sm:col-span-2 lg:col-span-1">
                            <label className="block text-sm font-medium mb-1">Remarks</label>
                            <input
                                name="remarks"
                                value={form.remarks}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                                required
                            />
                        </div>

                        <div className="sm:col-span-2 lg:col-span-3">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                    <hr />
                    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">

                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Personnel</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Item Description</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Asset Tag / Serial No.</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Quantity</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-600">From Location / Line</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-600">To Location / Line</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Reason for Transfer</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Remarks</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {movements.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-gray-700">{item.personnel}</td>
                                        <td className="px-4 py-3 text-gray-700">{item.date}</td>
                                        <td className="px-4 py-3 text-gray-700">{item.description}</td>
                                        <td className="px-4 py-3 text-gray-700">{item.serial}</td>
                                        <td className="px-4 py-3 text-gray-700">{item.quantity}</td>
                                        <td className="px-4 py-3 text-gray-700">{item.from}</td>
                                        <td className="px-4 py-3 text-gray-700">{item.to}</td>
                                        <td className="px-4 py-3 text-gray-700">{item.condition}</td>
                                        {/* balik mo na lang to pagkailangan ng kaartihan<td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${item.condition === "good"
                                                    ? "bg-green-100 text-green-700"
                                                    : item.condition === "damaged"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-gray-100 text-gray-700"
                                                    }`}
                                            >
                                                {item.condition}
                                            </span>
                                        </td>*/}
                                        <td className="px-4 py-3 text-gray-700">{item.remarks}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {movements.length === 0 && (
                            <div className="text-center py-10 text-gray-500">
                                No movement records found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
