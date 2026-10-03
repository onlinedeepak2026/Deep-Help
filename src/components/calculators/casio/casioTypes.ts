export type CasioMode =
  | 'calculate'
  | 'home_menu'
  | 'equation'
  | 'table'
  | 'base_n'
  | 'spreadsheet';

export type AngleUnit = 'DEG' | 'RAD' | 'GRA';

export type DisplayTheme = 'lcd_green' | 'lcd_dark' | 'lcd_blue';

export interface CasioVariables {
  [key: string]: number;
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
  F: number;
  x: number;
  y: number;
  z: number;
  M: number;
  Ans: number;
}

export interface EquationResult {
  type: 'quadratic' | 'cubic' | 'simultaneous2' | 'simultaneous3';
  roots: { label: string; value: string }[];
  extrema?: { label: string; value: string }[];
  details?: string;
}

export interface TableRow {
  x: number;
  fx: number | string;
}

export interface SpreadsheetCell {
  row: number;
  col: number;
  val: string;
}
