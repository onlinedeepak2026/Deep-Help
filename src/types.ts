export type ActiveTab =
  | 'home'
  | 'study'
  | 'calculators'
  | 'concrete'
  | 'brick'
  | 'steel'
  | 'mix'
  | 'cost'
  | 'rate'
  | 'unit'
  | 'converter'
  | 'design'
  | 'estimation'
  | 'survey'
  | 'surveying'
  | 'career'
  | 'ai-tools'
  | 'beam'
  | 'column'
  | 'slab'
  | 'footing'
  | 'tank'
  | 'formula'
  | 'formulas'
  | 'quiz'
  | 'quiz-manage'
  | 'scientific'
  | 'calculator'
  | 'pyqs'
  | 'academic-uploads'
  | 'practicals'
  | 'about'
  | 'founder'
  | 'feedback'
  | 'community'
  | 'notices';

export type ActiveModule = ActiveTab;

export interface Notice {
  id: string;
  title: string;
  category: 'Official' | 'Update' | 'Exam & Job' | 'Site Guidelines' | 'Important';
  content: string;
  link?: string;
  linkText?: string;
  isPinned?: boolean;
  authorName: string;
  authorRole: string;
  isFounderNotice?: boolean;
  timestamp: number;
  tags?: string[];
  views?: number;
  shares?: number;
}

export interface VisitorStats {
  totalVisits: number;
  todayVisits: number;
  activeOnline: number;
  totalLikes: number;
  userHasLiked: boolean;
  totalCalculations: number;
}

export interface CommunityComment {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  category: 'General' | 'Doubt & Question' | 'Site Experience' | 'Appreciation' | 'Exam Prep';
  content: string;
  timestamp: number;
  likes: number;
  userLiked?: boolean;
  replies?: {
    id: string;
    name: string;
    role: string;
    content: string;
    timestamp: number;
  }[];
}

export interface FeedbackItem {
  id: string;
  name: string;
  email?: string;
  role: string;
  rating: number; // 1 to 5
  category: 'Suggestion' | 'Accuracy' | 'Feature Request' | 'Appreciation' | 'Bug Report';
  message: string;
  timestamp: number;
  helpfulCount: number;
  userVotedHelpful?: boolean;
}

export interface ConcreteResult {
  grade: string;
  nominalRatio: string;
  wetVolume: number;
  dryVolume: number;
  cementBags: number;
  cementKg: number;
  sandCubicMeters: number;
  sandCubicFeet: number;
  sandKg: number;
  aggregateCubicMeters: number;
  aggregateCubicFeet: number;
  aggregateKg: number;
  waterLiters: number;
}

export interface BrickResult {
  wallVolume: number; // m3
  brickSizeWithMortar: string;
  brickSizeWithoutMortar: string;
  totalBricks: number;
  bricksWithWastage: number;
  mortarDryVolume: number; // m3
  cementBags: number;
  cementKg: number;
  sandCubicMeters: number;
  sandCubicFeet: number;
}

export interface CostEstimateResult {
  builtUpArea: number;
  unit: 'sqft' | 'sqm';
  costPerUnit: number;
  totalCost: number;
  structureCost: number;
  finishingCost: number;
  mepCost: number;
  servicesCost: number;
  materialCost: number;
  laborCost: number;
  contingencyCost: number;
}

export interface SurveyStation {
  id: string;
  stationName: string;
  bs: number | null; // Back Sight
  is: number | null; // Intermediate Sight
  fs: number | null; // Fore Sight
  hi?: number | null; // Height of Instrument
  rise?: number | null;
  fall?: number | null;
  rl?: number | null; // Reduced Level
  remarks: string;
}

export interface PointLoad {
  id: string;
  distance: number; // m from left support
  magnitude: number; // kN
}

export interface UdlLoad {
  id: string;
  start: number; // m from left
  end: number; // m from left
  load: number; // kN/m
}

export interface BeamResult {
  span: number;
  ra: number;
  rb: number;
  totalLoad: number;
  maxBendingMoment: number;
  maxMomentPosition: number;
}

export interface TankResult {
  shape: 'rectangular' | 'circular';
  grossVolumeM3: number;
  waterVolumeM3: number;
  capacityLiters: number;
  capacityGallons: number;
  personsServed: number; // based on 135 LPCD
}

export interface FormulaItem {
  id: string;
  category: string;
  title: string;
  formula: string;
  variables: { symbol: string; meaning: string }[];
  description: string;
  isStandardCode?: string;
  keyConcepts?: string[];
  practicalRule?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
  explanation: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface SavedCalculation {
  id: string;
  timestamp: number;
  module: string;
  title: string;
  summary: string;
  details: Record<string, string | number>;
}
