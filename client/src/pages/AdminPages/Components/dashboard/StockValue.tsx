import { useEffect, useMemo, useState } from "react";
import { formatNumberShort } from "../../../../helper/helper";
import type { Part } from "../../../../services/Part.Service";
import { Modal } from "../../../../components/Modal";
import SecondaryButton from "../../../../components/button/SecondaryButton";
import InputField from "../../../../components/InputField";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

type Props = {
  data: Part[];
};

interface MonthlyStockValue {
  month: string;
  value: number;
  displayMonth: string;
}

export const StockValue = ({ data }: Props) => {
  const [modalShow, setModalShow] = useState(false);
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();

  const totalInventoryValue = data.reduce(
    (sum, part) => sum + part.unitPrice * part.quantity,
    0
  );

  useEffect(() => {
    const today = new Date();

    // --- END DATE = Last day of current month ---
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const endDateStr = end.toISOString().split("T")[0];

    // --- START DATE = 6 months before current month (first day of that month) ---
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);
    const startDateStr = sixMonthsAgo.toISOString().split("T")[0];

    setStartDate(startDateStr);
    setEndDate(endDateStr);
  }, []);

  // Calculate monthly stock values
  const monthlyStockData = useMemo<MonthlyStockValue[]>(() => {
    if (!startDate || !endDate) return [];

    const start = new Date(startDate);
    const end = new Date(endDate);
    const monthlyData: MonthlyStockValue[] = [];

    // Generate all months between start and end
    const currentDate = new Date(start.getFullYear(), start.getMonth(), 1);
    const endOfRange = new Date(end.getFullYear(), end.getMonth(), 1);

    while (currentDate <= endOfRange) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const lastDayOfMonth = new Date(year, month + 1, 0);

      // Calculate stock value at the end of this month
      let monthValue = 0;

      data.forEach((stock) => {
        // Calculate net quantity up to the end of this month
        let netQuantity = 0;

        // Add all inbounds up to this month
        stock.inbounds?.forEach((inbound) => {
          const inboundDate = new Date(inbound.inboundDate);
          if (inboundDate <= lastDayOfMonth) {
            netQuantity += inbound.quantity;
          }
        });

        // Subtract all outbounds up to this month
        stock.outbounds?.forEach((outbound) => {
          const outboundDate = new Date(outbound.outboundDate);
          if (outboundDate <= lastDayOfMonth) {
            netQuantity -= outbound.quantity;
          }
        });

        // Calculate value for this part
        monthValue += netQuantity * stock.unitPrice;
      });

      monthlyData.push({
        month: `${year}-${String(month + 1).padStart(2, "0")}`,
        value: monthValue,
        displayMonth: currentDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        }),
      });

      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return monthlyData;
  }, [data, startDate, endDate]);

  // Calculate statistics
  const statistics = useMemo(() => {
    if (monthlyStockData.length === 0) return null;

    const values = monthlyStockData.map((d) => d.value);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    const change = lastValue - firstValue;
    const changePercent = firstValue !== 0 ? (change / firstValue) * 100 : 0;

    return {
      max: maxValue,
      min: minValue,
      avg: avgValue,
      change,
      changePercent,
      trend: change >= 0 ? "up" : "down",
    };
  }, [monthlyStockData]);

  return (
    <>
      <div
        className={`relative bg-emerald-500 hover:bg-emerald-600 transition duration-500 ease-in-out text-neutral-50 rounded shadow  p-3 md:p-6 cursor-pointer`}
        onClick={() => setModalShow(true)}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-neutral-50">Inventory Value</h3>
            <h1 className="font-bold text-neutral-0 mt-2">
              {`₩ ${formatNumberShort(totalInventoryValue)}`}
            </h1>
            <p className="text-sm text-neutral-100 mt-1">Total stock value</p>
          </div>
          <div
            className={`absolute top-5 right-5 size-10 lg:size-13 flex justify-center items-center p-3 rounded-full bg-neutral-50 text-emerald-500`}
          >
            <h3 className="mt-1">
              <i className="bx bxs-currency-notes"></i>
            </h3>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalShow}
        onClose={() => setModalShow(false)}
        title={
          <>
            <h4>MONTHLY STOCK VALUE TREND</h4>
          </>
        }
        size="2xl"
        footer={
          <>
            <SecondaryButton text="CLOSE" onClick={() => setModalShow(false)} />
          </>
        }
      >
        <div>
          <div className="flex justify-start items-center gap-2 mb-2">
            <div className="mb-1">
              <label
                htmlFor="START-DATE"
                className="block font-medium text-gray-700"
              >
                <p>START DATE:</p>
              </label>
              <InputField
                label="START-DATE"
                type="date"
                value={startDate!}
                required={true}
                onChange={(value: string) => setStartDate(value)}
                autoComplete={`Previous date`}
              />
            </div>
            <div className="mb-1">
              <label
                htmlFor="END-DATE"
                className="block font-medium text-gray-700"
              >
                <p>END DATE:</p>
              </label>
              <InputField
                label="END-DATE"
                type="date"
                value={endDate!}
                required={true}
                onChange={(value: string) => setEndDate(value)}
                autoComplete={`Previous date`}
              />
            </div>
          </div>

          {/* Statistics Cards */}
          {statistics && (
            <div className="grid grid-cols-4 gap-4 mb-2">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">Peak Value</div>
                <div className="text-lg font-bold text-blue-600">
                  ₩{formatNumberShort(statistics.max)}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">Average Value</div>
                <div className="text-lg font-bold text-green-600">
                  ₩{formatNumberShort(statistics.avg)}
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">Lowest Value</div>
                <div className="text-lg font-bold text-orange-600">
                  ₩{formatNumberShort(statistics.min)}
                </div>
              </div>
              <div
                className={`${
                  statistics.trend === "up" ? "bg-emerald-50" : "bg-red-50"
                } p-4 rounded-lg`}
              >
                <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                  Period Change
                  <TrendingUp
                    className={`w-3 h-3 ${
                      statistics.trend === "up"
                        ? "text-emerald-600"
                        : "text-red-600 rotate-180"
                    }`}
                  />
                </div>
                <div
                  className={`text-lg font-bold ${
                    statistics.trend === "up"
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {statistics.changePercent >= 0 ? "+" : ""}
                  {statistics.changePercent.toFixed(1)}%
                </div>
              </div>
            </div>
          )}

          {/* Line Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            {monthlyStockData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={monthlyStockData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="displayMonth"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    tickFormatter={(value) => `₩${formatNumberShort(value)}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                            <p className="font-semibold text-gray-800 mb-1">
                              {payload[0].payload.displayMonth}
                            </p>
                            <p className="text-sm text-emerald-600">
                              Value: ₩
                              {payload[0].value?.toLocaleString("en-US", {
                                maximumFractionDigits: 0,
                              })}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Stock Value (₩)"
                    dot={{ fill: "#10b981", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div
                className="flex justify-center items-center flex-col text-center py-12 text-gray-500"
                style={{ height: 400 }}
              >
                <h1 className="text-neutral-400">
                  <i className="bx  bx-calendar-x"></i>
                </h1>
                <h4>No data available for the selected date range</h4>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
