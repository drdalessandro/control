// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { AppShell, Burger, Container, Drawer, Group, Menu, Stack, UnstyledButton, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ResourceAvatar, useMedplumProfile } from '@medplum/react';
import { IconChevronDown, IconLogout, IconSettings, IconUserCircle } from '@tabler/icons-react';
import cx from 'clsx';
import { useState } from 'react';
import type { JSX } from 'react';
import { Link, useNavigate } from 'react-router';
import classes from './Header.module.css';
import { Logo } from './Logo';

const navigation = [
  { name: 'Plan 100 Días', href: '/care-plan' },
  { name: 'Mi Salud', href: '/health-record' },
  { name: 'Laboratorio', href: '/laboratory' },
  { name: 'Mi Equipo', href: '/Communication' },
  { name: 'Turnos', href: '/get-care' },
];

export function Header(): JSX.Element {
  const navigate = useNavigate();
  const profile = useMedplumProfile();
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  return (
    <AppShell.Header>
      <Container>
        <div className={classes.inner}>
          <UnstyledButton className={classes.logoButton} onClick={() => navigate('/')?.catch(console.error)}>
            <Logo width={240} />
          </UnstyledButton>
          <Group gap={5} className={classes.links}>
            {navigation.map((link) => (
              <Link key={link.name} to={link.href} className={classes.link}>
                {link.name}
              </Link>
            ))}
          </Group>
          <Menu
            width={260}
            shadow="xl"
            position="bottom-end"
            transitionProps={{ transition: 'pop-top-right' }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
          >
            <Menu.Target>
              <UnstyledButton className={cx(classes.user, { [classes.userActive]: userMenuOpened })}>
                <Group gap={7}>
                  <ResourceAvatar radius="xl" value={profile} />
                  <IconChevronDown size={12} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconUserCircle size={16} color={theme.colors.red[6]} stroke={1.5} />}
                onClick={() => navigate('/account/profile')?.catch(console.error)}
              >
                Mi perfil
              </Menu.Item>
              <Menu.Item
                leftSection={<IconSettings size={16} color={theme.colors.blue[6]} stroke={1.5} />}
                onClick={() => navigate('/account/profile')?.catch(console.error)}
              >
                Configuración
              </Menu.Item>
              <Menu.Item
                leftSection={<IconLogout size={16} color={theme.colors.gray[6]} stroke={1.5} />}
                onClick={() => navigate('/signout')?.catch(console.error)}
              >
                Cerrar sesión
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />
        </div>
      </Container>
      <Drawer
        opened={opened}
        onClose={toggle}
        size="75%"
        padding="md"
        title="Menú"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <Stack gap="xs">
          {navigation.map((link) => (
            <Link key={link.name} to={link.href} className={classes.link} onClick={toggle}>
              {link.name}
            </Link>
          ))}
        </Stack>
      </Drawer>
    </AppShell.Header>
  );
}
