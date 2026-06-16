// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  Overlay,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { formatHumanName } from '@medplum/core';
import type { Patient, Practitioner } from '@medplum/fhirtypes';
import { useMedplumProfile } from '@medplum/react';
import {
  IconCalendarHeart,
  IconClipboardHeart,
  IconHeartbeat,
  IconMessage2,
  IconReportMedical,
  IconStethoscope,
} from '@tabler/icons-react';
import { useCallback } from 'react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import { HeartToday } from '../components/HeartToday';
import { PlanProgress, PlanStartInvite, usePlan100 } from '../components/Plan100';
import { getPlanDay } from '../utils/plan100';
import classes from './HomePage.module.css';

// Acciones rápidas del paciente. Verbos que invitan a la acción.
const quickActions = [
  { icon: IconHeartbeat, title: 'Cargar mi presión', description: '30 segundos', href: '/health-record/vitals/blood-pressure' },
  { icon: IconReportMedical, title: 'Cargar laboratorio', description: 'Resultados de tu análisis', href: '/laboratory' },
  { icon: IconStethoscope, title: 'Mis registros', description: 'Tu salud en un lugar', href: '/health-record' },
  { icon: IconCalendarHeart, title: 'Mis turnos', description: 'Pedí atención', href: '/get-care' },
];

export function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const profile = useMedplumProfile() as Patient | Practitioner;
  const firstName = profile.name?.[0]?.given?.[0] ?? (profile.name ? formatHumanName(profile.name[0]) : '');
  const { plan, loading, starting, start } = usePlan100();

  const handleStart = useCallback(() => {
    start()
      .then((created) => {
        if (created) {
          navigate('/care-plan')?.catch(console.error);
        }
      })
      .catch(console.error);
  }, [start, navigate]);

  return (
    <Box bg="gray.0">
      <Box className={classes.announcements}>
        <span>Bienvenido/a a Favaloro Argentina · Tu Plan Bienestar 100 Días te espera.</span>
      </Box>

      <div className={classes.hero}>
        <Overlay
          gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.4) 40%)"
          opacity={1}
          zIndex={0}
        />
        <Container className={classes.heroContainer}>
          <Title className={classes.heroTitle}>
            Hola {firstName} 👋<br /> tu bienestar empieza hoy
          </Title>
          <Text c="white" size="xl" maw={620} mb="xl">
            Un paso por día. Te acompañamos durante 100 días para cuidar tu corazón, tus riñones y tu metabolismo.
          </Text>
          {plan ? (
            <Button
              size="xl"
              radius="xl"
              className={classes.heroButton}
              onClick={() => navigate('/care-plan')?.catch(console.error)}
            >
              Continuar — Día {getPlanDay(plan)} de 100
            </Button>
          ) : (
            <Button
              size="xl"
              radius="xl"
              className={classes.heroButton}
              loading={starting}
              onClick={handleStart}
            >
              Empezar mi Plan Bienestar 100 Días
            </Button>
          )}
        </Container>
      </div>

      <Box className={classes.callToAction}>
        <Group justify="center">
          <IconMessage2 />
          <p>¿Tenés una duda? Tu equipo de salud está para ayudarte.</p>
          <Button variant="white" onClick={() => navigate('/Communication')?.catch(console.error)}>
            Escribir a mi equipo
          </Button>
        </Group>
      </Box>

      {/* Tu corazón hoy — palancas personales (el diferencial) */}
      <Box p="lg">
        <Container>
          <HeartToday />
        </Container>
      </Box>

      {/* Plan 100 Días — progreso real (o invitación a empezar) */}
      {!loading && (
        <Box p="lg" pt={0}>
          <Container>
            {plan ? <PlanProgress plan={plan} /> : <PlanStartInvite onStart={handleStart} starting={starting} />}
          </Container>
        </Box>
      )}

      {/* Cuestionario SDOH — recomendado */}
      <Box p="lg" pt={0}>
        <Container>
          <Card
            shadow="md"
            radius="md"
            withBorder
            p="xl"
            style={{ borderColor: theme.colors[theme.primaryColor][6], borderWidth: 2 }}
          >
            <Group justify="space-between" gap="lg">
              <Group wrap="nowrap" gap="md">
                <IconClipboardHeart size={48} color={theme.colors[theme.primaryColor][6]} stroke={1.5} />
                <div>
                  <Badge color={theme.primaryColor} mb={4}>
                    Recomendado
                  </Badge>
                  <Text size="lg" fw={600}>
                    Cuestionario de salud social (SDOH)
                  </Text>
                  <Text size="sm" c="dimmed">
                    Unas pocas preguntas sobre tu situación social y económica. Ayudan a tu equipo de salud a
                    acompañarte mejor.
                  </Text>
                </div>
              </Group>
              <Button size="md" onClick={() => navigate('/sdoh-questionnaire')?.catch(console.error)}>
                Completar cuestionario
              </Button>
            </Group>
          </Card>
        </Container>
      </Box>

      {/* Acciones rápidas */}
      <Box p="lg" pt={0} pb="xl">
        <Container>
          <Text fw={600} size="lg" mb="md">
            Tu acción de hoy
          </Text>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
            {quickActions.map((action) => (
              <Card
                key={action.href}
                shadow="md"
                radius="md"
                withBorder
                p="lg"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(action.href)?.catch(console.error)}
              >
                <ThemeIcon variant="light" size={48} radius="md">
                  <action.icon size={28} stroke={1.5} />
                </ThemeIcon>
                <Text fw={600} mt="md">
                  {action.title}
                </Text>
                <Text size="sm" c="dimmed">
                  {action.description}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
}
