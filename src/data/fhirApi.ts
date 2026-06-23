import type { FhirBundle, FhirValueSet } from "../types/fhir";
import type { ConceptRuleForm, QueryResult } from "../types/domain";
import { mockValueSetBundle, mockMedicationResults } from "../data/mockFhirBundle";

/**
 * Simulated FHIR server base URL.
 * Replace with your real FHIR server endpoint in production:
 *   const BASE_URL = "https://your-fhir-server.example.com/fhir/R4";
 */
const SIMULATED_LATENCY_MS = 600;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetches the ValueSet bundle from the FHIR server.
 * Simulates: GET [base]/ValueSet?status=active&_count=50
 */
export async function fetchValueSetBundle(): Promise<FhirBundle<FhirValueSet>> {
  await delay(SIMULATED_LATENCY_MS);
  return mockValueSetBundle;
}

/**
 * Executes a concept rule query against the FHIR server.
 * Simulates: POST [base]/$evaluate-concept-rules (custom operation)
 *
 * In production this would POST the rule form as a FHIR Parameters resource
 * and receive a Bundle of matching resources back.
 */
export async function executeConceptQuery(
  _form: ConceptRuleForm
): Promise<QueryResult> {
  await delay(SIMULATED_LATENCY_MS);
  return {
    records: mockMedicationResults,
    totalCount: mockMedicationResults.length,
    executedAt: new Date().toISOString(),
  };
}
