import { useMemo, useState } from "react";

// SampleTable.jsx
// A single-file React component (Tailwind CSS classes) that shows a searchable,
// sortable, paginated table with selectable rows. Default export a React component.

export default function DashBoard({
  data = null,
  columns = null,
  initialPageSize = 8,
}) {
  // default sample data if none provided
  const sampleColumns = useMemo(
    () =>
      columns || [
        { key: "id", label: "ID", sortable: true },
        { key: "name", label: "Name", sortable: true },
        { key: "email", label: "Email", sortable: true },
        { key: "role", label: "Role", sortable: true },
        { key: "status", label: "Status", sortable: true },
      ],
    [columns]
  );

  const sampleData = useMemo(
    () =>
      data || [
        {
          id: 1,
          name: "Ava Carter",
          email: "ava@example.com",
          role: "Admin",
          status: "Active",
        },
        {
          id: 2,
          name: "Noah Kim",
          email: "noah@example.com",
          role: "Manager",
          status: "Active",
        },
        {
          id: 3,
          name: "Emma Lee",
          email: "emma@example.com",
          role: "Developer",
          status: "Inactive",
        },
        {
          id: 4,
          name: "Liam Park",
          email: "liam@example.com",
          role: "Designer",
          status: "Active",
        },
        {
          id: 5,
          name: "Olivia Choi",
          email: "olivia@example.com",
          role: "QA",
          status: "Active",
        },
        {
          id: 6,
          name: "Lucas Lim",
          email: "lucas@example.com",
          role: "Developer",
          status: "Inactive",
        },
        {
          id: 7,
          name: "Sophia Yoon",
          email: "sophia@example.com",
          role: "Support",
          status: "Active",
        },
        {
          id: 8,
          name: "Mason Shin",
          email: "mason@example.com",
          role: "Developer",
          status: "Active",
        },
        {
          id: 9,
          name: "Isabella Jung",
          email: "isabella@example.com",
          role: "Designer",
          status: "Active",
        },
        {
          id: 10,
          name: "Ethan Park",
          email: "ethan@example.com",
          role: "Admin",
          status: "Inactive",
        },
      ],
    [data, columns]
  );

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState({ key: null, dir: "asc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize || 8);
  const [selected, setSelected] = useState(new Set());

  // filtered and sorted rows
  const rows = useMemo(() => {
    // filter
    const q = query.trim().toLowerCase();
    let filtered = sampleData.filter((row) => {
      if (!q) return true;
      return Object.values(row).some((v) =>
        String(v).toLowerCase().includes(q)
      );
    });

    // sort
    if (sortBy.key) {
      filtered = filtered.slice().sort((a, b) => {
        const av = a[sortBy.key];
        const bv = b[sortBy.key];
        if (av == null && bv == null) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;
        if (typeof av === "number" && typeof bv === "number") {
          return sortBy.dir === "asc" ? av - bv : bv - av;
        }
        return sortBy.dir === "asc"
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      });
    }

    return filtered;
  }, [sampleData, query, sortBy]);

  const total = rows.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const visibleRows = rows.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(key) {
    setPage(1);
    setSortBy((s) => {
      if (s.key === key) {
        return { key, dir: s.dir === "asc" ? "desc" : "asc" };
      }
      return { key, dir: "asc" };
    });
  }

  function toggleSelect(id) {
    setSelected((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  }

  function selectAllVisible(e) {
    const checked = e.target.checked;
    setSelected((prev) => {
      const copy = new Set(prev);
      visibleRows.forEach((r) => {
        if (checked) copy.add(r.id);
        else copy.delete(r.id);
      });
      return copy;
    });
  }

  function clearSelection() {
    setSelected(new Set());
  }

  // small utility for rendering sort arrow
  function SortIcon({ columnKey }) {
    if (sortBy.key !== columnKey) return <span className="opacity-50">⇅</span>;
    return <span>{sortBy.dir === "asc" ? "▲" : "▼"}</span>;
  }

  return (
    <>
      {" "}
      <table className="min-w-full table-auto">
        <thead>
          <tr className="text-left text-sm text-gray-600 border-b">
            <th className="pr-4 py-3">
              <input
                type="checkbox"
                onChange={selectAllVisible}
                aria-label="select all visible rows"
              />
            </th>
            {sampleColumns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 cursor-pointer select-none"
                onClick={() => col.sortable !== false && toggleSort(col.key)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{col.label}</span>
                  <SortIcon columnKey={col.key} />
                </div>
              </th>
            ))}
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {visibleRows.length === 0 && (
            <tr>
              <td
                colSpan={sampleColumns.length + 2}
                className="px-4 py-6 text-center text-sm text-gray-500"
              >
                No rows found.
              </td>
            </tr>
          )}

          {visibleRows.map((row) => (
            <tr key={row.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 align-top">
                <input
                  type="checkbox"
                  checked={selected.has(row.id)}
                  onChange={() => toggleSelect(row.id)}
                  aria-label={`select row ${row.id}`}
                />
              </td>
              {sampleColumns.map((col) => (
                <td key={col.key} className="px-4 py-3 align-top">
                  <div className="text-sm">{row[col.key]}</div>
                </td>
              ))}
              <td className="px-4 py-3 align-top">
                <div className="flex gap-2">
                  <button className="px-3 py-1 rounded-md text-sm border">
                    View
                  </button>
                  <button className="px-3 py-1 rounded-md text-sm border">
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
