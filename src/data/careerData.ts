export interface JobExamAlert {
  id: string;
  category: 'SSC JE' | 'RRB JE' | 'BTSC JE' | 'GATE Civil' | 'State PWD / PSU';
  title: string;
  titleHi: string;
  organization: string;
  posts: string;
  totalVacancies: string;
  eligibility: string;
  eligibilityHi: string;
  status: 'Upcoming' | 'Active Notification' | 'Admit Card' | 'Exam Date Out' | 'Result Out';
  applicationDeadline: string;
  examDate: string;
  officialLink: string;
  syllabusHighlights: string[];
  examPattern: {
    stage: string;
    mode: string;
    totalMarks: number;
    durationMinutes: number;
    subjects: string[];
  }[];
  deepHelpTips: string;
}

export const CAREER_ALERTS_LIST: JobExamAlert[] = [
  {
    id: 'alert-ssc-je-2025',
    category: 'SSC JE',
    title: 'SSC Junior Engineer (Civil) Examination 2025-26',
    titleHi: 'एसएससी जूनियर इंजीनियर (सिविल) भर्ती परीक्षा',
    organization: 'Staff Selection Commission (CPWD, MES, BRO, CWC)',
    posts: 'Junior Engineer (Civil) Group B Non-Gazetted',
    totalVacancies: '1,500+ (Tentative Across All Departments)',
    eligibility: 'Diploma or B.Tech/B.E. in Civil Engineering from recognized university (BRO/MES may require 2 yrs experience for Diploma).',
    eligibilityHi: 'सिविल इंजीनियरिंग में 3 वर्षीय डिप्लोमा या बी.टेक/बी.ई.',
    status: 'Active Notification',
    applicationDeadline: 'Refer to Official SSC Calendar',
    examDate: 'Paper-1: October / November | Paper-2: January',
    officialLink: 'https://ssc.gov.in',
    syllabusHighlights: [
      'Building Materials & Concrete Technology (15-18 Qs)',
      'Estimating, Costing & Valuation (8-10 Qs)',
      'Surveying & Leveling (10-12 Qs)',
      'Soil Mechanics & Foundation Engg (10-12 Qs)',
      'Hydraulics & Fluid Mechanics (8-10 Qs)',
      'RCC Design & Steel Design (14-16 Qs)',
      'General Intelligence & Reasoning (50 Marks)',
      'General Awareness (50 Marks)'
    ],
    examPattern: [
      {
        stage: 'Paper 1 (CBT Objective)',
        mode: 'Online Computer Based Test',
        totalMarks: 200,
        durationMinutes: 120,
        subjects: ['General Intelligence & Reasoning (50)', 'General Awareness (50)', 'General Engineering - Civil (100)']
      },
      {
        stage: 'Paper 2 (CBT Objective with Calculator)',
        mode: 'Online Computer Based Test (Scientific Calculator Allowed)',
        totalMarks: 300,
        durationMinutes: 120,
        subjects: ['Part-A Civil & Structural Engineering (100 Questions × 3 Marks, Negative: 1 Mark)']
      }
    ],
    deepHelpTips: 'Practice IS 456, IS 800 codal clauses and unit conversions daily on our Engineering Calculators.'
  },
  {
    id: 'alert-rrb-je-2025',
    category: 'RRB JE',
    title: 'Railway Recruitment Board (RRB) Junior Engineer (Civil & Track Machine)',
    titleHi: 'रेलवे भर्ती बोर्ड (आरआरबी) जूनियर इंजीनियर सिविल',
    organization: 'Ministry of Railways (Indian Railways Zonal Divisions)',
    posts: 'Junior Engineer (Civil), Works, P-Way, Bridge, Drawing',
    totalVacancies: '7,900+ (All Trades, ~2,800 Civil Seats)',
    eligibility: 'Three years Diploma in Civil / Civil with Construction / B.Tech Civil.',
    eligibilityHi: 'सिविल इंजीनियरिंग में 3 वर्षीय डिप्लोमा या बी.टेक डिग्री।',
    status: 'Upcoming',
    applicationDeadline: 'Per Railway Board CEN Notification',
    examDate: 'CBT-1: Q3 | CBT-2: Q4',
    officialLink: 'https://indianrailways.gov.in',
    syllabusHighlights: [
      'CBT 1: Mathematics (30), General Intelligence & Reasoning (25), General Science (30), General Awareness (15)',
      'CBT 2: Technical Civil Engineering Abilities (100 Marks)',
      'Railway Track Structure, Sleepers, Ballast & Rail Crossings',
      'Civil Engineering Material Testing & Quality Control'
    ],
    examPattern: [
      {
        stage: 'Stage 1 (CBT 1 - Screening)',
        mode: 'Objective Online CBT',
        totalMarks: 100,
        durationMinutes: 90,
        subjects: ['Maths (30)', 'Reasoning (25)', 'General Science (30)', 'General Awareness (15)']
      },
      {
        stage: 'Stage 2 (CBT 2 - Merit)',
        mode: 'Objective Online CBT',
        totalMarks: 150,
        durationMinutes: 120,
        subjects: ['Technical Civil Engineering (100)', 'General Awareness (15)', 'Physics & Chemistry (15)', 'Basics of Computers (10)', 'Basics of Environment (10)']
      }
    ],
    deepHelpTips: 'Railway permanent way (P-Way) questions and survey curves carry high scoring weightage in RRB JE CBT-2.'
  },
  {
    id: 'alert-btsc-je-2025',
    category: 'BTSC JE',
    title: 'Bihar Technical Service Commission (BTSC) Kanishth Abhiyanta (Civil)',
    titleHi: 'बिहार तकनीकी सेवा आयोग (BTSC) कनीय अभियंता (असैनिक)',
    organization: 'Government of Bihar (Building Construction, WRD, RWD, PHED)',
    posts: 'Kanishth Abhiyanta (Junior Engineer Civil)',
    totalVacancies: '6,988 Vacancies (State Government Cadre)',
    eligibility: 'Diploma in Civil Engineering from recognized SBTE Bihar or AICTE approved polytechnic.',
    eligibilityHi: 'मान्यता प्राप्त संस्थान से सिविल इंजीनियरिंग में 3 वर्षीय डिप्लोमा।',
    status: 'Active Notification',
    applicationDeadline: 'Check BTSC Official Portal',
    examDate: 'Written CBT / Merit Schedule Announced on Portal',
    officialLink: 'https://btsc.bihar.gov.in',
    syllabusHighlights: [
      'Building Construction & Materials',
      'Applied Mechanics & SOM',
      'Concrete Technology & Mix Proportioning',
      'Water Resources & Irrigation in Bihar',
      'Highway Engineering & Rural Roads (RWD)',
      'Public Health Engineering (PHED)'
    ],
    examPattern: [
      {
        stage: 'Written Examination / Merit Matrix',
        mode: 'CBT Examination & Academic Marks Weightage',
        totalMarks: 100,
        durationMinutes: 120,
        subjects: ['Domain Specific Civil Engineering Technical Syllabus (Diploma Level) + Bihar General Knowledge']
      }
    ],
    deepHelpTips: 'Pay special attention to Bihar irrigation projects (Kosi, Gandak canals), tube-well discharge, and building bylaws.'
  },
  {
    id: 'alert-gate-civil-2026',
    category: 'GATE Civil',
    title: 'Graduate Aptitude Test in Engineering (GATE Civil - CE)',
    titleHi: 'गेट सिविल इंजीनियरिंग परीक्षा (आईआईटी द्वारा आयोजित)',
    organization: 'IIT / IISc Bangalore (MoE Government of India)',
    posts: 'PSU Recruitment (IOCL, ONGC, NTPC, NHAI, BARC) & M.Tech Admissions',
    totalVacancies: 'Direct Executive Trainee / AEE in Maharatna & Navratna PSUs',
    eligibility: 'B.Tech / B.E. in Civil Engineering (Final year students also eligible).',
    eligibilityHi: 'सिविल इंजीनियरिंग में बी.टेक / बी.ई. या अंतिम वर्ष के छात्र।',
    status: 'Upcoming',
    applicationDeadline: 'September - October Every Year',
    examDate: 'First / Second Weekend of February',
    officialLink: 'https://gate.iitk.ac.in',
    syllabusHighlights: [
      'Geotechnical Engineering (Soil Mechanics + Foundation): ~14-16% Weightage',
      'Environmental Engineering (Water + Wastewater + Air/Noise): ~10-12%',
      'Transportation Engineering (Geometric Design + Pavement): ~8-10%',
      'Structural Analysis & SOM: ~10-12%',
      'Fluid Mechanics & Hydraulics: ~7-9%',
      'Engineering Mathematics: 13% Fixed',
      'General Aptitude: 15% Fixed'
    ],
    examPattern: [
      {
        stage: 'Computer Based Test (Single Stage)',
        mode: 'Online CBT with Virtual Scientific Calculator',
        totalMarks: 100,
        durationMinutes: 180,
        subjects: ['General Aptitude (15 Marks)', 'Engineering Mathematics (13 Marks)', 'Civil Engineering Subject Knowledge (72 Marks - MCQ, MSQ, NAT)']
      }
    ],
    deepHelpTips: 'Numerical Answer Type (NAT) questions have NO negative marking. Master Geotech and Environmental engineering first for maximum cutoff clearance.'
  },
  {
    id: 'alert-psu-state-pwd',
    category: 'State PWD / PSU',
    title: 'Central & State Public Works, BRO, DMRC & NHAI Civil Engineer Alerts',
    titleHi: 'केंद्रीय एवं राज्य लोक निर्माण विभाग, बीआरओ एवं एनएचएआई भर्तियां',
    organization: 'Border Roads Organisation (BRO), DMRC, NHAI, Airport Authority (AAI)',
    posts: 'Assistant Engineer (AE) / Junior Engineer (JE) / Management Trainee',
    totalVacancies: 'Rolling Advertisements Across India',
    eligibility: 'Degree / Diploma in Civil Engineering.',
    eligibilityHi: 'सिविल इंजीनियरिंग में डिग्री अथवा डिप्लोमा।',
    status: 'Active Notification',
    applicationDeadline: 'Monthly Rolling Updates',
    examDate: 'Varies per recruitment notice',
    officialLink: 'https://www.bro.gov.in',
    syllabusHighlights: [
      'General Civil Engineering Principles',
      'Tendering, E-Procurement, Contract Act, FIDIC conditions',
      'Quality Control, Non-Destructive Testing (NDT)',
      'Safety on Construction Sites & IS 3764'
    ],
    examPattern: [
      {
        stage: 'Written CBT / Trade Test / Interview',
        mode: 'National / State Examination Centers',
        totalMarks: 100,
        durationMinutes: 120,
        subjects: ['Technical Civil Knowledge + Quantitative Aptitude + Language & Interview']
      }
    ],
    deepHelpTips: 'Review our Rate Analysis and Detailed Estimation tools to easily answer practical site and billing questions in interviews.'
  }
];
