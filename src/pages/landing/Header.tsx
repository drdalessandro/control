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
  IconBook,
  IconChartPie3,
  IconChevronDown,
  IconCode,
  IconCoin,
  IconFingerprint,
  IconNotification,
} from '@tabler/icons-react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import { Logo } from '../../components/Logo';
import classes from './Header.module.css';

const mockdata = [
  {
    icon: IconCode,
    title: 'Código abierto',
    description: 'El grito de este Pokémon es muy fuerte y distrae',
  },
  {
    icon: IconCoin,
    title: 'Gratis para todos',
    description: 'El fluido de las secreciones de la cola de Smeargle cambia',
  },
  {
    icon: IconBook,
    title: 'Documentación',
    description: 'Yanma puede ver 360 grados sin necesidad de',
  },
  {
    icon: IconFingerprint,
    title: 'Seguridad',
    description: 'La forma redondeada del caparazón y los surcos de su.',
  },
  {
    icon: IconChartPie3,
    title: 'Analítica',
    description: 'Este Pokémon usa su capacidad de vuelo para perseguir rápido',
  },
  {
    icon: IconNotification,
    title: 'Notificaciones',
    description: 'Combusken pelea con las llamas intensamente calientes que escupe',
  },
];

export function Header(): JSX.Element {
  const navigate = useNavigate();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();

  const links = mockdata.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon style={{ width: rem(22), height: rem(22) }} color={theme.primaryColor} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  return (
    <>
      <AppShell.Header px="md">
        <Container h="100%">
          <Group justify="space-between" h="100%">
            <UnstyledButton className={classes.logoButton} onClick={() => navigate('/')?.catch(console.error)}>
              <Logo width={240} />
            </UnstyledButton>

            <Group style={{ height: '100%' }} gap={0} className={classes.hiddenMobile}>
              <HoverCard width={600} position="bottom" radius="md" shadow="md" withinPortal>
                <HoverCard.Target>
                  <a href="#" className={classes.link}>
                    <Center inline>
                      <Box component="span" mr={5}>
                        Servicios
                      </Box>
                      <IconChevronDown size={16} />
                    </Center>
                  </a>
                </HoverCard.Target>

                <HoverCard.Dropdown style={{ overflow: 'hidden' }}>
                  <Group justify="space-between" px="md">
                    <Text fw={500}>Servicios</Text>
                    <Anchor href="#" size="xs">
                      Ver todo
                    </Anchor>
                  </Group>

                  <Divider my="sm" mx="-md" />

                  <SimpleGrid cols={2} spacing={0}>
                    {links}
                  </SimpleGrid>

                  <div className={classes.dropdownFooter}>
                    <Group justify="space-between">
                      <div>
                        <Text fw={500} size="sm">
                          Comenzar
                        </Text>
                        <Text size="xs" color="dimmed">
                          Sus fuentes de alimento disminuyeron, y su cantidad
                        </Text>
                      </div>
                      <Button variant="default">Comenzar</Button>
                    </Group>
                  </div>
                </HoverCard.Dropdown>
              </HoverCard>
              <a href="#" className={classes.link}>
                Orientación
              </a>
              <a href="#" className={classes.link}>
                Médicos
              </a>
              <a href="#" className={classes.link}>
                Más
              </a>
            </Group>

            <Group className={classes.hiddenMobile}>
              <Button variant="default" onClick={() => navigate('/signin')?.catch(console.error)}>
                Iniciar sesión
              </Button>
              <Button onClick={() => navigate('/register')?.catch(console.error)}>Registrarse</Button>
            </Group>

            <Burger opened={drawerOpened} onClick={toggleDrawer} className={classes.hiddenDesktop} />
          </Group>
        </Container>
      </AppShell.Header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navegación"
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea style={{ height: 'calc(100vh - 60px)' }} mx="-md">
          <Divider my="sm" />

          <a href="#" className={classes.link}>
            Inicio
          </a>
          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Funciones
              </Box>
              <IconChevronDown size={16} />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>
          <a href="#" className={classes.link}>
            Aprender
          </a>
          <a href="#" className={classes.link}>
            Academia
          </a>

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            <Button variant="default" onClick={() => navigate('/signin')?.catch(console.error)}>
              Iniciar sesión
            </Button>
            <Button onClick={() => navigate('/register')?.catch(console.error)}>Registrarse</Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </>
  );
}
