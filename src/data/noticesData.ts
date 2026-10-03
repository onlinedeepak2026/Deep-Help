import { Notice } from '../types';

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'notice-founder-1',
    title: 'New CASIO fx-991CW Engineering Scientific Calculator Released!',
    category: 'Official',
    content:
      'Dear Civil Engineers and Students, we have integrated a full-function CASIO fx-991CW ClassWiz Scientific Calculator into Deep Help! Includes natural textbook display, CATALOG civil/physical constants (Steel density 7850 kg/m³, Concrete elastic modulus, g=9.81 m/s²), memory variable registers (A-F, x, y, z), and angle mode toggle (Deg/Rad/Gra). Try it on site and share your feedback.',
    link: 'https://www.facebook.com/share/1BwLC95KKg/',
    linkText: 'Er. Deepak Kumar Facebook Announcement',
    isPinned: true,
    authorName: 'Er. Deepak Kumar',
    authorRole: 'Founder (Diploma + B.Tech Civil)',
    isFounderNotice: true,
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    tags: ['CASIO fx-991CW', 'Calculator', 'Founder Notice', 'Civil Standards'],
    views: 842,
    shares: 156,
  },
  {
    id: 'notice-founder-2',
    title: 'Revised IS 456 & IS 10262:2019 Ready-Reckoner Concrete Mix Updates',
    category: 'Site Guidelines',
    content:
      'Official guidelines bulletin: On-site verification charts for M20, M25, and M30 grade concrete batches have been updated with sand bulking correction factors and water-cement ratio limit indicators (IS 456 Table 5). All site engineers can now print client-ready PDF calculation reports directly.',
    link: 'mailto:deepak2OO61122@gmail.com',
    linkText: 'Contact Er. Deepak Kumar for Mix Queries',
    isPinned: true,
    authorName: 'Er. Deepak Kumar',
    authorRole: 'Founder (Deep Help)',
    isFounderNotice: true,
    timestamp: Date.now() - 1000 * 60 * 60 * 26, // 1 day ago
    tags: ['IS 456', 'IS 10262', 'Mix Design', 'Site Guidelines'],
    views: 1280,
    shares: 310,
  },
  {
    id: 'notice-3',
    title: 'SSC JE & State AE/JE Civil Engineering Mock Quiz Sets Uploaded',
    category: 'Exam & Job',
    content:
      'New batch of 50+ previous year questions covering Soil Mechanics, RCC Limit State Method, Fluid Mechanics, and Highway Engineering IRC standards is now accessible under the Civil Quiz tab with full step-by-step explanations.',
    link: '',
    linkText: '',
    isPinned: false,
    authorName: 'Deep Help Technical Editorial Board',
    authorRole: 'Academic Advisory',
    isFounderNotice: false,
    timestamp: Date.now() - 1000 * 60 * 60 * 50, // 2 days ago
    tags: ['SSC JE', 'GATE Civil', 'State PSC', 'Quiz Sets'],
    views: 654,
    shares: 98,
  },
  {
    id: 'notice-4',
    title: 'Surveying & Leveling Book Calculation Sheet With Auto Check',
    category: 'Update',
    content:
      'Field survey team announcement: The Rise & Fall and Height of Instrument (HI) methods now include automatic arithmetic verification (Sum of BS - Sum of FS = Last RL - First RL).',
    link: 'https://www.facebook.com/share/1BwLC95KKg/',
    linkText: 'Join Discussion on Facebook',
    isPinned: false,
    authorName: 'Er. Deepak Kumar',
    authorRole: 'Founder (Deep Help)',
    isFounderNotice: true,
    timestamp: Date.now() - 1000 * 60 * 60 * 75,
    tags: ['Surveying', 'Leveling', 'Site Verification'],
    views: 920,
    shares: 184,
  },
];
