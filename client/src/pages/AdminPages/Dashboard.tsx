import React from "react";
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Boxes,
} from "lucide-react";
import type { Part } from "../../services/Part.Service";
import { useOutletContext } from "react-router-dom";

interface ContextType {
  parts: Part[];
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  subtitle?: string;
  color?: "blue" | "green" | "red" | "yellow" | "purple";
}

interface CategoryStats {
  [key: string]: {
    count: number;
    value: number;
    quantity: number;
  };
}

export default function Dashboard() {
  const { parts } = useOutletContext<ContextType>();
  // Calculate metrics
  const totalParts = parts.length;
  const totalInventoryValue = parts.reduce(
    (sum, part) => sum + part.unitPrice * part.quantity,
    0
  );
  const lowStockParts = parts.filter(
    (part) => part.quantity > 0 && part.quantity < 10
  );
  const outOfStockParts = parts.filter((part) => part.quantity === 0);

  // Category breakdown
  const categoryStats: CategoryStats = parts.reduce((acc, part) => {
    if (!acc[part.category]) {
      acc[part.category] = { count: 0, value: 0, quantity: 0 };
    }
    acc[part.category].count += 1;
    acc[part.category].value += part.unitPrice * part.quantity;
    acc[part.category].quantity += part.quantity;
    return acc;
  }, {} as CategoryStats);

  // Company breakdown
  const companyStats: CategoryStats = parts.reduce((acc, part) => {
    if (!acc[part.company]) {
      acc[part.company] = { count: 0, value: 0, quantity: 0 };
    }
    acc[part.company].count += 1;
    acc[part.company].value += part.unitPrice * part.quantity;
    acc[part.company].quantity += part.quantity;
    return acc;
  }, {} as CategoryStats);

  const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    subtitle,
    color = "blue",
  }) => {
    const colorClasses = {
      blue: "bg-blue-50 text-blue-600",
      green: "bg-green-50 text-green-600",
      red: "bg-red-50 text-red-600",
      yellow: "bg-yellow-50 text-yellow-600",
      purple: "bg-purple-50 text-purple-600",
    };

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon size={24} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Inventory Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Overview of your inventory management system
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Parts"
            value={totalParts}
            icon={Package}
            subtitle="Unique SKUs"
            color="blue"
          />
          <StatCard
            title="Inventory Value"
            value={`$${totalInventoryValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={DollarSign}
            subtitle="Total stock value"
            color="green"
          />
          <StatCard
            title="Low Stock Alert"
            value={lowStockParts.length}
            icon={AlertTriangle}
            subtitle="Parts below 10 units"
            color="yellow"
          />
          <StatCard
            title="Out of Stock"
            value={outOfStockParts.length}
            icon={TrendingDown}
            subtitle="Immediate attention needed"
            color="red"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">By Category</h2>
              <Boxes size={20} className="text-gray-400" />
            </div>
            <div className="space-y-4">
              {Object.entries(categoryStats).map(([category, stats]) => (
                <div key={category} className="border-b pb-3 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-700">
                      {category}
                    </span>
                    <span className="text-sm font-semibold text-blue-600">
                      $
                      {stats.value.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{stats.count} parts</span>
                    <span>{stats.quantity} units</span>
                  </div>
                </div>
              ))}
              {Object.keys(categoryStats).length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No categories available
                </p>
              )}
            </div>
          </div>

          {/* Company Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">By Company</h2>
              <TrendingUp size={20} className="text-gray-400" />
            </div>
            <div className="space-y-4">
              {Object.entries(companyStats).map(([company, stats]) => (
                <div key={company} className="border-b pb-3 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-700">{company}</span>
                    <span className="text-sm font-semibold text-green-600">
                      $
                      {stats.value.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{stats.count} parts</span>
                    <span>{stats.quantity} units</span>
                  </div>
                </div>
              ))}
              {Object.keys(companyStats).length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No companies available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Alert Section */}
        {(lowStockParts.length > 0 || outOfStockParts.length > 0) && (
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
        )}
      </div>
    </div>
  );
}
