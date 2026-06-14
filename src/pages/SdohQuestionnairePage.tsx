// SPDX-License-Identifier: Apache-2.0
// ============================================================================
// Control (foomedical fork) — Cuestionario SDOH (rol paciente)
// ----------------------------------------------------------------------------
// Permite al paciente completar el "Screening de Determinantes Sociales de la
// Salud (SDOH)" del programa CKM. El QuestionnaireResponse generado lo consume
// el bot `sdoh-response` de Seguimiento, que suma los pesos (ordinalValue) de
// cada respuesta y los usa como insumo de las ecuaciones PREVENT.
//
// El bot identifica la respuesta por la URL canónica del Questionnaire
// (SDOH_QUESTIONNAIRE_URL) y lee cada respuesta por `${linkId}|${code}`, así que
// los linkId y los `code` de cada opción deben coincidir con el Questionnaire
// desplegado en el servidor (de ahí salen los pesos).
// ============================================================================
import { showNotification } from '@mantine/notifications';
import { createReference, normalizeErrorString } from '@medplum/core';
import type { Patient, Questionnaire, QuestionnaireResponse } from '@medplum/fhirtypes';
import { Document, QuestionnaireForm, useMedplum } from '@medplum/react';
import { IconCircleCheck, IconCircleOff } from '@tabler/icons-react';
import { useCallback, useState } from 'react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';

// URL canónica que usa el bot `sdoh-response` para identificar la respuesta.
const SDOH_QUESTIONNAIRE_URL = 'https://seguimiento.medplum.com.ar/fhir/Questionnaire/ckm-sdoh-screening-v1';

export function SdohQuestionnairePage(): JSX.Element {
  const medplum = useMedplum();
  const navigate = useNavigate();
  const patient = medplum.getProfile() as Patient;
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = useCallback(
    (formData: QuestionnaireResponse): void => {
      const response: QuestionnaireResponse = {
        ...formData,
        status: 'completed',
        // El bot identifica la respuesta por esta URL canónica exacta.
        questionnaire: SDOH_QUESTIONNAIRE_URL,
        subject: createReference(patient),
        source: createReference(patient),
        authored: new Date().toISOString(),
      };

      medplum
        .createResource(response)
        .then(() => {
          setIsSubmitted(true);
          window.scrollTo(0, 0);
          showNotification({
            icon: <IconCircleCheck />,
            title: 'Listo',
            message: 'Gracias por completar el cuestionario.',
          });
        })
        .catch((err) => {
          showNotification({
            color: 'red',
            icon: <IconCircleOff />,
            title: 'Error',
            message: normalizeErrorString(err),
          });
        });
    },
    [medplum, patient]
  );

  return (
    <Document width={800}>
      {isSubmitted ? (
        <div>
          Gracias por completar el cuestionario. Tus respuestas ayudan a tu equipo de salud a acompañarte mejor.{' '}
          <a href="/" onClick={() => navigate('/')?.catch(console.error)}>
            Volver al inicio
          </a>
        </div>
      ) : (
        <QuestionnaireForm questionnaire={sdohQuestionnaire} onSubmit={handleSubmit} />
      )}
    </Document>
  );
}

const sdohQuestionnaire: Questionnaire = {
  resourceType: 'Questionnaire',
  url: SDOH_QUESTIONNAIRE_URL,
  name: 'CKMSDOHScreening',
  title: 'Screening de Determinantes Sociales de la Salud (SDOH)',
  status: 'active',
  subjectType: ['Patient'],
  description:
    'Screening breve de determinantes sociales de la salud para el programa CKM. Los pesos (ordinalValue) de cada ' +
    'opción alimentan el resumen de deprivación social usado como insumo de las ecuaciones PREVENT.',
  item: [
    {
      linkId: 'vivienda',
      type: 'choice',
      text: '¿Tiene problemas con su vivienda (riesgo de perderla, condiciones inadecuadas, hacinamiento)?',
      required: true,
      answerOption: [
        {
          valueCoding: {
            code: 'si',
            display: 'Sí',
            extension: [{ url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue', valueDecimal: 3 }],
          },
        },
        {
          valueCoding: {
            code: 'no',
            display: 'No',
            extension: [{ url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue', valueDecimal: 0 }],
          },
        },
      ],
    },
    {
      linkId: 'alimentacion',
      type: 'choice',
      text: 'En los últimos 12 meses, ¿le preocupó que la comida se le acabara antes de tener dinero para comprar más?',
      required: true,
      answerOption: [
        {
          valueCoding: {
            code: 'frecuentemente',
            display: 'Frecuentemente',
            extension: [{ url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue', valueDecimal: 2 }],
          },
        },
        {
          valueCoding: {
            code: 'a-veces',
            display: 'A veces',
            extension: [{ url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue', valueDecimal: 1 }],
          },
        },
        {
          valueCoding: {
            code: 'nunca',
            display: 'Nunca',
            extension: [{ url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue', valueDecimal: 0 }],
          },
        },
      ],
    },
    {
      linkId: 'transporte',
      type: 'choice',
      text: '¿La falta de transporte le impidió asistir a consultas médicas o conseguir medicamentos?',
      required: true,
      answerOption: [
        {
          valueCoding: {
            code: 'si',
            display: 'Sí',
            extension: [{ url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue', valueDecimal: 2 }],
          },
        },
        {
          valueCoding: {
            code: 'no',
            display: 'No',
            extension: [{ url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue', valueDecimal: 0 }],
          },
        },
      ],
    },
    {
      linkId: 'servicios',
      type: 'choice',
      text: '¿Tiene dificultades para pagar los servicios básicos (luz, gas, agua)?',
      required: true,
      answerOption: [
        {
          valueCoding: {
            code: 'si',
            display: 'Sí',
            extension: [{ url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue', valueDecimal: 1 }],
          },
        },
        {
          valueCoding: {
            code: 'no',
            display: 'No',
            extension: [{ url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue', valueDecimal: 0 }],
          },
        },
      ],
    },
    {
      linkId: 'seguridad',
      type: 'choice',
      text: '¿Se siente inseguro/a en su barrio o en su hogar?',
      required: true,
      answerOption: [
        {
          valueCoding: {
            code: 'si',
            display: 'Sí',
            extension: [{ url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue', valueDecimal: 2 }],
          },
        },
        {
          valueCoding: {
            code: 'no',
            display: 'No',
            extension: [{ url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue', valueDecimal: 0 }],
          },
        },
      ],
    },
    {
      linkId: 'soledad',
      type: 'choice',
      text: '¿Con qué frecuencia se siente solo/a o aislado/a de las personas que lo rodean?',
      required: true,
      answerOption: [
        {
          valueCoding: {
            code: 'siempre',
            display: 'Siempre o casi siempre',
            extension: [{ url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue', valueDecimal: 2 }],
          },
        },
        {
          valueCoding: {
            code: 'a-veces',
            display: 'A veces',
            extension: [{ url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue', valueDecimal: 1 }],
          },
        },
        {
          valueCoding: {
            code: 'nunca',
            display: 'Nunca',
            extension: [{ url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue', valueDecimal: 0 }],
          },
        },
      ],
    },
    {
      linkId: 'ingresos',
      type: 'choice',
      text: '¿Tiene dificultades para llegar a fin de mes con sus ingresos?',
      required: true,
      answerOption: [
        {
          valueCoding: {
            code: 'si',
            display: 'Sí',
            extension: [{ url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue', valueDecimal: 2 }],
          },
        },
        {
          valueCoding: {
            code: 'no',
            display: 'No',
            extension: [{ url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue', valueDecimal: 0 }],
          },
        },
      ],
    },
    {
      linkId: 'medicamentos',
      type: 'choice',
      text: 'En el último año, ¿dejó de comprar medicamentos recetados por su costo?',
      required: true,
      answerOption: [
        {
          valueCoding: {
            code: 'si',
            display: 'Sí',
            extension: [{ url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue', valueDecimal: 3 }],
          },
        },
        {
          valueCoding: {
            code: 'no',
            display: 'No',
            extension: [{ url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue', valueDecimal: 0 }],
          },
        },
      ],
    },
  ],
};
