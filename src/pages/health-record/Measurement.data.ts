// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
export interface ObservationType {
  id: string;
  code: string;
  title: string;
  description: string;
  chartDatasets: {
    label: string;
    code?: string;
    unit: string;
    backgroundColor: string;
    borderColor: string;
  }[];
}

const backgroundColor = 'rgba(29, 112, 214, 0.7)';
const borderColor = 'rgba(29, 112, 214, 1)';
const secondBackgroundColor = 'rgba(255, 119, 0, 0.7)';
const secondBorderColor = 'rgba(255, 119, 0, 1)';

// Los LOINC y unidades coinciden EXACTAMENTE con lo que Seguimiento lee
// (src/ckm/constants.ts) y con lo que necesita el motor PREVENT. No cambiar
// los códigos ni las unidades: de eso depende que el dato impacte en el score.
export const measurementsMeta: Record<string, ObservationType> = {
  // ── Registro de Salud / Signos vitales ────────────────────────────────────
  'blood-pressure': {
    id: 'blood-pressure',
    code: '85354-9',
    title: 'Presión arterial',
    description:
      'Su presión arterial es la fuerza que ejerce la sangre sobre las paredes de sus vasos sanguíneos. ' +
      'Cuando esta presión es alta puede dañar los vasos y aumentar el riesgo de un infarto o un ACV. ' +
      'La medimos periódicamente para asegurarnos de que no se mantenga alta. La hipertensión es la condición ' +
      'de tener la presión arterial alta de forma sostenida.',
    chartDatasets: [
      {
        label: 'Sistólica',
        code: '8480-6',
        unit: 'mm[Hg]',
        backgroundColor,
        borderColor,
      },
      {
        label: 'Diastólica',
        code: '8462-4',
        unit: 'mm[Hg]',
        backgroundColor: secondBackgroundColor,
        borderColor: secondBorderColor,
      },
    ],
  },
  'body-temperature': {
    id: 'body-temperature',
    code: '8310-5',
    title: 'Temperatura corporal',
    description: 'Sus valores de temperatura corporal.',
    chartDatasets: [
      {
        label: 'Temperatura corporal',
        unit: 'Cel',
        backgroundColor,
        borderColor,
      },
    ],
  },
  height: {
    id: 'height',
    code: '8302-2',
    title: 'Altura',
    description: 'Sus valores de altura.',
    chartDatasets: [
      {
        label: 'Altura',
        unit: 'cm',
        backgroundColor,
        borderColor,
      },
    ],
  },
  'respiratory-rate': {
    id: 'respiratory-rate',
    code: '9279-1',
    title: 'Frecuencia respiratoria',
    description: 'Sus valores de frecuencia respiratoria.',
    chartDatasets: [
      {
        label: 'Frecuencia respiratoria',
        unit: '/min',
        backgroundColor,
        borderColor,
      },
    ],
  },
  'heart-rate': {
    id: 'heart-rate',
    code: '8867-4',
    title: 'Frecuencia cardíaca',
    description: 'Sus valores de frecuencia cardíaca.',
    chartDatasets: [
      {
        label: 'Frecuencia cardíaca',
        unit: '/min',
        backgroundColor,
        borderColor,
      },
    ],
  },
  weight: {
    id: 'weight',
    code: '29463-7',
    title: 'Peso',
    description: 'Sus valores de peso.',
    chartDatasets: [
      {
        label: 'Peso',
        unit: 'kg',
        backgroundColor,
        borderColor,
      },
    ],
  },
  bmi: {
    id: 'bmi',
    code: '39156-5', // Índice de masa corporal
    title: 'Índice de masa corporal (IMC)',
    description: 'El IMC relaciona su peso con su altura para evaluar si su peso es saludable.',
    chartDatasets: [{ label: 'IMC', unit: 'kg/m2', backgroundColor, borderColor }],
  },
  'waist-circumference': {
    id: 'waist-circumference',
    code: '56086-2', // Circunferencia de cintura
    title: 'Circunferencia de cintura',
    description:
      'La medida de su cintura con una cinta métrica. Una cintura grande se asocia con mayor riesgo ' +
      'cardiovascular y metabólico.',
    chartDatasets: [{ label: 'Cintura', unit: 'cm', backgroundColor, borderColor }],
  },

  // ── Laboratorio ───────────────────────────────────────────────────────────
  tfge: {
    id: 'tfge',
    code: '62238-1', // Filtrado glomerular estimado (TFGe / eGFR)
    title: 'Filtrado glomerular (función del riñón)',
    description:
      'El filtrado glomerular estimado (TFGe) indica qué tan bien limpian la sangre sus riñones. ' +
      'Lo encuentra en su análisis de laboratorio, a veces como "TFGe", "VFG" o "eGFR".',
    chartDatasets: [{ label: 'TFGe', unit: 'mL/min/{1.73_m2}', backgroundColor, borderColor }],
  },
  triglycerides: {
    id: 'triglycerides',
    code: '2571-8', // Triglicéridos
    title: 'Triglicéridos (grasas en sangre)',
    description: 'Los triglicéridos son un tipo de grasa en la sangre. Valores altos aumentan el riesgo cardiovascular.',
    chartDatasets: [{ label: 'Triglicéridos', unit: 'mg/dL', backgroundColor, borderColor }],
  },
  hdl: {
    id: 'hdl',
    code: '2085-9', // Colesterol HDL
    title: 'Colesterol HDL ("bueno")',
    description: 'El colesterol HDL ayuda a proteger su corazón. En general, valores más altos son mejores.',
    chartDatasets: [{ label: 'HDL', unit: 'mg/dL', backgroundColor, borderColor }],
  },
  ldl: {
    id: 'ldl',
    code: '13457-7', // Colesterol LDL (calculado)
    title: 'Colesterol LDL ("malo")',
    description: 'El colesterol LDL puede acumularse en las arterias. En general, valores más bajos son mejores.',
    chartDatasets: [{ label: 'LDL', unit: 'mg/dL', backgroundColor, borderColor }],
  },
  'non-hdl': {
    id: 'non-hdl',
    code: '43396-1', // Colesterol No-HDL
    title: 'Colesterol No-HDL',
    description:
      'El colesterol No-HDL resume todo el colesterol "malo" de la sangre. ' +
      'Figura en su análisis de laboratorio. Es el valor que usa el cálculo de riesgo cardiovascular.',
    chartDatasets: [{ label: 'No-HDL', unit: 'mg/dL', backgroundColor, borderColor }],
  },
  hba1c: {
    id: 'hba1c',
    code: '4548-4', // Hemoglobina glicosilada A1c
    title: 'Hemoglobina glicosilada (HbA1c)',
    description: 'La HbA1c refleja el promedio de azúcar en sangre de los últimos 2 a 3 meses.',
    chartDatasets: [{ label: 'HbA1c', unit: '%', backgroundColor, borderColor }],
  },
  'fasting-glucose': {
    id: 'fasting-glucose',
    code: '1558-6', // Glucosa en ayunas
    title: 'Glucemia en ayunas (azúcar en sangre)',
    description: 'El azúcar en sangre medido en ayunas (sin haber comido). Ayuda a evaluar el riesgo de diabetes.',
    chartDatasets: [{ label: 'Glucemia en ayunas', unit: 'mg/dL', backgroundColor, borderColor }],
  },
};

// Ids que pertenecen al Registro de Salud (signos vitales). El submenú de
// "Registro de Salud → Signos vitales" se arma a partir de esta lista; los
// estudios de laboratorio se cargan desde la página Laboratorio.
export const vitalsMeasurementIds = [
  'blood-pressure',
  'body-temperature',
  'height',
  'weight',
  'heart-rate',
  'respiratory-rate',
  'bmi',
  'waist-circumference',
];

// Ids que pertenecen a la página Laboratorio.
export const labMeasurementIds = [
  'tfge',
  'triglycerides',
  'hdl',
  'ldl',
  'non-hdl',
  'hba1c',
  'fasting-glucose',
];
