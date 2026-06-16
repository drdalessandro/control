// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { BackgroundImage, Box, SimpleGrid } from '@mantine/core';
import { RegisterForm } from '@medplum/react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import { MEDPLUM_GOOGLE_CLIENT_ID, MEDPLUM_PROJECT_ID, MEDPLUM_RECAPTCHA_SITE_KEY } from '../config';

export function RegisterPage(): JSX.Element {
  const navigate = useNavigate();

  return (
    <SimpleGrid cols={2}>
      <Box pt={100} pb={200}>
        <RegisterForm
          type="patient"
          projectId={MEDPLUM_PROJECT_ID}
          googleClientId={MEDPLUM_GOOGLE_CLIENT_ID}
          recaptchaSiteKey={MEDPLUM_RECAPTCHA_SITE_KEY}
          onSuccess={() => navigate('/')?.catch(console.error)}
        >
          <h2>Registrarse en Favaloro Argentina</h2>
        </RegisterForm>
      </Box>
    </SimpleGrid>
  );
}
