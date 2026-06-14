// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { BackgroundImage, Box, SimpleGrid } from '@mantine/core';
import { SignInForm } from '@medplum/react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import { MEDPLUM_GOOGLE_CLIENT_ID, MEDPLUM_PROJECT_ID } from '../config';

export function SignInPage(): JSX.Element {
  const navigate = useNavigate();
  return (
    <SimpleGrid cols={2}>
      <Box pt={100} pb={200}>
        <SignInForm
          projectId={MEDPLUM_PROJECT_ID}
          googleClientId={MEDPLUM_GOOGLE_CLIENT_ID}
          onSuccess={() => navigate('/')?.catch(console.error)}
        >
          <h2>Ingresar</h2>
        </SignInForm>
      </Box>
      <BackgroundImage src="https://app.medplum.com.ar/static/img/favaloro.png />
    </SimpleGrid>
  );
}
