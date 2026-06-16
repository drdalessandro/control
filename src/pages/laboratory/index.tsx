// SPDX-License-Identifier: Apache-2.0
import { Container, Group } from '@mantine/core';
import { Suspense } from 'react';
import type { JSX } from 'react';
import { Outlet } from 'react-router';
import { Loading } from '../../components/Loading';
import { SideMenu } from '../../components/SideMenu';
import { labMeasurementIds, measurementsMeta } from '../health-record/Measurement.data';

const sideMenu = {
  title: 'Laboratorio',
  menu: labMeasurementIds.map((id) => ({
    name: measurementsMeta[id].title,
    href: `/laboratory/${id}`,
  })),
};

export function LaboratoryLayout(): JSX.Element {
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
