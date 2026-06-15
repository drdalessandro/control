// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { Group, Stack, Text } from '@mantine/core';
import type { JSX } from 'react';

export function Logo(props: { width?: number | string }): JSX.Element {
  return (
    <Stack gap={0} align="flex-start" justify="center" style={{ width: props.width }}>
      <Text 
        fw={900} 
        size="2rem" 
        c="teal.8" 
        lh={0.9} 
        style={{ letterSpacing: '-1px', textTransform: 'uppercase' }}
      >
        FAVALORO
      </Text>
      <Group gap={6} mt={4} align="center">
        <Text fw={700} c="gray.5" size="0.65rem" style={{ letterSpacing: '3px' }}>
          ARGENTINA
        </Text>
        <span style={{ fontSize: '0.85rem', lineHeight: 1 }}>🇦🇷</span>
      </Group>
    </Stack>
  );
}
