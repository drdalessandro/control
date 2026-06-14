// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { Alert, Box, Button, Group, Modal, NumberInput, Stack, Table, Title } from '@mantine/core';
import { createReference, formatDate, formatDateTime, formatObservationValue, getReferenceString } from '@medplum/core';
import type { Observation, ObservationComponent, Patient } from '@medplum/fhirtypes';
import { Document, Form, useMedplum } from '@medplum/react';
import { IconAlertCircle } from '@tabler/icons-react';
import type { ChartData, ChartDataset } from 'chart.js';
import { useCallback, useEffect, useState } from 'react';
import type { JSX } from 'react';
import { useParams } from 'react-router';
import { LineChart } from '../../components/LineChart';
import { measurementsMeta } from './Measurement.data';

export function Measurement(): JSX.Element | null {
  const { measurementId } = useParams();
  const { code, title, description, chartDatasets } = measurementsMeta[measurementId as string];
  const medplum = useMedplum();
  const patient = medplum.getProfile() as Patient;
  const [modalOpen, setModalOpen] = useState(false);
  const [chartData, setChartData] = useState<ChartData<'line', number[]>>();
  const [observations, setObservations] = useState<Observation[]>([]);
  const [formError, setFormError] = useState<string>();

  const loadObservations = useCallback(() => {
    medplum
      .searchResources('Observation', `code=${code}&patient=${getReferenceString(patient)}`)
      .then(setObservations)
      .catch(console.error);
  }, [medplum, code, patient]);

  useEffect(() => {
    loadObservations();
  }, [loadObservations]);

  useEffect(() => {
    if (observations) {
      const labels: string[] = [];
      const datasets: ChartDataset<'line', number[]>[] = chartDatasets.map((item) => ({ ...item, data: [] }));
      for (const obs of observations) {
        labels.push(formatDate(obs.effectiveDateTime));
        if (chartDatasets.length === 1) {
          datasets[0].data.push(obs.valueQuantity?.value as number);
        } else {
          for (let i = 0; i < chartDatasets.length; i++) {
            datasets[i].data.push((obs.component as ObservationComponent[])[i].valueQuantity?.value as number);
          }
        }
      }
      setChartData({ labels, datasets });
    }
  }, [chartDatasets, observations]);

  function addObservation(formData: Record<string, string>): void {
    // Presión arterial: la sistólica (8480-6) debe ser mayor que la diastólica (8462-4).
    const systolicDataset = chartDatasets.find((d) => d.code === '8480-6');
    const diastolicDataset = chartDatasets.find((d) => d.code === '8462-4');
    if (systolicDataset && diastolicDataset) {
      const systolic = Number.parseFloat(formData[systolicDataset.label]);
      const diastolic = Number.parseFloat(formData[diastolicDataset.label]);
      if (!Number.isFinite(systolic) || !Number.isFinite(diastolic)) {
        setFormError('Ingresá ambos valores: sistólica (el número más alto) y diastólica (el más bajo).');
        return;
      }
      if (systolic <= diastolic) {
        setFormError('La presión sistólica debe ser mayor que la diastólica. Revisá que no estén invertidas.');
        return;
      }
    }
    setFormError(undefined);

    const obs: Observation = {
      resourceType: 'Observation',
      status: 'final',
      subject: createReference(patient),
      effectiveDateTime: new Date().toISOString(),
      code: {
        coding: [
          {
            code,
            display: title,
            system: 'http://loinc.org',
          },
        ],
        text: title,
      },
    };

    if (chartDatasets.length === 1) {
      obs.valueQuantity = {
        value: Number.parseFloat(formData[chartDatasets[0].label]),
        system: 'http://unitsofmeasure.org',
        unit: chartDatasets[0].unit,
        code: chartDatasets[0].unit,
      };
    } else {
      obs.component = chartDatasets.map((item) => ({
        code: {
          coding: [
            {
              code: item.code,
              display: item.label,
              system: 'http://loinc.org',
            },
          ],
          text: item.label,
        },
        valueQuantity: {
          value: Number.parseFloat(formData[item.label]),
          system: 'http://unitsofmeasure.org',
          unit: item.unit,
          code: item.unit,
        },
      }));
    }

    medplum
      .createResource(obs)
      .then(() => {
        setModalOpen(false);
        loadObservations();
      })
      .catch(console.error);
  }

  return (
    <Document>
      <Group justify="space-between" mb="xl">
        <Title order={1}>{title}</Title>
        <Button
          onClick={() => {
            setFormError(undefined);
            setModalOpen(true);
          }}
        >
          Agregar medición
        </Button>
      </Group>
      {chartData && <LineChart chartData={chartData} />}
      <Box my="xl">
        <Alert icon={<IconAlertCircle size={16} />} title="¿Qué es esta medición?" color="gray" radius="md">
          {description}
        </Alert>
      </Box>
      {observations?.length && (
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Fecha</Table.Th>
              <Table.Th>Su valor</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {observations.map((obs) => (
              <Table.Tr key={obs.id}>
                <Table.Td>{formatDateTime(obs.effectiveDateTime as string)}</Table.Td>
                <Table.Td>{formatObservationValue(obs)}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
      <Modal
        size="lg"
        opened={modalOpen}
        onClose={() => {
          setFormError(undefined);
          setModalOpen(false);
        }}
        title={title}
      >
        <Form onSubmit={addObservation}>
          <Stack gap="md">
            {formError && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" radius="md">
                {formError}
              </Alert>
            )}
            <Group grow wrap="nowrap">
              {chartDatasets.map((component) => (
                <NumberInput key={component.label} label={component.label} name={component.label} />
              ))}
            </Group>
            <Group justify="flex-end">
              <Button type="submit">Agregar</Button>
            </Group>
          </Stack>
        </Form>
      </Modal>
    </Document>
  );
}
