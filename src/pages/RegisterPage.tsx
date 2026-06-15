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
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing={0} style={{ minHeight: '100vh' }}>
      {/* Columna del Formulario: Centrado y responsivo */}
      <Box
        pt={{ base: 40, md: 100 }}
        pb={{ base: 40, md: 200 }}
        px={{ base: 24, sm: 40 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box style={{ width: '100%', maxWidth: 420 }}>
          <RegisterForm
            type="patient"
            projectId={MEDPLUM_PROJECT_ID}
            googleClientId={MEDPLUM_GOOGLE_CLIENT_ID}
            recaptchaSiteKey={MEDPLUM_RECAPTCHA_SITE_KEY}
            onSuccess={() => navigate('/')?.catch(console.error)}
          >
            <h2 style={{ textAlign: 'center', marginBottom: 24, fontFamily: 'sans-serif' }}>
              Registrarse en Foo Medical
            </h2>
          </RegisterForm>
        </Box>
      </Box>

      {/* Columna de la Imagen: Se oculta en celulares y aparece en pantallas medianas/grandes */}
      <Box visibleFrom="md">
        <BackgroundImage
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2000" // Reemplaza con la URL de tu imagen corporativa
          style={{ height: '100%', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
      </Box>
    </SimpleGrid>
  );
}
