// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { Box, Center, Container, Paper, Stack, Text, Title } from '@mantine/core';
import { SignInForm } from '@medplum/react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import { MEDPLUM_GOOGLE_CLIENT_ID, MEDPLUM_PROJECT_ID } from '../config';

export function SignInPage(): JSX.Element {
  const navigate = useNavigate();

  return (
    <Center mih="100vh" bg="gray.0" p="md">
      <Container size="sm" w="100%" px="md">
        <Paper radius="lg" p="xl" shadow="md" bg="white">
          <Stack gap="lg">
            <Box ta="center">
              <Title order={1} c="teal.6" fw={800} size="h2">
                Tu Bienestar, en Tus Manos
              </Title>
              <Text c="dimmed" size="sm" mt="sm">
                Iniciá tu <b>Plan Bienestar 100 Días</b> y cuidá tu salud cardiovascular con el respaldo de nuestros
                especialistas.
              </Text>
            </Box>
            <SignInForm
              projectId={MEDPLUM_PROJECT_ID}
              googleClientId={MEDPLUM_GOOGLE_CLIENT_ID}
              onSuccess={() => navigate('/')?.catch(console.error)}
            />
          </Stack>
        </Paper>
      </Container>
    </Center>
  );
}
