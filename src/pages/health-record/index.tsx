// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { Container, Group } from '@mantine/core';
import { Suspense } from 'react';
import type { JSX } from 'react';
import { Outlet } from 'react-router';
import { Loading } from '../../components/Loading';
import { SideMenu } from '../../components/SideMenu';
import { measurementsMeta, vitalsMeasurementIds } from './Measurement.data';

const sideMenu = {
  title: 'Mi Salud',
  menu: [
    { name: 'Resultados de Laboratorio', href: '/health-record/lab-results' },
    { name: 'Medicamentos', href: '/health-record/medications' },
    { name: 'Respuestas de Cuestionarios', href: '/health-record/questionnaire-responses' },
    { name: 'Vacunas', href: '/health-record/vaccines' },
    {
      name: 'Signos vitales',
      href: '/health-record/vitals',
      subMenu: vitalsMeasurementIds.map((id) => ({
        name: measurementsMeta[id].title,
        href: `/health-record/vitals/${id}`,
      })),
    },
  ],
};

export function HealthRecord(): JSX.Element {
  return (
    <Container>
      <Group align="top">
        <SideMenu {...sideMenu} />
        <div style={{ width: 800, flex: 800 }}>
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </div>
      </Group>
    </Container>
  );
}
