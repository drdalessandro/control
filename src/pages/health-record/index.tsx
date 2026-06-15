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
import { useMedplum, useMedplumProfile } from '@medplum/react';
import { IconCheck, IconHeartbeat, IconMoonStars, IconScale, IconSend } from '@tabler/icons-react';
import { useState } from 'react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';

export function Vitals(): JSX.Element {
  const navigate = useNavigate();
  const medplum = useMedplum();
  const profile = useMedplumProfile();

  // Estados limpios y directos para los inputs
  const [systolic, setSystolic] = useState<number | ''>('');
  const [diastolic, setDiastolic] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [sleepHours, setSleepHours] = useState<number | ''>(''); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verificamos si hay al menos un dato cargado
  const canSubmit = Boolean((systolic && diastolic) || weight || sleepHours);

  const handleSubmit = async () => {
    // CORRECCIÓN 1: Verificamos que exista el ID del perfil, no una "reference"
    if (!profile || !profile.id) {
      notifications.show({
        title: 'Sesión no encontrada',
        message: 'No pudimos verificar tu identidad. Por favor, volvé a ingresar.',
        color: 'red',
      });
      return;
    }

    setIsSubmitting(true);
    
    // Capturamos el momento exacto de la carga
    const effectiveDateTime = new Date().toISOString();
    
    // Creamos la cadena de referencia FHIR oficial (Ej: "Patient/12345")
    const subjectReference = { reference: `${profile.resourceType}/${profile.id}` };
    
    const promises = [];

    try {
      // 1. OBSERVATION: Presión Arterial (LOINC: 85354-9)
      if (systolic && diastolic) {
        promises.push(
          medplum.createResource({
            resourceType: 'Observation',
            status: 'final',
            category: [
              {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                    code: 'vital-signs',
                    display: 'Vital Signs',
                  },
                ],
              },
            ],
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '85354-9',
                  display: 'Blood pressure panel with all children optional',
                },
              ],
            },
            // CORRECCIÓN 2: Usamos la referencia construida
            subject: subjectReference,
            effectiveDateTime,
            component: [
              {
                code: {
                  coding: [{ system: 'http://loinc.org', code: '8480-6', display: 'Systolic blood pressure' }],
                },
                valueQuantity: { value: Number(systolic), unit: 'mmHg', system: 'http://unitsofmeasure.org', code: 'mm[Hg]' },
              },
              {
                code: {
                  coding: [{ system: 'http://loinc.org', code: '8462-4', display: 'Diastolic blood pressure' }],
                },
                valueQuantity: { value: Number(diastolic), unit: 'mmHg', system: 'http://unitsofmeasure.org', code: 'mm[Hg]' },
              },
            ],
          })
        );
      }

      // 2. OBSERVATION: Peso (LOINC: 29463-7)
      if (weight) {
        promises.push(
          medplum.createResource({
            resourceType: 'Observation',
            status: 'final',
            category: [
              {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                    code: 'vital-signs',
                    display: 'Vital Signs',
                  },
                ],
              },
            ],
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '29463-7',
                  display: 'Body Weight',
                },
              ],
            },
            // CORRECCIÓN 3: Usamos la referencia construida
            subject: subjectReference,
            effectiveDateTime,
            valueQuantity: { value: Number(weight), unit: 'kg', system: 'http://unitsofmeasure.org', code: 'kg' },
          })
        );
      }

      // 3. OBSERVATION: Horas de Sueño (LOINC: 93832-4)
      if (sleepHours) {
        promises.push(
          medplum.createResource({
            resourceType: 'Observation',
            status: 'final',
            category: [
              {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                    code: 'vital-signs',
                    display: 'Vital Signs',
                  },
                ],
              },
            ],
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '93832-4',
                  display: 'Sleep duration',
                },
              ],
            },
            // CORRECCIÓN 4: Usamos la referencia construida
            subject: subjectReference,
            effectiveDateTime,
            valueQuantity: { value: Number(sleepHours), unit: 'h', system: 'http://unitsofmeasure.org', code: 'h' },
          })
        );
      }

      // Disparamos todas las peticiones a la API en simultáneo
      await Promise.all(promises);

      // Feedback visual de éxito
      notifications.show({
        title: '¡Datos guardados!',
        message: 'Tus métricas fueron subidas al servidor clínico exitosamente.',
        color: 'teal',
        icon: <IconCheck size={20} />,
        radius: 'md',
      });

      // Limpiamos los campos y volvemos al dashboard
      setSystolic('');
      setDiastolic('');
      setWeight('');
      setSleepHours('');
      navigate('/'); 

    } catch (error) {
      console.error('Error al guardar datos en FHIR:', error);
      notifications.show({
        title: 'Error de conexión',
        message: 'No pudimos guardar tus datos. Verificá tu conexión a internet.',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box bg="gray.0" mih="100vh" pb={120} pt={20} pos="relative">
      <Container size="sm">
        
        {/* Cabecera */}
        <Box mb="xl" ta="center">
          <Title order={2} fw={800} c="gray.9">
            ¿Cómo venimos hoy?
          </Title>
          <Text c="dimmed" mt="sm">
            Ingresá los datos que tengas. No hace falta llenar todo.
          </Text>
        </Box>

        <Stack gap="lg">
          {/* TARJETA 1: PRESIÓN ARTERIAL */}
          <Card shadow="sm" radius="xl" p="xl" bg="white" withBorder>
            <Group wrap="nowrap" mb="lg">
              <ThemeIcon size={48} radius="xl" color="red" variant="light">
                <IconHeartbeat size={28} />
              </ThemeIcon>
              <div>
                <Text fw={700} size="lg">Presión Arterial</Text>
                <Text size="xs" c="dimmed">Sistólica / Diastólica (mmHg)</Text>
              </div>
            </Group>

            <Group grow align="flex-start">
              <NumberInput
                size="xl"
                radius="md"
                placeholder="Ej: 120"
                value={systolic}
                onChange={(val) => setSystolic(val === '' ? '' : Number(val))}
                min={50}
                max={250}
                hideControls
                styles={{ input: { fontSize: '1.5rem', textAlign: 'center', fontWeight: 600 } }}
              />
              <Text size="xl" fw={300} c="gray.4" mt="sm" ta="center">/</Text>
              <NumberInput
                size="xl"
                radius="md"
                placeholder="Ej: 80"
                value={diastolic}
                onChange={(val) => setDiastolic(val === '' ? '' : Number(val))}
                min={30}
                max={150}
                hideControls
                styles={{ input: { fontSize: '1.5rem', textAlign: 'center', fontWeight: 600 } }}
              />
            </Group>
          </Card>

          {/* TARJETA 2: PESO */}
          <Card shadow="sm" radius="xl" p="xl" bg="white" withBorder>
            <Group wrap="nowrap" mb="lg">
              <ThemeIcon size={48} radius="xl" color="blue" variant="light">
                <IconScale size={28} />
              </ThemeIcon>
              <div>
                <Text fw={700} size="lg">Tu Peso</Text>
                <Text size="xs" c="dimmed">En kilogramos (kg)</Text>
              </div>
            </Group>

            <NumberInput
              size="xl"
              radius="md"
              placeholder="Ej: 75.5"
              value={weight}
              onChange={(val) => setWeight(val === '' ? '' : Number(val))}
              min={30}
              max={300}
              decimalScale={1}
              step={0.1}
              hideControls
              rightSection={<Text c="dimmed" fw={600} mr="md">kg</Text>}
              styles={{ input: { fontSize: '1.5rem', fontWeight: 600 } }}
            />
          </Card>

          {/* TARJETA 3: SUEÑO */}
          <Card shadow="sm" radius="xl" p="xl" bg="white" withBorder>
            <Group wrap="nowrap" mb="lg">
              <ThemeIcon size={48} radius="xl" color="indigo" variant="light">
                <IconMoonStars size={28} />
              </ThemeIcon>
              <div>
                <Text fw={700} size="lg">Horas de Sueño</Text>
                <Text size="xs" c="dimmed">Recuperación nocturna</Text>
              </div>
            </Group>

            <NumberInput
              size="xl"
              radius="md"
              placeholder="Ej: 7"
              value={sleepHours}
              onChange={(val) => setSleepHours(val === '' ? '' : Number(val))}
              min={0}
              max={24}
              decimalScale={1}
              step={0.5}
              hideControls
              rightSection={<Text c="dimmed" fw={600} mr="md">h</Text>}
              styles={{ input: { fontSize: '1.5rem', fontWeight: 600 } }}
            />
          </Card>
        </Stack>
      </Container>

      {/* BOTÓN FLOTANTE TIPO WHATSAPP */}
      <Transition mounted={canSubmit} transition="slide-up" duration={200} timingFunction="ease">
        {(transitionStyles) => (
          <Box
            style={{
              ...transitionStyles,
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '20px',
              paddingBottom: '30px',
              background: 'linear-gradient(to top, rgba(255,255,255,1) 60%, rgba(255,255,255,0))',
              zIndex: 100,
            }}
          >
            <Container size="sm">
              <Button
                fullWidth
                size="xl"
                radius="xl"
                color="teal"
                onClick={handleSubmit}
                loading={isSubmitting}
                rightSection={<IconSend size={20} />}
                style={{ boxShadow: '0 8px 20px rgba(0, 128, 128, 0.3)' }}
              >
                Enviar mis datos
              </Button>
            </Container>
          </Box>
        )}
      </Transition>
    </Box>
  );
}
