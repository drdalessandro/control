// SPDX-License-Identifier: Apache-2.0
// ============================================================================
// Plan Bienestar 100 Días — utilidades sobre FHIR CarePlan
// ----------------------------------------------------------------------------
// El plan del paciente se modela como un CarePlan de 100 días. El "día actual"
// se deriva de period.start, así que el progreso es real (no un placeholder).
// ============================================================================
import { createReference, getReferenceString, type MedplumClient } from '@medplum/core';
import type { CarePlan, Patient } from '@medplum/fhirtypes';

export const PLAN_DURATION_DAYS = 100;
export const PLAN_TITLE = 'Plan Bienestar 100 Días';

const PLAN_SYSTEM = 'https://favaloro.com.ar/fhir/care-plan';
const PLAN_CODE = 'bienestar-100-dias';
const MS_PER_DAY = 86_400_000;

export interface PlanPhase {
  readonly name: string;
  readonly from: number;
  readonly to: number;
}

export const PLAN_PHASES: readonly PlanPhase[] = [
  { name: 'Conocerte', from: 1, to: 30 },
  { name: 'Construir hábitos', from: 31, to: 70 },
  { name: 'Sostener', from: 71, to: 100 },
];

/** Día actual del plan (1..100), derivado de period.start. */
export function getPlanDay(plan: CarePlan): number {
  const startStr = plan.period?.start;
  if (!startStr) {
    return 1;
  }
  const elapsed = Math.floor((Date.now() - new Date(startStr).getTime()) / MS_PER_DAY);
  return Math.min(Math.max(elapsed + 1, 1), PLAN_DURATION_DAYS);
}

/** Progreso del plan en porcentaje (0..100). */
export function getPlanProgress(plan: CarePlan): number {
  return Math.round((getPlanDay(plan) / PLAN_DURATION_DAYS) * 100);
}

/** Etapa correspondiente a un día dado. */
export function getPlanPhase(day: number): PlanPhase {
  return PLAN_PHASES.find((p) => day >= p.from && day <= p.to) ?? PLAN_PHASES[PLAN_PHASES.length - 1];
}

/** Busca el Plan 100 Días activo del paciente, si existe. */
export async function findActivePlan(medplum: MedplumClient, patient: Patient): Promise<CarePlan | undefined> {
  // Incluye 'draft': un plan creado por el equipo médico y aún no activado
  // también cuenta como "ya hay plan" (no hay que ofrecer crear otro).
  const plans = await medplum.searchResources(
    'CarePlan',
    `subject=${getReferenceString(patient)}&status=active,draft&_count=20&_sort=-_lastUpdated`
  );
  // Reconoce tanto los planes creados por Control (category bienestar-100-dias)
  // como los creados desde Seguimiento por el equipo médico (por título).
  const isPlan100 = (plan: CarePlan): boolean =>
    Boolean(
      plan.category?.some((cat) => cat.coding?.some((c) => c.code === PLAN_CODE)) ||
        plan.title?.toLowerCase().includes('100 días') ||
        plan.title?.toLowerCase().includes('100 dias')
    );
  const matches = plans.filter(isPlan100);
  return matches.find((plan) => plan.status === 'active') ?? matches[0];
}

/** Crea (inicia) el Plan 100 Días del paciente con el día de hoy como día 1. */
export async function startPlan(medplum: MedplumClient, patient: Patient): Promise<CarePlan> {
  const start = new Date();
  const end = new Date(start.getTime() + PLAN_DURATION_DAYS * MS_PER_DAY);
  return medplum.createResource<CarePlan>({
    resourceType: 'CarePlan',
    status: 'active',
    intent: 'plan',
    title: PLAN_TITLE,
    subject: createReference(patient),
    period: { start: start.toISOString(), end: end.toISOString() },
    category: [{ coding: [{ system: PLAN_SYSTEM, code: PLAN_CODE, display: PLAN_TITLE }], text: PLAN_TITLE }],
  });
}
