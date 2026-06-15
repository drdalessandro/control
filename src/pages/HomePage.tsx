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
  Progress,
  RingProgress,
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
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import classes from './HomePage.module.css';

// Acciones rápidas del paciente. Verbos que invitan a la acción.
const quickActions = [
  { icon: IconHeartbeat, title: 'Cargar mi presión', description: '30 segundos', href: '/health-record/vitals/blood-pressure' },
  { icon: IconReportMedical, title: 'Cargar laboratorio', description: 'Resultados de tu análisis', href: '/laboratorio' },
  { icon: IconStethoscope, title: 'Mis registros', description: 'Tu salud en un lugar', href: '/health-record' },
  { icon: IconCalendarHeart, title: 'Mis turnos', description: 'Pedí atención', href: '/get-care' },
];

export function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const profile = useMedplumProfile() as Patient | Practitioner;
  const firstName = profile.name?.[0]?.given?.[0] ?? (profile.name ? formatHumanName(profile.name[0]) : '');

  // Plan 100 Días — estado visual (placeholder; en Fase 2 se lee del CarePlan real).
  const planDay = 1;
  const planTotal = 100;
  const planPct = Math.round((planDay / planTotal) * 100);

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
          <Button
            size="xl"
            radius="xl"
            className={classes.heroButton}
            onClick={() => navigate('/care-plan')?.catch(console.error)}
          >
            Empezar mi Plan Bienestar 100 Días
          </Button>
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

      {/* Plan 100 Días — tarjeta de progreso */}
      <Box p="lg">
        <Container>
          <Card shadow="md" radius="md" withBorder p="xl">
            <Group justify="space-between" align="center" wrap="wrap" gap="lg">
              <Group wrap="nowrap" gap="xl">
                <RingProgress
                  size={120}
                  thickness={10}
                  roundCaps
                  sections={[{ value: planPct, color: theme.primaryColor }]}
                  label={
                    <Text ta="center" fw={700} size="lg">
                      Día {planDay}
                      <Text span c="dimmed" fw={400} size="sm">
                        {' '}
                        / {planTotal}
                      </Text>
                    </Text>
                  }
                />
                <div>
                  <Text fw={700} size="lg">
                    Plan Bienestar 100 Días
                  </Text>
                  <Text c="dimmed" size="sm" maw={440}>
                    Pequeños pasos, grandes cambios. Estás en la etapa <b>Conocerte</b>: cargá tus datos y completá el
                    cuestionario para ver tu mapa de salud.
                  </Text>
                </div>
              </Group>
              <Button onClick={() => navigate('/care-plan')?.catch(console.error)}>Ver mi plan</Button>
            </Group>
            <Progress value={planPct} mt="lg" radius="xl" size="md" />
            <Group mt="xs" gap="xl">
              <Text size="xs" c="dimmed">
                Etapa 1 · Conocerte (días 1–30)
              </Text>
              <Text size="xs" c="dimmed">
                Etapa 2 · Construir hábitos (31–70)
              </Text>
              <Text size="xs" c="dimmed">
                Etapa 3 · Sostener (71–100)
              </Text>
            </Group>
          </Card>
        </Container>
      </Box>

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
              <Button size="md" onClick={() => navigate('/cuestionario-sdoh')?.catch(console.error)}>
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
