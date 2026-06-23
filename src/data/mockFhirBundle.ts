import type { FhirBundle, FhirValueSet } from "../types/fhir";

/**
 * Mock FHIR R4 Bundle of ValueSet resources representing the selectable
 * "concepts" in the Conceptual Rules UI.
 *
 * In production, this would be fetched from a FHIR server:
 *   GET [base]/ValueSet?status=active&_count=50
 */
export const mockValueSetBundle: FhirBundle<FhirValueSet> = {
  resourceType: "Bundle",
  id: "concept-valueset-bundle",
  meta: { lastUpdated: "2025-03-18T10:00:00Z" },
  type: "searchset",
  total: 11,
  entry: [
    {
      fullUrl: "http://integrate.health/fhir/ValueSet/vasopressors-and-vasodilators",
      resource: {
        resourceType: "ValueSet",
        id: "vasopressors-and-vasodilators",
        url: "http://integrate.health/fhir/ValueSet/vasopressors-and-vasodilators",
        version: "2",
        name: "INTEGRATEVasopressorsAndVasodilators",
        title: "INTEGRATE Vasopressors and Vasodilators",
        status: "active",
        date: "2025-03-18",
        publisher: "INTEGRATE",
        description:
          "Vasopressor and vasodilator medications identified by RxNorm codes and name patterns.",
      },
    },
    {
      fullUrl: "http://integrate.health/fhir/ValueSet/lactate-codes",
      resource: {
        resourceType: "ValueSet",
        id: "lactate-codes",
        url: "http://integrate.health/fhir/ValueSet/lactate-codes",
        version: "1",
        name: "INTEGRATELactateCodes",
        title: "INTEGRATE Lactate Codes",
        status: "active",
        date: "2024-11-01",
        publisher: "INTEGRATE",
        description: "LOINC codes for serum/plasma lactate observations.",
        compose: {
          include: [
            {
              system: "http://loinc.org",
              concept: [
                { code: "32693-4", display: "Lactate [Moles/volume] in Blood" },
                { code: "2524-7", display: "Lactate [Moles/volume] in Serum or Plasma" },
              ],
            },
          ],
        },
      },
    },
    {
      fullUrl: "http://integrate.health/fhir/ValueSet/hematocrit-codes",
      resource: {
        resourceType: "ValueSet",
        id: "hematocrit-codes",
        url: "http://integrate.health/fhir/ValueSet/hematocrit-codes",
        version: "1",
        name: "INTEGRATEHematocritCodes",
        title: "INTEGRATE Hematocrit Codes",
        status: "active",
        date: "2024-11-01",
        publisher: "INTEGRATE",
        description: "LOINC codes for hematocrit observations.",
      },
    },
    {
      fullUrl: "http://integrate.health/fhir/ValueSet/hemoglobin-codes",
      resource: {
        resourceType: "ValueSet",
        id: "hemoglobin-codes",
        url: "http://integrate.health/fhir/ValueSet/hemoglobin-codes",
        version: "1",
        name: "INTEGRATEHemoglobinCodes",
        title: "INTEGRATE Hemoglobin Codes",
        status: "active",
        date: "2024-11-01",
        publisher: "INTEGRATE",
      },
    },
    {
      fullUrl: "http://integrate.health/fhir/ValueSet/systolic-bp-codes",
      resource: {
        resourceType: "ValueSet",
        id: "systolic-bp-codes",
        url: "http://integrate.health/fhir/ValueSet/systolic-bp-codes",
        version: "1",
        name: "INTEGRATESystolicBPCodes",
        title: "INTEGRATE Systolic Blood Pressure Codes",
        status: "active",
        date: "2024-11-01",
        publisher: "INTEGRATE",
        compose: {
          include: [
            {
              system: "http://loinc.org",
              concept: [
                { code: "8480-6", display: "Systolic blood pressure" },
                { code: "75996-9", display: "Systolic blood pressure by method" },
              ],
            },
          ],
        },
      },
    },
    {
      fullUrl: "http://integrate.health/fhir/ValueSet/vasopressor-names",
      resource: {
        resourceType: "ValueSet",
        id: "vasopressor-names",
        url: "http://integrate.health/fhir/ValueSet/vasopressor-names",
        version: "1",
        name: "INTEGRATEVasopressorNames",
        title: "INTEGRATE Vasopressor Names",
        status: "active",
        date: "2024-11-01",
        publisher: "INTEGRATE",
      },
    },
    {
      fullUrl: "http://integrate.health/fhir/ValueSet/vasopressor-rxcui-codes",
      resource: {
        resourceType: "ValueSet",
        id: "vasopressor-rxcui-codes",
        url: "http://integrate.health/fhir/ValueSet/vasopressor-rxcui-codes",
        version: "1",
        name: "INTEGRATEVasopressorRXCUICodes",
        title: "INTEGRATE Vasopressor RXCUI Codes",
        status: "active",
        date: "2024-11-01",
        publisher: "INTEGRATE",
        compose: {
          include: [
            {
              system: "http://www.nlm.nih.gov/research/umls/rxnorm",
              concept: [
                { code: "3992", display: "Norepinephrine" },
                { code: "3498", display: "Epinephrine" },
                { code: "11149", display: "Vasopressin" },
                { code: "3628", display: "Dopamine" },
                { code: "8163", display: "Phenylephrine" },
              ],
            },
          ],
        },
      },
    },
    {
      fullUrl: "http://integrate.health/fhir/ValueSet/vasodilator-names",
      resource: {
        resourceType: "ValueSet",
        id: "vasodilator-names",
        url: "http://integrate.health/fhir/ValueSet/vasodilator-names",
        version: "1",
        name: "INTEGRATEVasodilatorNames",
        title: "INTEGRATE Vasodilator Names",
        status: "active",
        date: "2024-11-01",
        publisher: "INTEGRATE",
      },
    },
    {
      fullUrl: "http://integrate.health/fhir/ValueSet/vasodilator-rxcui-codes",
      resource: {
        resourceType: "ValueSet",
        id: "vasodilator-rxcui-codes",
        url: "http://integrate.health/fhir/ValueSet/vasodilator-rxcui-codes",
        version: "1",
        name: "INTEGRATEVasodilatorRXCUICodes",
        title: "INTEGRATE Vasodilator RXCUI Codes",
        status: "active",
        date: "2024-11-01",
        publisher: "INTEGRATE",
        compose: {
          include: [
            {
              system: "http://www.nlm.nih.gov/research/umls/rxnorm",
              concept: [
                { code: "7454", display: "Nitroglycerin" },
                { code: "7477", display: "Nitroprusside" },
                { code: "5470", display: "Hydralazine" },
              ],
            },
          ],
        },
      },
    },
    {
      fullUrl: "http://integrate.health/fhir/ValueSet/loq-diastolic-bp",
      resource: {
        resourceType: "ValueSet",
        id: "loq-diastolic-bp",
        url: "http://integrate.health/fhir/ValueSet/loq-diastolic-bp",
        version: "1",
        name: "LOQDiastolicBPCodes",
        title: "LOQ Diastolic Blood Pressure Codes",
        status: "active",
        date: "2024-11-01",
        publisher: "LOQ",
      },
    },
    {
      fullUrl: "http://integrate.health/fhir/ValueSet/loq-systolic-bp",
      resource: {
        resourceType: "ValueSet",
        id: "loq-systolic-bp",
        url: "http://integrate.health/fhir/ValueSet/loq-systolic-bp",
        version: "1",
        name: "LOQSystolicBPCodes",
        title: "LOQ Systolic Blood Pressure Codes",
        status: "active",
        date: "2024-11-01",
        publisher: "LOQ",
      },
    },
  ],
};

/** Simulated MedicationRequest result records for query execution. */
export const mockMedicationResults = [
  { id: "RX-001", name: "Norepinephrine", codes: "3992", adminRoute: "IV", frequency: "Continuous", status: "active" },
  { id: "RX-002", name: "Epinephrine",    codes: "3498", adminRoute: "IV", frequency: "PRN",        status: "active" },
  { id: "RX-003", name: "Vasopressin",    codes: "11149",adminRoute: "IV", frequency: "Continuous", status: "active" },
  { id: "RX-004", name: "Dopamine",       codes: "3628", adminRoute: "IV", frequency: "Continuous", status: "completed" },
  { id: "RX-005", name: "Phenylephrine",  codes: "8163", adminRoute: "IV", frequency: "PRN",        status: "active" },
  { id: "RX-006", name: "Nitroglycerin",  codes: "7454", adminRoute: "IV", frequency: "Continuous", status: "active" },
  { id: "RX-007", name: "Nitroprusside",  codes: "7477", adminRoute: "IV", frequency: "Continuous", status: "completed" },
  { id: "RX-008", name: "Hydralazine",    codes: "5470", adminRoute: "IV", frequency: "Q6H",        status: "active" },
];
