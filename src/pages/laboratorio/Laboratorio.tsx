// SPDX-License-Identifier: Apache-2.0
// ============================================================================
// Control (foomedical fork) — Página "Laboratorio" (rol paciente)
// ----------------------------------------------------------------------------
// Lista las mediciones de laboratorio que el paciente puede cargar. Cada tarjeta
// lleva al formulario de carga reutilizando el componente Measurement existente.
//
// La lista y los títulos se derivan de measurementsMeta para mantenerse en
// sincronía con el contrato de datos (LOINC/unidades) que lee Seguimiento.
// ============================================================================
import { Card, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import type { JSX } from 'react';
import { Link } from 'react-router';
import { labMeasurementIds, measurementsMeta } from '../health-record/Measurement.data';

const BASE_PATH = '/laboratorio';

// Pista corta (unidad) que se muestra debajo de cada título.
const LAB_HINTS: Record<string, string> = {
  tfge: 'TFGe — mL/min/1.73m²',
  triglycerides: 'mg/dL',
  hdl: 'mg/dL',
  ldl: 'mg/dL',
  'non-hdl': 'mg/dL',
  hba1c: '%',
  'fasting-glucose': 'mg/dL',
};

export function Laboratorio(): JSX.Element {
  return (
    <Stack p="md" gap="md">
      <div>
        <Title order={2}>Laboratorio</Title>
        <Text c="dimmed" size="sm">
          Cargá los resultados de tu último análisis de sangre. Copiá cada valor tal como figura en el informe del
          laboratorio.
        </Text>
      </div>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
        {labMeasurementIds.map((id) => (
          <Card
            key={id}
            component={Link}
            to={`${BASE_PATH}/${id}`}
            withBorder
            padding="lg"
            radius="md"
            style={{ textDecoration: 'none' }}
          >
            <Text fw={600}>{measurementsMeta[id]?.title ?? id}</Text>
            <Text c="dimmed" size="xs" mt={4}>
              {LAB_HINTS[id]}
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
