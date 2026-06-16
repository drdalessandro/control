// SPDX-License-Identifier: Apache-2.0
// Plan Bienestar 100 Días — hook de datos y tarjetas de progreso reutilizables.
import { Badge, Button, Card, Group, Progress, RingProgress, Stack, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { normalizeErrorString } from '@medplum/core';
import type { CarePlan, Patient } from '@medplum/fhirtypes';
import { useMedplum } from '@medplum/react';
import { IconCircleOff } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import {
  findActivePlan,
  getPlanDay,
  getPlanPhase,
  getPlanProgress,
  PLAN_DURATION_DAYS,
  PLAN_PHASES,
  PLAN_TITLE,
  startPlan,
} from '../utils/plan100';

interface UsePlan100Result {
  readonly plan: CarePlan | undefined;
  readonly loading: boolean;
  readonly starting: boolean;
  readonly start: () => Promise<CarePlan | undefined>;
}

/** Carga el Plan 100 Días activo del paciente y permite iniciarlo. */
export function usePlan100(): UsePlan100Result {
  const medplum = useMedplum();
  const patient = medplum.getProfile() as Patient;
  const [plan, setPlan] = useState<CarePlan>();
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    let active = true;
    findActivePlan(medplum, patient)
      .then((found) => active && setPlan(found))
      .catch(console.error)
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [medplum, patient]);

  const start = useCallback(async (): Promise<CarePlan | undefined> => {
    setStarting(true);
    try {
      const created = await startPlan(medplum, patient);
      setPlan(created);
      return created;
    } catch (err) {
      showNotification({
        color: 'red',
        icon: <IconCircleOff />,
        title: 'No pudimos iniciar tu plan',
        message: normalizeErrorString(err),
      });
      return undefined;
    } finally {
      setStarting(false);
    }
  }, [medplum, patient]);

  return { plan, loading, starting, start };
}

/** Tarjeta de progreso para un plan ya iniciado. */
export function PlanProgress({ plan }: { readonly plan: CarePlan }): JSX.Element {
  const navigate = useNavigate();
  const day = getPlanDay(plan);
  const pct = getPlanProgress(plan);
  const currentPhase = getPlanPhase(day);

  return (
    <Card shadow="md" radius="md" withBorder p="xl">
      <Group justify="space-between" align="center" wrap="wrap" gap="lg">
        <Group wrap="nowrap" gap="xl">
          <RingProgress
            size={120}
            thickness={10}
            roundCaps
            sections={[{ value: pct, color: 'teal' }]}
            label={
              <Text ta="center" fw={700} size="lg">
                Día {day}
                <Text span c="dimmed" fw={400} size="sm">
                  {' '}
                  / {PLAN_DURATION_DAYS}
                </Text>
              </Text>
            }
          />
          <div>
            <Text fw={700} size="lg">
              {PLAN_TITLE}
            </Text>
            <Text c="dimmed" size="sm" maw={440}>
              Estás en la etapa <b>{currentPhase.name}</b>. Pequeños pasos, grandes cambios: seguí cargando tus datos y
              completando tus acciones.
            </Text>
          </div>
        </Group>
        <Button onClick={() => navigate('/care-plan')?.catch(console.error)}>Ver mi plan</Button>
      </Group>
      <Progress value={pct} mt="lg" radius="xl" size="md" color="teal" />
      <Group mt="xs" gap="xl">
        {PLAN_PHASES.map((phase) => (
          <Text key={phase.name} size="xs" c={phase.name === currentPhase.name ? 'teal' : 'dimmed'} fw={phase.name === currentPhase.name ? 700 : 400}>
            {phase.name} ({phase.from}–{phase.to})
          </Text>
        ))}
      </Group>
    </Card>
  );
}

/** Invitación a iniciar el plan, cuando el paciente todavía no lo empezó. */
export function PlanStartInvite({
  onStart,
  starting,
}: {
  readonly onStart: () => void;
  readonly starting: boolean;
}): JSX.Element {
  return (
    <Card shadow="md" radius="md" withBorder p="xl" style={{ borderColor: 'var(--mantine-color-teal-6)', borderWidth: 2 }}>
      <Group justify="space-between" align="center" wrap="wrap" gap="lg">
        <Stack gap={4} maw={520}>
          <Badge color="teal">Tu camino empieza acá</Badge>
          <Text fw={700} size="lg">
            {PLAN_TITLE}
          </Text>
          <Text c="dimmed" size="sm">
            100 días para cuidar tu corazón, tus riñones y tu metabolismo. Un paso por día, con el respaldo de tu equipo.
            Tres etapas: <b>Conocerte</b>, <b>Construir hábitos</b> y <b>Sostener</b>.
          </Text>
        </Stack>
        <Button size="md" loading={starting} onClick={onStart}>
          Empezar mi Plan 100 Días
        </Button>
      </Group>
    </Card>
  );
}

/** Tarjeta inteligente: muestra progreso o invitación según corresponda. */
export function Plan100Card(): JSX.Element | null {
  const navigate = useNavigate();
  const { plan, loading, starting, start } = usePlan100();

  if (loading) {
    return null;
  }
  if (plan) {
    return <PlanProgress plan={plan} />;
  }
  return (
    <PlanStartInvite
      starting={starting}
      onStart={() => {
        start()
          .then((created) => {
            if (created) {
              navigate('/care-plan')?.catch(console.error);
            }
          })
          .catch(console.error);
      }}
    />
  );
}
