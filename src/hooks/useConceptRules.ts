import { useState, useEffect, useCallback } from "react";
import type { ConceptMeta, ConceptRuleForm, MatchMode, QueryResult, RuleRow } from "../types/domain";
import type { LogicOperator, ValueOperator } from "../types/domain";
import type { FhirResourceType } from "../types/fhir";
import { fetchValueSetBundle, executeConceptQuery } from "../data/fhirApi";
import { mapBundleToConcepts } from "../mappers/valueSetMapper";
import { COLUMNS_BY_RECORD_TYPE, DEFAULT_RULE_ROW_VALUES } from "../constants/fhir";

interface UseConceptRulesReturn {
  concepts: ConceptMeta[];
  conceptsLoading: boolean;
  form: ConceptRuleForm;
  queryResult: QueryResult | null;
  queryLoading: boolean;
  queryError: string | null;
  selectConcept: (concept: ConceptMeta) => void;
  setMatchMode: (mode: MatchMode) => void;
  addRow: () => void;
  removeRow: (id: string) => void;
  updateRow: (id: string, patch: Partial<Omit<RuleRow, "id">>) => void;
  runQuery: () => Promise<void>;
  resetResults: () => void;
}

function generateId(): string {
  return `row-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function makeDefaultRow(): RuleRow {
  return {
    id: generateId(),
    logic: DEFAULT_RULE_ROW_VALUES.logic as LogicOperator,
    recordType: DEFAULT_RULE_ROW_VALUES.recordType as FhirResourceType,
    column: DEFAULT_RULE_ROW_VALUES.column,
    operator: DEFAULT_RULE_ROW_VALUES.operator as ValueOperator,
    value: DEFAULT_RULE_ROW_VALUES.value,
  };
}

const INITIAL_ROWS: RuleRow[] = [
  {
    id: generateId(),
    logic: "AND",
    recordType: "MedicationRequest",
    column: "Name",
    operator: "ANY OF",
    value: "Vasopressor Names, INTEGRATE Vasopressor Names",
  },
  {
    id: generateId(),
    logic: "OR",
    recordType: "MedicationRequest",
    column: "Codes",
    operator: "ANY OF",
    value: "INTEGRATE Vasopressor Codes, INTEGRATE Vasodilator Names",
  },
  {
    id: generateId(),
    logic: "AND",
    recordType: "MedicationRequest",
    column: "Admin Route",
    operator: "NOT IN",
    value: "'Oral', 'Eye Drop', 'Dropper'",
  },
  {
    id: generateId(),
    logic: "AND",
    recordType: "MedicationRequest",
    column: "Frequency",
    operator: "NOT IN",
    value: "'Bolus'",
  },
];

export function useConceptRules(): UseConceptRulesReturn {
  const [concepts, setConcepts] = useState<ConceptMeta[]>([]);
  const [conceptsLoading, setConceptsLoading] = useState(true);

  const [form, setForm] = useState<ConceptRuleForm>({
    concept: null,
    matchMode: "ANY IN",
    rows: INITIAL_ROWS,
  });

  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  // Load concepts from FHIR bundle on mount
  useEffect(() => {
    let cancelled = false;
    fetchValueSetBundle().then((bundle) => {
      if (cancelled) return;
      const mapped = mapBundleToConcepts(bundle);
      setConcepts(mapped);
      setForm((f) => ({ ...f, concept: mapped[0] ?? null }));
      setConceptsLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const selectConcept = useCallback((concept: ConceptMeta) => {
    setForm((f) => ({ ...f, concept }));
    setQueryResult(null);
  }, []);

  const setMatchMode = useCallback((matchMode: MatchMode) => {
    setForm((f) => ({ ...f, matchMode }));
  }, []);

  const addRow = useCallback(() => {
    setForm((f) => ({ ...f, rows: [...f.rows, makeDefaultRow()] }));
  }, []);

  const removeRow = useCallback((id: string) => {
    setForm((f) => ({ ...f, rows: f.rows.filter((r) => r.id !== id) }));
  }, []);

  const updateRow = useCallback(
    (id: string, patch: Partial<Omit<RuleRow, "id">>) => {
      setForm((f) => ({
        ...f,
        rows: f.rows.map((r) => {
          if (r.id !== id) return r;
          const updated = { ...r, ...patch };
          // Reset column when recordType changes to ensure valid column selection
          if (patch.recordType && patch.recordType !== r.recordType) {
            updated.column = COLUMNS_BY_RECORD_TYPE[patch.recordType][0];
          }
          return updated;
        }),
      }));
    },
    []
  );

  const runQuery = useCallback(async () => {
    setQueryLoading(true);
    setQueryError(null);
    try {
      const result = await executeConceptQuery(form);
      setQueryResult(result);
    } catch (err) {
      setQueryError(err instanceof Error ? err.message : "Query failed");
    } finally {
      setQueryLoading(false);
    }
  }, [form]);

  const resetResults = useCallback(() => {
    setQueryResult(null);
    setQueryError(null);
  }, []);

  return {
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
    resetResults,
  };
}
