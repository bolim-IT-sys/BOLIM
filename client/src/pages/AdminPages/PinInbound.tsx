import {
    useCallback,
    useEffect,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import { type Part } from "../../services/Part.Service";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { User } from "../../services/User.Service";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

interface ContextType {
    user: User;
    materials: Part[];
    setMaterials: Dispatch<SetStateAction<Part[]>>;
    fetchAllParts: () => void;
}

type SpareData = {
    id: number;
    category_id: number;
    part_number: string;
    product_name: string;
    no: number;
    specification: string;
    maker: string;
    stock: number | null;
    unit_price: number;
    remarks: string;
    app_holder: string;
    category: string;
};

type SummaryData = {
    part_number: string;
    total_inbound: number;

    [key: string]: string | number;
};

type UsageData = {
    part_number: string;
    total_usage: number;

    [key: string]: string | number;
};

export default function InventoryDashboard() {
    const { user } = useOutletContext<ContextType>();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
    const { t } = useTranslation();
    const [inventoryData, setInventoryData] = useState<SpareData[]>([]);
    const [inboundData, setInboundData] = useState({
        part_number: "",
        quantity: "",
        inbound_date: ""
    });
    const [summaryData, setSummaryData] = useState<SummaryData[]>([]);
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [usageData, setUsageData] = useState<UsageData[]>([]);
    const [useData, setUseData] = useState({ part_number: "", quantity: "", usage_date: "" });

    const months = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
    ];

    const years = Array.from(
        { length: 10 },
        (_, i) => currentYear - i
    );

    const handleInbound = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {
            await axios.post(
                `${API_URL}/spare/inbound`,
                inboundData
            );

            Swal.fire({
                icon: "success",
                title: "Inbound successful",
                timer: 3000,
                showConfirmButton: true,
            });

            setInboundData({
                part_number: "",
                quantity: "",
                inbound_date: "",
            });

            fetchMovements();

        } catch (error: unknown) {
            console.error(error);

            let errorMessage = "Inbound failed";

            if (axios.isAxiosError(error)) {
                errorMessage =
                    error.response?.data?.message ||
                    "Server error";
            }

            Swal.fire({
                icon: "error",
                title: errorMessage,
                timer: 3000,
                showConfirmButton: false,
            });
        }
    };

    const handleUsage = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {
            await axios.post(
                `${API_URL}/spare/usage`,
                useData
            );

            Swal.fire({
                icon: "success",
                title: "Usage Recorded",
                timer: 3000,
                showConfirmButton: true,
            });

            setUseData({
                part_number: "",
                quantity: "",
                usage_date: "",
            });

            fetchMovements();

        } catch (error: unknown) {
            console.error(error);

            let errorMessage = "Usage failed";

            if (axios.isAxiosError(error)) {
                errorMessage =
                    error.response?.data?.message ||
                    "Server error";
            }

            Swal.fire({
                icon: "error",
                title: errorMessage,
                timer: 3000,
                showConfirmButton: false,
            });
        }
    };

    const fetchMovements = useCallback(async () => {
        try {
            const res = await axios.get(`${API_URL}/spare/view`);
            setInventoryData(res.data);

            const summaryRes = await axios.get(
                `${API_URL}/spare/inbound-summary?year=${selectedYear}`
            );

            setSummaryData(summaryRes.data);

            const usageRes = await axios.get(
                `${API_URL}/spare/usage-summary?year=${selectedYear}`
            );

            setUsageData(usageRes.data);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }, [API_URL, selectedYear]);
    useEffect(() => {
        fetchMovements();
    }, [fetchMovements, selectedYear]);

    useEffect(() => {
        if (user) {
            if (!user?.pininb) {
                alert("You're not authorized to access this page.");
                navigate("/dashboard");
            }
        }
    }, [navigate, user]);

    return (
        <div className="h-full w-full bg-slate-100 p-3 sm:p-4 lg:p-6 space-y-4 overflow-y-scroll">
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <form
                    onSubmit={handleInbound}
                    className="bg-white w-full rounded-2xl"
                >
                    <h4 className="text-center font-bold pt-4">
                        {t("pininv.inparts")}
                    </h4>

                    <div className="p-4 grid gap-5 md:grid-cols-4">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                {t("pininv.prodnum")}
                            </label>

                            <input
                                type="text"
                                value={inboundData.part_number}
                                required
                                onChange={(e) =>
                                    setInboundData({
                                        ...inboundData,
                                        part_number: e.target.value,
                                    })
                                }
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                {t("pininv.qty")}
                            </label>

                            <input
                                type="number"
                                value={inboundData.quantity}
                                required
                                onChange={(e) =>
                                    setInboundData({
                                        ...inboundData,
                                        quantity: e.target.value,
                                    })
                                }
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                {t("pininv.inDate")}
                            </label>

                            <input
                                type="date"
                                value={inboundData.inbound_date}
                                required
                                onChange={(e) =>
                                    setInboundData({
                                        ...inboundData,
                                        inbound_date: e.target.value,
                                    })
                                }
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="self-end h-[50px] rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            {t("pininv.inbound")}
                        </button>
                    </div>
                </form>
                <form
                    onSubmit={handleUsage}
                    className="bg-white w-full rounded-2xl"
                >
                    <h4 className="text-center font-bold pt-4">
                        {t("pininv.useparts")}
                    </h4>

                    <div className="p-4 grid gap-5 md:grid-cols-4">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                {t("pininv.prodnum")}
                            </label>

                            <input
                                type="text"
                                value={useData.part_number}
                                required
                                onChange={(e) =>
                                    setUseData({
                                        ...useData,
                                        part_number: e.target.value,
                                    })
                                }
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                {t("pininv.qty")}
                            </label>

                            <input
                                type="number"
                                value={useData.quantity}
                                required
                                onChange={(e) =>
                                    setUseData({
                                        ...useData,
                                        quantity: e.target.value,
                                    })
                                }
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                {t("pininv.useDate")}
                            </label>

                            <input
                                type="date"
                                value={useData.usage_date}
                                required
                                onChange={(e) =>
                                    setUseData({
                                        ...useData,
                                        usage_date: e.target.value,
                                    })
                                }
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="self-end h-[50px] rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            {t("pininv.use")}
                        </button>
                    </div>
                </form>
            </div>
            <div className="flex items-center justify-end gap-3">
                <label className="text-sm font-semibold text-slate-700">
                    {t("pininv.year")}
                </label>

                <select
                    value={selectedYear}
                    onChange={(e) =>
                        setSelectedYear(Number(e.target.value))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 outline-none focus:border-blue-500"
                >
                    {years.map((year) => (
                        <option
                            key={year}
                            value={year}
                        >
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            <div className="overflow-auto rounded-2xl max-h-[525px] bg-white shadow-sm ring-1 ring-slate-200">
                <table className="min-w-full border-separate border-spacing-0 text-xs sm:text-sm">
                    <thead className="sticky top-0 bg-white z-20">
                        <tr>
                            <th
                                rowSpan={2}
                                className="sticky left-0 z-30 min-w-[180px] bg-slate-800 px-4 py-3 text-left font-semibold text-white border border-slate-200"
                            >
                                {t("pininv.prodnum")}
                            </th>
                            <th colSpan={12} className="bg-emerald-100 px-2 py-2 text-center font-bold text-emerald-900 border border-slate-200">
                                {selectedYear} {t("pininv.inbound")}
                            </th>
                            <th rowSpan={2} className="min-w-[120px] bg-emerald-200 px-2 py-2 text-center font-bold text-emerald-900 border border-slate-200">
                                {t("pininv.totalIn")}
                            </th>
                            <th rowSpan={2} className="min-w-[110px] bg-yellow-100 px-2 py-2 text-center font-bold text-yellow-900 border border-slate-200">
                                {t("pininv.avgUsage")}
                            </th>
                            <th colSpan={12} className="bg-orange-100 px-2 py-2 text-center font-bold text-orange-900 border border-slate-200">
                                {selectedYear} {t("pininv.usage")}
                            </th>
                            <th rowSpan={2} className="min-w-[120px] bg-orange-200 px-2 py-2 text-center font-bold text-orange-900 border border-slate-200">
                                {t("pininv.totalUse")}
                            </th>
                        </tr>
                        <tr>
                            {months.map((month) => (
                                <th key={`in-${month}`} className="px-1 py-1 text-center font-semibold text-slate-700 border border-slate-200 bg-emerald-50">
                                    {month}
                                </th>
                            ))}
                            {months.map((month) => (
                                <th key={`use-${month}`} className="px-1 py-1 text-center font-semibold text-slate-700 border border-slate-200 bg-orange-50">
                                    {month}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {inventoryData.map((inventory, row) => (
                            <tr key={row} className="hover:bg-slate-50">
                                <td className="sticky left-0 z-10 bg-white px-4 py-3 font-medium text-slate-800 border border-slate-100">
                                    {inventory.part_number}
                                </td>
                                {months.map((month, i) => {
                                    const summary = summaryData.find(
                                        (s) => s.part_number === inventory.part_number
                                    );

                                    return (
                                        <td
                                            key={`in-${row}-${i}`}
                                            className="border border-slate-100 px-2 py-2 text-center text-slate-600"
                                        >
                                            {summary?.[month] || ""}
                                        </td>
                                    );
                                })}

                                <td className="bg-emerald-50 px-4 py-2 text-center font-semibold text-emerald-700 border border-slate-100">
                                    {summaryData.find((s) => s.part_number === inventory.part_number)?.total_inbound || 0}
                                </td>

                                <td className="bg-yellow-50 px-4 py-2 text-center font-semibold text-yellow-700 border border-slate-100">
                                    {usageData.find((s) => s.part_number === inventory.part_number)?.avg_monthly_usage || 0}
                                </td>

                                {months.map((month, i) => {
                                    const summary = usageData.find(
                                        (s) => s.part_number === inventory.part_number
                                    );

                                    return (
                                        <td
                                            key={`in-${row}-${i}`}
                                            className="border border-slate-100 px-2 py-2 text-center text-slate-600"
                                        >
                                            {summary?.[month] || ""}
                                        </td>
                                    );
                                })}

                                <td className="bg-orange-50 px-4 py-2 text-center font-semibold text-orange-700 border border-slate-100">
                                    {usageData.find((s) => s.part_number === inventory.part_number)?.total_usage || 0}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
