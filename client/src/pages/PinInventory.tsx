import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { type Part } from "../services/Part.Service";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { User } from "../services/User.Service";
import axios from "axios";
//import { useTranslation } from "react-i18next";
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
    const [inventoryData, setInventoryData] = useState<SpareData[]>([]);
    const [category, setCategory] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [openAddModal, setOpenAddModal] = useState(false);
    const filteredInventory = selectedCategory === null ? inventoryData : inventoryData.filter(item => item.category_id === selectedCategory);
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
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<SpareData>>({});
    const [searchTerm, setSearchTerm] = useState("");
    const searchedInventory = filteredInventory.filter((item) => {
        const search = searchTerm.toLowerCase();
        return (
            item.part_number?.toLowerCase().includes(search) ||
            item.product_name?.toLowerCase().includes(search) ||
            item.specification?.toLowerCase().includes(search) ||
            item.maker?.toLowerCase().includes(search) ||
            item.app_holder?.toLowerCase().includes(search) ||
            item.category?.toLowerCase().includes(search)
        );
    });

    const isProductCategory = selectedCategory === 1 || selectedCategory === 2;
    const columns: Column[] = isProductCategory
        ? [
            { key: "no", label: "No." },
            { key: "part_number", label: "Part Number [품번]" },
            { key: "product_name", label: "Product [품명]" },
            { key: "specification", label: "spec 규격(설명)" },
            { key: "maker", label: "Maker" },
            { key: "stock", label: "Stock", align: "right" },
            { key: "unit_price", label: "Unit Price", align: "right" },
        ]
        : [
            { key: "no", label: "No." },
            { key: "part_number", label: "Part Number [품번]" },
            { key: "app_holder", label: "Applicable holder" },
            { key: "specification", label: "spec 규격(설명)" },
            { key: "category", label: "Category" },
            { key: "stock", label: "Stock", align: "right" },
            { key: "unit_price", label: "Unit Price", align: "right" },
        ];
    const inputClass = "w-full rounded-lg border border-slate-300 outline-none focus:border-blue-500 px-3 py-1";
    const renderCell = (item: SpareData, column: Column, index: number) => {
        const isEditing = editingId === item.id;

        if (column.key === "no") {
            return index + 1;
        }

        if (column.key === "unit_price") {
            return isEditing ? (
                <input
                    type="text"
                    name="unit_price"
                    value={editFormData.unit_price}
                    onChange={handleEditChange}
                    className={`${inputClass} text-right`}
                />
            ) : (
                `₩${Number(item.unit_price || 0).toLocaleString()}`
            );
        }

        if (column.key === "stock") {
            return isEditing ? (
                <input
                    type="text"
                    name="stock"
                    value={editFormData.stock || ""}
                    onChange={handleEditChange}
                    className={`${inputClass} text-right`}
                />
            ) : (
                item.stock
            );
        }

        const fieldKey = column.key as keyof SpareData;
        return isEditing ? (
            <input
                type="text"
                name={column.key}
                value={editFormData[fieldKey] || ""}
                onChange={handleEditChange}
                className={inputClass}
            />
        ) : (
            item[fieldKey]
        );
    };
    {/*const categories = [
        { id: 1, name: "Pin Inventory" },
        { id: 2, name: "TAB Plates" },
        { id: 3, name: "Inner Seal" },
        { id: 4, name: "Machine Spare" },
    ];
    const inventoryData = [
        {
            partNumber: 'S105A-0.7',
            product: 'PIN',
            specs: '통전핀(이중단차핀)',
            maker: '신안오토테크',
            stock: 20,
            avgUsage: 1,
            coverage: '200%',
            reorder: 10,
            price: '1,600',
            amount: '16,000',
            status: 'Normal',
        },
        {
            partNumber: 'S100A5-045-5.0',
            product: 'PIN',
            maker: 'SHINAN',
            stock: 46,
            avgUsage: 17,
            coverage: '115%',
            reorder: 6,
            price: '1,400',
            amount: '8,400',
            status: 'Low Stock',
        },
        {
            partNumber: 'S105A5-05-2.0',
            product: 'PIN',
            maker: 'SHINAN',
            stock: 18,
            avgUsage: 6,
            coverage: '90%',
            reorder: 2,
            price: '2,000',
            amount: '4,000',
            status: 'Critical',
        },
    ];

    const tabs = [
        'Pin Inventory',
        'TAB Plates',
        'Inner Seal',
        'Machine Spare',
    ];*/}

    const handleEdit = (item: SpareData) => {

        setEditingId(item.id);

        setEditFormData(item);
    };

    const handleEditChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSaveEdit = async (
        id: number
    ) => {

        try {

            await axios.put(
                `${API_URL}/spare/update/${id}`,
                editFormData
            );

            fetchMovements();

            setEditingId(null);

        } catch (error) {

            console.error(error);
        }
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

    const totalInventoryValue = inventoryData.reduce(
        (total, item) =>
            total +
            (Number(item.stock || 0) *
                Number(item.unit_price || 0)),
        0
    );
    const totalParts = inventoryData.length;

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
                            Spare Parts Inventory
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {/*Inbound, usage monitoring, reorder planning, and stock management.*/}
                            Price and stock management.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setOpenAddModal(true)}
                            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700"
                        >
                            + Add Part
                        </button>

                        {/*<button className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                            Export Report
                        </button>*/}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-2 gap-5">{/* change this back to 2xl:grid-cols-4 */}
                    <div className="rounded-3xl bg-white p-6 shadow-sm text-center">{/* remove the text-center if needed */}
                        <p className="text-sm font-medium text-slate-500">Total Parts</p>
                        <h2 className="mt-3 text-4xl font-bold text-slate-800">{totalParts}</h2>
                        {/*<p className="mt-2 text-sm text-emerald-600">+12 this month</p>*/}
                    </div>

                    {/*<div className="rounded-3xl bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">Low Stock</p>
                        <h2 className="mt-3 text-4xl font-bold text-amber-500">24</h2>
                        <p className="mt-2 text-sm text-slate-500">Requires monitoring</p>
                    </div>

                    <div className="rounded-3xl bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">Critical Stock</p>
                        <h2 className="mt-3 text-4xl font-bold text-red-500">8</h2>
                        <p className="mt-2 text-sm text-slate-500">Immediate reorder needed</p>
                    </div>*/}

                    <div className="rounded-3xl bg-white p-6 shadow-sm text-center">{/* remove the text-center if needed */}
                        <p className="text-sm font-medium text-slate-500">Inventory Value</p>
                        <h2 className="mt-3 text-4xl font-bold text-slate-800">₩{totalInventoryValue.toLocaleString()}</h2>
                        <p className="mt-2 text-sm text-slate-500">Current stock value</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="w-full overflow-x-auto rounded-3xl bg-white p-3 shadow-sm">
                    <div className="flex min-w-max gap-3">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${selectedCategory === null
                                ? "bg-blue-600 text-white shadow"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                        >
                            All
                        </button>
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

                                    <th className="px-4 py-4 text-center font-semibold">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {searchedInventory?.length > 0 ? (
                                    searchedInventory.map((item, index) => {
                                        const isEditing = editingId === item.id;

                                        return (
                                            <tr
                                                key={item.id}
                                                className={`border-b border-slate-100 ${isEditing
                                                    ? "bg-blue-50"
                                                    : "hover:bg-slate-50"
                                                    }`}
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

                                                <td className="whitespace-nowrap px-4 py-4 text-center">
                                                    {isEditing ? (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleSaveEdit(item.id)
                                                                }
                                                                className="rounded-xl bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-200"
                                                            >
                                                                Save
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    setEditingId(null)
                                                                }
                                                                className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center gap-2">
                                                            {/*<button className="rounded-xl bg-blue-100 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-200">
                                                                View
                                                            </button>*/}

                                                            <button
                                                                onClick={() => handleEdit(item)}
                                                                className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                                                            >
                                                                Edit
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
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

                {/* Bottom Section */}

            </div>
            {openAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">

                        {/* Header */}

                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-800">
                                Add Spare Part
                            </h2>

                            <button
                                onClick={() =>
                                    setOpenAddModal(false)
                                }
                                className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                            >
                                Close
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
                                        Part Number
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
                                        Product Name
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
                                        Maker
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
                                        Application Holder
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
                                        Category
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
                                        Unit Price
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
                                        Category Tab
                                    </label>

                                    <select
                                        name="category_id"
                                        value={formData.category_id}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                                    >
                                        <option value="">
                                            Select Category
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
                                    Specification
                                </label>

                                <input
                                    type='text'
                                    name="specification"
                                    value={formData.specification}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Remarks
                                </label>

                                <textarea
                                    name="remarks"
                                    value={formData.remarks}
                                    onChange={handleChange}
                                    rows={3}
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
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                                >
                                    Save Part
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
