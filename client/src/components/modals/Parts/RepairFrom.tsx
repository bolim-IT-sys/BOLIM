import { useState, useEffect } from "react";
import axios from "axios";

type RepairFormProps = {
    serialNumber: string;
    onClose: () => void;
};
type RepairFormData = {
    serial_number: string;
    reported_date: string;
    issue_description: string;
    status: string;
    started_date: string;
    completed_date: string;
    personnel: string;
    before_picture: File | null;
    after_picture: File | null;
};

const RepairForm = ({ serialNumber, onClose }: RepairFormProps) => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
    const [form, setForm] = useState<RepairFormData>({
        serial_number: serialNumber,
        reported_date: "",
        issue_description: "",
        status: "pending",
        started_date: "",
        completed_date: "",
        personnel: "",
        before_picture: null,
        after_picture: null,
    });
    const [preview, setPreview] = useState({
        before_picture: null as string | null,
        after_picture: null as string | null,
    });

    useEffect(() => {
        return () => {
            if (preview.before_picture)
                URL.revokeObjectURL(preview.before_picture);
            if (preview.after_picture)
                URL.revokeObjectURL(preview.after_picture);
        };
    }, [preview]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const name = e.target.name as keyof RepairFormData;

        if (e.target instanceof HTMLInputElement && e.target.files) {
            const file = e.target.files[0];

            setForm((prev) => ({
                ...prev,
                [name]: file,
            }));

            const imageUrl = URL.createObjectURL(file);

            setPreview((prev) => ({
                ...prev,
                [name]: imageUrl,
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                [name]: e.target.value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();

        for (const key in form) {
            const typedKey = key as keyof RepairFormData;
            const value = form[typedKey];

            if (!value) continue;

            formData.append(typedKey, value as string | Blob);
        }
        try {
            await axios.post(`${API_URL}/repairs`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            alert("Repair saved!");
            onClose();
        } catch (error) {
            console.error(error);
            alert("Error saving repair");
        }
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col items-center p-4 gap-2">
            <div className="w-full flex gap-4 justify-between">
                <div className="relative flex-1 flex flex-col gap-2">
                    <label htmlFor="Reported Date" >Serial Number: </label>
                    <input
                        name="serial_number"
                        placeholder="Serial Number"
                        value={form.serial_number}
                        readOnly
                        onChange={handleChange}
                        className="p-2 w-full border border-gray-400 rounded-xl outline-none" />
                    <label htmlFor="Reported Date" >Reported Date: </label>
                    <input type="datetime-local" name="reported_date" onChange={handleChange} className="p-2 w-full border border-gray-400 rounded-xl outline-none"
                        value={form.reported_date}
                        required />
                    <textarea
                        name="issue_description"
                        placeholder="Issue Description"
                        onChange={handleChange}
                        required
                        className="p-2 w-full border border-gray-400 outline-none"
                    />
                    <label htmlFor="Repair Status">Select Repair Status: </label>
                    <select name="status" onChange={handleChange} className="p-2 w-full border border-gray-400 rounded-xl outline-none">
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <label htmlFor="Date Started">Date Started: </label>
                    <input type="datetime-local" name="started_date" onChange={handleChange} className="p-2 w-full border border-gray-400 rounded-xl outline-none" />
                </div>
                <div className="relative flex-1 flex flex-col gap-2">
                    <label htmlFor="Date Completed">Date Completed: </label>
                    <input type="datetime-local" name="completed_date" onChange={handleChange} className="p-2 w-full border border-gray-400 rounded-xl outline-none" />
                    <input name="personnel" placeholder="Personnel" onChange={handleChange} className="p-2 w-full border border-gray-400 rounded-xl outline-none" required />
                    <label htmlFor="Before Picture">Before Picture: </label>
                    <input type="file" name="before_picture" onChange={handleChange} className="p-2 w-full border border-gray-400 rounded-xl outline-none" required />
                    {preview.before_picture && (
                        <img
                            src={preview.before_picture}
                            className="w-40 h-40 object-cover rounded border"
                        />
                    )}
                    <label htmlFor="After Picture">After Picture: </label>
                    <input type="file" name="after_picture" onChange={handleChange} className="p-2 w-full border border-gray-400 rounded-xl outline-none" />
                    {preview.after_picture && (
                        <img
                            src={preview.after_picture}
                            className="w-40 h-40 object-cover rounded border"
                        />
                    )}
                </div>
            </div>
            <button type="submit" className="border border-orange-400 hover:bg-orange-400 p-2 rounded w-1/2 transition">Save Repair</button>
        </form>
    );
};

export default RepairForm;