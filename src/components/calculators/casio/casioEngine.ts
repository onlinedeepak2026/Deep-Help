import { AngleUnit, EquationResult, TableRow } from './casioTypes';

// Approximate float to fraction with a max denominator
export function floatToFraction(val: number, tolerance = 1e-6): { num: number; den: number } | null {
  if (isNaN(val) || !isFinite(val)) return null;
  if (Math.abs(val) > 1e6) return null;
  if (Number.isInteger(val)) return { num: val, den: 1 };

  const sign = val < 0 ? -1 : 1;
  val = Math.abs(val);

  let h1 = 1, h2 = 0;
  let k1 = 0, k2 = 1;
  let b = val;

  do {
    const a = Math.floor(b);
    let aux = h1;
    h1 = a * h1 + h2;
    h2 = aux;
    aux = k1;
    k1 = a * k1 + k2;
    k2 = aux;
    b = 1 / (b - a);
  } while (Math.abs(val - h1 / k1) > val * tolerance && k1 < 10000 && b < 1e9);

  if (k1 > 10000 || k1 === 1) return null;
  return { num: sign * h1, den: k1 };
}

// Convert decimal degrees to Deg Min Sec (DMS)
export function decimalToDMS(deg: number): string {
  const sign = deg < 0 ? '-' : '';
  const abs = Math.abs(deg);
  const d = Math.floor(abs);
  const minFloat = (abs - d) * 60;
  const m = Math.floor(minFloat);
  const s = ((minFloat - m) * 60).toFixed(2);
  return `${sign}${d}°${m}′${s}″`;
}

// Factorial helper
export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n > 170) return Infinity;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

// Combinations nCr
export function nCr(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  if (r === 0 || r === n) return 1;
  return factorial(n) / (factorial(r) * factorial(n - r));
}

// Permutations nPr
export function nPr(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  return factorial(n) / factorial(n - r);
}

// Evaluate mathematical expression in Casio ClassWiz syntax
export function evaluateCasioExpression(
  expr: string,
  angleMode: AngleUnit = 'DEG',
  variables: Record<string, number> = {}
): number {
  if (!expr || !expr.trim()) return 0;

  let sanitized = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, `(${Math.PI})`)
    .replace(/e(?![a-zA-Z0-9_])/g, `(${Math.E})`)
    .replace(/\^/g, '**')
    .replace(/Ans/g, `(${variables.Ans ?? 0})`);

  // Substitute variables (A, B, C, D, E, F, x, y, z)
  ['A', 'B', 'C', 'D', 'E', 'F', 'x', 'y', 'z'].forEach((v) => {
    if (v in variables) {
      const regex = new RegExp(`(?<![a-zA-Z0-9_])${v}(?![a-zA-Z0-9_])`, 'g');
      sanitized = sanitized.replace(regex, `(${variables[v]})`);
    }
  });

  // Angle conversion multipliers
  let toRad = '* (Math.PI / 180)';
  let fromRad = '* (180 / Math.PI)';
  if (angleMode === 'RAD') {
    toRad = '';
    fromRad = '';
  } else if (angleMode === 'GRA') {
    toRad = '* (Math.PI / 200)';
    fromRad = '* (200 / Math.PI)';
  }

  // Trigonometric and inverse trigonometric
  sanitized = sanitized
    .replace(/sin⁻¹\(([^)]+)\)/g, `(Math.asin($1) ${fromRad})`)
    .replace(/cos⁻¹\(([^)]+)\)/g, `(Math.acos($1) ${fromRad})`)
    .replace(/tan⁻¹\(([^)]+)\)/g, `(Math.atan($1) ${fromRad})`)
    .replace(/asin\(([^)]+)\)/g, `(Math.asin($1) ${fromRad})`)
    .replace(/acos\(([^)]+)\)/g, `(Math.acos($1) ${fromRad})`)
    .replace(/atan\(([^)]+)\)/g, `(Math.atan($1) ${fromRad})`)
    .replace(/sin\(([^)]+)\)/g, `Math.sin(($1) ${toRad})`)
    .replace(/cos\(([^)]+)\)/g, `Math.cos(($1) ${toRad})`)
    .replace(/tan\(([^)]+)\)/g, `Math.tan(($1) ${toRad})`)
    .replace(/sinh\(([^)]+)\)/g, `Math.sinh($1)`)
    .replace(/cosh\(([^)]+)\)/g, `Math.cosh($1)`)
    .replace(/tanh\(([^)]+)\)/g, `Math.tanh($1)`);

  // Roots, logarithms, and powers
  sanitized = sanitized
    .replace(/cbrt\(([^)]+)\)/g, `Math.cbrt($1)`)
    .replace(/³√\(([^)]+)\)/g, `Math.cbrt($1)`)
    .replace(/sqrt\(([^)]+)\)/g, `Math.sqrt($1)`)
    .replace(/√\(([^)]+)\)/g, `Math.sqrt($1)`)
    .replace(/ln\(([^)]+)\)/g, `Math.log($1)`)
    .replace(/log\(([^)]+)\)/g, `Math.log10($1)`)
    .replace(/abs\(([^)]+)\)/g, `Math.abs($1)`)
    .replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');

  // Custom log base log_a(b) represented as logBase(b, a) => Math.log(b)/Math.log(a)
  sanitized = sanitized.replace(/logBase\(([^,]+),([^)]+)\)/g, '(Math.log($1)/Math.log($2))');

  // Combinations nCr(n, r) and nPr(n, r)
  sanitized = sanitized.replace(/(\d+)P(\d+)/g, (_, n, r) => nPr(parseInt(n, 10), parseInt(r, 10)).toString());
  sanitized = sanitized.replace(/(\d+)C(\d+)/g, (_, n, r) => nCr(parseInt(n, 10), parseInt(r, 10)).toString());

  // Factorials
  sanitized = sanitized.replace(/(\d+)!/g, (_, n) => factorial(parseInt(n, 10)).toString());

  // Scientific notation format (e.g., 5×10^3)
  sanitized = sanitized.replace(/(\d+(?:\.\d+)?)\*10\*\*([+-]?\d+)/g, '($1e$2)');

  // Safely evaluate
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const fn = new Function(`"use strict"; return (${sanitized});`);
  const res = fn();
  if (typeof res !== 'number' || isNaN(res)) {
    throw new Error('Math Error');
  }
  return res;
}

// Format a number based on format style
export function formatResultString(
  num: number,
  mode: 'standard' | 'fraction' | 'scientific' | 'dms' = 'standard'
): string {
  if (isNaN(num)) return 'Math Error';
  if (!isFinite(num)) return num > 0 ? 'Infinity' : '-Infinity';

  if (mode === 'fraction') {
    const frac = floatToFraction(num);
    if (frac) {
      if (Math.abs(frac.num) > frac.den && frac.den > 1) {
        // Mixed fraction
        const whole = Math.floor(Math.abs(frac.num) / frac.den) * (frac.num < 0 ? -1 : 1);
        const rem = Math.abs(frac.num) % frac.den;
        return `${frac.num}/${frac.den} (${whole} ⌟ ${rem}/${frac.den})`;
      }
      return `${frac.num}/${frac.den}`;
    }
  }

  if (mode === 'scientific') {
    return num.toExponential(6).replace('e+', '×10^').replace('e', '×10^');
  }

  if (mode === 'dms') {
    return decimalToDMS(num);
  }

  // Standard output
  if (Math.abs(num) < 1e-9 && num !== 0) {
    return num.toExponential(6).replace('e+', '×10^').replace('e', '×10^');
  }
  if (Math.abs(num) >= 1e11) {
    return num.toExponential(6).replace('e+', '×10^').replace('e', '×10^');
  }

  // Clean rounding
  const fixed = Number(num.toFixed(8));
  return fixed.toString();
}

// Quadratic Equation Solver: ax^2 + bx + c = 0
export function solveQuadratic(a: number, b: number, c: number): EquationResult {
  if (a === 0) {
    if (b === 0) {
      return {
        type: 'quadratic',
        roots: [{ label: 'Result', value: c === 0 ? 'Infinite Solutions' : 'No Solution' }],
      };
    }
    const x = -c / b;
    return {
      type: 'quadratic',
      roots: [{ label: 'x', value: Number(x.toFixed(6)).toString() }],
    };
  }

  const d = b * b - 4 * a * c;
  const xv = -b / (2 * a);
  const yv = a * xv * xv + b * xv + c;
  const extremaLabel = a > 0 ? 'Minimum of y=ax²+bx+c' : 'Maximum of y=ax²+bx+c';

  if (d > 0) {
    const x1 = (-b + Math.sqrt(d)) / (2 * a);
    const x2 = (-b - Math.sqrt(d)) / (2 * a);
    return {
      type: 'quadratic',
      roots: [
        { label: 'x₁', value: Number(x1.toFixed(6)).toString() },
        { label: 'x₂', value: Number(x2.toFixed(6)).toString() },
      ],
      extrema: [
        { label: 'x-coordinate', value: Number(xv.toFixed(6)).toString() },
        { label: extremaLabel, value: Number(yv.toFixed(6)).toString() },
      ],
      details: `Discriminant Δ = ${d.toFixed(4)} > 0 (Two distinct real roots)`,
    };
  } else if (d === 0) {
    const x = -b / (2 * a);
    return {
      type: 'quadratic',
      roots: [{ label: 'x₁ = x₂', value: Number(x.toFixed(6)).toString() }],
      extrema: [
        { label: 'x-coordinate', value: Number(xv.toFixed(6)).toString() },
        { label: extremaLabel, value: Number(yv.toFixed(6)).toString() },
      ],
      details: `Discriminant Δ = 0 (One repeated real root)`,
    };
  } else {
    // Complex roots
    const real = -b / (2 * a);
    const imag = Math.sqrt(-d) / (2 * a);
    const realStr = Number(real.toFixed(6)).toString();
    const imagStr = Number(Math.abs(imag).toFixed(6)).toString();
    return {
      type: 'quadratic',
      roots: [
        { label: 'x₁', value: `${realStr} + ${imagStr}i` },
        { label: 'x₂', value: `${realStr} - ${imagStr}i` },
      ],
      extrema: [
        { label: 'x-coordinate', value: Number(xv.toFixed(6)).toString() },
        { label: extremaLabel, value: Number(yv.toFixed(6)).toString() },
      ],
      details: `Discriminant Δ = ${d.toFixed(4)} < 0 (Complex conjugate roots)`,
    };
  }
}

// Simultaneous Linear Equations (2 Unknowns):
// a1*x + b1*y = c1
// a2*x + b2*y = c2
export function solveSimultaneous2(
  a1: number, b1: number, c1: number,
  a2: number, b2: number, c2: number
): EquationResult {
  const det = a1 * b2 - a2 * b1;
  if (Math.abs(det) < 1e-12) {
    return {
      type: 'simultaneous2',
      roots: [{ label: 'Status', value: 'No unique solution (Parallel/Coincident)' }],
      details: 'Determinant = 0',
    };
  }
  const x = (c1 * b2 - c2 * b1) / det;
  const y = (a1 * c2 - a2 * c1) / det;
  return {
    type: 'simultaneous2',
    roots: [
      { label: 'x', value: Number(x.toFixed(6)).toString() },
      { label: 'y', value: Number(y.toFixed(6)).toString() },
    ],
    details: `Determinant D = ${det.toFixed(4)}`,
  };
}

// Cubic Equation Solver: ax^3 + bx^2 + cx + d = 0 (using Cardano's method)
export function solveCubic(a: number, b: number, c: number, d: number): EquationResult {
  if (a === 0) {
    return solveQuadratic(b, c, d);
  }

  // Normalize to x^3 + px + q = 0
  const p = (3 * a * c - b * b) / (3 * a * a);
  const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
  const delta = (q * q) / 4 + (p * p * p) / 27;
  const shift = -b / (3 * a);

  if (delta > 0) {
    const u = Math.cbrt(-q / 2 + Math.sqrt(delta));
    const v = Math.cbrt(-q / 2 - Math.sqrt(delta));
    const x1 = u + v + shift;
    const realPart = -(u + v) / 2 + shift;
    const imagPart = ((u - v) * Math.sqrt(3)) / 2;

    return {
      type: 'cubic',
      roots: [
        { label: 'x₁ (Real)', value: Number(x1.toFixed(6)).toString() },
        { label: 'x₂', value: `${Number(realPart.toFixed(5))} + ${Number(Math.abs(imagPart).toFixed(5))}i` },
        { label: 'x₃', value: `${Number(realPart.toFixed(5))} - ${Number(Math.abs(imagPart).toFixed(5))}i` },
      ],
      details: 'One real root and two complex roots',
    };
  } else if (delta === 0) {
    const u = Math.cbrt(-q / 2);
    const x1 = 2 * u + shift;
    const x2 = -u + shift;
    return {
      type: 'cubic',
      roots: [
        { label: 'x₁', value: Number(x1.toFixed(6)).toString() },
        { label: 'x₂ = x₃', value: Number(x2.toFixed(6)).toString() },
      ],
      details: 'Three real roots, at least two are equal',
    };
  } else {
    // 3 distinct real roots (casus irreducibilis)
    const r = Math.sqrt(-(p * p * p) / 27);
    const phi = Math.acos(-q / (2 * r));
    const m = 2 * Math.cbrt(r);
    const x1 = m * Math.cos(phi / 3) + shift;
    const x2 = m * Math.cos((phi + 2 * Math.PI) / 3) + shift;
    const x3 = m * Math.cos((phi + 4 * Math.PI) / 3) + shift;

    return {
      type: 'cubic',
      roots: [
        { label: 'x₁', value: Number(x1.toFixed(6)).toString() },
        { label: 'x₂', value: Number(x2.toFixed(6)).toString() },
        { label: 'x₃', value: Number(x3.toFixed(6)).toString() },
      ],
      details: 'Three distinct real roots',
    };
  }
}

// Base-N conversions & bitwise operations
export function convertBaseN(valStr: string, fromBase: 10 | 16 | 2 | 8): {
  dec: string;
  hex: string;
  bin: string;
  oct: string;
} {
  try {
    const num = parseInt(valStr.trim() || '0', fromBase);
    if (isNaN(num)) {
      return { dec: '0', hex: '0', bin: '0', oct: '0' };
    }
    return {
      dec: num.toString(10),
      hex: num.toString(16).toUpperCase(),
      bin: num.toString(2),
      oct: num.toString(8),
    };
  } catch {
    return { dec: '0', hex: '0', bin: '0', oct: '0' };
  }
}

// Generate table for f(x)
export function generateFunctionTable(
  funcExpr: string,
  start: number,
  end: number,
  step: number
): TableRow[] {
  if (step <= 0 || start > end) return [];
  const rows: TableRow[] = [];
  const maxRows = 40;
  let count = 0;

  for (let x = start; x <= end + 1e-9 && count < maxRows; x += step, count++) {
    const roundedX = Number(x.toFixed(6));
    try {
      const res = evaluateCasioExpression(funcExpr, 'RAD', { x: roundedX });
      rows.push({
        x: roundedX,
        fx: Number(res.toFixed(6)),
      });
    } catch {
      rows.push({
        x: roundedX,
        fx: 'Error',
      });
    }
  }

  return rows;
}
