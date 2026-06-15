// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import {
  Anchor,
  AppShell,
  Box,
  Burger,
  Button,
  Center,
  Collapse,
  Container,
  Divider,
  Drawer,
  Group,
  HoverCard,
  rem,
  ScrollArea,
  SimpleGrid,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconHeartbeat,
  IconStethoscope,
  IconTrophy,
  IconChartInfographic,
  IconActivity,
  IconChevronDown,
  IconDeviceMobileVibration,
} from '@tabler/icons-react';
import type { JSX } from 'react';
import { useNavigate, Link } from 'react-router';
import { Logo } from '../../components/Logo';
import classes from './Header.module.css';

const programFeatures = [
  {
    icon: IconTrophy,
    title: 'Plan Bienestar 100 Días',
    description: 'Un mapa de ruta gamificado para transformar tus hábitos.',
  },
  {
    icon: IconStethoscope,
    title: 'Segunda Opinión Médica',
    description: 'Red de expertos liderada por el Dr. Alex Barbagelata.',
  },
  {
    icon: IconDeviceMobileVibration,
    title: 'Bienestar con Datos',
    description: 'Sincronizá tu presión, peso y horas de sueño desde tu smartphone.',
  },
  {
    icon: IconChartInfographic,
    title: 'Scores ASCVD Inteligentes',
    description: 'Conocé tu riesgo cardiovascular a 10 y 30 años con precisión clínica.',
  },
  {
    icon: IconHeartbeat,
    title: 'Life\'s Essential 8',
    description: 'Respaldado por las métricas de la American Heart Association.',
  },
  {
    icon: IconActivity,
    title: 'Acompañamiento Continuo',
    description: 'Monitoreo dinámico sin sentir que estás en un hospital.',
  },
];

export function Header(): JSX.Element {
  const navigate = useNavigate();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();

  const links = programFeatures.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="light" color="teal" radius="md">
          <item.icon style={{ width: rem(22), height: rem(22) }} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={600} c="gray.9">
            {item.title}
          </Text>
          <Text size="xs" c="dimmed" lh={1.4}>
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  return (
    <>
      <AppShell.Header px="md" style={{ borderBottom: '1px solid #eaeaea' }}>
        <Container h="100%" size="xl">
          <Group justify="space-between" h="100%">
            <UnstyledButton className={classes.logoButton} onClick={() => navigate('/')?.catch(console.error)}>
              <Logo width={200} />
            </UnstyledButton>

            <Group style={{ height: '100%' }} gap={10} className={classes.hiddenMobile}>
              <HoverCard width={650} position="bottom" radius="md" shadow="xl" withinPortal>
                <HoverCard.Target>
                  <a href="#" className={classes.link}>
                    <Center inline>
                      <Box component="span" mr={5} fw={500}>
                        El Programa
                      </Box>
                      <IconChevronDown size={16} />
                    </Center>
                  </a>
                </HoverCard.Target>

                <HoverCard.Dropdown style={{ overflow: 'hidden' }} p={0}>
                  <Box p="md" bg="gray.0">
                    <Group justify="space-between">
                      <Text fw={600} size="sm">Ecosistema EPA Bienestar</Text>
                      <Anchor href="#" size="xs" fw={500} c="teal">
                        Conocer más
                      </Anchor>
                    </Group>
                  </Box>

                  <Divider mx={0} />

                  <SimpleGrid cols={2} spacing={20} p="md">
                    {links}
                  </SimpleGrid>

                  <Box className={classes.dropdownFooter} p="md" bg="teal.0">
                    <Group justify="space-between">
                      <div>
                        <Text fw={600} size="sm" c="teal.9">
                          ¿Listo para transformar tu salud?
                        </Text>
                        <Text size="xs" c="teal.7">
                          Ingresá tus datos y obtené tu diagnóstico base hoy.
                        </Text>
                      </div>
                      <Button radius="xl" color="teal" onClick={() => navigate('/register')?.catch(console.error)}>
                        Comenzar Ahora
                      </Button>
                    </Group>
                  </Box>
                </HoverCard.Dropdown>
              </HoverCard>

              <a href="#" className={classes.link}>Nuestros Especialistas</a>
              <a href="#" className={classes.link} onClick={(e) => { e.preventDefault(); navigate('/evidencia-cientifica'); }}>
  Evidencia Científica
</a>
            </Group>

            <Group className={classes.hiddenMobile}>
              <Button variant="subtle" color="teal" onClick={() => navigate('/signin')?.catch(console.error)}>
                Ingresar
              </Button>
              <Button radius="xl" color="teal" onClick={() => navigate('/register')?.catch(console.error)}>
                Unirme al Plan
              </Button>
            </Group>

            <Burger opened={drawerOpened} onClick={toggleDrawer} className={classes.hiddenDesktop} color="teal" />
          </Group>
        </Container>
      </AppShell.Header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title={<Text fw={700} c="teal">Navegación</Text>}
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea style={{ height: 'calc(100vh - 80px)' }} mx="-md" px="md">
          <Divider my="sm" />

          <a href="#" className={classes.link}>Inicio</a>
          
          <UnstyledButton className={classes.link} onClick={toggleLinks} w="100%">
            <Group justify="space-between" w="100%">
              <Text fw={500}>El Programa</Text>
              <IconChevronDown size={16} />
            </Group>
          </UnstyledButton>
          <Collapse in={linksOpened} px="md">
            {links}
          </Collapse>
          <Link to="/especialistas" className={classes.link}>
  Nuestros Especialistas
</Link>
          <Link to="/evidencia-cientifica" className={classes.link}>
  Evidencia Científica
</Link>

          <Divider my="xl" />
          <Group justify="center" grow pb="xl">
            <Button variant="outline" color="teal" radius="xl" onClick={() => navigate('/signin')?.catch(console.error)}>
              Ingresar
            </Button>
            <Button color="teal" radius="xl" onClick={() => navigate('/register')?.catch(console.error)}>
              Unirme al Plan
            </Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </>
  );
}
