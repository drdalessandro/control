// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Group,
  RingProgress,
  Stack,
  Text,
  Title,
  ThemeIcon,
  useMantineTheme,
  ActionIcon,
} from '@mantine/core';
import { formatHumanName } from '@medplum/core';
import type { Patient, Practitioner } from '@medplum/fhirtypes';
import { useMedplumProfile } from '@medplum/react';
import { 
  IconHeartbeat, 
  IconScale, 
  IconMoonStars, 
  IconTrophy, 
  IconStethoscope, 
  IconChevronRight,
  IconActivity
} from '@tabler/icons-react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import classes from './HomePage.module.css';

const quickActions = [
  { icon: IconHeartbeat, color: 'red', title: 'Presión Arterial', description: 'Registrá tu medición de hoy', url: '/health-record/vitals' },
  { icon: IconScale, color: 'blue', title: 'Peso y Cintura', description: 'Actualizá tu índice metabólico', url: '/health-record/vitals' },
  { icon: IconMoonStars, color: 'indigo', title: 'Horas de Sueño', description: 'Vital para la recuperación', url: '/health-record/vitals' },
];

const milestones = [
  { title: 'Día 7 completado', description: '¡Tu primera semana perfecta! Hábitos en formación.' },
  { title: 'Score ASCVD Base', description: 'Laboratorios cargados. Conocé tu riesgo a 10 años.' },
  { title: 'Revisión Médica', description: 'Tus datos fueron visados por el equipo cardiológico.' },
];

export function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const profile = useMedplumProfile() as Patient | Practitioner;
  const profileName = profile.name ? formatHumanName(profile.name[0]).split(' ')[0] : 'Paciente';

  const dayOfPlan = 14; 
  const totalDays = 100;
  const progressPercent = (dayOfPlan / totalDays) * 100;

  return (
    <Box bg="gray.0" pb={80}>
      <Box className={classes.hero}>
        <Container size="xl" className={classes.heroContainer}>
          <Grid align="center" w="100%">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Badge color="teal.2" c="teal.9" size="lg" radius="xl" mb="sm" fw={600}>
                Plan Bienestar • Día {dayOfPlan}
              </Badge>
              <Title className={classes.heroTitle}>
                ¡Buen día, {profileName}! <br />
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.75em' }}>
                  Es momento de cuidar tu corazón.
                </span>
              </Title>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Group justify="center">
                <RingProgress
                  size={140}
                  thickness={14}
                  roundCaps
                  sections={[{ value: progressPercent, color: 'white' }]}
                  label={
                    <Text c="white" fw={700} ta="center" size="xl">
                      {dayOfPlan}/100
                    </Text>
                  }
                />
              </Group>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      <Container size="xl" mt="-40px" style={{ position: 'relative', zIndex: 10 }}>
        <Card shadow="xl" radius="lg" p="xl" mb="xl" className={classes.alertCard}>
          <Group justify="space-between" gap="lg" wrap="nowrap">
            <Group wrap="nowrap" gap="md">
              <ThemeIcon size={54} radius="xl" color="teal" variant="light">
                <IconActivity size={32} />
              </ThemeIcon>
              <div>
                <Text size="lg" fw={700} c="gray.9">
                  Tu SCORE ASCVD está listo
                </Text>
                <Text size="sm" c="dimmed" mt={4}>
                  Procesamos tus laboratorios. Descubrí tu edad vascular y el impacto de completarlo.
                </Text>
              </div>
            </Group>
            <Button radius="xl" color="teal" onClick={() => navigate('/health-record/lab-results')}>
              Ver mi Riesgo
            </Button>
          </Group>
        </Card>

        <Title order={3} mb="md" fw={700} c="gray.8">Tus Métricas de Hoy</Title>
        <Grid mb="xl">
          {quickActions.map((item, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 4 }}>
              <Card shadow="sm" radius="lg" p="lg" className={classes.actionCard} onClick={() => navigate(item.url)}>
                <Group wrap="nowrap">
                  <ThemeIcon size={48} radius="md" color={item.color} variant="light">
                    <item.icon size={28} />
                  </ThemeIcon>
                  <Box style={{ flex: 1 }}>
                    <Text fw={600} size="md">{item.title}</Text>
                    <Text size="xs" c="dimmed">{item.description}</Text>
                  </Box>
                  <ActionIcon variant="subtle" color="gray">
                    <IconChevronRight size={20} />
                  </ActionIcon>
                </Group>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Title order={3} mb="md" fw={700} c="gray.8">Segunda Opinión</Title>
            <Card shadow="sm" radius="lg" p="xl" h="100%">
              <Group wrap="nowrap" align="flex-start">
                <ThemeIcon size={60} radius="xl" color="teal" variant="filled">
                  <IconStethoscope size={34} />
                </ThemeIcon>
                <div>
                  <Badge color="teal" variant="light" mb={8}>Dr. Alex Barbagelata</Badge>
                  <Text fw={700} size="lg" mb={4}>Supervisión Cardiológica</Text>
                  <Text size="sm" c="dimmed" mb="md" lh={1.5}>
                    Tu progreso es monitoreado por nuestra red de especialistas. Solicitá una revisión integral de tus datos en cualquier momento.
                  </Text>
                  <Button variant="outline" color="teal" radius="xl" onClick={() => navigate('/messages')}>
                    Contactar al Equipo
                  </Button>
                </div>
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Title order={3} mb="md" fw={700} c="gray.8">Tu Mapa de Ruta</Title>
            <Card shadow="sm" radius="lg" p="xl" h="100%">
              <Stack gap="md">
                {milestones.map((item, index) => (
                  <Group key={index} wrap="nowrap">
                    <ThemeIcon size={40} radius="xl" color="yellow" variant="light">
                      <IconTrophy size={20} />
                    </ThemeIcon>
                    <div>
                      <Text fw={600} size="sm">{item.title}</Text>
                      <Text size="xs" c="dimmed">{item.description}</Text>
                    </div>
                  </Group>
                ))}
                <Button variant="subtle" color="teal" mt="sm" onClick={() => navigate('/care-plan')}>
                  Ver Plan Completo
                </Button>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

      </Container>
    </Box>
  );
}
