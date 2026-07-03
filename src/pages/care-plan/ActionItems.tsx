// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
// ============================================================================
// "Mis acciones" — checklist del Plan Bienestar 100 Días (rol paciente)
// ----------------------------------------------------------------------------
// Lee las activity reales del CarePlan (activity.detail) y las muestra
// agrupadas por categoría, con su estado FHIR traducido a lenguaje paciente.
// El paciente puede pasar una acción de "Para empezar" a "En curso" y de
// "En curso" a "¡Lograda!" — eso actualiza activity.detail.status en el
// CarePlan, que es exactamente donde el equipo médico ve la adherencia.
// ============================================================================
import { Badge, Box, Button, Card, Group, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { formatDate, getReferenceString, normalizeErrorString } from '@medplum/core';
import type { CarePlan, CarePlanActivityDetail, Patient } from '@medplum/fhirtypes';
import { StatusBadge, useMedplum } from '@medplum/react';
import { IconCalendar, IconCircleCheck, IconCircleOff } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import { InfoButton } from '../../components/InfoButton';
import { InfoSection } from '../../components/InfoSection';
import { findActivePlan } from '../../utils/plan100';

type ActivityStatus = CarePlanActivityDetail['status'];

// Estado FHIR → lenguaje paciente.
const STATUS_META: Record<string, { label: string; color: string }> = {
  'not-started': { label: 'Para empezar', color: 'gray' },
  scheduled: { label: 'Programada', color: 'blue' },
  'in-progress': { label: 'En curso', color: 'teal' },
  'on-hold': { label: 'En pausa', color: 'yellow' },
  completed: { label: '¡Lograda!', color: 'teal' },
  cancelled: { label: 'Cancelada', color: 'gray' },
  stopped: { label: 'Suspendida', color: 'gray' },
  unknown: { label: 'Sin estado', color: 'gray' },
};

interface PlanActivity {
  readonly index: number; // índice en plan.activity (para persistir el cambio)
  readonly category: string;
  readonly title: string;
  readonly description?: string;
  readonly status: ActivityStatus;
}

// El título viene como "[Categoría] Título" desde Seguimiento.
function parseActivity(plan: CarePlan): PlanActivity[] {
  const result: PlanActivity[] = [];
  plan.activity?.forEach((activity, index) => {
    const detail = activity.detail;
    if (!detail || detail.status === 'entered-in-error') {
      return;
    }
    const raw = detail.code?.text ?? detail.code?.coding?.[0]?.display ?? 'Acción';
    const match = /^\[([^\]]+)\]\s*(.*)$/.exec(raw);
    result.push({
      index,
      category: match ? match[1] : 'Mi plan',
      title: match ? match[2] : raw,
      description: detail.description,
      status: detail.status,
    });
  });
  return result;
}

export function ActionItems(): JSX.Element {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const medplum = useMedplum();
  const patient = medplum.getProfile() as Patient;
  const [plan, setPlan] = useState<CarePlan>();
  const [otherPlans, setOtherPlans] = useState<CarePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingIndex, setSavingIndex] = useState<number>();

  useEffect(() => {
    let active = true;
    Promise.all([
      findActivePlan(medplum, patient),
      medplum.searchResources('CarePlan', `subject=${getReferenceString(patient)}&_count=20&_sort=-_lastUpdated`),
    ])
      .then(([mainPlan, allPlans]) => {
        if (!active) {
          return;
        }
        setPlan(mainPlan);
        setOtherPlans(allPlans.filter((p) => p.id !== mainPlan?.id));
      })
      .catch(console.error)
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [medplum, patient]);

  function updateActivityStatus(index: number, newStatus: ActivityStatus): void {
    if (!plan) {
      return;
    }
    setSavingIndex(index);
    const updated: CarePlan = {
      ...plan,
      activity: plan.activity?.map((a, i) =>
        i === index && a.detail ? { ...a, detail: { ...a.detail, status: newStatus } } : a
      ),
    };
    medplum
      .updateResource(updated)
      .then((saved) => {
        setPlan(saved);
        if (newStatus === 'completed') {
          showNotification({
            icon: <IconCircleCheck />,
            title: '¡Muy bien!',
            message: 'Acción lograda. Tu equipo de salud lo va a ver en tu plan.',
          });
        }
      })
      .catch((err) => {
        showNotification({
          color: 'red',
          icon: <IconCircleOff />,
          title: 'No pudimos guardar el cambio',
          message: normalizeErrorString(err),
        });
      })
      .finally(() => setSavingIndex(undefined));
  }

  if (loading) {
    return <Box p="xl" />;
  }

  const activities = plan ? parseActivity(plan) : [];
  const inProgress = activities.filter((a) => a.status === 'in-progress').length;
  const completed = activities.filter((a) => a.status === 'completed').length;

  // Agrupa por categoría preservando el orden de aparición.
  const categories: string[] = [];
  const byCategory = new Map<string, PlanActivity[]>();
  for (const activity of activities) {
    if (!byCategory.has(activity.category)) {
      categories.push(activity.category);
      byCategory.set(activity.category, []);
    }
    byCategory.get(activity.category)?.push(activity);
  }

  return (
    <Box p="xl" pt={0}>
      <Title mb="xs">Mis acciones</Title>
      {plan ? (
        <>
          <Text c="dimmed" size="sm" mb="lg">
            {activities.length} acciones en tu plan · <b>{inProgress}</b> en curso · <b>{completed}</b> logradas.
            Marcá cada una a medida que la incorporás: tu equipo lo ve en tiempo real.
          </Text>
          <Stack gap="lg">
            {categories.map((category) => (
              <div key={category}>
                <Text fw={700} size="sm" tt="uppercase" c="dimmed" mb="xs">
                  {category}
                </Text>
                <Stack gap="sm">
                  {byCategory.get(category)?.map((activity) => {
                    const meta = STATUS_META[activity.status] ?? STATUS_META.unknown;
                    const done = activity.status === 'completed';
                    return (
                      <Card key={activity.index} withBorder radius="md" p="md">
                        <Group justify="space-between" align="flex-start" wrap="nowrap" gap="md">
                          <div>
                            <Group gap="xs" mb={4}>
                              <Text fw={600} td={done ? 'line-through' : undefined} c={done ? 'dimmed' : undefined}>
                                {activity.title}
                              </Text>
                              <Badge color={meta.color} variant={done ? 'filled' : 'light'} size="sm">
                                {meta.label}
                              </Badge>
                            </Group>
                            {activity.description && (
                              <Text size="sm" c="dimmed">
                                {activity.description}
                              </Text>
                            )}
                          </div>
                          <Stack gap={4} align="flex-end">
                            {(activity.status === 'not-started' || activity.status === 'scheduled') && (
                              <Button
                                size="xs"
                                loading={savingIndex === activity.index}
                                onClick={() => updateActivityStatus(activity.index, 'in-progress')}
                              >
                                Empezar
                              </Button>
                            )}
                            {activity.status === 'in-progress' && (
                              <Button
                                size="xs"
                                variant="light"
                                loading={savingIndex === activity.index}
                                onClick={() => updateActivityStatus(activity.index, 'completed')}
                              >
                                ¡La logré!
                              </Button>
                            )}
                            {done && (
                              <Button
                                size="xs"
                                variant="subtle"
                                color="gray"
                                loading={savingIndex === activity.index}
                                onClick={() => updateActivityStatus(activity.index, 'in-progress')}
                              >
                                Retomar
                              </Button>
                            )}
                          </Stack>
                        </Group>
                      </Card>
                    );
                  })}
                </Stack>
              </div>
            ))}
          </Stack>
          {activities.length === 0 && (
            <Text c="dimmed">
              Tu plan todavía no tiene acciones cargadas. Tu equipo de salud las va a definir con vos.
            </Text>
          )}
        </>
      ) : (
        <Text c="dimmed" mb="lg">
          Todavía no tenés un plan activo. Podés empezarlo desde la tarjeta de arriba, o tu equipo de salud puede
          crearlo por vos.
        </Text>
      )}

      {otherPlans.length > 0 && (
        <Box mt="xl">
          <InfoSection title="Otros planes">
            <Stack gap={0}>
              {otherPlans.map((resource) => (
                <InfoButton key={resource.id} onClick={() => navigate(`./${resource.id}`)?.catch(console.error)}>
                  <div>
                    <Text c={theme.primaryColor} fw={500}>
                      {resource.title}
                    </Text>
                    <Text mt="sm" c="gray.5" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <IconCalendar size={16} />
                      <time>{formatDate(resource.period?.start)} </time>
                      {resource.period?.end && <time>&nbsp;-&nbsp;{formatDate(resource.period.end)}</time>}
                    </Text>
                  </div>
                  <StatusBadge status={resource.status as string} />
                </InfoButton>
              ))}
            </Stack>
          </InfoSection>
        </Box>
      )}
    </Box>
  );
}
