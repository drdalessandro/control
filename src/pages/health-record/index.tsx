// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { Box, Container, Tabs, Title } from '@mantine/core';
import { IconHeartbeat, IconPill, IconTestPipe, IconVaccine } from '@tabler/icons-react';
import type { JSX } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

export function HealthRecord(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  // Leemos la URL actual para saber qué pestaña dejar activa
  // Ej: si la URL es /health-record/vitals, la pestaña activa será "vitals"
  const activeTab = location.pathname.split('/').pop() || 'lab-results';

  return (
    <Box bg="gray.0" mih="100vh" pt={40} pb={120}>
      <Container size="lg">
        
        <Title order={2} fw={800} mb="xl" c="gray.9">
          Mi Registro de Salud
        </Title>

        {/* PESTAÑAS DE NAVEGACIÓN (Diseño App Móvil) */}
        <Tabs
          value={activeTab}
          onChange={(value) => navigate(`/health-record/${value}`)}
          variant="pills"
          color="teal"
          radius="xl"
          mb="xl"
        >
          {/* ScrollArea permite que en pantallas muy chicas las pestañas se deslicen de izquierda a derecha */}
          <Tabs.List style={{ flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '10px' }}>
            <Tabs.Tab value="vitals" leftSection={<IconHeartbeat size={18} />}>
              Métricas Diarias
            </Tabs.Tab>
            <Tabs.Tab value="lab-results" leftSection={<IconTestPipe size={18} />}>
              Laboratorio y SCORE
            </Tabs.Tab>
            <Tabs.Tab value="medications" leftSection={<IconPill size={18} />}>
              Medicación
            </Tabs.Tab>
            <Tabs.Tab value="vaccines" leftSection={<IconVaccine size={18} />}>
              Vacunas
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>

        {/* CONTENEDOR DE LA PÁGINA ACTIVA */}
        <Box 
          bg="white" 
          p={{ base: 'sm', md: 'xl' }} 
          style={{ 
            borderRadius: '24px', 
            boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
            border: '1px solid #eaeaea'
          }}
        >
          {/* Aquí adentro es donde React Router inyecta automáticamente Vitals.tsx o LabResults.tsx */}
          <Outlet />
        </Box>

      </Container>
    </Box>
  );
}
