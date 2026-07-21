import React, { useState } from "react";
import { useConceptRules } from "../hooks/useConceptRules";
import { ConceptSelector } from "../components/ConceptSelector/ConceptSelector";
import { RulesTable } from "../components/RulesTable/RulesTable";
import { ResultsTable } from "../components/ResultsTable/ResultsTable";
import { Button } from "../components/ui/Button";
import { MATCH_MODES } from "../constants/fhir";
import type { MatchMode } from "../types/domain";

export const ConceptRulesPage: React.FC = () => {
  const {
    concepts,
    conceptsLoading,
    form,
    queryResult,
    queryLoading,
    queryError,
    selectConcept,
    setMatchMode,
    addRow,
    removeRow,
    updateRow,
    runQuery,
  } = useConceptRules();

  const [showSelector, setShowSelector] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* Modal */}
      {showSelector && (
        <ConceptSelector
          concepts={concepts}
          currentConcept={form.concept}
          onConfirm={(c) => {
            selectConcept(c);
            setShowSelector(false);
          }}
          onCancel={() => setShowSelector(false)}
        />
      )}

      <main className="max-w-6xl mx-auto px-4 py-5 space-y-4">
        {/* ── Concept Meta Card ── */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex flex-wrap gap-6 items-start justify-between">
            {/* Meta grid */}
            <div className="grid grid-cols-[130px_1fr] gap-x-4 gap-y-2.5 items-center flex-1">
              <MetaLabel>Concept Name</MetaLabel>
              {conceptsLoading ? (
                <div className="h-5 bg-slate-100 rounded animate-pulse w-64" />
              ) : (
                <button
                  className="text-left text-sm font-bold text-blue-800 hover:text-blue-900 flex items-center gap-2 group"
                  onClick={() => setShowSelector(true)}
                  data-testid="concept-name-btn"
                >
                  {form.concept?.name ?? "Select a concept…"}
                  <span className="text-slate-300 group-hover:text-slate-500 text-base">✎</span>
                </button>
              )}

              <MetaLabel>Version</MetaLabel>
              <MetaValue>{form.concept?.version}</MetaValue>

              <MetaLabel>Author</MetaLabel>
              <MetaValue>{form.concept?.author}</MetaValue>

              <MetaLabel>Approval</MetaLabel>
              <MetaValue>{form.concept?.approval}</MetaValue>

              {form.concept?.fhirUrl && (
                <>
                  <MetaLabel>FHIR URL</MetaLabel>
                  <a
                    href={form.concept.fhirUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline truncate"
                  >
                    {form.concept.fhirUrl}
                  </a>
                </>
              )}
            </div>

            {/* Match mode */}
            <div className="border-l border-slate-200 pl-6 min-w-[140px]">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                Match Mode
              </p>
              <div className="space-y-2">
                {MATCH_MODES.map((m) => (
                  <label
                    key={m}
                    className="flex items-center gap-2 cursor-pointer text-sm text-slate-700"
                  >
                    <input
                      type="radio"
                      name="matchMode"
                      value={m}
                      checked={form.matchMode === m}
                      onChange={() => setMatchMode(m as MatchMode)}
                      className="accent-blue-800"
                    />
                    {m}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Rules Table ── */}
        <RulesTable
          rows={form.rows}
          onAdd={addRow}
          onRemove={removeRow}
          onUpdate={updateRow}
        />

        {/* Run button row */}
        <div className="flex justify-end">
          <Button
            onClick={runQuery}
            disabled={queryLoading || !form.concept}
            data-testid="run-query-btn"
          >
            {queryLoading ? "Running…" : "▶ Run Query"}
          </Button>
        </div>

        {/* ── Error ── */}
        {queryError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            Query failed: {queryError}
          </div>
        )}

        {/* ── Results ── */}
        {queryResult && (
          <ResultsTable
            result={queryResult}
            conceptName={form.concept?.name ?? "results"}
          />
        )}
      </main>
    </div>
  );
};

const MetaLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
    {children}
  </span>
);

const MetaValue: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <span className="text-sm text-slate-700">{children ?? "—"}</span>
);
