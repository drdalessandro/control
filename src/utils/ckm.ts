// SPDX-License-Identifier: Apache-2.0
// ============================================================================
// Lectura del CKM / PREVENT calculados por Seguimiento.
// ----------------------------------------------------------------------------
// Control NO recalcula nada: lee los valores ya computados por el bot
// ckm-recalculate, que los persiste como extensiones del Patient.
// Contrato (seguimiento/src/ckm/{constants,types,extensions}.ts).
// ============================================================================
import type { Patient, RiskAssessment } from '@medplum/fhirtypes';

const CKM_STAGE_URL = 'https://seguimiento.medplum.com.ar/fhir/StructureDefinition/CKMStage';
const HGRAPH_DATA_URL = 'https://seguimiento.medplum.com.ar/fhir/StructureDefinition/hGraphData';

// Contrato del RiskAssessment que emite el bot ckm-recalculate (uno por corrida).
// probabilityDecimal lleva el riesgo en PORCENTAJE (p. ej. 8.5), igual que las
// extensiones, para que el número y su tendencia sean consistentes.
export const PREVENT_OUTCOME_SYSTEM = 'https://seguimiento.medplum.com.ar/fhir/CodeSystem/prevent-outcome';
export const PREVENT_OUTCOME_ASCVD10Y = 'ascvd-10y';

/** Riesgos PREVENT, en porcentaje (p. ej. 8.5 = 8,5 %). */
export interface PreventScores {
  readonly ascvd10y?: number;
  readonly hf10y?: number;
  readonly cvdTotal30y?: number;
}

/** Estadío CKM (0–4) ya calculado por Seguimiento, o undefined si aún no hay. */
export function getCKMStage(patient: Patient): number | undefined {
  const ext = patient.extension?.find((e) => e.url === CKM_STAGE_URL);
  if (!ext) {
    return undefined;
  }
  const raw =
    ext.valueInteger ??
    (ext.valueCode !== undefined ? Number(ext.valueCode) : undefined) ??
    (ext.valueString !== undefined ? Number(ext.valueString) : undefined);
  if (raw === undefined || Number.isNaN(raw)) {
    return undefined;
  }
  const stage = Math.trunc(raw);
  return stage >= 0 && stage <= 4 ? stage : undefined;
}

/** Scores PREVENT ya calculados por Seguimiento, o undefined si aún no hay. */
export function getPreventScores(patient: Patient): PreventScores | undefined {
  const ext = patient.extension?.find((e) => e.url === HGRAPH_DATA_URL);
  if (!ext?.valueString) {
    return undefined;
  }
  try {
    const data = JSON.parse(ext.valueString) as { prevent?: PreventScores };
    return data?.prevent;
  } catch {
    return undefined;
  }
}

export interface RiskPoint {
  readonly date: string;
  readonly value: number;
}

/** Serie temporal (ascendente por fecha) del riesgo ASCVD 10 años desde los RiskAssessment. */
export function getAscvdSeries(assessments: RiskAssessment[]): RiskPoint[] {
  const points: RiskPoint[] = [];
  for (const ra of assessments) {
    const date = ra.occurrenceDateTime ?? ra.meta?.lastUpdated;
    const prediction = ra.prediction?.find((p) => p.outcome?.coding?.some((c) => c.code === PREVENT_OUTCOME_ASCVD10Y));
    const value = prediction?.probabilityDecimal;
    if (date && typeof value === 'number') {
      points.push({ date, value });
    }
  }
  return points.sort((a, b) => a.date.localeCompare(b.date));
}

export interface AscvdDelta {
  readonly current: number;
  readonly previous?: number;
  readonly delta?: number;
}

/** Valor actual y variación vs. el control anterior (positivo = empeoró, negativo = mejoró). */
export function getAscvdDelta(series: RiskPoint[]): AscvdDelta | undefined {
  if (series.length === 0) {
    return undefined;
  }
  const current = series[series.length - 1].value;
  const previous = series.length >= 2 ? series[series.length - 2].value : undefined;
  const delta = previous !== undefined ? Math.round((current - previous) * 10) / 10 : undefined;
  return { current, previous, delta };
}

/** Etiqueta del estadío CKM en lenguaje paciente (no alarmista). */
export const CKM_STAGE_LABELS: Record<number, { readonly title: string; readonly color: string }> = {
  0: { title: 'Sin factores de riesgo — protejamos tu corazón', color: 'teal' },
  1: { title: 'Cuidando tu peso y metabolismo', color: 'lime' },
  2: { title: 'Atendiendo factores metabólicos y riñón', color: 'yellow' },
  3: { title: 'Señales tempranas — a trabajarlo con tu equipo', color: 'orange' },
  4: { title: 'Junto a tu equipo, paso a paso', color: 'red' },
};
