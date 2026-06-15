// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { AppShell, Box, Container, Grid, Group, Stack, Text, Title, ThemeIcon, Image, Badge, Card } from '@mantine/core';
import { IconHeartRateMonitor, IconStethoscope, IconBooks, IconActivityHeartbeat } from '@tabler/icons-react';
import type { JSX } from 'react';
import { Footer } from '../../components/Footer';
import { Header } from './Header'; // Asumiendo que el Header está en la misma carpeta

const scientificPillars = [
  {
    badge: 'AHA Protocol',
    title: "Life's Essential 8™",
    description: "No inventamos métricas nuevas, usamos el estándar de oro mundial. La American Heart Association define la salud cardiovascular óptima basándose en 8 factores medibles. Nuestro algoritmo toma tus datos diarios (sueño, dieta, actividad) y los cruza con tus laboratorios (lípidos, glucosa) para decirte exactamente en qué pilar debes enfocarte hoy.",
    icon: IconHeartRateMonitor,
    // Aquí puedes poner la URL real de la infografía de la AHA
    imgSrc: "https://www.heart.org/-/media/Healthy-Living-Images/Healthy-Lifestyle/Lifes-Essential-8/Lifes_Essential_8_Infographic_Spanish.jpg",
    reverse: false
  },
  {
    badge: 'Motor Predictivo',
    title: 'Calculadora de Riesgo ASCVD a 10 y 30 años',
    description: 'El riesgo de enfermedad cardiovascular aterosclerótica (ASCVD) no se adivina, se calcula. Integrando las ecuaciones agrupadas del ACC/AHA (American College of Cardiology), EPA Bienestar proyecta tu riesgo a una década. Esto permite a nuestro equipo médico (y a ti) tomar decisiones clínicas tempranas antes de que ocurra un evento agudo.',
    icon: IconActivityHeartbeat,
    // Gráfico de las curvas de riesgo de ASCVD
    imgSrc: "https://www.ahajournals.org/cms/asset/608298ad-d596-41dc-9d4d-61695de97587/hc0114008702.jpeg",
    reverse: true
  },
  {
    badge: 'Paradigma Innovador',
    title: 'Abordaje del Síndrome CKM',
    description: 'Bajo la visión del Dr. Alex Barbagelata, no miramos el corazón de forma aislada. El Síndrome CKM (Cardio-Kidney-Metabolic) demuestra cómo la obesidad, la diabetes y la enfermedad renal crónica interactúan para destruir la salud vascular. Monitorizamos tu estadio CKM (de 0 a 4) para frenar la progresión sistémica.',
    icon: IconStethoscope,
    // Gráfico de los estadios del Síndrome CKM
    imgSrc: "https://professional.heart.org/-/media/Images/Science-and-Clinical/Clinical-Guidelines/CKM/CKM_Stages_Graphic.jpg",
    reverse: false
  }
];

export function ScientificEvidence(): JSX.Element {
  return (
    <AppShell header={{ height: 80 }}>
      <Header />
      
      <AppShell.Main>
        {/* HERO SECTION */}
        <Box bg="gray.9" pt={100} pb={120} style={{ position: 'relative', overflow: 'hidden' }}>
          <Box 
            style={{ 
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
              background: 'radial-gradient(circle at 80% 50%, rgba(0, 128, 128, 0.4), transparent 50%)' 
            }} 
          />
          <Container size="md" style={{ position: 'relative', zIndex: 1 }}>
            <Stack align="center" ta="center">
              <ThemeIcon size={60} radius="xl" color="teal" variant="light" mb="md">
                <IconBooks size={30} />
              </ThemeIcon>
              <Title order={1} size="3.5rem" fw={900} c="white" lh={1.1}>
                Medicina basada en <Text component="span" c="teal.4" inherit>Evidencia Pura.</Text>
              </Title>
              <Text size="xl" c="gray.4" mt="md" maw={700}>
                Impulsados por algoritmos validados internacionalmente y respaldados por American Heart Association (AHA).
              </Text>
            </Stack>
          </Container>
        </Box>

        {/* SECCIONES CIENTÍFICAS */}
        <Container size="xl" py={100}>
          <Stack gap={100}>
            {scientificPillars.map((pillar, index) => (
              <Grid key={index} align="center" gutter={60}>
                
                {/* Lado de la Imagen */}
                <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 2, md: pillar.reverse ? 2 : 1 }}>
                  <Card radius="xl" p={0} style={{ overflow: 'hidden', border: '1px solid #eaeaea', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
                    {/* El Image component de Mantine se encarga de que la foto encaje perfecto */}
                    <Image 
                      src={pillar.imgSrc} 
                      alt={`Gráfico de ${pillar.title}`} 
                      fallbackSrc="src/img/landingPage/le8_evidencia.png"
                    />
                  </Card>
                </Grid.Col>

                {/* Lado del Texto */}
                <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 1, md: pillar.reverse ? 1 : 2 }}>
                  <Badge color="teal" variant="light" size="lg" mb="sm" fw={800} tt="uppercase" lts={1}>
                    {pillar.badge}
                  </Badge>
                  <Title order={2} size="2.5rem" fw={800} c="gray.9" mb="md" lh={1.2}>
                    {pillar.title}
                  </Title>
                  <Text size="lg" c="gray.7" lh={1.6}>
                    {pillar.description}
                  </Text>
                  <Group mt="xl" wrap="nowrap">
                    <ThemeIcon size={48} radius="xl" color="teal" variant="light">
                      <pillar.icon size={24} />
                    </ThemeIcon>
                    <Text size="sm" fw={600} c="gray.6">
                      Algoritmo integrado activamente en la API de FHIR R4 de la plataforma.
                    </Text>
                  </Group>
                </Grid.Col>

              </Grid>
            ))}
          </Stack>
        </Container>

      </AppShell.Main>
      <Footer />
    </AppShell>
  );
}
