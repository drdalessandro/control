// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { Box } from '@mantine/core';
import type { JSX } from 'react';
import { Outlet } from 'react-router';

// Este es el componente que el Router no encontraba
export function HealthRecord(): JSX.Element {
  return (
    <Box bg="gray.0" mih="100vh">
      {/* El Outlet permite que Vitals, Labs y otras páginas se rendericen aquí adentro */}
      <Outlet />
    </Box>
  );
}
