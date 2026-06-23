import React from "react";
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
  const handleExport = () => {
    const csv = recordsToCsv(result.records);
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
            {result.totalCount} records
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            Executed {new Date(result.executedAt).toLocaleTimeString()}
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
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 text-xs text-slate-500 uppercase tracking-wider">
              {["ID", "Name", "Codes", "Admin Route", "Frequency", "Status"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.records.map((r, i) => (
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
