// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { AppShell, Box, Button, Container, Grid, Group, Stack, Text, Title, ThemeIcon, Card, useMantineTheme, rem } from '@mantine/core';
import { IconHeartbeat, IconTrophy, IconDeviceAnalytics, IconStethoscope } from '@tabler/icons-react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import { Footer } from '../../components/Footer';
import LabImage from '../../img/landingPage/evidencia_cientifica.png';
import WorkingEnvironmentImage from '../../img/landingPage/control_landing.png';
import { Header } from './Header';
import classes from './index.module.css';

const features = [
  {
    icon: IconDeviceAnalytics,
    title: 'Bienestar con Datos (ASCVD)',
    description: 'Calculamos tu riesgo cardiovascular a 10 y 30 años. Conocé tu edad vascular real y cómo mejorarla.',
  },
  {
    icon: IconTrophy,
    title: 'Plan 100 Días Gamificado',
    description: 'Un mapa de ruta paso a paso basado en los 8 pilares de la American Heart Association.',
  },
  {
    icon: IconHeartbeat,
    title: 'Monitoreo Dinámico',
    description: 'Sincronizá tu presión arterial, peso, cintura y horas de sueño directo desde tu smartphone.',
  },
  {
    icon: IconStethoscope,
    title: 'Segunda Opinión Médica',
    description: 'No estás solo. Tu progreso es supervisado por una red de cardiólogos expertos liderados por el Dr. Alex Barbagelata.',
  },
];

export function LandingPage(): JSX.Element {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  return (
    <AppShell header={{ height: 80 }}>
      <Header />
      <AppShell.Main className={classes.outer}>
        <Box bg="teal.0" pt={{ base: 60, md: 100 }} pb={{ base: 80, md: 120 }}>
          <Container size="xl">
            <Grid align="center" gutter={60}>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Title order={1} size="3.5rem" fw={900} lh={1.1} mb="md" className={classes.title}>
                  Tu Bienestar, en tus manos. <br />
                  <Text component="span" className={classes.highlight} inherit>
                    100 días para mejorar!
                  </Text>
                </Title>
                {/* CORRECCIÓN 1: maxW -> maw */}
                <Text size="xl" c="dimmed" mb="xl" maw={500}>
                  Una Red de Cardiólogos expertos, te acompañaremos durante 100 días, en un proceso de aprendizaje, optimización y desafíos para optimizar tu salud!
                </Text>
                <Group>
                  <Button radius="xl" size="lg" color="teal" onClick={() => navigate('/register')}>
                    Iniciar mi Plan
                  </Button>
                  <Button variant="outline" radius="xl" size="lg" color="teal" onClick={() => navigate('/signin')}>
                    Ya soy paciente
                  </Button>
                </Group>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Box style={{ borderRadius: theme.radius.xl, overflow: 'hidden', boxShadow: theme.shadows.xl }}>
                  <img src={WorkingEnvironmentImage} alt="Bienestar" style={{ width: '100%', display: 'block' }} />
                </Box>
              </Grid.Col>
            </Grid>
          </Container>
        </Box>

        <Container size="xl" py={{ base: 80, md: 120 }}>
          <Grid align="center" gutter={60}>
            <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 2, md: 1 }}>
              <Box style={{ borderRadius: theme.radius.xl, overflow: 'hidden', boxShadow: theme.shadows.md }}>
                <img src={LabImage} alt="Análisis ASCVD" style={{ width: '100%', display: 'block' }} />
              </Box>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 1, md: 2 }}>
              <Title order={3} fw={700} c="teal.6" mb="xs" tt="uppercase" lts={2}>
                Evidencia Científica
              </Title>
              <Title order={2} size="2.5rem" fw={800} mb="md">
                No adivines tu salud. Medila.
              </Title>
              <Text size="lg" c="gray.7" mb="xl">
                Al integrar tus resultados de laboratorio con tus hábitos diarios (peso, sueño, presión), nuestro motor impulsado por FHIR R4 genera un SCORE de riesgo preciso.
              </Text>
            </Grid.Col>
          </Grid>
        </Container>

        <Box bg="gray.0" py={{ base: 80, md: 120 }}>
          <Container size="xl">
            <Title order={2} ta="center" size="2.5rem" fw={800} mb="xl">
              ¿Qué incluye el ecosistema?
            </Title>
            <Grid gutter="xl" mt="xl">
              {features.map((feature, index) => (
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }} key={index}>
                  <Card p="xl" radius="md" bg="white" shadow="sm" style={{ height: '100%' }} className={classes.featureCard}>
                    <ThemeIcon size={60} radius="md" variant="light" color="teal" mb="md">
                      <feature.icon style={{ width: rem(30), height: rem(30) }} stroke={1.5} />
                    </ThemeIcon>
                    <Text size="lg" fw={700} mb="xs">
                      {feature.title}
                    </Text>
                    <Text size="sm" c="dimmed" lh={1.6}>
                      {feature.description}
                    </Text>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Container>
        </Box>

        <Container size="xl" py={{ base: 80, md: 120 }}>
          <Box bg="teal.6" p={{ base: 'xl', md: 'calc(4rem)' }} style={{ borderRadius: theme.radius.xl }}>
            <Stack align="center" ta="center" gap="lg">
              <Title order={2} c="white" size="2.5rem" fw={800}>
                Tu Segunda Opinión Médica te espera.
              </Title>
              {/* CORRECCIÓN 2: maxW -> maw */}
              <Text c="teal.1" size="lg" maw={600}>
                Unite hoy a la red de pacientes que ya están optimizando su salud.
              </Text>
              <Button size="xl" radius="xl" color="white" c="teal.9" mt="md" onClick={() => navigate('/register')}>
                Crear mi cuenta gratis
              </Button>
            </Stack>
          </Box>
        </Container>
      </AppShell.Main>
      <Footer />
    </AppShell>
  );
}
