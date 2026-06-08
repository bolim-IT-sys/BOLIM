import { useCallback, useEffect, useState, useMemo, type Dispatch, type SetStateAction } from "react";
import { type Part } from "../services/Part.Service";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { User } from "../services/User.Service";
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
    unit_price: number
    remarks: string;
    app_holder: string;
    category: string;

    safety_stock: number;
    securement_rate: number;
    excess_shortage: number;
    regular_order_qty: number;
    avg_monthly_usage: number;
};
type Category = {
    id: number;
    name: string;
};
type Column = {
    key: string;
    label: string;
    align?: "left" | "right" | "center";
};

export default function InventoryDashboard() {
    const { user } = useOutletContext<ContextType>();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
    const { t } = useTranslation();
    const [inventoryData, setInventoryData] = useState<SpareData[]>([]);
    const [category, setCategory] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(1);
    const [openAddModal, setOpenAddModal] = useState(false);
    const filteredInventory = useMemo(() => {
        return selectedCategory === null
            ? inventoryData
            : inventoryData.filter((item) => item.category_id === selectedCategory);
    }, [inventoryData, selectedCategory]);
    const [formData, setFormData] = useState({
        category_id: "",
        part_number: "",
        product_name: "",
        specification: "",
        maker: "",
        num: "",
        unit_price: "",
        remarks: "",
        app_holder: "",
        category: "",
    });
    const [searchTerm, setSearchTerm] = useState("");
    const searchedInventory = useMemo(() => {
        const search = searchTerm.toLowerCase();
        return filteredInventory.filter((item) => {
            return (
                item.part_number?.toLowerCase().includes(search) ||
                item.product_name?.toLowerCase().includes(search) ||
                item.specification?.toLowerCase().includes(search) ||
                item.maker?.toLowerCase().includes(search) ||
                item.app_holder?.toLowerCase().includes(search) ||
                item.category?.toLowerCase().includes(search)
            );
        });
    }, [filteredInventory, searchTerm]);

    const isProductCategory = selectedCategory === 1 || selectedCategory === 2;
    const columns: Column[] = isProductCategory
        ? [
            { key: "no", label: "No." },
            { key: "part_number", label: t("pininv.prodnum") },
            { key: "product_name", label: t("pininv.prodname") },
            { key: "specification", label: t("pininv.specs") },
            { key: "maker", label: t("pininv.maker") },
            { key: "stock", label: t("pininv.stock"), align: "right" },
            { key: "safety_stock", label: t("pininv.safesto"), align: "right" },
            { key: "securement_rate", label: t("pininv.sr"), align: "right" },
            { key: "excess_shortage", label: t("pininv.esq"), align: "right" },
            { key: "regular_order_qty", label: t("pininv.roq"), align: "right" },
        ]
        : [
            { key: "no", label: "No." },
            { key: "part_number", label: t("pininv.prodnum") },
            { key: "app_holder", label: t("pininv.appHol") },
            { key: "specification", label: t("pininv.specs") },
            { key: "category", label: t("pininv.category") },
            { key: "stock", label: t("pininv.stock"), align: "right" },
        ];
    const renderCell = (item: SpareData, column: Column, index: number) => {
        if (column.key === "no") {
            return index + 1;
        }

        if (column.key === "stock") {
            return Number(item.stock || 0).toLocaleString();
        }

        // This shi is for the percentage eg. 0.6 -> 60%; 1.25 -> 125%;
        if (column.key === "securement_rate") {
            return `${(Number(item.securement_rate) * 100).toFixed(0)}%`;
        }

        if (column.key === "excess_shortage") {
            const value = Number(item.excess_shortage || 0);

            return (
                <span
                    className={
                        value < 0
                            ? "font-semibold text-red-600"
                            : value > 0
                                ? "font-semibold text-green-600"
                                : "text-slate-600"
                    }
                >
                    {value.toLocaleString()}
                </span>
            );
        }

        const fieldKey = column.key as keyof SpareData;
        return item[fieldKey];
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {
            await axios.post(
                `${API_URL}/spare/create`,
                formData
            );

            setOpenAddModal(false);

            fetchMovements();

            setFormData({
                category_id: "",
                part_number: "",
                product_name: "",
                specification: "",
                maker: "",
                num: "",
                unit_price: "",
                remarks: "",
                app_holder: "",
                category: "",
            });
            Swal.fire({
                icon: "success",
                title: `Saved!`,
                timer: 3000,
                showConfirmButton: true,
            });

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: `Error saving!`,
                timer: 3000,
                showConfirmButton: false,
            });
        }
    };

    const fetchMovements = useCallback(async () => {
        try {
            const res = await axios.get(`${API_URL}/spare/view`);
            const ress = await axios.get(`${API_URL}/spare/category`);
            setInventoryData(res.data);
            setCategory(ress.data)
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }, [API_URL])
    useEffect(() => {
        fetchMovements();
    }, [fetchMovements]);

    useEffect(() => {
        if (user) {
            if (!user?.pininv) {
                alert("You're not authorized to access this page.");
                navigate("/dashboard");
            }
        }
    }, [navigate, user]);

    return (
        <div className="h-full bg-slate-100 overflow-x-hidden p-4 overflow-y-scroll">
            <div className="w-full space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">
                            {t("pininv.spi")}
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setOpenAddModal(true)}
                            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700"
                        >
                            + {t("pininv.addPart")}
                        </button>

                        {/*<button className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                            Export Report
                        </button>*/}
                    </div>
                </div>

                {/* Tabs */}
                <div className="w-full overflow-x-auto rounded-3xl bg-white p-3 shadow-sm">
                    <div className="flex min-w-max gap-3">
                        {category.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${selectedCategory === category.id
                                    ? 'bg-blue-600 text-white shadow'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                {category.name}
                                <span className="ml-2 rounded-full bg-white/20 px-2 py-1 text-xs">
                                    {
                                        inventoryData.filter(
                                            item =>
                                                item.category_id === category.id
                                        ).length
                                    }
                                </span>
                            </button>
                        ))}
                        <input
                            type="text"
                            placeholder="Search part number or product..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Inventory Table */}
                <div className="w-full overflow-hidden rounded-3xl bg-white shadow-sm">
                    <div className="max-h-[650px] overflow-auto rounded-3xl bg-white shadow-sm">
                        <table className="min-w-full table-fixed border-collapse text-sm">
                            <thead className="sticky top-0 z-20 bg-slate-800 text-white shadow">
                                <tr>
                                    {columns.map((column) => (
                                        <th
                                            key={column.key}
                                            className={`whitespace-nowrap px-4 py-4 font-semibold ${column.align === "right"
                                                ? "text-right"
                                                : column.align === "center"
                                                    ? "text-center"
                                                    : "text-left"
                                                }`}
                                        >
                                            {column.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {searchedInventory?.length > 0 ? (
                                    searchedInventory.map((item, index) => {
                                        return (
                                            <tr
                                                key={item.id}
                                                className="border-b border-slate-100 hover:bg-slate-50"
                                            >
                                                {columns.map((column) => (
                                                    <td
                                                        key={column.key}
                                                        className={`whitespace-nowrap px-4 py-4 text-slate-600 ${column.align === "right"
                                                            ? "text-right"
                                                            : ""
                                                            }`}
                                                    >
                                                        {renderCell(item, column, index)}
                                                    </td>
                                                ))}
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={columns.length + 1}
                                            className="py-10 text-center text-slate-400"
                                        >
                                            No inventory data found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {openAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">

                        {/* Header */}

                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-800">
                                {t("pininv.asp")}
                            </h2>

                            <button
                                onClick={() =>
                                    setOpenAddModal(false)
                                }
                                className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                            >
                                {t("pininv.close")}
                            </button>
                        </div>

                        {/* Form */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            <div className="grid gap-5 md:grid-cols-2">

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        No.
                                    </label>

                                    <input
                                        type="text"
                                        name="num"
                                        value={formData.num}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        {t("pininv.prodnum")}
                                    </label>

                                    <input
                                        type="text"
                                        name="part_number"
                                        value={formData.part_number}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        {t("pininv.prodname")}
                                    </label>

                                    <input
                                        type="text"
                                        name="product_name"
                                        value={formData.product_name}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                                    //required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        {t("pininv.maker")}
                                    </label>

                                    <input
                                        type="text"
                                        name="maker"
                                        value={formData.maker}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        {t("pininv.appHol")}
                                    </label>

                                    <input
                                        type="text"
                                        name="app_holder"
                                        value={formData.app_holder}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        {t("pininv.category")}
                                    </label>

                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        {t("pininv.unitprice")}
                                    </label>

                                    <input
                                        type="number"
                                        name="unit_price"
                                        value={formData.unit_price}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        {t("pininv.tab")}
                                    </label>

                                    <select
                                        name="category_id"
                                        value={formData.category_id}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                                    >
                                        <option value="">
                                            {t("pininv.select")}
                                        </option>

                                        {category.map(category => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    {t("pininv.specs")}
                                </label>

                                <input
                                    type='text'
                                    name="specification"
                                    value={formData.specification}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpenAddModal(false)
                                    }
                                    className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-100"
                                >
                                    {t("pininv.cancel")}
                                </button>

                                <button
                                    type="submit"
                                    className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                                >
                                    {t("pininv.savepart")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
