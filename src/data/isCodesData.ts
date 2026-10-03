export interface ISCodeItem {
  id: string;
  codeNumber: string;
  title: string;
  hindiTitle: string;
  year: string;
  category: 'Concrete & RCC' | 'Steel Structures' | 'Soil & Foundation' | 'Earthquake & Wind' | 'Materials & Testing' | 'Surveying & Measurement' | 'Environmental & Plumbing' | 'Highway & Transportation';
  summary: string;
  keyClauses: {
    clauseNumber: string;
    title: string;
    description: string;
  }[];
  practicalApplication: string;
  isMandatoryForExams: boolean;
}

export const IS_CODES_LIST: ISCodeItem[] = [
  {
    id: 'is-456-2000',
    codeNumber: 'IS 456:2000',
    title: 'Plain and Reinforced Concrete - Code of Practice',
    hindiTitle: 'सादा एवं प्रबलित कंक्रीट - व्यवहार संहिता',
    year: '2000 (Reaffirmed 2021)',
    category: 'Concrete & RCC',
    summary: 'The bible of Civil Engineering in India. Deals with general structural use of plain and reinforced concrete, limit state design method, material specifications, and durability requirements.',
    keyClauses: [
      {
        clauseNumber: 'Clause 6.1 / Table 2',
        title: 'Concrete Grades',
        description: 'Classified into Ordinary (M10-M20), Standard (M25-M60), and High Strength (M65-M100) concrete based on 28-day characteristic compressive strength (fck).'
      },
      {
        clauseNumber: 'Clause 26.4 / Table 16',
        title: 'Nominal Cover to Reinforcement',
        description: 'Minimum cover for durability: Slab: 20mm, Beam: 25mm, Column: 40mm, Footing: 50mm.'
      },
      {
        clauseNumber: 'Clause 26.2.1',
        title: 'Development Length (Ld)',
        description: 'Ld = (φ · σs) / (4 · τbd). For deformed bars (Fe415/Fe500), design bond stress (τbd) is increased by 60%.'
      },
      {
        clauseNumber: 'Clause 38.1',
        title: 'Assumptions for Limit State of Collapse (Flexure)',
        description: 'Plane sections remain plane; maximum strain in concrete at outer compression fiber is 0.0035; tensile strength of concrete is ignored.'
      },
      {
        clauseNumber: 'Clause 26.5.1.1',
        title: 'Minimum & Maximum Tension Steel',
        description: 'Minimum Ast = (0.85 · b · d) / fy. Maximum Ast in beams = 0.04 · b · D (4% of gross area).'
      }
    ],
    practicalApplication: 'Used for all structural drawings, beam/slab/column/footing design, site mix control, and shuttering removal period schedules.',
    isMandatoryForExams: true
  },
  {
    id: 'is-800-2007',
    codeNumber: 'IS 800:2007',
    title: 'General Construction in Steel - Code of Practice',
    hindiTitle: 'इस्पात निर्माण में सामान्य निर्माण - व्यवहार संहिता',
    year: '2007 (LSM based)',
    category: 'Steel Structures',
    summary: 'Specifies limit state design rules for structural steel members: tension, compression, flexure, bolted/welded connections, plate girders, and roof trusses.',
    keyClauses: [
      {
        clauseNumber: 'Table 2',
        title: 'Limiting Width-to-Thickness Ratios',
        description: 'Classifies cross-sections into Plastic (Class 1), Compact (Class 2), Semi-compact (Class 3), and Slender (Class 4).'
      },
      {
        clauseNumber: 'Table 3',
        title: 'Maximum Slenderness Ratio (λ = KL/r)',
        description: 'Tension member subject to reversal due to loads other than wind/seismic = 180; Member carrying dead + superimposed load = 180; Roof truss tie = 350.'
      },
      {
        clauseNumber: 'Section 10',
        title: 'Connections (Bolts & Welds)',
        description: 'Pitch p must be ≥ 2.5d (nominal bolt dia). Edge distance e must be ≥ 1.5d0 (machine cut) or 1.7d0 (hand flame cut).'
      },
      {
        clauseNumber: 'Table 5',
        title: 'Partial Safety Factors for Materials (γm)',
        description: 'γm0 (yielding) = 1.10; γm1 (ultimate tensile rupture) = 1.25; γmb (bolts) = 1.25.'
      }
    ],
    practicalApplication: 'Industrial sheds, warehouse trusses, PEB (Pre-Engineered Buildings), transmission towers, and bridge steel girders.',
    isMandatoryForExams: true
  },
  {
    id: 'is-1893-2016',
    codeNumber: 'IS 1893 (Part 1):2016',
    title: 'Criteria for Earthquake Resistant Design of Structures',
    hindiTitle: 'भूकंप प्रतिरोधी संरचनाओं के डिजाइन के मानदंड',
    year: '2016',
    category: 'Earthquake & Wind',
    summary: 'Deals with assessment of seismic loads, seismic zoning in India (Zone II to Zone V), response reduction factor (R), and design lateral force calculation.',
    keyClauses: [
      {
        clauseNumber: 'Clause 6.4.2 / Figure 1',
        title: 'Seismic Zones of India',
        description: 'India divided into Zone II (Z=0.10, Low), Zone III (Z=0.16, Moderate), Zone IV (Z=0.24, Severe), and Zone V (Z=0.36, Very Severe).'
      },
      {
        clauseNumber: 'Clause 6.4.2',
        title: 'Base Shear Equation',
        description: 'Design horizontal seismic coefficient Ah = (Z/2) · (I/R) · (Sa/g). Total Base Shear Vb = Ah · W.'
      },
      {
        clauseNumber: 'Clause 7.1',
        title: 'Regular and Irregular Buildings',
        description: 'Defines torsional irregularity, re-entrant corners, diaphragm discontinuity, soft storey, and weak storey.'
      }
    ],
    practicalApplication: 'Mandatory seismic analysis for residential, high-rise, hospital, and municipal buildings in India.',
    isMandatoryForExams: true
  },
  {
    id: 'is-13920-2016',
    codeNumber: 'IS 13920:2016',
    title: 'Ductile Design and Detailing of Reinforced Concrete Structures Subjected to Seismic Forces',
    hindiTitle: 'भूकंपीय बलों के अधीन प्रबलित कंक्रीट संरचनाओं का नम्य विवरण',
    year: '2016',
    category: 'Earthquake & Wind',
    summary: 'Specifies mandatory ductile detailing provisions for beams, columns, joints, and shear walls located in seismic zones III, IV, and V.',
    keyClauses: [
      {
        clauseNumber: 'Clause 6.1',
        title: 'Flexural Members (Beams)',
        description: 'Width b ≥ 200mm; Depth D ≤ 1/4 of clear span; Minimum top & bottom steel shall consist of at least two bars continuously.'
      },
      {
        clauseNumber: 'Clause 7.4',
        title: 'Special Confining Reinforcement in Columns',
        description: 'Closely spaced lateral hoops provided over length lo near column joints. Hook bend must be 135° with 10d extension.'
      },
      {
        clauseNumber: 'Clause 8.1',
        title: 'Beam-Column Joints',
        description: 'Transverse ties shall be continued through the beam-column joint core to prevent joint shear failure.'
      }
    ],
    practicalApplication: 'Site rebar bending and tying inspection, seismic ductile stirrup detailing in high-risk zones.',
    isMandatoryForExams: true
  },
  {
    id: 'is-10262-2019',
    codeNumber: 'IS 10262:2019',
    title: 'Concrete Mix Proportioning - Guidelines',
    hindiTitle: 'कंक्रीट मिश्रण समानुपातन - दिशानिर्देश',
    year: '2019',
    category: 'Concrete & RCC',
    summary: 'Standard Indian method for proportioning concrete mixes from ordinary (M10-M20) to high-performance and self-compacting concrete (up to M100).',
    keyClauses: [
      {
        clauseNumber: 'Clause 4',
        title: 'Target Strength for Mix Design',
        description: "Target mean strength f'ck = fck + 1.65 · s (where s = standard deviation per Table 1; e.g., 4.0 for M20, 5.0 for M30-M50)."
      },
      {
        clauseNumber: 'Table 2 & 3',
        title: 'Selection of Water-Cement Ratio & Water Content',
        description: 'Maximum w/c ratio based on exposure condition (Mild: 0.55, Moderate: 0.50, Severe: 0.45, Very Severe: 0.45, Extreme: 0.40).'
      }
    ],
    practicalApplication: 'Batching plant mix design sheets, lab cube trials, RMC (Ready Mix Concrete) batch tickets.',
    isMandatoryForExams: true
  },
  {
    id: 'is-383-2016',
    codeNumber: 'IS 383:2016',
    title: 'Coarse and Fine Aggregate for Concrete - Specification',
    hindiTitle: 'कंक्रीट के लिए मोटे एवं महीन मिलावे की विशिष्टियां',
    year: '2016',
    category: 'Materials & Testing',
    summary: 'Specifies physical requirements, grading zones (Zone I, II, III, IV for fine sand), flakiness/elongation index, and aggregate impact value.',
    keyClauses: [
      {
        clauseNumber: 'Table 9',
        title: 'Fine Aggregate Grading Zones',
        description: 'Zone I (Coarsest sand, 90-100% passing 4.75mm, 15-34% passing 600μm), Zone II (Preferred for general RCC), Zone III, Zone IV (Finest, suitable for plastering).'
      },
      {
        clauseNumber: 'Clause 4.3',
        title: 'Flakiness & Elongation Combined Index',
        description: 'Combined Flakiness and Elongation index of coarse aggregate shall not exceed 35% for concrete.'
      }
    ],
    practicalApplication: 'Aggregate testing in QC lab, sieve analysis grading curve verification, crusher aggregate selection.',
    isMandatoryForExams: true
  },
  {
    id: 'is-875-part1-5',
    codeNumber: 'IS 875 (Parts 1 to 5)',
    title: 'Code of Practice for Design Loads (Other Than Earthquake) for Buildings and Structures',
    hindiTitle: 'डिजाइन भार के लिए व्यवहार संहिता (भूकंप को छोड़कर)',
    year: '1987 / Revised',
    category: 'Earthquake & Wind',
    summary: 'Defines unit weights of building materials (Part 1 Dead Loads), Imposed/Live loads (Part 2), Wind loads (Part 3), Snow loads (Part 4), and Special loads/combinations (Part 5).',
    keyClauses: [
      {
        clauseNumber: 'Part 1 Table 1',
        title: 'Unit Weights of Materials',
        description: 'Plain Concrete = 24 kN/m³, Reinforced Concrete (RCC) = 25 kN/m³, Common Clay Brickwork = 19 kN/m³, Structural Steel = 78.5 kN/m³.'
      },
      {
        clauseNumber: 'Part 2 Table 1',
        title: 'Live Loads on Floors & Roofs',
        description: 'Residential rooms = 2.0 kN/m²; Corridors/Staircases = 3.0 kN/m²; Office rooms = 2.5-4.0 kN/m²; Inaccessible roofs = 0.75 kN/m².'
      },
      {
        clauseNumber: 'Part 3 Clause 6.3',
        title: 'Design Wind Speed (Vz)',
        description: 'Vz = Vb · k1 (risk) · k2 (terrain) · k3 (topography) · k4 (cyclone). Design wind pressure Pz = 0.6 · Vz².'
      }
    ],
    practicalApplication: 'Primary load calculations for ETABS, STAAD.Pro, and manual structural design sheets.',
    isMandatoryForExams: true
  },
  {
    id: 'is-1200-all-parts',
    codeNumber: 'IS 1200 (All Parts)',
    title: 'Method of Measurement of Building and Civil Engineering Works',
    hindiTitle: 'भवन और सिविल इंजीनियरिंग कार्यों के मापन की पद्धति',
    year: 'Revised Series',
    category: 'Surveying & Measurement',
    summary: 'Standard rules for measurement of civil works: Part 1 Earthwork, Part 2 Concrete, Part 3 Brickwork, Part 4 Stone masonry, Part 12 Plastering and Pointing.',
    keyClauses: [
      {
        clauseNumber: 'Part 1',
        title: 'Earthwork Measurement',
        description: 'Excavation measured in m³. Lead up to 50m and lift up to 1.5m are included in normal excavation rate.'
      },
      {
        clauseNumber: 'Part 3',
        title: 'Brickwork Deductions',
        description: 'No deduction is made for ends of joists, beams, lintels up to 0.1 m² section, wall plates, or openings up to 0.1 m² area.'
      },
      {
        clauseNumber: 'Part 12',
        title: 'Plastering Deductions',
        description: 'Openings < 0.5 m²: No deduction made, no addition for jambs/soffits. Openings 0.5 m² to 3.0 m²: Deduction made for one face only. Openings > 3.0 m²: Deductions for both faces, jambs added.'
      }
    ],
    practicalApplication: 'Measurement Book (MB) billing, contractor quantity verification, CPWD tenders and estimates.',
    isMandatoryForExams: true
  },
  {
    id: 'is-6403-1981',
    codeNumber: 'IS 6403:1981',
    title: 'Code of Practice for Determination of Bearing Capacity of Shallow Foundations',
    hindiTitle: 'उथली नींव की धारण क्षमता निर्धारण की संहिता',
    year: '1981 (Reaffirmed 2016)',
    category: 'Soil & Foundation',
    summary: 'Terzaghi and Brinch-Hansen based method for calculating net ultimate and safe bearing capacity of strip, isolated, and raft shallow footings.',
    keyClauses: [
      {
        clauseNumber: 'Clause 5.1',
        title: 'General Shear Failure Formula',
        description: 'qult = c · Nc · sc · dc · ic + q · (Nq - 1) · sq · dq · iq + 0.5 · B · γ · Nγ · sγ · dγ · iγ.'
      },
      {
        clauseNumber: 'Clause 5.2.2',
        title: 'Local Shear Failure',
        description: "For loose/soft soils: mobilized cohesion c' = (2/3)c and mobilized friction angle tan φ' = (2/3) tan φ."
      }
    ],
    practicalApplication: 'Geotechnical soil investigation reports (SBC calculation), foundation depth and dimension design.',
    isMandatoryForExams: true
  },
  {
    id: 'is-10500-2012',
    codeNumber: 'IS 10500:2012',
    title: 'Drinking Water - Specification',
    hindiTitle: 'पीने का पानी - विशिष्टियां',
    year: '2012',
    category: 'Environmental & Plumbing',
    summary: 'Specifies acceptable and permissible limits in the absence of alternate source for drinking water quality parameters.',
    keyClauses: [
      {
        clauseNumber: 'Table 1 Parameter 1',
        title: 'pH Value',
        description: 'Acceptable limit: 6.5 to 8.5. No relaxation.'
      },
      {
        clauseNumber: 'Table 1 Parameter 2',
        title: 'Total Dissolved Solids (TDS)',
        description: 'Acceptable limit: 500 mg/L. Permissible in absence of alternate source: 2000 mg/L.'
      },
      {
        clauseNumber: 'Table 1 Parameter 3',
        title: 'Total Hardness (as CaCO3)',
        description: 'Acceptable limit: 200 mg/L. Permissible limit: 600 mg/L.'
      },
      {
        clauseNumber: 'Table 1 Parameter 4',
        title: 'Chlorides & Fluorides',
        description: 'Chlorides: Acceptable 250 mg/L, max 1000 mg/L. Fluoride: Acceptable 1.0 mg/L, max 1.5 mg/L (causes dental fluorosis if higher).'
      }
    ],
    practicalApplication: 'Public health engineering (PHED), water treatment plant (WTP) effluent testing, RO plant design.',
    isMandatoryForExams: true
  },
  {
    id: 'irc-37-2018',
    codeNumber: 'IRC:37-2018',
    title: 'Guidelines for the Design of Flexible Pavements (Indian Roads Congress)',
    hindiTitle: 'लचीले फुटपाथ के डिजाइन के लिए दिशानिर्देश (आई.आर.सी.)',
    year: '2018',
    category: 'Highway & Transportation',
    summary: 'Mechanistic-empirical design guidelines for bituminous flexible pavements based on cumulative standard axles (mullion standard axles - MSA) and subgrade California Bearing Ratio (CBR).',
    keyClauses: [
      {
        clauseNumber: 'Section 4',
        title: 'Traffic Estimation (MSA)',
        description: 'N = [365 · {(1 + r)^n - 1} · A · D · F] / r, where A is initial commercial vehicles per day (CVPD), r is growth rate, F is vehicle damage factor (VDF).'
      },
      {
        clauseNumber: 'Section 6',
        title: 'Pavement Layer System',
        description: 'Subgrade (CBR min 8%), Granular Sub-Base (GSB), Wet Mix Macadam (WMM), Dense Bituminous Macadam (DBM), and Bituminous Concrete (BC).'
      }
    ],
    practicalApplication: 'Highway construction, NHAI project DPRs, PMGSY rural road design, and municipal road pavement cross-sections.',
    isMandatoryForExams: true
  },
  {
    id: 'is-269-2015',
    codeNumber: 'IS 269:2015',
    title: 'Ordinary Portland Cement (33, 43 and 53 Grade) - Specification',
    hindiTitle: 'साधारण पोर्टलैंड सीमेंट (33, 43 एवं 53 ग्रेड) - विशिष्टियां',
    year: '2015',
    category: 'Materials & Testing',
    summary: 'Consolidated standard for 33 grade, 43 grade, and 53 grade OPC specifying physical (fineness, soundness, setting time, compressive strength) and chemical requirements.',
    keyClauses: [
      {
        clauseNumber: 'Clause 6 Table 2',
        title: 'Compressive Strength Requirements',
        description: '28-day strength: 33 grade ≥ 33 MPa; 43 grade ≥ 43 MPa (and < 58 MPa); 53 grade ≥ 53 MPa.'
      },
      {
        clauseNumber: 'Clause 6 Table 2',
        title: 'Soundness of Cement',
        description: 'Le Chatelier expansion ≤ 10 mm. Autoclave expansion ≤ 0.8% (tests for excess lime and magnesia).'
      }
    ],
    practicalApplication: 'Cement quality assurance certificates, site storage inspection, pre-cast and high-strength concrete mix proportioning.',
    isMandatoryForExams: true
  }
];
