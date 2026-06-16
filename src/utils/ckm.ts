// SPDX-License-Identifier: Apache-2.0
// ============================================================================
// Lectura del CKM / PREVENT calculados por Seguimiento.
// ----------------------------------------------------------------------------
// Control NO recalcula nada: lee los valores ya computados por el bot
// ckm-recalculate, que los persiste como extensiones del Patient.
// Contrato (seguimiento/src/ckm/{constants,types,extensions}.ts).
// ============================================================================
import type { Patient } from '@medplum/fhirtypes';

const CKM_STAGE_URL = 'https://seguimiento.medplum.com.ar/fhir/StructureDefinition/CKMStage';
const HGRAPH_DATA_URL = 'https://seguimiento.medplum.com.ar/fhir/StructureDefinition/hGraphData';

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

/** Etiqueta del estadío CKM en lenguaje paciente (no alarmista). */
export const CKM_STAGE_LABELS: Record<number, { readonly title: string; readonly color: string }> = {
  0: { title: 'Sin factores de riesgo — protejamos tu corazón', color: 'teal' },
  1: { title: 'Cuidando tu peso y metabolismo', color: 'lime' },
  2: { title: 'Atendiendo factores metabólicos y riñón', color: 'yellow' },
  3: { title: 'Señales tempranas — a trabajarlo con tu equipo', color: 'orange' },
  4: { title: 'Junto a tu equipo, paso a paso', color: 'red' },
};
