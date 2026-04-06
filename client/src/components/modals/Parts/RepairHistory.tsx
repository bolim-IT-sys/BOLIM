import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

export type Repair = {
    id: number;
    serial_number: string,
    reported_date: string,
    issue_description: string,
    status: string,
    started_date: string,
    completed_date: string,
    before_picture: string,
    after_picture: string,
    personnel: string,
    createdAt: string;
};

type Props = {
    serialNumber: string;
    repairs: Repair[];
};

const RepairHistory = ({ serialNumber }: Props) => {
    const [repairs, setRepairs] = useState<Repair[]>([]);
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
    const API_BASE = import.meta.env.VITE_API_URL?.replace("/api", "");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState<Repair | null>(null)
    const [file, setFile] = useState<File | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (!serialNumber) return;

        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `${API_URL}/repairs/${serialNumber}`
                );
                setRepairs(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    },);
    {/*dependency array => [serialNumber]*/ }

    const formatLongDate = (
        dateInput?: string | Date | null
    ): string => {
        if (!dateInput) return "N/A";

        const date = new Date(dateInput);
        if (isNaN(date.getTime())) return "N/A";

        const datePart = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

        const timePart = date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });

        return `${datePart} • ${timePart}`;
    };

    const handleEdit = (repair: Repair) => {
        setEditingId(repair.id);
        setEditData(repair);
    };

    const handleUpdate = async () => {
        try {
            if (!editData) return;

            if (editData.completed_date && !file) {
                alert("After picture is required when repair is completed.");
                return;
            }

            const formData = new FormData();

            formData.append("status", editData.status);
            if (editData.started_date) {
                formData.append("started_date", editData.started_date);
            }

            if (editData.completed_date) {
                formData.append("completed_date", editData.completed_date);
            }
            //formData.append("started_date", editData.started_date || "");
            //formData.append("completed_date", editData.completed_date || "");

            if (file) {
                formData.append("after_picture", file);
            }

            await axios.put(`${API_URL}/repairs/${editingId}`, formData);

            setRepairs((prev) =>
                prev
                    .map((r) => (r.id === editData.id ? editData : r))
                    .sort((a, b) =>
                        new Date(b.reported_date).getTime() -
                        new Date(a.reported_date).getTime()
                    )
            );

            alert("Repair updated!");
            setEditingId(null);
        } catch (err) {
            console.error(err);
        }
    };

    const getNowLocal = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset();
        return new Date(now.getTime() - offset * 60000)
            .toISOString()
            .slice(0, 16);
    };

    const formatForInput = (dateStr?: string) => {
        if (!dateStr) return "";

        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "";

        const offset = date.getTimezoneOffset();
        const local = new Date(date.getTime() - offset * 60000);

        return local.toISOString().slice(0, 16); // ✅ "YYYY-MM-DDTHH:mm"
    };
    {/* contents of repairs.map
        <div key={r.id} className="text-start flex justify-around">
                                <div className="flex flex-col">
                                    <span>Serial Number: {r.serial_number}</span>
                                    <span>Reported Date: {formatLongDate(String(r.reported_date))}</span>
                                    <span>Issue Description: {r.issue_description}</span>
                                    <span>Repair Status: {r.status}</span>
                                    <span>Started Date: {formatLongDate(String(r.started_date))}</span>
                                    <span>Completed Date: {formatLongDate(String(r.completed_date))}</span>
                                    <span>Personnel: {r.personnel}</span>
                                </div>
                                <div className="flex">
                                    <span>Before:
                                        <img
                                            src={
                                                r.before_picture
                                                    ? `${API_BASE}/${r.before_picture.replace(/^\/+/, "")}`
                                                    : "/placeholder.png"
                                            }
                                            alt="Before"
                                            className="w-40 h-40 object-cover rounded border"
                                            onClick={() => setSelectedImage(`${API_BASE}${r.before_picture}`)}
                                        />
                                    </span>
                                    <span>After:
                                        <img
                                            src={
                                                r.after_picture
                                                    ? `${API_BASE}/${r.after_picture.replace(/^\/+/, "")}`
                                                    : "/placeholder.png"
                                            }
                                            alt="Before"
                                            className="w-40 h-40 object-cover rounded border"
                                            onClick={() => setSelectedImage(`${API_BASE}${r.after_picture}`)}
                                        />
                                    </span>
                                </div>
                            </div>
    */}

    return (
        <div className="mb-2">
            <h4 className="font-bold">{t("rh.RH")}</h4>
            <div className="overflow-y-auto">
                {repairs.length === 0 ? (
                    <p className="text-gray-500">{t("rh.nrh")}</p>
                ) : (
                    repairs.map(r => {
                        //(console.log("Image URL:", `${API_BASE}/${r.before_picture}`)),
                        const isEditable = r.status === "pending" || r.status === "in_progress";
                        return (
                            <div key={r.id} className={`rounded gap-4 border-s-2 p-3 mt-1 ${r.status === "pending" ?
                                "bg-red-100 text-red-800 border-red-500" : r.status === "in_progress" ?
                                    "bg-blue-100 text-blue-800 border-blue-500" : "bg-green-100 text-green-800 border-green-500"
                                }`}>
                                <div className="text-start">
                                    {editingId !== r.id ? (
                                        <>
                                            <div className="flex justify-around">
                                                <div className="flex flex-col">
                                                    <span>{t("rh.SN")} {r.serial_number}</span>
                                                    <span>{t("rh.RD")} {formatLongDate(String(r.reported_date))}</span>
                                                    <span>{t("rh.ID")} {r.issue_description}</span>
                                                    <span>{t("rh.RS")} {r.status}</span>
                                                    <span>{t("rh.SD")} {formatLongDate(String(r.started_date))}</span>
                                                    <span>{t("rh.CD")} {formatLongDate(String(r.completed_date))}</span>
                                                    <span>{t("rh.Pers")} {r.personnel}</span>
                                                </div>
                                                <div className="flex">
                                                    <span>{t("rh.Bef")}
                                                        <img
                                                            src={
                                                                r.before_picture
                                                                    ? `${API_BASE}/${r.before_picture.replace(/^\/+/, "")}`
                                                                    : "/placeholder.png"
                                                            }
                                                            alt="Before"
                                                            className="w-40 h-40 object-cover rounded border"
                                                            onClick={() => setSelectedImage(`${API_BASE}${r.before_picture}`)}
                                                        />
                                                    </span>
                                                    <span>{t("rh.Aft")}
                                                        <img
                                                            src={
                                                                r.after_picture
                                                                    ? `${API_BASE}/${r.after_picture.replace(/^\/+/, "")}`
                                                                    : "/placeholder.png"
                                                            }
                                                            alt="Before"
                                                            className="w-40 h-40 object-cover rounded border"
                                                            onClick={() => setSelectedImage(`${API_BASE}${r.after_picture}`)}
                                                        />
                                                    </span>
                                                </div>
                                            </div>
                                            {isEditable && (
                                                <button
                                                    className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
                                                    onClick={() => handleEdit(r)}
                                                >
                                                    {t("rh.Upt")}
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <div>
                                            <table className="w-full">
                                                <thead>
                                                    <tr>
                                                        <th>{t("rh.Sta")}</th>
                                                        <th>{t("rh.UAI")}</th>
                                                        <th>{t("rh.DS")}</th>
                                                        <th>{t("rh.DC")}</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-center">
                                                    <tr>
                                                        <td>
                                                            <select
                                                                value={editData?.status || ""}
                                                                onChange={(e) => {
                                                                    const newStatus = e.target.value;

                                                                    setEditData((prev) => {
                                                                        if (!prev) return prev;

                                                                        const updated: Repair = {
                                                                            ...prev,
                                                                            status: newStatus,
                                                                        };

                                                                        // 🔥 AUTO SET STARTED DATE
                                                                        if (newStatus === "in_progress" && !prev.started_date) {
                                                                            updated.started_date = getNowLocal();
                                                                        }

                                                                        // 🔥 AUTO SET COMPLETED DATE
                                                                        if (newStatus === "completed" && !prev.completed_date) {
                                                                            updated.completed_date = getNowLocal();
                                                                        }

                                                                        return updated;
                                                                    });
                                                                }}
                                                                className="border p-2 mb-2 w-fit"
                                                            >
                                                                <option value="pending">Pending</option>
                                                                <option value="in_progress">In Progress</option>
                                                                <option value="completed">Completed</option>
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="file"
                                                                onChange={(e) =>
                                                                    setFile(e.target.files ? e.target.files[0] : null)
                                                                }
                                                                className="mb-2"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="datetime-local"
                                                                value={formatForInput(editData?.started_date || "")}
                                                                disabled
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="datetime-local"
                                                                value={formatForInput(editData?.completed_date || "")}
                                                                disabled
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div className="flex gap-2">
                                                <button
                                                    className="bg-green-500 text-white px-3 py-1 rounded"
                                                    onClick={handleUpdate}
                                                >
                                                    Save
                                                </button>

                                                <button
                                                    className="bg-gray-400 text-white px-3 py-1 rounded"
                                                    onClick={() => setEditingId(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
                    onClick={() => setSelectedImage(null)}
                >
                    <img
                        src={selectedImage}
                        className="max-w-[90%] max-h-[90%] rounded shadow-lg transition-transform scale-100"
                    />
                </div>
            )}
        </div>
    )
}

export default RepairHistory