import React, { useMemo, useState } from "react";
import type { QueryResult } from "../../types/domain";
import { Button } from "../ui/Button";
import { recordsToCsv, downloadCsv } from "../../utils/csvExport";

interface ResultsTableProps {
  result: QueryResult;
  conceptName: string;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  result,
  conceptName,
}) => {
  // 1. Setup states for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  
  const filtered = useMemo(() => {
    return result.records.filter(record => {
      const text = search.toLowerCase();
      return (
        record.id.toLowerCase().includes(text) ||
        record.name.toLowerCase().includes(text) ||
        record.codes.toLowerCase().includes(text) ||
        record.adminRoute.toLowerCase().includes(text) ||
        record.frequency.toLowerCase().includes(text) ||
        record.status.toLowerCase().includes(text)
      )
    })
  }, [result, search]);

  const totalFilteredCount = filtered.length;

  const itemsPerPage = 10; // Number of rows per page

  // 2. Calculate indices and slices
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // Extract data subset for the active page
  const currentRows = filtered.slice(indexOfFirstItem, indexOfLastItem);

  // 3. Navigation handler utilities
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  
  const handleExport = () => {
    const csv = recordsToCsv(filtered);
    const filename = `${conceptName.replace(/\s+/g, "_")}_results.csv`;
    downloadCsv(csv, filename);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden" data-testid="results-table">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-800">Results</span>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
            {totalFilteredCount} records
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            {/* Executed {new Date(result.executedAt).toLocaleTimeString()} */}
            Executed {new Date().toLocaleTimeString()}
          </span>
          <Button
            variant="success"
            size="sm"
            onClick={handleExport}
            data-testid="export-csv-btn"
          >
            ⬇ Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {/* Table search input */}
        <input
          value={search}
          onChange={e => {
            setSearch(e.target.value)
          }}
          placeholder="Search results..."
          className="border rounded px-3 py-2 w-full"
        />
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="bg-slate-100 text-xs text-slate-500 px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
              {["ID", "Name", "Codes", "Admin Route", "Frequency", "Status"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRows.map((r, i) => (
              <tr
                key={r.id}
                className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
              >
                <td className="px-4 py-2.5">
                  <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                    {r.id}
                  </code>
                </td>
                <td className="px-4 py-2.5 font-medium text-slate-800">{r.name}</td>
                <td className="px-4 py-2.5 text-slate-600">{r.codes}</td>
                <td className="px-4 py-2.5 text-slate-600">{r.adminRoute}</td>
                <td className="px-4 py-2.5 text-slate-600">{r.frequency}</td>
                <td className="px-4 py-2.5">
                  <StatusPill status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination Controller Actions */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
          {/* Mobile Info View */}
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* Desktop View */}
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filtered.length)}
                </span>{' '}
                of <span className="font-medium">{filtered.length}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                {/* Previous Button */}
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:hover:bg-white"
                >
                  <span className="sr-only">Previous</span>
                  &larr;
                </button>

                {/* Explicit Page Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    aria-current={currentPage === pageNumber ? 'page' : undefined}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 ring-1 ring-inset ring-gray-300 ${
                      currentPage === pageNumber
                        ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        : 'text-gray-900 hover:bg-gray-50 focus:outline-offset-0'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:hover:bg-white"
                >
                  <span className="sr-only">Next</span>
                  &rarr;
                </button>
              </nav>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

const StatusPill: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    completed: "bg-slate-100 text-slate-600",
    "on-hold": "bg-amber-100 text-amber-800",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${styles[status] ?? "bg-slate-100 text-slate-600"}`}
    >
      {status}
    </span>
  );
};
