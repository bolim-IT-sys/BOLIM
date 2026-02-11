// FOR DOWNLOADING INVENTORY DATA IN EXCEL
import { monthList } from "../../helper/helper";
import type { Part } from "../../services/Part.Service";
import SuccessButton from "../button/SuccessButton";
import { Modal } from "../Modal";
import { useEffect, useState } from "react";
import SecondaryButton from "../button/SecondaryButton";
import InputField from "../InputField";

interface ItemDataProp {
  parts: Part[];
}

export const DownloadPartData = ({ parts }: ItemDataProp) => {
  const [modalShow, setShowModal] = useState(false);

  // GETTING THE DEFAULT START AND END DATE
  const today = new Date();
  // First day of previous month
  const firstDayPrevMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    2
  );
  // Last day of current month
  const lastDayCurrentMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    1
  );
  const [prevDate, setPrevDate] = useState<string>(
    firstDayPrevMonth.toISOString().split("T")[0]
  );
  const [currentDate, setCurrentDate] = useState<string>(
    lastDayCurrentMonth.toISOString().split("T")[0]
  );

  const [previousMonth, setPreviousMonth] = useState<number>(0);
  const [previousYear, setPreviousYear] = useState<number>(0);
  const [latestMonth, setLatestMonth] = useState<number>(0);
  const [latestYear, setLatestYear] = useState<number>(0);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

  useEffect(() => {
    const cDate = new Date(currentDate);
    setLatestYear(cDate.getFullYear());
    setLatestMonth(cDate.getMonth() + 1);
    // console.log(
    //   "Latest month and year: ",
    //   cDate.getMonth() + 1,
    //   " ",
    //   cDate.getFullYear()
    // );
    const pDate = new Date(prevDate);
    setPreviousYear(pDate.getFullYear());
    setPreviousMonth(pDate.getMonth() + 1);
    // console.log(
    //   "Previous month and year: ",
    //   pDate.getMonth() + 1,
    //   " ",
    //   pDate.getFullYear()
    // );
  }, [currentDate, prevDate]);

  const handleExportToExcel = async () => {
    try {
      const res = await fetch(`${API_URL}/export-inventory-to-excel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parts,
          monthList,
          previousMonth,
          previousYear,
          latestMonth,
          latestYear,
        }),
      });

      // Convert backend response to file download
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${monthList[latestMonth - 1]}_${latestYear}_SPARE_PARTS_SUMMARY.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };
  return (
    <>
      <SuccessButton
        text="EXPORT TO EXCEL"
        onClick={() => setShowModal(true)}
      />
      <Modal
        isOpen={modalShow}
        onClose={() => setShowModal(false)}
        title={
          <>
            <div className="flex items-center gap-2">
              <h3 className="">Export Options</h3>
            </div>
          </>
        }
        footer={
          <>
            <SuccessButton
              text={`EXPORT`}
              onClick={() => {
                handleExportToExcel();
                setShowModal(false);
              }}
            />
            <SecondaryButton text="CLOSE" onClick={() => setShowModal(false)} />
          </>
        }
      >
        <div className="mb-1">
          <label
            htmlFor="Previous date"
            className="block font-medium text-gray-700"
          >
            <p>PREVIOUS DATE:</p>
          </label>
          <InputField
            label="Previous date"
            type="date"
            value={prevDate}
            required={true}
            onChange={(value: string) => setPrevDate(value)}
            autoComplete={`Previous date`}
          />
        </div>
        <div className="mb-1">
          <label
            htmlFor="Latest date"
            className="block font-medium text-gray-700"
          >
            <p>CURRENT DATE:</p>
          </label>
          <InputField
            label="Latest date"
            type="date"
            value={currentDate}
            required={true}
            onChange={(value: string) => setCurrentDate(value)}
            autoComplete={`Latest date`}
          />
        </div>
      </Modal>
    </>
  );
};
