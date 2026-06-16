// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { Container, Group, Stack } from '@mantine/core';
import { Suspense } from 'react';
import type { JSX } from 'react';
import { Outlet } from 'react-router';
import { Loading } from '../../components/Loading';
import { Plan100Card } from '../../components/Plan100';
import { SideMenu } from '../../components/SideMenu';

const sideMenu = {
  title: 'Plan 100 Días',
  menu: [{ name: 'Mis acciones', href: '/care-plan/action-items' }],
};

export function CarePlanPage(): JSX.Element {
  return (
    <Container>
      <Group align="top">
        <SideMenu {...sideMenu} />
        <div style={{ width: 800, flex: 800 }}>
          <Stack gap="lg">
            <Plan100Card />
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
          </Stack>
        </div>
      </Group>
    </Container>
  );
}
