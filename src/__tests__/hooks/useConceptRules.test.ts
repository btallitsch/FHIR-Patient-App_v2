import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useConceptRules } from "../../hooks/useConceptRules";
import * as fhirApi from "../../data/fhirApi";
import { mockValueSetBundle, mockMedicationResults } from "../../data/mockFhirBundle";

vi.mock("../../data/fhirApi");

const mockFetchBundle = vi.mocked(fhirApi.fetchValueSetBundle);
const mockExecuteQuery = vi.mocked(fhirApi.executeConceptQuery);

beforeEach(() => {
  vi.clearAllMocks();
  mockFetchBundle.mockResolvedValue(mockValueSetBundle);
  mockExecuteQuery.mockResolvedValue({
    records: mockMedicationResults,
    totalCount: mockMedicationResults.length,
    executedAt: new Date().toISOString(),
  });
});

describe("useConceptRules", () => {
  it("loads concepts from the FHIR bundle on mount", async () => {
    const { result } = renderHook(() => useConceptRules());
    await waitFor(() => expect(result.current.conceptsLoading).toBe(false));
    expect(result.current.concepts.length).toBeGreaterThan(0);
    expect(result.current.concepts[0].name).toContain("Vasopressors");
  });

  it("auto-selects the first concept after loading", async () => {
    const { result } = renderHook(() => useConceptRules());
    await waitFor(() => expect(result.current.conceptsLoading).toBe(false));
    expect(result.current.form.concept).not.toBeNull();
  });

  it("updates the selected concept via selectConcept", async () => {
    const { result } = renderHook(() => useConceptRules());
    await waitFor(() => expect(result.current.conceptsLoading).toBe(false));
    const second = result.current.concepts[1];
    act(() => result.current.selectConcept(second));
    expect(result.current.form.concept?.id).toBe(second.id);
  });

  it("adds a new row via addRow", async () => {
    const { result } = renderHook(() => useConceptRules());
    await waitFor(() => expect(result.current.conceptsLoading).toBe(false));
    const initial = result.current.form.rows.length;
    act(() => result.current.addRow());
    expect(result.current.form.rows).toHaveLength(initial + 1);
  });

  it("removes a row by id via removeRow", async () => {
    const { result } = renderHook(() => useConceptRules());
    await waitFor(() => expect(result.current.conceptsLoading).toBe(false));
    const idToRemove = result.current.form.rows[0].id;
    act(() => result.current.removeRow(idToRemove));
    expect(result.current.form.rows.find((r) => r.id === idToRemove)).toBeUndefined();
  });

  it("updates a row field via updateRow", async () => {
    const { result } = renderHook(() => useConceptRules());
    await waitFor(() => expect(result.current.conceptsLoading).toBe(false));
    const id = result.current.form.rows[0].id;
    act(() => result.current.updateRow(id, { value: "Updated value" }));
    expect(result.current.form.rows[0].value).toBe("Updated value");
  });

  it("resets column to first valid column when recordType changes", async () => {
    const { result } = renderHook(() => useConceptRules());
    await waitFor(() => expect(result.current.conceptsLoading).toBe(false));
    const id = result.current.form.rows[0].id;
    act(() => result.current.updateRow(id, { recordType: "Observation" }));
    // Observation's first column is "Code"
    expect(result.current.form.rows[0].column).toBe("Code");
  });

  it("updates matchMode via setMatchMode", async () => {
    const { result } = renderHook(() => useConceptRules());
    await waitFor(() => expect(result.current.conceptsLoading).toBe(false));
    act(() => result.current.setMatchMode("ALL IN"));
    expect(result.current.form.matchMode).toBe("ALL IN");
  });

  it("populates queryResult after runQuery succeeds", async () => {
    const { result } = renderHook(() => useConceptRules());
    await waitFor(() => expect(result.current.conceptsLoading).toBe(false));
    await act(() => result.current.runQuery());
    expect(result.current.queryResult).not.toBeNull();
    expect(result.current.queryResult?.totalCount).toBe(mockMedicationResults.length);
  });

  it("clears queryResult when selectConcept is called", async () => {
    const { result } = renderHook(() => useConceptRules());
    await waitFor(() => expect(result.current.conceptsLoading).toBe(false));
    await act(() => result.current.runQuery());
    expect(result.current.queryResult).not.toBeNull();
    act(() => result.current.selectConcept(result.current.concepts[1]));
    expect(result.current.queryResult).toBeNull();
  });

  it("sets queryError when the API throws", async () => {
    mockExecuteQuery.mockRejectedValue(new Error("FHIR server unavailable"));
    const { result } = renderHook(() => useConceptRules());
    await waitFor(() => expect(result.current.conceptsLoading).toBe(false));
    await act(() => result.current.runQuery());
    expect(result.current.queryError).toBe("FHIR server unavailable");
    expect(result.current.queryResult).toBeNull();
  });
});
