// SPDX-License-Identifier: Apache-2.0
// "Tu corazón hoy" — versión paciente, motivacional y accionable.
// Muestra en qué factores el paciente va bien y cuáles puede mejorar, derivados
// de sus propias Observations. El número PREVENT y el estadío CKM se leen (no se
// recalculan) de Seguimiento; esa sección se enchufa cuando esté el contrato.
import { Badge, Box, Button, Card, Divider, Group, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { getReferenceString } from '@medplum/core';
import type { Patient } from '@medplum/fhirtypes';
import { useMedplum } from '@medplum/react';
import { IconCircleCheck, IconHeart, IconTargetArrow } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import { CKM_STAGE_LABELS, getCKMStage, getPreventScores, type PreventScores } from '../utils/ckm';
import { computeHeartLevers, type HeartLevers } from '../utils/heartLevers';

const MAX_TO_IMPROVE = 3;

export function HeartToday(): JSX.Element | null {
  const medplum = useMedplum();
  const navigate = useNavigate();
  const patient = medplum.getProfile() as Patient;
  const [levers, setLevers] = useState<HeartLevers>();
  const [stage, setStage] = useState<number>();
  const [prevent, setPrevent] = useState<PreventScores>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      medplum.searchResources('Observation', `patient=${getReferenceString(patient)}&_count=100&_sort=-date`),
      // Leemos el Patient fresco: las extensiones CKM/PREVENT las escribe el bot.
      patient.id ? medplum.readResource('Patient', patient.id) : Promise.resolve(patient),
    ])
      .then(([obs, freshPatient]) => {
        if (!active) {
          return;
        }
        setLevers(computeHeartLevers(obs));
        setStage(getCKMStage(freshPatient));
        setPrevent(getPreventScores(freshPatient));
      })
      .catch(console.error)
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [medplum, patient]);

  if (loading || !levers) {
    return null;
  }

  // Todavía no cargó ningún dato: invitamos a empezar.
  if (levers.statuses.length === 0) {
    return (
      <Card shadow="md" radius="md" withBorder p="xl">
        <Group wrap="nowrap" gap="md">
          <ThemeIcon size={48} radius="xl" color="teal" variant="light">
            <IconHeart size={28} />
          </ThemeIcon>
          <div>
            <Text fw={700} size="lg">
              Tu corazón hoy
            </Text>
            <Text c="dimmed" size="sm">
              Cargá tus primeros datos (presión, laboratorio) y acá vas a ver qué cuidar y qué mejorar.
            </Text>
          </div>
          <Button ml="auto" onClick={() => navigate('/health-record/vitals/blood-pressure')?.catch(console.error)}>
            Empezar
          </Button>
        </Group>
      </Card>
    );
  }

  const total = levers.statuses.length;
  const onTargetCount = levers.onTarget.length;
  const toImprove = levers.toImprove.slice(0, MAX_TO_IMPROVE);

  return (
    <Card shadow="md" radius="md" withBorder p="xl">
      <Group justify="space-between" align="flex-start" mb="md">
        <Group gap="sm">
          <ThemeIcon size={40} radius="xl" color="teal" variant="light">
            <IconHeart size={24} />
          </ThemeIcon>
          <div>
            <Title order={3}>Tu corazón hoy</Title>
            <Text c="dimmed" size="sm">
              Vas bien en <b>{onTargetCount}</b> de <b>{total}</b> factores que cuidan tu corazón.
            </Text>
          </div>
        </Group>
        <Badge size="lg" color="teal" variant="light">
          {onTargetCount}/{total} en objetivo
        </Badge>
      </Group>

      {toImprove.length === 0 ? (
        <Group gap="sm" c="teal">
          <IconCircleCheck size={20} />
          <Text fw={600}>¡Vas muy bien! Todos tus factores están en objetivo. Sostené tus hábitos.</Text>
        </Group>
      ) : (
        <Stack gap="md">
          <Group gap="xs">
            <IconTargetArrow size={18} />
            <Text fw={600}>Lo que más mueve tu corazón ahora</Text>
          </Group>
          {toImprove.map((s) => (
            <Box key={s.def.id} pl="md" style={{ borderLeft: '3px solid var(--mantine-color-orange-4)' }}>
              <Group justify="space-between" wrap="nowrap">
                <Text fw={600}>{s.def.label}</Text>
                <Text size="sm" c="dimmed">
                  Tu valor: <b>{s.value}</b> {s.def.unit} · Objetivo: {s.def.targetText}
                </Text>
              </Group>
              <Text size="sm" c="dimmed">
                {s.def.tip}
              </Text>
            </Box>
          ))}
        </Stack>
      )}

      <Divider my="lg" />

      {/* Riesgo PREVENT / estadío CKM: se LEE de Seguimiento (no se recalcula). */}
      {stage !== undefined || prevent?.ascvd10y !== undefined ? (
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="xl">
          {stage !== undefined && (
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Tu estadío CKM
              </Text>
              <Badge size="lg" color={CKM_STAGE_LABELS[stage].color} variant="light" mt={4}>
                Estadío {stage}
              </Badge>
              <Text size="sm" mt={6} maw={320}>
                {CKM_STAGE_LABELS[stage].title}
              </Text>
            </div>
          )}
          {prevent?.ascvd10y !== undefined && (
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Tu riesgo cardiovascular a 10 años
              </Text>
              <Text fw={800} fz="2rem" c="teal" lh={1.1} mt={4}>
                {prevent.ascvd10y.toFixed(1)}%
              </Text>
              <Text size="xs" c="dimmed" maw={320}>
                Estimación PREVENT (American Heart Association). Bajarlo está en tus manos, junto a tu equipo.
              </Text>
            </div>
          )}
        </Group>
      ) : (
        <Text size="sm" c="dimmed">
          Tu riesgo cardiovascular (PREVENT) y tu estadío CKM los calcula tu equipo de Favaloro a partir de tus datos.
          Cargá tus datos y, en minutos, los vas a ver acá.
        </Text>
      )}

      <Group justify="space-between" mt="md">
        <Text size="xs" c="dimmed" maw={460}>
          Estos objetivos son una guía general saludable. Tus metas personales las define tu equipo médico.
        </Text>
        <Button variant="light" onClick={() => navigate('/Communication')?.catch(console.error)}>
          Hablar con mi equipo
        </Button>
      </Group>
    </Card>
  );
}
