export interface PYQItem {
  id: string;
  exam: 'SSC JE' | 'RRB JE' | 'BTSC JE' | 'GATE Civil' | 'State AE/JE' | string;
  year: string;
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionEn: string;
  questionHi: string;
  optionsEn: string[];
  optionsHi: string[];
  correctOption: number; // 0-indexed
  solutionEn: string;
  solutionHi: string;
  codeReference?: string;
  isCustom?: boolean;
  createdAt?: string;
}

export const CIVIL_PYQS: PYQItem[] = [
  {
    id: 'pyq-ssc-2023-01',
    exam: 'SSC JE',
    year: '2023 CBT-1',
    subject: 'RCC Design',
    topic: 'Limit State Design (Beams)',
    difficulty: 'Medium',
    questionEn: 'As per IS 456:2000, what is the maximum depth of neutral axis (Xu,max / d) for Fe 415 grade steel in limit state of collapse?',
    questionHi: 'IS 456:2000 के अनुसार, चरम सीमा अवस्था में Fe 415 ग्रेड स्टील के लिए तटस्थ अक्ष की अधिकतम गहराई (Xu,max / d) कितनी होती है?',
    optionsEn: ['0.53', '0.48', '0.46', '0.43'],
    optionsHi: ['0.53', '0.48', '0.46', '0.43'],
    correctOption: 1,
    solutionEn: 'According to IS 456:2000 (Clause 38.1 Note):\n• For Fe 250: Xu,max / d = 0.53\n• For Fe 415: Xu,max / d = 0.48\n• For Fe 500: Xu,max / d = 0.46\n• For Fe 550: Xu,max / d = 0.44\nDerived from strain compatibility: (Xu,max / d) = 0.0035 / (0.0055 + 0.87·fy/Es).',
    solutionHi: 'IS 456:2000 के अनुसार:\n• Fe 250 के लिए: Xu,max / d = 0.53\n• Fe 415 के लिए: Xu,max / d = 0.48\n• Fe 500 के लिए: Xu,max / d = 0.46\nयह फॉर्मूला (0.0035 / (0.0055 + 0.87·fy/Es)) से प्राप्त होता है।',
    codeReference: 'IS 456:2000 Clause 38.1'
  },
  {
    id: 'pyq-rrb-2019-01',
    exam: 'RRB JE',
    year: '2019 CBT-2',
    subject: 'Surveying',
    topic: 'Levelling',
    difficulty: 'Easy',
    questionEn: 'In levelling, if the staff reading at a Benchmark (RL = 100.000 m) is 2.450 m (Backsight), what is the Height of Instrument (HI)?',
    questionHi: 'तलेक्षण (Levelling) में, यदि बेंचमार्क (RL = 100.000 m) पर स्टाफ पाठ्यांक 2.450 m (Backsight) है, तो उपकरण की ऊंचाई (HI) क्या होगी?',
    optionsEn: ['97.550 m', '102.450 m', '100.000 m', '104.900 m'],
    optionsHi: ['97.550 m', '102.450 m', '100.000 m', '104.900 m'],
    correctOption: 1,
    solutionEn: 'In the Height of Instrument (HI) method:\nHI = RL of Benchmark + Backsight (BS)\nHI = 100.000 m + 2.450 m = 102.450 m.',
    solutionHi: 'उपकरण की ऊंचाई विधि (HI Method) में:\nHI = BM का तल (RL) + पश्चावलोकन (BS)\nHI = 100.000 + 2.450 = 102.450 m.',
    codeReference: 'Surveying by B.C. Punmia'
  },
  {
    id: 'pyq-btsc-2022-01',
    exam: 'BTSC JE',
    year: '2022 Civil',
    subject: 'Building Materials',
    topic: 'Cement & Concrete',
    difficulty: 'Easy',
    questionEn: 'Which Bogue compound is primarily responsible for the early strength of Portland cement within the first 7 days?',
    questionHi: 'पोर्टलैंड सीमेंट में पहले 7 दिनों में प्रारंभिक शक्ति के लिए मुख्य रूप से कौन सा बोग यौगिक (Bogue compound) जिम्मेदार होता है?',
    optionsEn: ['Dicalcium Silicate (C2S)', 'Tricalcium Silicate (C3S)', 'Tricalcium Aluminate (C3A)', 'Tetracalcium Aluminoferrite (C4AF)'],
    optionsHi: ['डाईकैल्शियम सिलिकेट (C2S)', 'ट्राईकैल्शियम सिलिकेट (C3S)', 'ट्राईकैल्शियम एलुमिनेट (C3A)', 'टेट्राकैल्शियम एलुमिनोफेराइट (C4AF)'],
    correctOption: 1,
    solutionEn: 'Tricalcium Silicate (C3S / Alite) hydrates rapidly and contributes to the early strength (up to 7-14 days). C2S (Belite) is responsible for ultimate and progressive later strength beyond 28 days to 1 year.',
    solutionHi: 'ट्राईकैल्शियम सिलिकेट (C3S) तेजी से हाइड्रेट होता है और 7 से 14 दिनों तक की प्रारंभिक शक्ति प्रदान करता है। C2S 28 दिनों के बाद की दीर्घकालिक शक्ति के लिए जिम्मेदार है।',
    codeReference: 'IS 269 & Concrete Technology (M.S. Shetty)'
  },
  {
    id: 'pyq-gate-2022-01',
    exam: 'GATE Civil',
    year: '2022 Forenoon',
    subject: 'Geotechnical Engineering',
    topic: 'Soil Mechanics (Phase Relations)',
    difficulty: 'Hard',
    questionEn: 'A soil sample has a void ratio (e) of 0.67 and specific gravity (G) of 2.70. If the degree of saturation (S) is 100%, what is the saturated unit weight (γsat) in kN/m³? (Take unit weight of water γw = 9.81 kN/m³)',
    questionHi: 'एक मृदा नमूने का रिक्ति अनुपात (e) 0.67 और विशिष्ट गुरुत्व (G) 2.70 है। यदि संतृप्ति की मात्रा (S) 100% है, तो संतृप्त इकाई भार (γsat) kN/m³ में क्या होगा? (जल का भार γw = 9.81 kN/m³)',
    optionsEn: ['19.80 kN/m³', '17.45 kN/m³', '21.50 kN/m³', '18.90 kN/m³'],
    optionsHi: ['19.80 kN/m³', '17.45 kN/m³', '21.50 kN/m³', '18.90 kN/m³'],
    correctOption: 0,
    solutionEn: 'Formula: γsat = [(G + e) / (1 + e)] · γw\nγsat = [(2.70 + 0.67) / (1 + 0.67)] · 9.81\nγsat = [3.37 / 1.67] · 9.81 = 2.0179 · 9.81 ≈ 19.80 kN/m³.',
    solutionHi: 'सूत्र: γsat = [(G + e) / (1 + e)] · γw\nγsat = [(2.70 + 0.67) / (1 + 0.67)] · 9.81\nγsat = [3.37 / 1.67] · 9.81 ≈ 19.80 kN/m³.',
    codeReference: 'Soil Mechanics (Gopal Ranjan & Rao)'
  },
  {
    id: 'pyq-ssc-2022-02',
    exam: 'SSC JE',
    year: '2022 CBT-1',
    subject: 'Transportation Engineering',
    topic: 'Highway Geometric Design',
    difficulty: 'Medium',
    questionEn: 'As per IRC, what is the ruling design speed for a National Highway in Plain Terrain?',
    questionHi: 'IRC के अनुसार, मैदानी क्षेत्र में राष्ट्रीय राजमार्ग (NH) के लिए मानक डिजाइन गति (Ruling Design Speed) क्या है?',
    optionsEn: ['80 km/h', '100 km/h', '120 km/h', '65 km/h'],
    optionsHi: ['80 km/h', '100 km/h', '120 km/h', '65 km/h'],
    correctOption: 1,
    solutionEn: 'As per IRC:73 Table 2:\n• National Highway (NH) / State Highway (SH) in Plain Terrain: Ruling = 100 km/h, Minimum = 80 km/h.\n• Rolling Terrain: Ruling = 80 km/h.\n• Mountainous Terrain: Ruling = 50 km/h.',
    solutionHi: 'IRC:73 के अनुसार:\n• मैदानी क्षेत्र में राष्ट्रीय राजमार्ग (NH)/राज्य राजमार्ग (SH): Ruling = 100 km/h, Minimum = 80 km/h.\n• रोलिंग भूभाग: 80 km/h.\n• पहाड़ी भूभाग: 50 km/h.',
    codeReference: 'IRC:73-1980 Table 2'
  },
  {
    id: 'pyq-rrb-2019-02',
    exam: 'RRB JE',
    year: '2019 CBT-2',
    subject: 'Estimation & Costing',
    topic: 'Analysis of Rates',
    difficulty: 'Medium',
    questionEn: 'What is the dry volume of mortar required for 1 cubic meter of standard brickwork with cement-sand mortar?',
    questionHi: 'सीमेंट-बालू मसाले के साथ 1 घन मीटर मानक ईंट की चिनाई के लिए सूखे मसाले (Dry Mortar) का आयतन कितना माना जाता है?',
    optionsEn: ['0.15 m³', '0.30 m³', '0.54 m³', '0.45 m³'],
    optionsHi: ['0.15 m³', '0.30 m³', '0.54 m³', '0.45 m³'],
    correctOption: 1,
    solutionEn: 'For 1 m³ of brickwork:\n• Wet mortar volume is about 0.23 to 0.25 m³ (accounting for frogs, joints, and 10% wastage).\n• Dry volume of mortar required = 1.25 to 1.33 times wet volume ≈ 0.30 m³ (30% of brickwork volume).',
    solutionHi: '1 घन मीटर ईंट चिनाई के लिए:\n• गीले मसाले का आयतन लगभग 0.23-0.25 m³ होता है।\n• सूखे मसाले (Dry volume) की मात्रा लगभग 0.30 m³ (अर्थात 30%) ली जाती है।',
    codeReference: 'CPWD DSR & IS 1200 Part 3'
  },
  {
    id: 'pyq-ssc-2021-03',
    exam: 'SSC JE',
    year: '2021 CBT-1',
    subject: 'Environmental Engineering',
    topic: 'Water Supply & Quality',
    difficulty: 'Easy',
    questionEn: 'As per IS 10500:2012, what is the maximum permissible limit of Fluoride in drinking water in the absence of an alternate source?',
    questionHi: 'IS 10500:2012 के अनुसार, वैकल्पिक स्रोत के अभाव में पीने के पानी में फ्लोराइड की अधिकतम स्वीकार्य सीमा क्या है?',
    optionsEn: ['1.0 mg/L', '1.5 mg/L', '2.0 mg/L', '0.5 mg/L'],
    optionsHi: ['1.0 mg/L', '1.5 mg/L', '2.0 mg/L', '0.5 mg/L'],
    correctOption: 1,
    solutionEn: 'Per IS 10500:2012:\n• Acceptable limit of Fluoride = 1.0 mg/L\n• Permissible limit in absence of alternate source = 1.5 mg/L\n• Fluoride < 1.0 mg/L causes dental caries (cavities), while > 1.5 mg/L causes fluorosis and bone deformation.',
    solutionHi: 'IS 10500:2012 के अनुसार:\n• स्वीकार्य सीमा: 1.0 mg/L\n• वैकल्पिक स्रोत की अनुपस्थिति में अनुमेय सीमा: 1.5 mg/L\n• 1.5 mg/L से अधिक होने पर दांतों और हड्डियों का फ्लोरोसिस (fluorosis) रोग हो जाता है।',
    codeReference: 'IS 10500:2012 Table 1'
  },
  {
    id: 'pyq-gate-2023-02',
    exam: 'GATE Civil',
    year: '2023 Afternoon',
    subject: 'Fluid Mechanics',
    topic: 'Hydraulic Jump',
    difficulty: 'Hard',
    questionEn: 'In a rectangular horizontal open channel, what is the relation between initial depth y1 and sequent depth y2 for a hydraulic jump with initial Froude number F1?',
    questionHi: 'एक आयताकार क्षैतिज खुले चैनल में, प्रारंभिक फ्राउड संख्या F1 के साथ हाइड्रोलिक जंप के लिए अनुवर्ती गहराई y2 और प्रारंभिक गहराई y1 का संबंध क्या है?',
    optionsEn: [
      'y2/y1 = 0.5 · [√(1 + 8·F1²) - 1]',
      'y2/y1 = 0.5 · [√(1 + 8·F1²) + 1]',
      'y2/y1 = [√(1 + 4·F1²) - 1]',
      'y2/y1 = F1 · [√(1 + 8·F1) - 1]'
    ],
    optionsHi: [
      'y2/y1 = 0.5 · [√(1 + 8·F1²) - 1]',
      'y2/y1 = 0.5 · [√(1 + 8·F1²) + 1]',
      'y2/y1 = [√(1 + 4·F1²) - 1]',
      'y2/y1 = F1 · [√(1 + 8·F1) - 1]'
    ],
    correctOption: 0,
    solutionEn: "The Belanger momentum equation for hydraulic jump in rectangular channels gives:\n(y2 / y1) = 0.5 · [ -1 + √(1 + 8 · F1²) ].\nHead loss in the jump: ΔE = (y2 - y1)³ / (4 · y1 · y2).",
    solutionHi: 'आयताकार चैनल में हाइड्रोलिक जंप के लिए बेलांगर समीकरण:\n(y2 / y1) = 0.5 · [ √(1 + 8 · F1²) - 1 ]\nजंप में ऊर्जा हानि ΔE = (y2 - y1)³ / (4 · y1 · y2) होती है।',
    codeReference: 'Open Channel Hydraulics (K. Subramanya)'
  }
];
