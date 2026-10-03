export interface ChapterNote {
  id: string;
  subjectId: string;
  subjectName: string;
  chapterTitle: string;
  chapterTitleHi: string;
  readingTimeMinutes: number;
  tags: string[];
  summary: string;
  summaryHi: string;
  sections: {
    heading: string;
    headingHi: string;
    content: string;
    contentHi: string;
    formulas?: { name: string; formula: string; note: string }[];
    examHighlights: string[];
    imageUrl?: string;
    imageCaption?: string;
  }[];
  isStandardCodeRef: string;
  imageUrl?: string;
  imageCaption?: string;
  isCustom?: boolean;
  createdAt?: string;
}

export const CIVIL_STUDY_NOTES: ChapterNote[] = [
  {
    id: 'note-rcc-beams',
    subjectId: 'rcc-design',
    subjectName: 'RCC Design (IS 456)',
    chapterTitle: 'Limit State of Collapse in Flexure (Beams)',
    chapterTitleHi: 'नमन में चरम सीमा अवस्था (बीम डिजाइन)',
    readingTimeMinutes: 12,
    tags: ['IS 456:2000', 'Flexure', 'Neutral Axis', 'Under-reinforced', 'Ast'],
    summary: 'Comprehensive revision on singly and doubly reinforced beam analysis, limiting depth of neutral axis, moment of resistance formulas, and balanced section criteria.',
    summaryHi: 'एकल और दोहरी प्रबलित बीम, तटस्थ अक्ष की सीमांत गहराई, प्रतिरोध आघूर्ण (MOR) और संतुलित खंड के प्रमुख सिद्धांतों का त्वरित रिवीजन।',
    sections: [
      {
        heading: 'Assumptions in Limit State of Flexure',
        headingHi: 'नमन की चरम सीमा अवस्था में मान्यताएं',
        content: '1. Plane sections normal to the longitudinal axis remain plane after bending (strain is linear).\n2. The maximum compressive strain in concrete at outer edge is 0.0035.\n3. Tensile strength of concrete is ignored.\n4. Compressive stress-strain curve of concrete is parabolic up to 0.002 strain and uniform rectangular up to 0.0035.\n5. Design compressive stress = 0.446 · fck.\n6. Minimum strain in tension steel at collapse εs ≥ 0.002 + (0.87·fy / Es).',
        contentHi: '1. बंकन के बाद समतल काट समतल ही रहता है (विकृति रैखिक होती है)।\n2. कंक्रीट के बाहरी किनारे पर अधिकतम संपीडन विकृति 0.0035 होती है।\n3. कंक्रीट की तन्य शक्ति को शून्य माना जाता है।\n4. कंक्रीट का डिजाइन संपीडन प्रतिबल = 0.446 fck होता है।\n5. चरम सीमा पर स्टील में न्यूनतम तन्य विकृति ≥ 0.002 + 0.87·fy/Es होनी चाहिए।',
        examHighlights: [
          'Design concrete stress: 0.67·fck / 1.5 = 0.446·fck',
          'Neutral axis depth factor: k = 0.53 (Fe250), 0.48 (Fe415), 0.46 (Fe500)',
          'Under-reinforced section fails in ductile manner (steel yields first).'
        ]
      },
      {
        heading: 'Depth of Neutral Axis & Moment of Resistance',
        headingHi: 'तटस्थ अक्ष की गहराई एवं प्रतिरोध आघूर्ण',
        content: 'For a singly reinforced rectangular beam (width b, effective depth d):\nEquating total compression C to total tension T:\n0.36 · fck · b · Xu = 0.87 · fy · Ast\n=> Xu = (0.87 · fy · Ast) / (0.36 · fck · b)\n\nIf Xu < Xu,max: Under-reinforced Section.\nMu = 0.87 · fy · Ast · d · [1 - (Ast · fy) / (b · d · fck)]\n\nIf Xu = Xu,max: Balanced Section.\nMu,lim = Q · fck · b · d²\n(Where Q = 0.148 for Fe250; Q = 0.138 for Fe415; Q = 0.133 for Fe500).',
        contentHi: 'आयताकार बीम के लिए कुल संपीडन (C) = कुल तनाव (T):\n0.36 fck b Xu = 0.87 fy Ast\nXu = (0.87 fy Ast) / (0.36 fck b)\n\nसंतुलित खंड के लिए:\nFe 250: Mu,lim = 0.148 · fck · b · d²\nFe 415: Mu,lim = 0.138 · fck · b · d²\nFe 500: Mu,lim = 0.133 · fck · b · d²',
        formulas: [
          { name: 'Neutral Axis Depth (Xu)', formula: 'Xu = (0.87 · fy · Ast) / (0.36 · fck · b)', note: 'For singly reinforced rectangular section' },
          { name: 'Limiting Moment (Mu,lim)', formula: 'Mu,lim = 0.138 · fck · b · d² (for Fe 415)', note: 'Maximum capacity without compression steel' },
          { name: 'Lever Arm (z)', formula: 'z = d - 0.42 · Xu', note: 'Distance between C and T centroids' }
        ],
        examHighlights: [
          'Over-reinforced beams are strictly avoided in practice to prevent sudden brittle crushing of concrete without warning.',
          'Minimum shear reinforcement: Asv / (b · sv) ≥ 0.4 / (0.87 · fy).'
        ]
      }
    ],
    isStandardCodeRef: 'IS 456:2000 Section 6'
  },
  {
    id: 'note-surveying-levelling',
    subjectId: 'surveying',
    subjectName: 'Surveying & Geomatics',
    chapterTitle: 'Levelling: Height of Instrument (HI) vs Rise & Fall',
    chapterTitleHi: 'तलेक्षण: उपकरण ऊंचाई विधि बनाम वृद्धि एवं गिरावट विधि',
    readingTimeMinutes: 10,
    tags: ['Levelling', 'HI Method', 'Rise and Fall', 'Arithmetic Check', 'Curvature & Refraction'],
    summary: 'Core rules of differential levelling, comparison between Collimation and Rise/Fall methods, arithmetic checks, and curvature/refraction corrections.',
    summaryHi: 'विभेदक तलेक्षण, उपकरण ऊंचाई विधि और वृद्धि-गिरावट विधि की तुलना, अंकगणितीय जांच और वक्रता एवं अपवर्तन सुधार।',
    sections: [
      {
        heading: 'Methods of Level Reduction',
        headingHi: 'समतल तल निर्धारण की विधियां',
        content: '1. Collimation Method (HI Method):\n• Height of Instrument (HI) = RL + BS\n• Reduced Level of Station (RL) = HI - (IS or FS)\n• Arithmetic check: Σ BS - Σ FS = Last RL - First RL.\n• Advantage: Faster calculation when there are many Intermediate Sights (IS).\n• Disadvantage: No check on Intermediate Sights.\n\n2. Rise and Fall Method:\n• Rise/Fall = Previous reading - Current reading. (Positive = Rise, Negative = Fall).\n• RL of station = Previous RL + Rise OR Previous RL - Fall.\n• Arithmetic check: Σ BS - Σ FS = Σ Rise - Σ Fall = Last RL - First RL.\n• Advantage: Provides complete check on all readings including Intermediate Sights.',
        contentHi: '1. उपकरण ऊंचाई विधि (HI Method):\n• HI = RL + BS\n• स्टेशन का तल RL = HI - (IS या FS)\n• जांच: Σ BS - Σ FS = Last RL - First RL\n\n2. वृद्धि एवं गिरावट विधि (Rise & Fall Method):\n• Rise/Fall = पिछला पाठ्यांक - वर्तमान पाठ्यांक\n• पूर्ण जांच: Σ BS - Σ FS = Σ Rise - Σ Fall = Last RL - First RL\n• यह विधि सभी पाठ्यांकों (IS सहित) पर पूरी जांच प्रदान करती है।',
        formulas: [
          { name: 'Curvature Correction (Cc)', formula: 'Cc = - 0.0785 · d² (meters)', note: 'd is distance in kilometers (always subtractive)' },
          { name: 'Refraction Correction (Cr)', formula: 'Cr = + 0.0112 · d² (meters)', note: 'Cr ≈ 1/7 of Cc (always additive)' },
          { name: 'Combined Correction (C)', formula: 'C = - 0.0673 · d² (meters)', note: 'Net correction to staff reading' },
          { name: 'Visible Horizon Distance', formula: 'd = 3.855 · √h (km)', note: 'h is height above sea level in meters' }
        ],
        examHighlights: [
          'Combined correction C is always subtractive to staff reading.',
          'Sensitivity of bubble tube α = (s / n·D) · 206265 seconds.',
          'Reciprocal levelling eliminates both curvature and collimation errors completely.'
        ]
      }
    ],
    isStandardCodeRef: 'Survey of India Levelling Manual'
  },
  {
    id: 'note-soil-mechanics',
    subjectId: 'geotechnical',
    subjectName: 'Soil Mechanics & Foundation',
    chapterTitle: 'Phase Relations & Soil Index Properties',
    chapterTitleHi: 'मृदा प्रावस्था संबंध एवं सूचकांक गुण',
    readingTimeMinutes: 14,
    tags: ['Void ratio', 'Porosity', 'Degree of Saturation', 'Atterberg Limits', 'IS 1498'],
    summary: 'Definitions and vital relationships between void ratio, porosity, water content, degree of saturation, submerged unit weight, and A-line equation.',
    summaryHi: 'रिक्ति अनुपात (e), सरंध्रता (n), संतृप्ति की मात्रा (S), जल अंश (w), विशिष्ट गुरुत्व (G) और ए-लाइन समीकरण के आवश्यक सूत्र।',
    sections: [
      {
        heading: 'Phase Relations and Equations',
        headingHi: 'प्रावस्था संबंध एवं समीकरण',
        content: 'Soil is a three-phase system consisting of soil solids, water, and air voids.\n• Void Ratio e = Vv / Vs (can be > 1.0 or > 100%)\n• Porosity n = Vv / V (always 0 < n < 100%)\n• Relation: e = n / (1 - n) and n = e / (1 + e)\n• Fundamental relation: S · e = w · G\n• Bulk unit weight: γ = [(G + S·e) / (1 + e)] · γw\n• Dry unit weight: γd = [G / (1 + e)] · γw = γ / (1 + w)\n• Submerged unit weight: γ\' = γsat - γw = [(G - 1) / (1 + e)] · γw ≈ 0.5 · γsat.',
        contentHi: 'मृदा त्रि-प्रावस्था प्रणाली है (ठोस कण, जल, वायु)।\n• S · e = w · G (सबसे महत्वपूर्ण सूत्र)\n• रिक्ति अनुपात e = n / (1 - n)\n• शुष्क इकाई भार γd = γ / (1 + w)\n• निमज्जित इकाई भार γ\' = [(G - 1) / (1 + e)] · γw',
        formulas: [
          { name: 'Fundamental Relation', formula: 'S · e = w · G', note: 'Relates saturation, void ratio, water content, specific gravity' },
          { name: 'Dry Density from Bulk', formula: 'γd = γ / (1 + w)', note: 'Used in Proctor compaction test' },
          { name: 'A-Line Equation (Casagrande)', formula: 'IP = 0.73 · (wL - 20)', note: 'Separates Clay (above) from Silt/Organic (below)' }
        ],
        examHighlights: [
          'Plasticity Index IP = wL - wP.',
          'Toughness Index IT = IP / IF (Flow Index). Typically 0 to 3.',
          'Sensitivity St = q_unconfined(undisturbed) / q_unconfined(remoulded). Sensitive soils have St > 4.'
        ]
      }
    ],
    isStandardCodeRef: 'IS 1498 & IS 2720'
  },
  {
    id: 'note-estimation-rules',
    subjectId: 'estimating-costing',
    subjectName: 'Estimating & Costing',
    chapterTitle: 'Rules of Measurement & Deductions (IS 1200)',
    chapterTitleHi: 'मापन के नियम एवं कटौती संहिता (IS 1200)',
    readingTimeMinutes: 11,
    tags: ['IS 1200', 'Measurement Book', 'Deduction Rules', 'DSR', 'Rate Analysis'],
    summary: 'Units of measurement for various civil construction works, deductions for doors/windows, plastering rules, and DSR rate analysis percentages.',
    summaryHi: 'विभिन्न निर्माण कार्यों के मापन की इकाइयाँ, ईंट चिनाई एवं प्लास्टर में कटौती के नियम, तथा मानक प्रतिशत।',
    sections: [
      {
        heading: 'Standard Units of Measurements',
        headingHi: 'मानक मापन इकाइयाँ',
        content: '1. Earthwork excavation: m³ (cu.m)\n2. PCC in foundation / RCC work: m³ (cu.m)\n3. DPC (Damp Proof Course): m² (sq.m) with thickness specified\n4. Brickwork (thickness ≥ 20cm): m³ (cu.m)\n5. Honeycomb / Half brick wall (10cm): m² (sq.m)\n6. Plastering & Painting: m² (sq.m)\n7. Steel reinforcement bars: Quintal (q) or Ton (t) / kg\n8. Shuttering / Formwork: m² (sq.m)\n9. Skirting / Border tiles: Running meter (R.m)\n10. Glass panes / Wire mesh: m² (sq.m).',
        contentHi: '1. मिट्टी की खुदाई: m³\n2. नींव में PCC / RCC कार्य: m³\n3. DPC (सीलन रोधक परत): m² (मोटाई निर्दिष्ट)\n4. ईंट चिनाई (मोटाई ≥ 20cm): m³\n5. 10cm (आधी ईंट) दीवार: m²\n6. प्लास्टर एवं रंगाई: m²\n7. सरिया (Reinforcement): क्विंटल / टन\n8. शटरिंग: m²',
        examHighlights: [
          'Lead included in normal excavation: 50 m. Lift included: 1.5 m.',
          'Water charges in CPWD Rate Analysis: 1.5% of total cost.',
          "Contractor's profit in Rate Analysis: 10% of total cost (materials + labor + water).",
          'Contingencies added to estimate: 3% to 5%.',
          'Work Charged Establishment: 1.5% to 2%.'
        ]
      }
    ],
    isStandardCodeRef: 'IS 1200 & CPWD Works Manual'
  }
];
