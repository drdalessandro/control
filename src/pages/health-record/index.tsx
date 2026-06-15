// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { Box, Container, Tabs, Title } from '@mantine/core';
import { IconHeartbeat, IconPill, IconTestPipe, IconVaccine } from '@tabler/icons-react';
import { Suspense } from 'react';
import type { JSX } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { Loading } from '../../components/Loading';

export function HealthRecord(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  // Leemos la URL actual para dejar activa la pestaña correcta automáticamente
  const activeTab = location.pathname.split('/').pop() || 'lab-results';

  return (
    <Box bg="gray.0" mih="100vh" pt={40} pb={120}>
      <Container size="lg">
        
        <Title order={2} fw={800} mb="xl" c="gray.9">
          Mi Registro de Salud
        </Title>

        {/* PESTAÑAS TIPO APP MÓVIL (Reemplazan al viejo SideMenu) */}
        <Tabs
          value={activeTab}
          onChange={(value) => navigate(`/health-record/${value}`)}
          variant="pills"
          color="teal"
          radius="xl"
          mb="xl"
        >
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

        {/* CONTENEDOR DE LA PANTALLA ACTIVA */}
        <Box 
          bg="white" 
          p={{ base: 'sm', md: 'xl' }} 
          style={{ 
            borderRadius: '24px', 
            boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
            border: '1px solid #eaeaea'
          }}
        >
          {/* Outlet inyecta automáticamente Vitals, LabResults, etc. */}
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </Box>

      </Container>
    </Box>
  );
}
