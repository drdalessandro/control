// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import type { Questionnaire, QuestionnaireResponse } from '@medplum/fhirtypes';
import { Document, QuestionnaireForm } from '@medplum/react';
import { useState } from 'react';
import type { JSX } from 'react';

export function PatientIntakeQuestionnairePage(): JSX.Element {
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleQuestionnaireSubmit(_formData: QuestionnaireResponse): Promise<void> {
    setIsSubmitted(true);
    window.scrollTo(0, 0);
  }

  return (
    <Document width={800}>
      {isSubmitted ? (
        <div>Gracias por enviar tu formulario</div>
      ) : (
        <QuestionnaireForm questionnaire={questionnaire} onSubmit={handleQuestionnaireSubmit} />
      )}
    </Document>
  );
}

const questionnaire: Questionnaire = {
  resourceType: 'Questionnaire',
  status: 'active',
  title: 'Cuestionario de admisión del paciente',
  name: 'patient-intake',
  item: [
    {
      linkId: 'patient-demographics',
      text: 'Datos demográficos',
      type: 'group',
      item: [
        {
          linkId: 'first-name',
          text: 'Nombre',
          type: 'string',
          required: true,
        },
        {
          linkId: 'middle-name',
          text: 'Segundo nombre',
          type: 'string',
        },
        {
          linkId: 'last-name',
          text: 'Apellido',
          type: 'string',
          required: true,
        },
        {
          linkId: 'dob',
          text: 'Fecha de nacimiento',
          type: 'date',
        },
        {
          linkId: 'street',
          text: 'Calle',
          type: 'string',
        },
        {
          linkId: 'city',
          text: 'Ciudad',
          type: 'string',
        },
        {
          linkId: 'state',
          text: 'Provincia',
          type: 'choice',
          answerValueSet: 'http://hl7.org/fhir/us/core/ValueSet/us-core-usps-state',
        },
        {
          linkId: 'zip',
          text: 'Código postal',
          type: 'string',
        },
        {
          linkId: 'phone',
          text: 'Teléfono',
          type: 'string',
        },
        {
          linkId: 'ssn',
          text: 'Número de seguro social',
          type: 'string',
          required: true,
        },
        {
          linkId: 'race',
          text: 'Raza',
          type: 'choice',
          answerValueSet: 'http://hl7.org/fhir/us/core/ValueSet/omb-race-category',
        },
        {
          linkId: 'ethnicity',
          text: 'Etnia',
          type: 'choice',
          answerValueSet: 'http://hl7.org/fhir/us/core/ValueSet/omb-ethnicity-category',
        },
        {
          linkId: 'gender-identity',
          text: 'Identidad de género',
          type: 'choice',
          answerValueSet: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1021.32',
        },
        {
          linkId: 'sexual-orientation',
          text: 'Orientación sexual',
          type: 'choice',
          answerValueSet: 'http://hl7.org/fhir/us/core/ValueSet/us-core-sexual-orientation',
        },
      ],
    },
    {
      linkId: 'emergency-contact',
      text: 'Contacto de emergencia',
      type: 'group',
      repeats: true,
      item: [
        {
          linkId: 'emergency-contact-first-name',
          text: 'Nombre',
          type: 'string',
        },
        {
          linkId: 'emergency-contact-middle-name',
          text: 'Segundo nombre',
          type: 'string',
        },
        {
          linkId: 'emergency-contact-last-name',
          text: 'Apellido',
          type: 'string',
        },
        {
          linkId: 'emergency-contact-phone',
          text: 'Teléfono',
          type: 'string',
        },
      ],
    },
    {
      linkId: 'allergies',
      text: 'Alergias',
      type: 'group',
      repeats: true,
      item: [
        {
          linkId: 'allergy-substance',
          text: 'Sustancia',
          type: 'choice',
          answerValueSet: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1186.8',
        },
        {
          linkId: 'allergy-reaction',
          text: 'Reacción',
          type: 'string',
        },
        {
          linkId: 'allergy-onset',
          text: 'Inicio',
          type: 'dateTime',
        },
      ],
    },
    {
      linkId: 'medications',
      text: 'Medicación actual',
      type: 'group',
      repeats: true,
      item: [
        {
          linkId: 'medication-code',
          text: 'Nombre del medicamento',
          type: 'choice',
          answerValueSet: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1010.4',
        },
        {
          linkId: 'medication-note',
          text: 'Nota',
          type: 'string',
        },
      ],
    },
    {
      linkId: 'medical-history',
      text: 'Antecedentes médicos',
      type: 'group',
      repeats: true,
      item: [
        {
          linkId: 'medical-history-problem',
          text: 'Problema',
          type: 'choice',
          answerValueSet: 'http://hl7.org/fhir/us/core/ValueSet/us-core-condition-code',
        },
        {
          linkId: 'medical-history-clinical-status',
          text: 'Estado',
          type: 'choice',
          answerValueSet: 'http://hl7.org/fhir/ValueSet/condition-clinical',
        },
        {
          linkId: 'medical-history-onset',
          text: 'Inicio',
          type: 'dateTime',
        },
      ],
    },
    {
      linkId: 'family-member-history',
      text: 'Antecedentes familiares',
      type: 'group',
      repeats: true,
      item: [
        {
          linkId: 'family-member-history-problem',
          text: 'Problema',
          type: 'choice',
          answerValueSet: 'http://hl7.org/fhir/us/core/ValueSet/us-core-condition-code',
        },
        {
          linkId: 'family-member-history-relationship',
          text: 'Parentesco',
          type: 'choice',
          answerValueSet: 'http://terminology.hl7.org/ValueSet/v3-FamilyMember',
        },
        {
          linkId: 'family-member-history-deceased',
          text: 'Fallecido/a',
          type: 'boolean',
        },
      ],
    },
    {
      linkId: 'vaccination-history',
      text: 'Historial de vacunación',
      type: 'group',
      repeats: true,
      item: [
        {
          linkId: 'immunization-vaccine',
          text: 'Vacuna',
          type: 'choice',
          answerValueSet: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1010.6',
        },
        {
          linkId: 'immunization-date',
          text: 'Fecha de aplicación',
          type: 'dateTime',
        },
      ],
    },
    {
      linkId: 'preferred-pharmacy',
      text: 'Farmacia preferida',
      type: 'group',
      item: [
        {
          linkId: 'preferred-pharmacy-reference',
          text: 'Farmacia',
          type: 'reference',
          extension: [
            {
              id: 'reference-pharmacy',
              url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-referenceResource',
              valueCodeableConcept: {
                coding: [
                  {
                    system: 'http://hl7.org/fhir/fhir-types',
                    display: 'Organizations',
                    code: 'Organization',
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      linkId: 'coverage-information',
      text: 'Información de cobertura',
      type: 'group',
      repeats: true,
      item: [
        {
          linkId: 'insurance-provider',
          text: 'Obra social / Prepaga',
          type: 'reference',
          required: true,
          extension: [
            {
              id: 'reference-insurance',
              url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-referenceResource',
              valueCodeableConcept: {
                coding: [
                  {
                    system: 'http://hl7.org/fhir/fhir-types',
                    display: 'Organizations',
                    code: 'Organization',
                  },
                ],
              },
            },
          ],
        },
        {
          linkId: 'subscriber-id',
          text: 'Número de afiliado',
          type: 'string',
          required: true,
        },
        {
          linkId: 'relationship-to-subscriber',
          text: 'Parentesco con el titular',
          type: 'choice',
          answerValueSet: 'http://hl7.org/fhir/ValueSet/subscriber-relationship',
          required: true,
        },
        {
          linkId: 'related-person',
          text: 'Datos del titular',
          type: 'group',
          enableBehavior: 'all',
          enableWhen: [
            {
              question: 'relationship-to-subscriber',
              operator: '!=',
              answerCoding: {
                system: 'http://terminology.hl7.org/CodeSystem/subscriber-relationship',
                code: 'other',
                display: 'Other',
              },
            },
            {
              question: 'relationship-to-subscriber',
              operator: '!=',
              answerCoding: {
                system: 'http://terminology.hl7.org/CodeSystem/subscriber-relationship',
                code: 'self',
                display: 'Self',
              },
            },
            {
              question: 'relationship-to-subscriber',
              operator: '!=',
              answerCoding: {
                system: 'http://terminology.hl7.org/CodeSystem/subscriber-relationship',
                code: 'injured',
                display: 'Injured Party',
              },
            },
          ],
          item: [
            {
              linkId: 'related-person-first-name',
              text: 'Nombre',
              type: 'string',
            },
            {
              linkId: 'related-person-middle-name',
              text: 'Segundo nombre',
              type: 'string',
            },
            {
              linkId: 'related-person-last-name',
              text: 'Apellido',
              type: 'string',
            },
            {
              linkId: 'related-person-dob',
              text: 'Fecha de nacimiento',
              type: 'date',
            },
            {
              linkId: 'related-person-gender-identity',
              text: 'Identidad de género',
              type: 'choice',
              answerValueSet: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1021.32',
            },
          ],
        },
      ],
    },
    {
      linkId: 'social-determinants-of-health',
      text: 'Determinantes sociales de la salud',
      type: 'group',
      item: [
        {
          linkId: 'housing-status',
          text: 'Situación habitacional',
          type: 'choice',
          answerValueSet: 'http://terminology.hl7.org/ValueSet/v3-LivingArrangement',
        },
        {
          linkId: 'education-level',
          text: 'Nivel educativo',
          type: 'choice',
          answerValueSet: 'http://terminology.hl7.org/ValueSet/v3-EducationLevel',
        },
        {
          linkId: 'smoking-status',
          text: 'Consumo de tabaco',
          type: 'choice',
          answerValueSet: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.11.20.9.38',
        },
        {
          linkId: 'veteran-status',
          text: 'Condición de veterano/a',
          type: 'boolean',
        },
        {
          linkId: 'pregnancy-status',
          text: 'Estado de embarazo',
          type: 'choice',
          code: [
            {
              code: '82810-3',
              display: 'Pregnancy status',
              system: 'http://loinc.org',
            },
          ],
          answerValueSet: 'http://example.com/pregnancy-status',
        },
        {
          linkId: 'estimated-delivery-date',
          text: 'Fecha probable de parto',
          type: 'date',
          code: [
            {
              code: '11778-8',
              display: 'Estimated date of delivery',
              system: 'http://loinc.org',
            },
          ],
          enableWhen: [
            {
              question: 'pregnancy-status',
              operator: '=',
              answerCoding: {
                system: 'http://snomed.info/sct',
                code: '77386006',
                display: 'Pregnancy',
              },
            },
          ],
        },
      ],
    },
    {
      linkId: 'languages-spoken',
      text: 'Idiomas que habla',
      type: 'choice',
      answerValueSet: 'http://hl7.org/fhir/ValueSet/languages',
      repeats: true,
    },
    {
      linkId: 'preferred-language',
      text: 'Idioma preferido',
      type: 'choice',
      answerValueSet: 'http://hl7.org/fhir/ValueSet/languages',
    },
    {
      linkId: 'consent-for-treatment',
      text: 'Consentimiento para el tratamiento',
      type: 'group',
      item: [
        {
          linkId: 'consent-for-treatment-signature',
          text: 'Yo, el/la paciente abajo firmante (o representante autorizado/a, o padre/madre/tutor), consiento y autorizo la realización de cualquier tratamiento, examen, servicio médico, procedimiento quirúrgico o diagnóstico, incluidos estudios de laboratorio y radiográficos, según lo indiquen este consultorio y sus profesionales de la salud.',
          type: 'boolean',
        },
        {
          linkId: 'consent-for-treatment-date',
          text: 'Fecha',
          type: 'date',
        },
      ],
    },
    {
      linkId: 'agreement-to-pay-for-treatment',
      text: 'Acuerdo de pago del tratamiento',
      type: 'group',
      item: [
        {
          linkId: 'agreement-to-pay-for-treatment-help',
          text: 'Yo, la persona responsable, acepto pagar todos los cargos presentados por este consultorio durante el transcurso del tratamiento del/de la paciente. Si el/la paciente cuenta con cobertura de una organización de salud con la que este consultorio tiene un acuerdo contractual, acepto pagar todos los copagos, coseguros y deducibles correspondientes que surjan durante el tratamiento. La persona responsable también acepta pagar el tratamiento brindado al/a la paciente que no sea considerado un servicio cubierto por mi obra social y/o por una aseguradora externa u otro pagador. Entiendo que el Hospital de Muestra aplica una escala de cargos según el tamaño del grupo familiar y los ingresos anuales del hogar, y que no se negará la atención por imposibilidad de pago al momento de la visita.',
          type: 'boolean',
        },
        {
          linkId: 'agreement-to-pay-for-treatment-date',
          text: 'Fecha',
          type: 'date',
        },
      ],
    },
    {
      linkId: 'notice-of-privacy-practices',
      text: 'Aviso de prácticas de privacidad',
      type: 'group',
      item: [
        {
          linkId: 'notice-of-privacy-practices-help',
          text: 'El Aviso de prácticas de privacidad del Hospital de Muestra brinda información sobre cómo el Hospital de Muestra puede usar y divulgar tu información de salud protegida (PHI). Entiendo que:\n- Tengo derecho a recibir una copia del Aviso de prácticas de privacidad del Hospital de Muestra.\n- Puedo solicitar una copia en cualquier momento.\n- El Aviso de prácticas de privacidad del Hospital de Muestra puede modificarse.',
          type: 'display',
        },
        {
          linkId: 'notice-of-privacy-practices-signature',
          text: 'Reconozco lo anterior y que recibí una copia del Aviso de prácticas de privacidad del Hospital de Muestra.',
          type: 'boolean',
        },
        {
          linkId: 'notice-of-privacy-practices-date',
          text: 'Fecha',
          type: 'date',
        },
      ],
    },
    {
      linkId: 'acknowledgement-for-advance-directives',
      text: 'Reconocimiento de directivas anticipadas',
      type: 'group',
      item: [
        {
          linkId: 'acknowledgement-for-advance-directives-help',
          text: 'Una directiva médica anticipada es un documento por el cual una persona deja establecidas las decisiones sobre su atención médica en caso de que, en el futuro, quede imposibilitada de tomar esas decisiones.',
          type: 'display',
        },
        {
          linkId: 'acknowledgement-for-advance-directives-signature',
          text: 'Reconozco que recibí información sobre las directivas anticipadas.',
          type: 'boolean',
        },
        {
          linkId: 'acknowledgement-for-advance-directives-date',
          text: 'Fecha',
          type: 'date',
        },
      ],
    },
  ],
};
