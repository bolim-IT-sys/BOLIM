import type { Part } from "../../services/Part.Service";
import { useOutletContext } from "react-router-dom";
import InputField from "../../components/InputField";
import { useEffect, useMemo, useState } from "react";
import { KeyMetrics } from "./Components/KeyMetrics";
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

interface ContextType {
  parts: Part[];
}

export default function Dashboard() {
  const { parts } = useOutletContext<ContextType>();

  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();

  useEffect(() => {
    const today = new Date();

    // Calculate Monday of current week
    const day = today.getDay(); // 0 = Sunday, 1 = Monday, ...
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const start = new Date(today);
    start.setDate(today.getDate() + diffToMonday + 1);
    start.setHours(0, 0, 0, 0);

    // End of week = start + 6 days (Sunday)
    const end = new Date(start);
    end.setDate(start.getDate() + 5);
    end.setHours(23, 59, 59, 999);

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  }, []);

  const filteredAndRankedParts = useMemo(() => {
    if (!startDate || !endDate) {
      return [];
    }
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const processedParts = parts.map((part) => {
      // console.log("Filtering parts...", part.partNumber);
      const filteredOutbounds = part.outbounds!.filter((outbound) => {
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
        ...part,
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
  }, [parts, startDate, endDate]);

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
      <div className=" ">
        {/* Header */}
        <div className="mb-3">
          <h2 className="font-bold text-gray-900">DASHBOARD</h2>
        </div>
        <div className="h-full overflow-auto">
          {/* Key Metrics Grid */}
          <KeyMetrics parts={parts} />

          {/* Two Column Layout */}
          <div className="flex justify-start items-center gap-2">
            <div className="mb-1">
              <label className="block font-medium text-gray-700">
                <p>START DATE:</p>
              </label>
              <InputField
                label="START DATE"
                type="date"
                value={startDate!}
                required={true}
                onChange={(value: string) => setStartDate(value)}
                autoComplete={`Previous date`}
              />
            </div>
            <div className="mb-1">
              <label className="block font-medium text-gray-700">
                <p>END DATE:</p>
              </label>
              <InputField
                label="END DATE"
                type="date"
                value={endDate!}
                required={true}
                onChange={(value: string) => setEndDate(value)}
                autoComplete={`Previous date`}
              />
            </div>
          </div>
          <div>
            <div className="bg-white rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <i className="bx  bxs-chart-bar-columns"></i> Parts Usage
                Overview
              </h2>

              {filteredAndRankedParts.length > 0 ? (
                <ResponsiveContainer width="100%" height={430}>
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
                    <Bar dataKey="outbound" fill="#ef4444" name="Outbound" />
                    <Bar dataKey="stock" fill="#3b82f6" name="Current Stock" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12" style={{ height: 430 }}>
                  <h1 className="text-neutral-500">
                    <i className="bx  bxs-package"></i>
                  </h1>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No Data Available
                  </h3>
                  <p className="text-gray-500">
                    No parts have both inbound and outbound transactions within
                    the selected date range.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Alert Section */}
          {/* {(lowStockParts.length > 0 || outOfStockParts.length > 0) && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Inventory Alerts
              </h2>

              {outOfStockParts.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center">
                    <AlertTriangle size={20} className="mr-2" />
                    Out of Stock ({outOfStockParts.length})
                  </h3>
                  <div className="space-y-2">
                    {outOfStockParts.slice(0, 5).map((part) => (
                      <div
                        key={part.id}
                        className="flex justify-between items-center p-3 bg-red-50 rounded"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {part.partNumber}
                          </p>
                          <p className="text-sm text-gray-600">{part.specs}</p>
                        </div>
                        <span className="text-sm font-semibold text-red-600">
                          0 units
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {lowStockParts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-yellow-600 mb-3 flex items-center">
                    <AlertTriangle size={20} className="mr-2" />
                    Low Stock ({lowStockParts.length})
                  </h3>
                  <div className="space-y-2">
                    {lowStockParts.slice(0, 5).map((part) => (
                      <div
                        key={part.id}
                        className="flex justify-between items-center p-3 bg-yellow-50 rounded"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {part.partNumber}
                          </p>
                          <p className="text-sm text-gray-600">{part.specs}</p>
                        </div>
                        <span className="text-sm font-semibold text-yellow-600">
                          {part.quantity} units
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )} */}
        </div>
      </div>
    </>
  );
}
