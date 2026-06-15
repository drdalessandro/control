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
  ThemeIcon,
  Title,
  Progress,
  ActionIcon,
} from '@mantine/core';
import {
  IconActivity,
  IconDroplet,
  IconHeartbeat,
  IconInfoCircle,
  IconStethoscope,
  IconFlame,
} from '@tabler/icons-react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';

// Simulamos los últimos resultados de laboratorio (Próximamente vendrán de FHIR)
const recentLabs = [
  { name: 'Colesterol Total', value: 210, unit: 'mg/dL', status: 'warning', icon: IconDroplet, color: 'yellow', min: 0, max: 240, target: 150 },
  { name: 'Colesterol LDL', value: 135, unit: 'mg/dL', status: 'warning', icon: IconFlame, color: 'orange', min: 0, max: 190, target: 100 },
  { name: 'Colesterol HDL', value: 45, unit: 'mg/dL', status: 'normal', icon: IconActivity, color: 'teal', min: 0, max: 100, target: 50 },
  { name: 'Glucosa (Ayuno)', value: 92, unit: 'mg/dL', status: 'normal', icon: IconDroplet, color: 'teal', min: 60, max: 125, target: 85 },
];

export function LabResults(): JSX.Element {
  const navigate = useNavigate();

  // Valores simulados del motor ASCVD
  const ascvdScore = 8.4; // Riesgo intermedio (ejemplo)
  const scoreColor = ascvdScore < 5 ? 'teal' : ascvdScore < 7.5 ? 'yellow' : ascvdScore < 20 ? 'orange' : 'red';
  const riskLabel = ascvdScore < 5 ? 'Riesgo Bajo' : ascvdScore < 7.5 ? 'Riesgo Límite' : ascvdScore < 20 ? 'Riesgo Intermedio' : 'Riesgo Alto';

  return (
    <Box>
      <Container size="md" px={0}>
        
        {/* SECCIÓN 1: EL SCORE ASCVD (Predictivo) */}
        <Card radius="xl" p={{ base: 'lg', md: 'xl' }} bg="gray.0" mb="xl" style={{ border: '1px solid #eaeaea' }}>
          <Grid align="center" gutter="xl">
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Group justify="center">
                <RingProgress
                  size={180}
                  thickness={16}
                  roundCaps
                  sections={[{ value: (ascvdScore / 20) * 100, color: scoreColor }]}
                  label={
                    <Stack gap={0} align="center">
                      <Text fw={900} size="2rem" c="gray.9" style={{ lineHeight: 1 }}>
                        {ascvdScore}%
                      </Text>
                      <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                        Riesgo 10 Años
                      </Text>
                    </Stack>
                  }
                />
              </Group>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 7 }}>
              <Badge color={scoreColor} variant="light" size="lg" mb="sm">
                {riskLabel}
              </Badge>
              <Title order={3} fw={800} c="gray.9" mb="xs" lh={1.2}>
                Tu Motor Predictivo CKM
              </Title>
              <Text size="sm" c="gray.7" mb="md" lh={1.5}>
                Basado en tus últimos laboratorios y signos vitales, tu probabilidad de sufrir un evento cardiovascular en la próxima década es del <b>{ascvdScore}%</b>. 
              </Text>
              
              <Group wrap="nowrap" align="flex-start" bg="white" p="sm" style={{ borderRadius: '12px' }}>
                <ThemeIcon color="blue" variant="light" size="lg" radius="xl">
                  <IconStethoscope size={20} />
                </ThemeIcon>
                <div>
                  <Text size="xs" fw={700} c="gray.9">Segunda Opinión - Dr. Barbagelata</Text>
                  <Text size="xs" c="dimmed">
                    Estás en una ventana de oportunidad. Reducir tu LDL a menos de 100 mg/dL podría bajar tu riesgo significativamente.
                  </Text>
                </div>
              </Group>
            </Grid.Col>
          </Grid>
        </Card>

        {/* SECCIÓN 2: DESGLOSE DE LABORATORIOS (Life's Essential 8) */}
        <Group justify="space-between" mb="md" mt="xl">
          <Title order={4} fw={800} c="gray.8">
            Tus Biomarcadores
          </Title>
          <ActionIcon variant="light" color="teal" radius="xl">
            <IconInfoCircle size={20} />
          </ActionIcon>
        </Group>

        <Stack gap="md">
          {recentLabs.map((lab, index) => {
            // Calculamos el porcentaje para la barra de progreso
            const progressValue = (lab.value / lab.max) * 100;
            
            return (
              <Card key={index} shadow="none" radius="lg" p="md" withBorder>
                <Grid align="center">
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <Group wrap="nowrap">
                      <ThemeIcon size={42} radius="xl" color={lab.color} variant="light">
                        <lab.icon size={22} />
                      </ThemeIcon>
                      <div>
                        <Text fw={700} size="sm">{lab.name}</Text>
                        <Text size="xs" c="dimmed">Objetivo: &lt; {lab.target} {lab.unit}</Text>
                      </div>
                    </Group>
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, sm: 8 }}>
                    <Group wrap="nowrap" justify="space-between" mb={4}>
                      <Text size="xl" fw={800} c={lab.color === 'teal' ? 'gray.9' : lab.color}>
                        {lab.value} <Text component="span" size="xs" c="dimmed" fw={500}>{lab.unit}</Text>
                      </Text>
                      <Badge color={lab.color} variant="dot">
                        {lab.status === 'normal' ? 'En Rango' : 'Atención'}
                      </Badge>
                    </Group>
                    <Progress 
                      value={progressValue > 100 ? 100 : progressValue} 
                      color={lab.color} 
                      size="md" 
                      radius="xl" 
                      bg="gray.1"
                    />
                  </Grid.Col>
                </Grid>
              </Card>
            );
          })}
        </Stack>

        <Box mt="xl" ta="center">
          <Button 
            variant="outline" 
            color="teal" 
            radius="xl" 
            size="md"
            onClick={() => navigate('/health-record/vaccines')}
          >
            Cargar nuevos laboratorios en PDF
          </Button>
        </Box>

      </Container>
    </Box>
  );
}
