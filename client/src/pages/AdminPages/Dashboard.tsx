import type { Part } from "../../services/Part.Service";
import { useOutletContext } from "react-router-dom";
import InputField from "../../components/InputField";
import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { KeyMetrics } from "./Components/dashboard/KeyMetrics";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getDateRange } from "../../helper/date.helper";
import type { User } from "../../services/User.Service";
import { getDataType } from "../../helper/dashboard.helper";

interface ContextType {
  user: User;
  parts: Part[];
  setParts: Dispatch<SetStateAction<Part[]>>;
  ITStocks: Part[];
  materials: Part[];
}

export default function Dashboard() {
  const { user, parts, setParts, ITStocks, materials } =
    useOutletContext<ContextType>();

  const [dataType, setDataType] = useState<string>("");
  useEffect(() => {
    // Remove the if (user) check or handle the falsy case
    if (!user) {
      // console.log("No user yet, dataType remains empty");
      return; // or set a default: setDataType("Pins");
    }
    setTimeout(() => {
      getDataType(user, setDataType);
    }, 100);
  }, [user]);

  useEffect(() => {
    if (user) {
      if (!dataType || dataType === "") {
        // console.log("data type cant be saved.");
        // localStorage.removeItem("dataType");
      } else {
        // console.log("data type can be saved.");
        localStorage.setItem("dataType", JSON.stringify(dataType));
      }
    }
  }, [user, dataType]);

  const [data, setData] = useState<Part[]>([]);

  useEffect(() => {
    // console.log("DATA TYPE: ", dataType);
    if (dataType === "Pins") {
      setData(parts);
    } else if (dataType === "ITStocks") {
      setData(ITStocks);
    } else if (dataType === "MaterialControl") {
      setData(materials);
    } else {
      // console.log("No data type.");
      setData([]);
    }
  }, [dataType, parts, ITStocks, materials]);

  const [dateRange, setDateRange] = useState(() => {
    const stored = localStorage.getItem("dateRange");
    return stored ? JSON.parse(stored) : "week";
  });
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();

  useEffect(() => {
    localStorage.setItem("dateRange", JSON.stringify(dateRange));
    const dates = getDateRange(dateRange);

    if (dates) {
      setStartDate(dates.start.toISOString().split("T")[0]);
      setEndDate(dates.end.toISOString().split("T")[0]);
    }
  }, [dateRange]);

  const filteredAndRankedParts = useMemo(() => {
    if (!startDate || !endDate) {
      return [];
    }
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const processedParts = data.map((stock) => {
      // console.log("Filtering parts...", part.partNumber);
      const filteredOutbounds = stock.outbounds!.filter((outbound) => {
        const date = new Date(outbound.outboundDate);
        date.setHours(0, 0, 0, 0); // Normalize to start of day
        return date >= start && date <= end;
      });
      // console.log(
      //   `Filtered outbounds for ${part.partNumber}: `,
      //   filteredOutbounds
      // );

      // Calculate totals

      const totalOutbound = filteredOutbounds.reduce(
        (sum, outbound) => sum + outbound.quantity,
        0
      );

      return {
        ...stock,
        filteredOutbounds,
        totalOutbound,
        outboundCount: filteredOutbounds.length,
      };
    });

    // Filter parts that have both inbounds and outbounds
    const partsWithBoth = processedParts.filter(
      (part) => part.totalOutbound > 0
    );

    // Sort by total outbound (usage) descending
    return partsWithBoth.sort((a, b) => b.totalOutbound - a.totalOutbound);
  }, [data, startDate, endDate]);

  const chartData = useMemo(() => {
    return filteredAndRankedParts.map((part, index) => ({
      name: part.partNumber,
      fullName: `${part.specs} (${part.category})`,
      company: part.company,
      rank: index + 1,
      outbound: part.totalOutbound,
      stock: part.quantity,
    }));
  }, [filteredAndRankedParts]);

  // useEffect(() => {
  //   console.log("FILTERED PARTS: ", filteredAndRankedParts);
  // }, [filteredAndRankedParts]);

  return (
    <>
      <div className="h-full overflow-x-hidden">
        <div className="">
          {/* Header */}
          <div className="mb-3 flex items-center gap-2">
            <h2 className="font-bold text-gray-900">DASHBOARD</h2>
            <div className="">
              <select
                className="w-full md:w-max no-arrow rounded-lg border border-neutral-300 hover:bg-neutral-200 transition duration-350 cursor-pointer px-2 py-2 focus:bg-neutral-50  focus:ring-1 focus:ring-neutral-300 focus:outline-none"
                name="dataTypeSelect"
                value={dataType}
                onChange={(e) => setDataType(e.target.value)}
              >
                <option value={``}>Options...</option>
                <option disabled={!user?.pins} value={`Pins`}>
                  Pins
                </option>
                <option disabled={!user?.it_stocks} value={`ITStocks`}>
                  IT Stocks
                </option>
                <option disabled={!user?.materials} value={`MaterialControl`}>
                  Material Control
                </option>
              </select>
            </div>
          </div>
          <div className="h-full w-full overflow-hidden">
            {/* Key Metrics Grid */}
            <KeyMetrics setParts={setParts} data={data} dataType={dataType} />
          </div>

          {/* BAR CHART */}
          <div className="w-full">
            <div className="w-full">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  {dataType === "Pins"
                    ? "Pins "
                    : dataType === "ITStocks"
                      ? "IT Stocks "
                      : dataType === "MaterialControl"
                        ? "Material Control "
                        : "Part "}
                  Usage Overview
                </h2>
                <div className="flex justify-start items-center flex-col sm:flex-row gap-1 sm:gap-2 mb-2">
                  <div className="mb-1 w-full sm:w-40">
                    <label
                      htmlFor="dateRangeSelect"
                      className="block text-gray-700"
                    >
                      <h6>DATE RANGE:</h6>
                    </label>
                    <select
                      className="w-full md:w-40 no-arrow rounded-lg border border-neutral-300 hover:bg-neutral-200 transition duration-350 cursor-pointer px-2 py-2 focus:bg-neutral-50  focus:ring-1 focus:ring-neutral-300 focus:outline-none"
                      id="dateRangeSelect"
                      name="dateRangeSelect"
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                    >
                      <option value={`week`}>This Week</option>
                      <option value={`month`}>This Month</option>
                      <option value={`year`}>This Year</option>
                      <option value={`custom`}>Custom</option>
                    </select>
                  </div>
                  <div className="mb-1 w-full sm:w-max">
                    <label htmlFor="START DATE" className="block text-gray-700">
                      <h6>START DATE:</h6>
                    </label>
                    <InputField
                      label="START DATE"
                      type="date"
                      value={startDate!}
                      required={true}
                      onChange={(value: string) => {
                        setStartDate(value);
                        setDateRange("custom");
                      }}
                      autoComplete={`Previous date`}
                    />
                  </div>
                  <div className="mb-1 w-full sm:w-max">
                    <label htmlFor="END DATE" className="block text-gray-700">
                      <h6>END DATE:</h6>
                    </label>
                    <InputField
                      label="END DATE"
                      type="date"
                      value={endDate!}
                      required={true}
                      onChange={(value: string) => {
                        setEndDate(value);
                        setDateRange("custom");
                      }}
                      autoComplete={`Previous date`}
                    />
                  </div>
                </div>
              </div>

              <div className="w-full overflow-x-auto md:overflow-hidden rounded-2xl">
                <div
                  className=" flex items-center justify-center mt-5"
                  style={{ height: "clamp(20rem, 22dvw, 90rem)" }}
                >
                  {filteredAndRankedParts.length > 0 ? (
                    <ResponsiveContainer height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          angle={-40}
                          textAnchor="end"
                          height={80}
                          interval={0}
                          style={{ fontSize: "12px" }}
                        />
                        <YAxis />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                                  <p className="font-bold text-gray-800 mb-1">
                                    {payload[0].payload.name}
                                  </p>
                                  <p className="text-sm text-gray-600 mb-1">
                                    {payload[0].payload.fullName}
                                  </p>
                                  <p className="text-sm text-gray-600 mb-2">
                                    {payload[0].payload.company}
                                  </p>
                                  <p className="text-sm text-gray-600 mb-1">
                                    Rank: #{payload[0].payload.rank}
                                  </p>
                                  <p className="text-sm text-red-600">
                                    Outbound: {payload[0].payload.outbound}
                                  </p>
                                  <p className="text-sm text-blue-600">
                                    Current Stock: {payload[0].payload.stock}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend />
                        <Bar
                          dataKey="outbound"
                          fill="#ef4444"
                          name="Outbound"
                        />
                        <Bar
                          dataKey="stock"
                          fill="#3b82f6"
                          name="Current Stock"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-12" style={{ height: 450 }}>
                      <h1 className="text-neutral-500">
                        <i className="bx  bxs-package"></i>
                      </h1>
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        No Data Available
                      </h3>
                      <p className="text-gray-500">
                        No parts have both inbound and outbound transactions
                        within the selected date range.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
