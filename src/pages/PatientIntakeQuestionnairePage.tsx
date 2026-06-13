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
          text: 'Insurance Provider',
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
          text: 'Subscriber ID',
          type: 'string',
          required: true,
        },
        {
          linkId: 'relationship-to-subscriber',
          text: 'Relationship to Subscriber',
          type: 'choice',
          answerValueSet: 'http://hl7.org/fhir/ValueSet/subscriber-relationship',
          required: true,
        },
        {
          linkId: 'related-person',
          text: 'Subscriber Information',
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
      text: 'Social Determinants of Health',
      type: 'group',
      item: [
        {
          linkId: 'housing-status',
          text: 'Housing Status',
          type: 'choice',
          answerValueSet: 'http://terminology.hl7.org/ValueSet/v3-LivingArrangement',
        },
        {
          linkId: 'education-level',
          text: 'Education Level',
          type: 'choice',
          answerValueSet: 'http://terminology.hl7.org/ValueSet/v3-EducationLevel',
        },
        {
          linkId: 'smoking-status',
          text: 'Smoking Status',
          type: 'choice',
          answerValueSet: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.11.20.9.38',
        },
        {
          linkId: 'veteran-status',
          text: 'Veteran Status',
          type: 'boolean',
        },
        {
          linkId: 'pregnancy-status',
          text: 'Pregnancy Status',
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
          text: 'Estimated Delivery Date',
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
      text: 'Languages Spoken',
      type: 'choice',
      answerValueSet: 'http://hl7.org/fhir/ValueSet/languages',
      repeats: true,
    },
    {
      linkId: 'preferred-language',
      text: 'Preferred Language',
      type: 'choice',
      answerValueSet: 'http://hl7.org/fhir/ValueSet/languages',
    },
    {
      linkId: 'consent-for-treatment',
      text: 'Consent for Treatment',
      type: 'group',
      item: [
        {
          linkId: 'consent-for-treatment-signature',
          text: 'I the undersigned patient (or authorized representative, or parent/guardian), consent to and authorize the performance of any treatments, examinations, medical services, surgical or diagnostic procedures, including lab and radiographic studies, as ordered by this office and it’s healthcare providers.',
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
      text: 'Agreement to Pay for Treatment',
      type: 'group',
      item: [
        {
          linkId: 'agreement-to-pay-for-treatment-help',
          text: 'I, the responsible party, hereby agree to pay all the charges submitted by this office during the course of treatment for the patient. If the patient has insurance coverage with a managed care organization, with which this office has a contractual agreement, I agree to pay all applicable co‐payments, co‐insurance and deductibles, which arise during the course of treatment for the patient. The responsible party also agrees to pay for treatment rendered to the patient, which is not considered to be a covered service by my insurer and/or a third party insurer or other payor. I understand that Sample Hospital provides charges on a sliding fee; based on family size and household annual income, and that services will not be refused due to inability to pay at the time of the visit.',
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
      text: 'Notice of Privacy Practices',
      type: 'group',
      item: [
        {
          linkId: 'notice-of-privacy-practices-help',
          text: 'Sample Hospital Notice of Privacy Practices gives information about how Sample Hospital may use and release protected health information (PHI) about you. I understand that:\n- I have the right to receive a copy of Sample Hospital’s Notice of Privacy Practices.\n- I may request a copy at any time.\n- Sample Hospital‘s Notice of Privacy Practices may be revised.',
          type: 'display',
        },
        {
          linkId: 'notice-of-privacy-practices-signature',
          text: 'I acknowledge the above and that I have received a copy of Sample Hospital’s Notice of Privacy Practices.',
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
      text: 'Acknowledgement for Advance Directives',
      type: 'group',
      item: [
        {
          linkId: 'acknowledgement-for-advance-directives-help',
          text: 'An Advance Medical Directive is a document by which a person makes provision for health care decisions in the event that, in the future, he/she becomes unable to make those decisions.',
          type: 'display',
        },
        {
          linkId: 'acknowledgement-for-advance-directives-signature',
          text: 'I acknowledge I have received information about Advance Directives.',
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
