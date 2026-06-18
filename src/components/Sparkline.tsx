// SPDX-License-Identifier: Apache-2.0
// Mini gráfico de línea (sparkline) en SVG, sin dependencias externas.
import type { JSX } from 'react';

interface SparklineProps {
  readonly values: number[];
  readonly width?: number;
  readonly height?: number;
  readonly color?: string; // color de Mantine (p. ej. 'teal', 'orange')
}

export function Sparkline({ values, width = 140, height = 40, color = 'teal' }: SparklineProps): JSX.Element | null {
  if (values.length < 2) {
    return null;
  }

  const pad = 4;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = (width - pad * 2) / (values.length - 1);

  const toX = (i: number): number => pad + i * stepX;
  const toY = (v: number): number => pad + (1 - (v - min) / range) * (height - pad * 2);

  const points = values.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ');
  const lastX = toX(values.length - 1);
  const lastY = toY(values[values.length - 1]);
  const stroke = `var(--mantine-color-${color}-6)`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Evolución de tu riesgo">
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={lastX} cy={lastY} r={3.5} fill={stroke} />
    </svg>
  );
}
