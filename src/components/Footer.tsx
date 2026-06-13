// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { Anchor, Container, Divider, SimpleGrid, Stack, Text } from '@mantine/core';
import type { JSX } from 'react';
import classes from './Footer.module.css';

export function Footer(): JSX.Element {
  return (
    <footer className={classes.footer}>
      <div className={classes.inner}>
        <Container p="xl">
          <Stack gap="xl">
            <SimpleGrid cols={4}>
              <Anchor href="https://www.medplum.com/docs/tutorials/api-basics/create-fhir-data">Primeros pasos</Anchor>
              <Anchor href="https://www.medplum.com/docs/tutorials">Probar Medplum</Anchor>
              <Anchor href="https://github.com/medplum/foomedical">Código abierto</Anchor>
              <Anchor href="https://www.medplum.com/docs">Documentación</Anchor>
            </SimpleGrid>
            <Divider />
            <Text c="dimmed" size="sm">
              &copy; {new Date().getFullYear()} Foo Medical, Inc. Todos los derechos reservados.
            </Text>
          </Stack>
        </Container>
      </div>
    </footer>
  );
}
