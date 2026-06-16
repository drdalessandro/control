// SPDX-License-Identifier: Apache-2.0
// ============================================================================
// "Tu corazón hoy" — motor de palancas personales del paciente.
// ----------------------------------------------------------------------------
// Deriva, de las propias Observations del paciente, qué factores modificables
// (Life's Essential 8 / CKM) están en objetivo y cuáles puede mejorar. NO
// recalcula PREVENT (eso lo computa Seguimiento); solo compara el último valor
// de cada factor contra objetivos saludables generales.
//
// Importante (ético): estos objetivos son una guía general. Los objetivos
// personales del paciente los define su equipo médico.
// ============================================================================
import type { Observation } from '@medplum/fhirtypes';

export type LeverDirection = 'lower' | 'higher' | 'range';

export interface LeverDef {
  readonly id: string;
  readonly code: string; // LOINC del recurso/panel
  readonly componentCode?: string; // para la sistólica dentro del panel de PA
  readonly label: string;
  readonly unit: string;
  readonly targetText: string;
  readonly direction: LeverDirection;
  readonly optimalMax?: number; // 'lower'
  readonly optimalMin?: number; // 'higher'
  readonly rangeMin?: number; // 'range'
  readonly rangeMax?: number; // 'range'
  readonly tip: string;
}

// Orden = prioridad clínica para mostrar (PA y lípidos primero).
export const LEVERS: readonly LeverDef[] = [
  {
    id: 'bp',
    code: '85354-9',
    componentCode: '8480-6',
    label: 'Presión arterial',
    unit: 'mmHg',
    targetText: 'menos de 120',
    direction: 'lower',
    optimalMax: 120,
    tip: 'Movete todos los días, bajá la sal y, si te la indicaron, tomá tu medicación a horario.',
  },
  {
    id: 'non-hdl',
    code: '43396-1',
    label: 'Colesterol No-HDL',
    unit: 'mg/dL',
    targetText: 'menos de 130',
    direction: 'lower',
    optimalMax: 130,
    tip: 'Más fibra, legumbres y pescado; menos ultraprocesados. La medicación para el colesterol ayuda mucho.',
  },
  {
    id: 'ldl',
    code: '13457-7',
    label: 'Colesterol LDL',
    unit: 'mg/dL',
    targetText: 'menos de 100',
    direction: 'lower',
    optimalMax: 100,
    tip: 'Reducí grasas saturadas y sumá actividad. Si tomás estatinas, sostenelas.',
  },
  {
    id: 'hba1c',
    code: '4548-4',
    label: 'Hemoglobina glicosilada (HbA1c)',
    unit: '%',
    targetText: 'menos de 5.7',
    direction: 'lower',
    optimalMax: 5.7,
    tip: 'Menos azúcar y harinas refinadas, más caminata después de comer.',
  },
  {
    id: 'glucose',
    code: '1558-6',
    label: 'Glucemia en ayunas',
    unit: 'mg/dL',
    targetText: 'menos de 100',
    direction: 'lower',
    optimalMax: 100,
    tip: 'Cuidá las porciones y sumá movimiento; el sueño también ayuda a la glucemia.',
  },
  {
    id: 'trig',
    code: '2571-8',
    label: 'Triglicéridos',
    unit: 'mg/dL',
    targetText: 'menos de 150',
    direction: 'lower',
    optimalMax: 150,
    tip: 'Menos alcohol y azúcar; más pescado y actividad aeróbica.',
  },
  {
    id: 'waist',
    code: '56086-2',
    label: 'Circunferencia de cintura',
    unit: 'cm',
    targetText: 'una cintura más chica',
    direction: 'lower',
    optimalMax: 94,
    tip: 'Pequeños cambios sostenidos en comida y movimiento reducen la cintura.',
  },
  {
    id: 'bmi',
    code: '39156-5',
    label: 'Índice de masa corporal (IMC)',
    unit: 'kg/m²',
    targetText: 'entre 18.5 y 25',
    direction: 'range',
    rangeMin: 18.5,
    rangeMax: 25,
    tip: 'No se trata de dietas extremas: un paso por día, sostenido.',
  },
  {
    id: 'hdl',
    code: '2085-9',
    label: 'Colesterol HDL ("bueno")',
    unit: 'mg/dL',
    targetText: '40 o más',
    direction: 'higher',
    optimalMin: 40,
    tip: 'La actividad física regular sube el HDL.',
  },
  {
    id: 'egfr',
    code: '62238-1',
    label: 'Función renal (TFGe)',
    unit: 'mL/min',
    targetText: '60 o más',
    direction: 'higher',
    optimalMin: 60,
    tip: 'Cuidar la presión, la glucemia y la hidratación protege tus riñones.',
  },
];

export interface LeverStatus {
  readonly def: LeverDef;
  readonly value: number;
  readonly onTarget: boolean;
}

export interface HeartLevers {
  readonly statuses: LeverStatus[];
  readonly onTarget: LeverStatus[];
  readonly toImprove: LeverStatus[];
}

function latestValue(observations: Observation[], def: LeverDef): number | undefined {
  const matching = observations
    .filter((o) => o.code?.coding?.some((c) => c.code === def.code))
    .sort((a, b) =>
      (b.effectiveDateTime ?? b.meta?.lastUpdated ?? '').localeCompare(a.effectiveDateTime ?? a.meta?.lastUpdated ?? '')
    );
  const latest = matching[0];
  if (!latest) {
    return undefined;
  }
  if (def.componentCode) {
    const comp = latest.component?.find((c) => c.code?.coding?.some((cc) => cc.code === def.componentCode));
    return comp?.valueQuantity?.value;
  }
  return latest.valueQuantity?.value;
}

function isOnTarget(def: LeverDef, value: number): boolean {
  switch (def.direction) {
    case 'lower':
      return value <= (def.optimalMax ?? Infinity);
    case 'higher':
      return value >= (def.optimalMin ?? -Infinity);
    case 'range':
      return value >= (def.rangeMin ?? -Infinity) && value <= (def.rangeMax ?? Infinity);
    default:
      return true;
  }
}

/** Evalúa todas las palancas contra el último valor cargado del paciente. */
export function computeHeartLevers(observations: Observation[]): HeartLevers {
  const statuses: LeverStatus[] = [];
  for (const def of LEVERS) {
    const value = latestValue(observations, def);
    if (value === undefined || Number.isNaN(value)) {
      continue;
    }
    statuses.push({ def, value, onTarget: isOnTarget(def, value) });
  }
  return {
    statuses,
    onTarget: statuses.filter((s) => s.onTarget),
    toImprove: statuses.filter((s) => !s.onTarget),
  };
}
