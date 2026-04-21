// FOR MATERIAL CONTROL MANAGEMENT PAGE
import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { type Part } from "../../services/Part.Service";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { User } from "../../services/User.Service";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule, type CellValueChangedEvent, type ColDef, type ColGroupDef } from "ag-grid-community";
import debounce from "lodash.debounce";
import TimeCellEditor from "./TimePicker";
import { useTranslation } from "react-i18next";


ModuleRegistry.registerModules([AllCommunityModule]);

interface ContextType {
  user: User;
  materials: Part[];
  setMaterials: Dispatch<SetStateAction<Part[]>>;
  fetchAllParts: () => void;
  //isFetching: boolean;
}

export default function MaterialControl() {
  const [rowData, setRowData] = useState<Row[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>();
  const { t } = useTranslation();

  const columnDefs: (ColDef<Row> | ColGroupDef<Row>)[] = [
    { headerName: t("mainRec.date"), field: "date", headerClass: "bg-[#FCE4D6]" },
    { headerName: t("mainRec.formNumber"), field: "formNumber", headerClass: "bg-[#FCE4D6]" },
    {
      headerName: t("mainRec.line"), field: "line", headerClass: "bg-[#FCE4D6]", cellEditor: "agSelectCellEditor", cellEditorParams: {
        values: ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9", "L10", "L11", "L12", "L13", "L14", "L15", "L16", "L17", "L18", "L19", "ABAG"]
      }
    },
    {
      headerName: t("mainRec.process"), field: "process", headerClass: "bg-[#FCE4D6]", cellEditor: "agSelectCellEditor", cellEditorParams: {
        values: ["CIRCUIT", "DIMENSION", "PRODUCT INPECTION", "GROMMET", "VISION", "TORQUE", "ASSEMBLY BOARD", "PCB BLOCK", "FUSE AND RELAY", "WRAP UP", "PACKING", "SUB", "DIM/CIR/WRAP/PROD"]
      }
    },
    {
      headerName: t("mainRec.code"), field: "code", headerClass: "bg-[#FCE4D6]", cellEditor: "agSelectCellEditor", cellEditorParams: {
        values: ["A", "B", "C", "D", "E", "F"]
      }
    },
    { headerName: t("mainRec.phenomenon"), field: "phenomenon", headerClass: "bg-[#D9E1F2]", width: 250 },
    { headerName: t("mainRec.detail"), field: "detail", headerClass: "bg-[#D9E1F2]", width: 300 },
    { headerName: t("mainRec.material"), field: "material", headerClass: "bg-[#D9E1F2]", },
    { headerName: t("mainRec.qty"), field: "qty", headerClass: "bg-[#D9E1F2]", },
    { headerName: t("mainRec.occurTime"), field: "occurTime", cellEditor: TimeCellEditor, valueFormatter: (params) => formatTo12Hour(params.value), headerClass: "bg-[#E2EFDA]", },
    { headerName: t("mainRec.finishTime"), field: "finishTime", cellEditor: TimeCellEditor, valueFormatter: (params) => formatTo12Hour(params.value), headerClass: "bg-[#E2EFDA]", },
    { headerName: t("mainRec.downTime"), field: "downTime", headerClass: "bg-[#E2EFDA]", },
    { headerName: t("mainRec.incharge"), field: "incharge", headerClass: "bg-[#E2EFDA]", },
    { headerName: t("mainRec.shift"), field: "shift", headerClass: "bg-[#E2EFDA]", },

    {
      headerName: t("mainRec.repairComp"), headerClass: "bg-[#FFF2CC]",
      children: [
        {
          headerName: t("mainRec.type"), field: "type", headerClass: "bg-[#FFF2CC]", cellEditor: "agSelectCellEditor", cellEditorParams: {
            values: ["CHANGE PIN", "CHANGE HOLDER", "CHECK"]
          }
        },
        { headerName: t("mainRec.labelSN"), field: "labelSN", headerClass: "bg-[#FFF2CC]", },
        { headerName: t("mainRec.holderNumber"), field: "holderNumber", headerClass: "bg-[#FFF2CC]", },
        { headerName: t("mainRec.pin"), field: "pin", headerClass: "bg-[#FFF2CC]", },
      ],
    },

    {
      headerName: t("mainRec.pinCheck"), headerClass: "bg-[#D9D9D9]",
      children: [
        { headerName: t("mainRec.pinSpec"), field: "pinSpec", headerClass: "bg-[#D9D9D9]", },
        { headerName: t("mainRec.pinHeight"), field: "pinHeight", headerClass: "bg-[#D9D9D9]", },
        { headerName: t("mainRec.pinDeformation"), field: "pinDeformation", headerClass: "bg-[#D9D9D9]", },
        { headerName: t("mainRec.pinSpring"), field: "pinSpring", headerClass: "bg-[#D9D9D9]", },
      ],
    },

    { headerName: t("mainRec.kyungshinLabel"), field: "kyungshinLabel", headerClass: "bg-[#D9D9D9]", },
    { headerName: t("mainRec.remarks"), field: "remarks", headerClass: "bg-[#F8CBAD]", },
  ];

  type Row = {
    id?: number;
    date: string
    formNumber: string
    line: string
    process: string
    code: string
    phenomenon: string
    detail: string
    material: string
    qty: string
    occurTime: string
    finishTime: string
    downTime: string
    incharge: string
    shift: string
    type: string
    labelSN: string
    holderNumber: string
    pin: string
    pinSpec: string
    pinHeight: string
    pinDeformation: string
    pinSpring: string
    kyungshinLabel: string
    remarks: string
  }

  const defaultColDef = {
    editable: true,
    resizable: true,
    sortable: true,
    filter: true,

    singleClickEdit: true,

    wrapText: true,
    autoHeight: true,

    flex: 1,
    minWidth: 120,

    cellStyle: {
      textAlign: "center",
      border: "1px solid #d1d5db", // softer border
    },
  };

  const formatTo12Hour = (time?: string) => {
    if (!time) return "";

    const [hour, minute] = time.split(":").map(Number);

    const suffix = hour >= 12 ? "PM" : "AM";
    const h = hour % 12 || 12;

    return `${h}:${minute.toString().padStart(2, "0")} ${suffix}`;
  };

  const saveToServer = async (row: Row) => {
    try {
      if (row.id) {
        await axios.put(
          `http://localhost:4000/api/maintenance/${row.id}`,
          row
        );
      } else {
        const res = await axios.post(
          "http://localhost:4000/api/maintenance",
          row
        );

        row.id = res.data.id; // assign ID after insert
      }

      //console.log("Saved ✅");
    } catch (error) {
      console.error("Save failed ❌", error);
    }
  };

  const debouncedSave = debounce(saveToServer, 800);

  const createEmptyRow = useCallback((): Row => ({
    date: "",
    formNumber: "",
    line: "",
    process: "",
    code: "",
    phenomenon: "",
    detail: "",
    material: "",
    qty: "",
    occurTime: "",
    finishTime: "",
    downTime: "",
    incharge: "",
    shift: "",
    type: "",
    labelSN: "",
    holderNumber: "",
    pin: "",
    pinSpec: "",
    pinHeight: "",
    pinDeformation: "",
    pinSpring: "",
    kyungshinLabel: "",
    remarks: "",
  }), []);

  const calculateDownTime = (start?: string, end?: string) => {
    if (!start || !end) return "";

    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);

    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;

    const diff = endMinutes - startMinutes;

    return diff >= 0 ? diff.toString() : ""; // prevent negative
  };

  useEffect(() => {
    setRowData([createEmptyRow()]);
  }, [createEmptyRow]);

  const onCellValueChanged = (params: CellValueChangedEvent<Row>) => {
    //console.log("UPDATED:", params.data);
    const row = params.data;

    // auto compute downtime
    if (
      params.colDef.field === "occurTime" ||
      params.colDef.field === "finishTime"
    ) {
      const downTime = calculateDownTime(
        row.occurTime,
        row.finishTime
      );

      params.node.setDataValue("downTime", downTime);
    }

    // skip empty rows
    const isEmpty = Object.values(row).every((v) => !v);
    if (isEmpty) return;

    // auto-add new row
    if (params.node.rowIndex === rowData.length - 1) {
      setRowData((prev) => [...prev, createEmptyRow()]);
    }

    // console.log("CHANGED:", params.data);

    // auto-save
    debouncedSave(row);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsFetching(true);

      const res = await axios.get(
        "http://localhost:4000/api/maintenance/view"
      );

      setRowData(res.data);
    } catch (error) {
      console.error("Fetch failed", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/maintenance/export-items-to-excel",
        {
          data: rowData,
        },
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Maintenance Records.xlsx");

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url); // cleanup
    } catch (error) {
      console.error("Export failed ❌", error);
    }
  };

  const { user } = useOutletContext<ContextType>();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (!user?.materials) {
        alert("You're not authorized to access this page.");
        navigate("/dashboard");
      }
    }
  }, [navigate, user]);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="w-full h-10 sm:w-4/10 flex gap-2">
        <button
          onClick={handleExport}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
        >
          Export to Excel
        </button>
      </div>

      <div
        className={`h-15/20 sm:h-17/20 w-10/10 border border-gray-300 relative`}
      >
        <div className="ag-theme-alpine w-full h-[600px] border border-gray-400 rounded-lg shadow">
          <AgGridReact
            theme="legacy"
            headerHeight={30}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}

            enterNavigatesVertically={true}
            enterNavigatesVerticallyAfterEdit={true}
            suppressCellFocus={false}

            loading={isFetching}

            overlayLoadingTemplate={`<span>Loading maintenance records...</span>`}
            overlayNoRowsTemplate={`<span>No data</span>`}


            onCellValueChanged={onCellValueChanged}
          />
          <button
            onClick={() =>
              setRowData((prev) => [
                ...prev,
                {
                  date: "",
                  formNumber: "",
                  line: "",
                  process: "",
                  code: "",
                  phenomenon: "",
                  detail: "",
                  material: "",
                  qty: "",
                  occurTime: "",
                  finishTime: "",
                  downTime: "",
                  incharge: "",
                  shift: "",
                  type: "",
                  labelSN: "",
                  holderNumber: "",
                  pin: "",
                  pinSpec: "",
                  pinHeight: "",
                  pinDeformation: "",
                  pinSpring: "",
                  kyungshinLabel: "",
                  remarks: "",
                },
              ])
            }
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow mt-2"
          >
            Add Row
          </button>
        </div>
      </div>
    </div>
  );
}
