// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import {
  Box,
  Button,
  Card,
  Container,
  Group,
  NumberInput,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Transition,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { createReference } from '@medplum/core'; // IMPORTANTE: Función oficial de Medplum
import { useMedplum, useMedplumProfile } from '@medplum/react';
import { IconCheck, IconHeartbeat, IconMoonStars, IconScale, IconSend } from '@tabler/icons-react';
import { useState } from 'react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';

export function Vitals(): JSX.Element {
  const navigate = useNavigate();
  const medplum = useMedplum();
  const profile = useMedplumProfile();

  const [systolic, setSystolic] = useState<number | ''>('');
  const [diastolic, setDiastolic] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [sleepHours, setSleepHours] = useState<number | ''>(''); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = Boolean((systolic && diastolic) || weight || sleepHours);

  const handleSubmit = async () => {
    // Verificamos identidad
    if (!profile || !profile.id) {
      notifications.show({
        title: 'Sesión no encontrada',
        message: 'No pudimos verificar tu identidad. Por favor, volvé a ingresar.',
        color: 'red',
      });
      return;
    }

    setIsSubmitting(true);
    const effectiveDateTime = new Date().toISOString();
    
    // CREAMOS LA REFERENCIA OFICIAL A PRUEBA DE ERRORES TS
    const subjectRef = createReference(profile);
    const promises = [];

    try {
      // 1. OBSERVATION: Presión Arterial
      if (systolic && diastolic) {
        promises.push(
          medplum.createResource({
            resourceType: 'Observation',
            status: 'final',
            category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs' }] }],
            code: { coding: [{ system: 'http://loinc.org', code: '85354-9' }] },
            subject: subjectRef,
            effectiveDateTime,
            component: [
              {
                code: { coding: [{ system: 'http://loinc.org', code: '8480-6' }] },
                valueQuantity: { value: Number(systolic), unit: 'mmHg', system: 'http://unitsofmeasure.org', code: 'mm[Hg]' },
              },
              {
                code: { coding: [{ system: 'http://loinc.org', code: '8462-4' }] },
                valueQuantity: { value: Number(diastolic), unit: 'mmHg', system: 'http://unitsofmeasure.org', code: 'mm[Hg]' },
              },
            ],
          })
        );
      }

      // 2. OBSERVATION: Peso
      if (weight) {
        promises.push(
          medplum.createResource({
            resourceType: 'Observation',
            status: 'final',
            category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs' }] }],
            code: { coding: [{ system: 'http://loinc.org', code: '29463-7' }] },
            subject: subjectRef,
            effectiveDateTime,
            valueQuantity: { value: Number(weight), unit: 'kg', system: 'http://unitsofmeasure.org', code: 'kg' },
          })
        );
      }

      // 3. OBSERVATION: Sueño
      if (sleepHours) {
        promises.push(
          medplum.createResource({
            resourceType: 'Observation',
            status: 'final',
            category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs' }] }],
            code: { coding: [{ system: 'http://loinc.org', code: '93832-4' }] },
            subject: subjectRef,
            effectiveDateTime,
            valueQuantity: { value: Number(sleepHours), unit: 'h', system: 'http://unitsofmeasure.org', code: 'h' },
          })
        );
      }

      await Promise.all(promises);

      notifications.show({
        title: '¡Datos guardados!',
        message: 'Tus métricas fueron subidas al servidor clínico exitosamente.',
        color: 'teal',
        icon: <IconCheck size={20} />,
        radius: 'md',
      });

      setSystolic('');
      setDiastolic('');
      setWeight('');
      setSleepHours('');
      navigate('/'); 

    } catch (error) {
      console.error('Error al guardar datos en FHIR:', error);
      notifications.show({
        title: 'Error de conexión',
        message: 'No pudimos guardar tus datos.',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box bg="gray.0" mih="100vh" pb={120} pt={20} pos="relative">
      <Container size="sm">
        <Box mb="xl" ta="center">
          <Title order={2} fw={800} c="gray.9">¿Cómo venimos hoy?</Title>
          <Text c="dimmed" mt="sm">Ingresá los datos que tengas. No hace falta llenar todo.</Text>
        </Box>

        <Stack gap="lg">
          <Card shadow="sm" radius="xl" p="xl" bg="white" withBorder>
            <Group wrap="nowrap" mb="lg">
              <ThemeIcon size={48} radius="xl" color="red" variant="light"><IconHeartbeat size={28} /></ThemeIcon>
              <div>
                <Text fw={700} size="lg">Presión Arterial</Text>
                <Text size="xs" c="dimmed">Sistólica / Diastólica (mmHg)</Text>
              </div>
            </Group>
            <Group grow align="flex-start">
              <NumberInput size="xl" radius="md" placeholder="120" value={systolic} onChange={(val) => setSystolic(val === '' ? '' : Number(val))} min={50} max={250} hideControls styles={{ input: { fontSize: '1.5rem', textAlign: 'center', fontWeight: 600 } }} />
              <Text size="xl" fw={300} c="gray.4" mt="sm" ta="center">/</Text>
              <NumberInput size="xl" radius="md" placeholder="80" value={diastolic} onChange={(val) => setDiastolic(val === '' ? '' : Number(val))} min={30} max={150} hideControls styles={{ input: { fontSize: '1.5rem', textAlign: 'center', fontWeight: 600 } }} />
            </Group>
          </Card>

          <Card shadow="sm" radius="xl" p="xl" bg="white" withBorder>
            <Group wrap="nowrap" mb="lg">
              <ThemeIcon size={48} radius="xl" color="blue" variant="light"><IconScale size={28} /></ThemeIcon>
              <div>
                <Text fw={700} size="lg">Tu Peso</Text>
                <Text size="xs" c="dimmed">En kilogramos (kg)</Text>
              </div>
            </Group>
            <NumberInput size="xl" radius="md" placeholder="75.5" value={weight} onChange={(val) => setWeight(val === '' ? '' : Number(val))} min={30} max={300} decimalScale={1} step={0.1} hideControls rightSection={<Text c="dimmed" fw={600} mr="md">kg</Text>} styles={{ input: { fontSize: '1.5rem', fontWeight: 600 } }} />
          </Card>

          <Card shadow="sm" radius="xl" p="xl" bg="white" withBorder>
            <Group wrap="nowrap" mb="lg">
              <ThemeIcon size={48} radius="xl" color="indigo" variant="light"><IconMoonStars size={28} /></ThemeIcon>
              <div>
                <Text fw={700} size="lg">Horas de Sueño</Text>
                <Text size="xs" c="dimmed">Recuperación nocturna</Text>
              </div>
            </Group>
            <NumberInput size="xl" radius="md" placeholder="7" value={sleepHours} onChange={(val) => setSleepHours(val === '' ? '' : Number(val))} min={0} max={24} decimalScale={1} step={0.5} hideControls rightSection={<Text c="dimmed" fw={600} mr="md">h</Text>} styles={{ input: { fontSize: '1.5rem', fontWeight: 600 } }} />
          </Card>
        </Stack>
      </Container>

      <Transition mounted={canSubmit} transition="slide-up" duration={200} timingFunction="ease">
        {(transitionStyles) => (
          <Box style={{ ...transitionStyles, position: 'fixed', bottom: 0, left: 0, right: 0, padding: '20px', paddingBottom: '30px', background: 'linear-gradient(to top, rgba(255,255,255,1) 60%, rgba(255,255,255,0))', zIndex: 100 }}>
            <Container size="sm">
              <Button fullWidth size="xl" radius="xl" color="teal" onClick={handleSubmit} loading={isSubmitting} rightSection={<IconSend size={20} />} style={{ boxShadow: '0 8px 20px rgba(0, 128, 128, 0.3)' }}>
                Enviar mis datos
              </Button>
            </Container>
          </Box>
        )}
      </Transition>
    </Box>
  );
}
