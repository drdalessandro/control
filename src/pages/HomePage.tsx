// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import {
  Anchor,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Group,
  Image,
  Overlay,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { formatHumanName } from '@medplum/core';
import type { Patient, Practitioner } from '@medplum/fhirtypes';
import { useMedplumProfile } from '@medplum/react';
import { IconChecklist, IconClipboardHeart, IconGift, IconSquareCheck } from '@tabler/icons-react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import DoctorImage from '../img/homePage/doctor.svg';
import HealthRecordImage from '../img/homePage/health-record.svg';
import HealthVisitImage from '../img/homePage/health-visit.jpg';
import PharmacyImage from '../img/homePage/pharmacy.svg';
import PillImage from '../img/homePage/pill.svg';
import classes from './HomePage.module.css';

const carouselItems = [
  {
    img: <IconChecklist />,
    title: 'Bienvenido/a a Foo Medical',
    description:
      'Lorem ipsum at porta donec ultricies ut, arcu morbi amet arcu ornare, curabitur pharetra magna tempus',
    url: '/screening-questionnaire',
    label: 'Evaluación AHC HRSN',
  },
  {
    img: <IconChecklist />,
    title: 'Cuestionario de admisión del paciente',
    description:
      'Lorem ipsum at porta donec ultricies ut, arcu morbi amet arcu ornare, curabitur pharetra magna tempus',
    url: '/patient-intake-questionnaire',
    label: 'Comenzar formulario',
  },
  {
    img: <IconChecklist />,
    title: 'Elegir un médico',
    description:
      'Lorem ipsum at porta donec ultricies ut, arcu morbi amet arcu ornare, curabitur pharetra magna tempus',
    url: '/account/provider/choose-a-primary-care-povider',
    label: 'Elegir un médico de cabecera',
  },
  {
    img: <IconChecklist />,
    title: 'Contacto de emergencia',
    description:
      'Lorem ipsum at porta donec ultricies ut, arcu morbi amet arcu ornare, curabitur pharetra magna tempus',
    url: '/account',
    label: 'Agregar contacto de emergencia',
  },
];

const linkPages = [
  {
    img: HealthRecordImage,
    title: 'Registro de Salud',
    description: '',
    href: '/health-record',
  },
  {
    img: PillImage,
    title: 'Solicitar renovación de receta',
    description: '',
    href: '/health-record/medications',
  },
  {
    img: PharmacyImage,
    title: 'Farmacia preferida',
    description: 'Walgreens D2866 1363 Divisadero St  DIVISADERO',
    href: '#',
  },
];

const recommendations = [
  {
    title: 'Obtener recomendaciones de salud para viajar',
    description: 'Averiguá qué vacunas y medicamentos necesitás para tu viaje.',
  },
  {
    title: 'Obtener reembolso FSA/HSA',
    description: 'Solicitá una receta para artículos de venta libre.',
  },
  {
    title: 'Solicitar registro de salud',
    description: 'Hacé que envíen o reciban registros desde Foo Medical.',
  },
];

export function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const profile = useMedplumProfile() as Patient | Practitioner;
  const profileName = profile.name ? formatHumanName(profile.name[0]) : '';

  return (
    <Box bg="gray.0">
      <Box className={classes.announcements}>
        <span>
          Los anuncios van acá. <Anchor href="#">Incluí enlaces si hace falta.</Anchor>
        </span>
      </Box>
      <div className={classes.hero}>
        <Overlay
          gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.4) 40%)"
          opacity={1}
          zIndex={0}
        />
        <Container className={classes.heroContainer}>
          <Title className={classes.heroTitle}>
            Hola <span className="text-teal-600">{profileName}</span>,<br /> estamos para ayudarte
          </Title>
          <Button size="xl" radius="xl" className={classes.heroButton}>
            Atención
          </Button>
        </Container>
      </div>
      <Box className={classes.callToAction}>
        <Group justify="center">
          <IconGift />
          <p>Poné las llamadas a la acción acá</p>
          <Button variant="white" onClick={() => navigate('/messages')?.catch(console.error)}>
            Enviar mensaje
          </Button>
        </Group>
      </Box>
      <Box p="lg">
        <Container>
          <Card
            shadow="md"
            radius="md"
            withBorder
            p="xl"
            style={{ borderColor: theme.colors[theme.primaryColor][6], borderWidth: 2 }}
          >
            <Group justify="space-between" gap="lg">
              <Group wrap="nowrap" gap="md">
                <IconClipboardHeart size={48} color={theme.colors[theme.primaryColor][6]} stroke={1.5} />
                <div>
                  <Badge color={theme.primaryColor} mb={4}>
                    Recomendado
                  </Badge>
                  <Text size="lg" fw={600}>
                    Cuestionario de salud social (SDOH)
                  </Text>
                  <Text size="sm" c="dimmed">
                    Unas pocas preguntas sobre tu situación social y económica. Ayudan a tu equipo de salud a
                    acompañarte mejor.
                  </Text>
                </div>
              </Group>
              <Button size="md" onClick={() => navigate('/cuestionario-sdoh')?.catch(console.error)}>
                Completar cuestionario
              </Button>
            </Group>
          </Card>
        </Container>
      </Box>
      <Box p="lg">
        <Container>
          <Grid>
            {carouselItems.map((item, index) => (
              <Grid.Col key={`card-${index}`} span={3} pb={40}>
                <Card shadow="md" radius="md" className={classes.card} p="xl">
                  <IconSquareCheck />
                  <Text size="lg" fw={500} mt="md">
                    {item.title}
                  </Text>
                  <Text size="sm" color="dimmed" my="sm">
                    {item.description}
                  </Text>
                  <Anchor href={item.url}>{item.label}</Anchor>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Container>
      </Box>
      <Box p="lg">
        <Container>
          <Card shadow="md" radius="md" className={classes.card} p="xl">
            <IconSquareCheck />
            <Text size="lg" fw={500} mt="md">
              Mejor descanso, mejor salud
            </Text>
            <Text size="sm" color="dimmed" my="sm">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste
              dolor cupiditate blanditiis ratione. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores
              impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.
            </Text>
            <Group>
              <Button>Invitar amigos</Button>
            </Group>
          </Card>
        </Container>
      </Box>
      <Box p="lg">
        <Container>
          <Card shadow="md" radius="md" className={classes.card} p="xl">
            <Flex>
              <Image src={HealthVisitImage} m="-40px 30px -40px -40px" w="40%" />
              <div>
                <Badge color={theme.primaryColor} size="xl">
                  Ya disponible
                </Badge>
                <Text size="lg" fw={500} mt="md">
                  Título
                </Text>
                <Text size="sm" color="dimmed" my="sm">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque,
                  iste dolor cupiditate blanditiis ratione. Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.
                </Text>
              </div>
            </Flex>
          </Card>
        </Container>
      </Box>
      <Box p="lg">
        <Container>
          <Grid columns={3} pb="xl">
            {linkPages.map((item, index) => (
              <Grid.Col key={`card-${index}`} span={1}>
                <Card shadow="md" radius="md" className={classes.card} p="xl">
                  <Image src={item.img} w={80} />
                  <Text size="lg" fw={500} mt="md">
                    {item.title}
                  </Text>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Container>
      </Box>
      <Box p="lg">
        <Container>
          <Grid columns={2} pb="xl">
            <Grid.Col span={1}>
              <Card shadow="md" radius="md" className={classes.card} p="xl">
                <Group wrap="nowrap">
                  <Avatar src={DoctorImage} size="xl" />
                  <div>
                    <Text fw={500}>Médico de cabecera</Text>
                    <Text size="sm" color="dimmed" my="sm">
                      Tener un médico de confianza y constante puede mejorar tu salud.
                    </Text>
                    <Button onClick={() => navigate('/account/provider')?.catch(console.error)}>Elegir médico</Button>
                  </div>
                </Group>
              </Card>
            </Grid.Col>
            <Grid.Col span={1}>
              <Card shadow="md" radius="md" className={classes.card} p="xl">
                <Stack>
                  {recommendations.map((item, index) => (
                    <div key={`recommendation-${index}`}>
                      <Text fw={500}>{item.title}</Text>
                      <Text size="sm" color="dimmed" my="sm">
                        {item.description}
                      </Text>
                    </div>
                  ))}
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
