// src/components/BottomNav.tsx
// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { Box, Stack, Text, rem } from '@mantine/core';
import {
  IconHeartbeat,
  IconFlask,
  IconMessage,
  IconRoute,
  IconStethoscope,
} from '@tabler/icons-react';
import type { JSX } from 'react';
import { NavLink } from 'react-router';
import classes from './BottomNav.module.css';

const navItems = [
  { to: '/health-record', label: 'Registro', icon: IconHeartbeat },
  { to: '/laboratorio', label: 'Laboratorio', icon: IconFlask },
  { to: '/Communication', label: 'Mensajes', icon: IconMessage },
  { to: '/care-plan', label: 'Plan', icon: IconRoute },
  { to: '/get-care', label: 'Atención', icon: IconStethoscope },
];

export function BottomNav(): JSX.Element {
  return (
    <Box component="nav" className={classes.bottomNav} hiddenFrom="sm">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            isActive ? `${classes.navItem} ${classes.active}` : classes.navItem
          }
        >
          <Stack align="center" gap={2}>
            <item.icon size={22} stroke={1.6} />
            <Text size={rem(10)} fw={600}>
              {item.label}
            </Text>
          </Stack>
        </NavLink>
      ))}
    </Box>
  );
}
