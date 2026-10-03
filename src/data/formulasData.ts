import { FormulaItem } from '../types';
import { CIVIL_CONCEPTS_PART_1 } from './civilConceptsData1';
import { CIVIL_CONCEPTS_PART_2 } from './civilConceptsData2';

export const FORMULAS_DATA: FormulaItem[] = [
  ...CIVIL_CONCEPTS_PART_1,
  ...CIVIL_CONCEPTS_PART_2,
];

export { CIVIL_CONCEPTS_PART_1, CIVIL_CONCEPTS_PART_2 };
