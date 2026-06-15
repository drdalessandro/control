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
  useMantineTheme,
  Transition,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMedplum, useMedplumProfile } from '@medplum/react';
import { IconCheck, IconHeartbeat, IconScale, IconSend } from '@tabler/icons-react';
import { useState } from 'react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';

export function Vitals(): JSX.Element {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const medplum = useMedplum();
  const profile = useMedplumProfile();

  // Estados limpios y directos para los inputs
  const [systolic, setSystolic] = useState<number | ''>('');
  const [diastolic, setDiastolic] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verificamos si hay al menos un dato para habilitar el botón de envío
  const canSubmit = (systolic && diastolic) || weight;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // ACÁ VA LA MAGIA DE MEDPLUM (FHIR R4)
      // Simulamos un pequeñísimo delay para que se sienta el efecto de "enviando"
      await new Promise((resolve) => setTimeout(resolve, 800));

      /* 
      TODO: Próximo paso. Acá armaremos los recursos 'Observation' nativos de FHIR:
      if (systolic && diastolic) {
        await medplum.createResource({
          resourceType: 'Observation',
          status: 'final',
          category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs' }] }],
          code: { coding: [{ system: 'http://loinc.org', code: '85354-9' }] },
          subject: { reference: profile?.reference },
          ...
        });
      }
      */

      // Feedback visual de éxito tipo WhatsApp ("Enviado ✓✓")
      notifications.show({
        title: '¡Datos guardados!',
        message: 'Tus métricas ya están actualizadas en tu Plan 100 Días.',
        color: 'teal',
        icon: <IconCheck size={20} />,
        radius: 'md',
      });

      // Limpiamos los campos o volvemos al inicio
      setSystolic('');
      setDiastolic('');
      setWeight('');
      navigate('/'); 

    } catch (error) {
      notifications.show({
        title: 'Ups, algo falló',
        message: 'No pudimos guardar tus datos. Intentá de nuevo.',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    {/* CORRECCIÓN APLICADA AQUÍ: minH -> mih */}
    <Box bg="gray.0" mih="100vh" pb={100} pt={20}>
      <Container size="sm">
        
        {/* Cabecera Simple y Conversacional */}
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
          <Card shadow="sm" radius="xl" p="xl" bg="white" style={{ border: '1px solid #eaeaea' }}>
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
          <Card shadow="sm" radius="xl" p="xl" bg="white" style={{ border: '1px solid #eaeaea' }}>
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
        </Stack>

      </Container>

      {/* BOTÓN FLOTANTE TIPO WHATSAPP (Anclado abajo) */}
      <Transition mounted={!!canSubmit} transition="slide-up" duration={200} timingFunction="ease">
        {(styles) => (
          <Box
            style={{
              ...styles,
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '20px',
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
