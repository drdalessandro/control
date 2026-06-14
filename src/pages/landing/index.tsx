// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { AppShell, Box, Button, Container, Group, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import cx from 'clsx';
import type { JSX } from 'react';
import { Footer } from '../../components/Footer';
import DoctorImage from '../../img/landingPage/doctor.jpg';
import EngineeringImage from '../../img/landingPage/engineering.jpg';
import LabImage from '../../img/landingPage/laboratory.jpg';
import WorkingEnvironmentImage from '../../img/landingPage/working-environment.jpg';
import { Header } from './Header';
import classes from './index.module.css';

const features = [
  {
    title: 'Planes de cuidado integrales',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
  },
  {
    title: 'Sin costos ocultos',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
  },
  {
    title: 'Mensajería 24/7',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
  },
  {
    title: 'Rigor clínico',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
  },
];

export function LandingPage(): JSX.Element {
  const theme = useMantineTheme();
  return (
    <AppShell className={classes.outer} header={{ height: 100 }}>
      <Header />
      <AppShell.Main className={classes.outer}>
        <img className={classes.heroImage1} src={WorkingEnvironmentImage} alt="Entorno de trabajo" />
        <Container>
          <div className={classes.inner}>
            <div className={classes.content}>
              <Title className={classes.title}>
                Un consultorio
                <br />
                <span className={classes.highlight}>médico extraordinario</span>
              </Title>
              <Text size="lg" c="dimmed" mt="md">
                En realidad no es un consultorio médico, es una aplicación de código abierto de ejemplo para que los
                desarrolladores la clonen, personalicen y ejecuten.
              </Text>
              <Group mt={30}>
                <Button radius="xl" size="md" className={classes.control}>
                  Comenzar
                </Button>
                <Button variant="default" radius="xl" size="md" className={classes.control}>
                  Código fuente
                </Button>
              </Group>
            </div>
            <img className={classes.heroImage2} src={DoctorImage} alt="Médico" />
          </div>
        </Container>
        <Container>
          <div className={classes.inner}>
            <div style={{ width: 500 }}>
              <Title order={3} fw={500} c={theme.primaryColor} mb="lg">
                Salud
              </Title>
              <Title order={1} fw={500} mb="md">
                Una mejor manera de cuidarte
              </Title>
              <Text size="xl" c="gray">
                Lorem ipsum dolor sit amet consect adipisicing elit. Possimus magnam voluptatum cupiditate veritatis in
                accusamus quisquam.
              </Text>
            </div>
            <img className={classes.heroImage3} src={LabImage} alt="Laboratorio" />
          </div>
        </Container>
        <Container>
          <div className={cx(classes.inner, classes.featureSection)}>
            <Stack align="flex-end">
              {features.map((feature, index) => (
                <Box key={`feature-${index}`} className={classes.featureBox}>
                  <Text className={classes.featureTitle}>{feature.title}</Text>
                  <Text className={classes.featureDescription}>{feature.description}</Text>
                </Box>
              ))}
            </Stack>
            <img className={classes.heroImage4} src={EngineeringImage} alt="Laboratorio" />
          </div>
        </Container>
      </AppShell.Main>
      <Footer />
    </AppShell>
  );
}
