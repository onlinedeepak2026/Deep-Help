/**
 * Deep Help - Offline Civil Engineering Knowledge Engine & Doubt Resolver
 * Provides instant, high-quality, structured explanations with formulas,
 * IS Code clauses, numerical steps, and site supervision best practices.
 */

interface CivilTopicKnowledge {
  keywords: string[];
  subject: string;
  title: string;
  isCode?: string;
  summary: string;
  hindiSummary: string;
  keyPoints: string[];
  keyFormulas?: string[];
  examTips: string[];
  siteChecklist: string[];
}

const TOPIC_KNOWLEDGE_BASE: CivilTopicKnowledge[] = [
  {
    keywords: ['slump', 'workability', 'slump test', 'concrete workability', 'consistency', 'segregation', 'bleeding'],
    subject: 'Concrete Technology',
    title: 'Concrete Slump Test & Workability (IS 1199 / IS 456)',
    isCode: 'IS 1199 (Fresh Concrete Testing) & IS 456:2000 (Clause 7.1)',
    summary: 'The slump test measures the consistency and workability of fresh concrete prior to placement.',
    hindiSummary: 'स्लम्प टेस्ट ताजे कंक्रीट की सुकार्यता (Workability) और कंसिस्टेंसी मापने का सबसे प्राथमिक साइट परीक्षण है।',
    keyPoints: [
      'Slump cone dimensions: Base diameter = 200 mm, Top diameter = 100 mm, Height = 300 mm.',
      'Tamping rod: 16 mm diameter, 600 mm long with bullet/rounded end.',
      'Filled in 4 equal layers (IS 1199) or 3 layers (ASTM), each tamped 25 times evenly.',
      'Types of Slump: True Slump (desired), Shear Slump (indicates lack of cohesion), Collapse Slump (too wet, excessive w/c ratio).',
      'Normal recommended values: RCC beams & slabs = 75 - 100 mm; Columns & heavily reinforced sections = 100 - 150 mm; Tremie concrete (underwater) = 150 - 200 mm; Mass concrete / roads = 25 - 50 mm.'
    ],
    keyFormulas: [
      'Slump = (Original Mold Height: 300 mm) - (Height of Subsided Concrete Specimen)',
      'Water-Cement Ratio Rule of Thumb: w/c ≈ 0.40 to 0.55 for standard M20 to M30 grades'
    ],
    examTips: [
      'Very low workability (0-25 mm) is measured using Vee-Bee Consistometer.',
      'Compacting Factor Test is more sensitive than Slump Test for low to medium workability (0.75 - 0.85).',
      'Frequent SSC JE / GATE Question: Dimensions of slump cone (100 mm top, 200 mm bottom, 300 mm height).'
    ],
    siteChecklist: [
      'Perform test within 2-3 minutes of sampling from transit mixer.',
      'Ensure the inside of mold and base plate are clean and moist (not dripping wet).',
      'If shear slump occurs, repeat test with fresh representative batch.'
    ]
  },
  {
    keywords: ['cover', 'clear cover', 'nominal cover', 'effective cover', 'reinforcement cover', 'durability'],
    subject: 'RCC Design (IS 456:2000)',
    title: 'Nominal & Minimum Concrete Cover (IS 456:2000 Clause 26.4)',
    isCode: 'IS 456:2000 Table 16 & Table 16A',
    summary: 'Nominal cover is the design depth of concrete between the outer reinforcement surface (including stirrups) and outer concrete face.',
    hindiSummary: 'नॉमिनल कवर कंक्रीट के बाहरी फेस और रिइन्फोर्समेंट (सरिया/रिंग) की बाहरी सतह के बीच की दूरी होती है जो सरिये को जंग से बचाती है।',
    keyPoints: [
      'Slab: Minimum nominal cover = 20 mm (can be reduced to 15 mm if rebar diameter ≤ 12 mm).',
      'Beam: Minimum nominal cover = 25 mm (or main bar diameter, whichever is greater).',
      'Column: Minimum nominal cover = 40 mm (or 25 mm if column size ≤ 200 mm with bar size ≤ 12 mm).',
      'Footing: Minimum nominal cover = 50 mm (when cast on blinding screed PCC), 75 mm if cast directly on earth.',
      'Durability Exposure Conditions: Mild = 20 mm, Moderate = 30 mm, Severe = 45 mm, Very Severe = 50 mm, Extreme = 75 mm.'
    ],
    keyFormulas: [
      'Effective Depth (d) = Total Depth (D) - Clear Cover - (Main Bar Diameter / 2)',
      'Effective Cover = Nominal Cover + (Stirrup Diameter) + (Main Bar Diameter / 2)'
    ],
    examTips: [
      'Fire resistance requirements can mandate additional cover (Table 16A).',
      'Never omit cover blocks; standard factory-made PVC or mortar blocks (same grade) should be tied with binding wire.'
    ],
    siteChecklist: [
      'Place cover blocks at a density of at least 4 to 5 blocks per square meter on slabs.',
      'Check vertical column rebar alignment with cover spacers to avoid eccentric buckling.'
    ]
  },
  {
    keywords: ['compressive strength', 'cube test', 'characteristic strength', 'fck', 'target mean strength', 'curing'],
    subject: 'Concrete Technology',
    title: 'Characteristic Compressive Strength (fck) & Target Mean Strength',
    isCode: 'IS 456:2000 Clause 6.1 & IS 10262 (Mix Design)',
    summary: 'Characteristic compressive strength is the strength of 150mm cubes at 28 days below which not more than 5% of test results are expected to fall.',
    hindiSummary: 'कैरेक्टरिस्टिक सामर्थ्य (fck) 28 दिनों की वह संपीडन सामर्थ्य है जिससे कम परिणाम आने की संभावना 5% से अधिक न हो।',
    keyPoints: [
      'Cube mold size: 150 mm × 150 mm × 150 mm (100 mm allowed if max aggregate size ≤ 20 mm).',
      'Testing: Specimen tested under Compressive Testing Machine (CTM) at a loading rate of 140 kg/cm²/min (approximately 5.2 kN/sec).',
      'Rate of strength gain: 1 day ≈ 16%, 3 days ≈ 40%, 7 days ≈ 65%, 14 days ≈ 90%, 28 days = 99-100% of nominal grade.',
      'Target mean strength (f\'ck) provides a safety cushion for site quality variations.'
    ],
    keyFormulas: [
      'Target Mean Strength: f\'ck = fck + 1.65 × s',
      '(where s is the standard deviation: 3.5 for M10/M15, 4.0 for M20/M25, 5.0 for M30 to M50)',
      'Modulus of Elasticity of Concrete: Ec = 5000 × √fck (in N/mm² / MPa)',
      'Flexural Tensile Strength (Modulus of Rupture): fcr = 0.7 × √fck (N/mm²)'
    ],
    examTips: [
      'Cylinder strength vs Cube strength: Cylinder strength ≈ 0.8 × Cube strength (due to height-to-diameter aspect ratio 2:1 causing less platen restraint).',
      'Factor of Safety for concrete in Limit State Method = 1.5; for steel = 1.15.'
    ],
    siteChecklist: [
      'Cast at least 3 cubes for 7-day test and 3 cubes for 28-day test per 5 m³ or per daily batch.',
      'Water temperature in curing tank must be 27°C ± 2°C.'
    ]
  },
  {
    keywords: ['mix design', 'concrete grade', 'm20', 'm25', 'm15', 'cement sand aggregate', 'nominal mix', 'is 10262'],
    subject: 'Concrete Technology',
    title: 'Concrete Mix Design & Nominal Mix Proportions (IS 456 & IS 10262)',
    isCode: 'IS 456:2000 Table 2 & IS 10262:2019',
    summary: 'Standard volumetric nominal mixes versus modern Indian Standard design mixes by weight.',
    hindiSummary: 'कंक्रीट मिक्स अनुपात (सीमेंट : बालू : गिट्टी) और IS 10262 के अनुसार वैज्ञानिक मिक्स डिजाइन।',
    keyPoints: [
      'M5  -> 1 : 5 : 10 (Lean concrete for sub-base / flooring bedding)',
      'M7.5 -> 1 : 4 : 8 (Foundation PCC bed, leveling course)',
      'M10 -> 1 : 3 : 6 (Mass foundations, gravity retaining walls, drainage)',
      'M15 -> 1 : 2 : 4 (PCC works, plain flooring, lightly loaded non-structural elements)',
      'M20 -> 1 : 1.5 : 3 (Minimum grade for general RCC construction under mild exposure)',
      'M25 -> 1 : 1 : 2 (Standard structural RCC: heavily loaded beams, slabs, columns, water tanks)',
      'For grades ≥ M30: Nominal mixes are prohibited; design mix (IS 10262) based on weight batching is mandatory.'
    ],
    keyFormulas: [
      'Dry Volume to Wet Volume ratio for concrete ≈ 1.52 to 1.54 (Dry Volume = Wet Volume × 1.54)',
      'Cement Bag Volume = 0.0347 m³ (50 kg bag, Density of cement = 1440 kg/m³)',
      '1 m³ of M20 (1:1.5:3): Cement ≈ 8 bags, Sand ≈ 15 cu.ft (0.42 m³), Coarse Aggregate ≈ 30 cu.ft (0.84 m³)'
    ],
    examTips: [
      'Minimum cement content for RCC under mild exposure: 300 kg/m³, Max w/c ratio: 0.55.',
      'Under severe/extreme marine exposure, minimum cement content increases to 320-360 kg/m³ with w/c down to 0.40.'
    ],
    siteChecklist: [
      'Never allow volumetric batching for structural RCC columns or transfer girders.',
      'Correct for sand bulking (surface moisture expands fine aggregate volume up to 20-30%).'
    ]
  },
  {
    keywords: ['neutral axis', 'moment of resistance', 'singly reinforced', 'doubly reinforced', 'flanged beam', 'is 456'],
    subject: 'RCC Structural Design',
    title: 'Limit State Flexural Design: Neutral Axis & Moment of Resistance',
    isCode: 'IS 456:2000 Clause 38.1 & Annex G',
    summary: 'Analysis of balanced, under-reinforced, and over-reinforced rectangular RCC sections.',
    hindiSummary: 'लिमिट स्टेट मेथड में न्यूट्रल एक्सिस (xu), बैलेंस्ड सेक्शन और मोमेंट ऑफ रेजिस्टेंस (Mu) का निर्धारण।',
    keyPoints: [
      'Limiting Depth of Neutral Axis (xu,max / d):',
      '  - Fe 250: xu,max / d = 0.53',
      '  - Fe 415: xu,max / d = 0.48',
      '  - Fe 500: xu,max / d = 0.46',
      '  - Fe 550: xu,max / d = 0.44',
      'Under-reinforced section (xu < xu,max): Steel yields before concrete crushes; ductile failure with prior crack warning (recommended design code requirement).',
      'Over-reinforced section (xu > xu,max): Concrete crushes before steel yields; brittle, sudden failure without warning (prohibited by IS 456).'
    ],
    keyFormulas: [
      'Actual Neutral Axis Depth (xu): xu = (0.87 × fy × Ast) / (0.36 × fck × b)',
      'Limiting Moment of Resistance (Mu,lim):',
      '  - For Fe 415: Mu,lim = 0.138 × fck × b × d²',
      '  - For Fe 250: Mu,lim = 0.148 × fck × b × d²',
      '  - For Fe 500: Mu,lim = 0.133 × fck × b × d²',
      'Under-reinforced MOR: Mu = 0.87 × fy × Ast × d × [1 - (Ast × fy)/(b × d × fck)]'
    ],
    examTips: [
      'Design compressive strain in concrete at extreme fiber = 0.0035.',
      'Design yield tensile strain in steel = (0.87 × fy / Es) + 0.002, where Es = 2 × 10⁵ MPa.'
    ],
    siteChecklist: [
      'Do not bunch tensile bars tightly; keep minimum clear distance = max bar diameter or aggregate size + 5 mm.',
      'Ensure tension bars are on the bottom at mid-span and top near supports for continuous beams.'
    ]
  },
  {
    keywords: ['shear design', 'stirrups', 'nominal shear stress', 'tau_v', 'tau_c', 'shear reinforcement'],
    subject: 'RCC Structural Design',
    title: 'Shear Reinforcement Design (IS 456:2000 Clause 40)',
    isCode: 'IS 456:2000 Clause 40 & Table 19/20',
    summary: 'Design of vertical and inclined stirrups to prevent diagonal tension shear failure.',
    hindiSummary: 'कंक्रीट बीम में शियर डिजाइन (Stirrups/छल्ले): डायगोनल टेंशन से बचाने के लिए छल्लों का निर्धारण।',
    keyPoints: [
      'Nominal Shear Stress (τv) = Vu / (b × d).',
      'Compare τv with Design Shear Strength of Concrete (τc from Table 19) and Maximum Shear Stress (τc,max from Table 20).',
      'Case 1: If τv > τc,max, the section must be redesigned (increase cross-section dimensions b or d).',
      'Case 2: If τc < τv ≤ τc,max, provide shear reinforcement to resist shear force Vus = Vu - τc × b × d.',
      'Case 3: If τv ≤ τc, provide minimum shear reinforcement (nominal stirrups).'
    ],
    keyFormulas: [
      'Vertical Stirrup Spacing (Sv): Sv = (0.87 × fy × Asv × d) / Vus',
      'Minimum Shear Reinforcement Formula: (Asv) / (b × Sv) ≥ 0.4 / (0.87 × fy)',
      'Maximum permissible spacing: Sv ≤ 0.75 × d, or 300 mm (whichever is minimum).'
    ],
    examTips: [
      'Critical section for shear is located at distance "d" (effective depth) from the face of the support.',
      'Inclined bent-up bars can resist a maximum of 50% of total calculated shear force Vus.'
    ],
    siteChecklist: [
      'Stirrups hooks must be bent at 135° angle with minimum hook length 10 × diameter (IS 13920 seismic requirement).',
      'Space stirrups closer near the support columns where shear force is highest.'
    ]
  },
  {
    keywords: ['development length', 'ld', 'bond stress', 'tau_bd', 'anchorage', 'lap length', 'splicing'],
    subject: 'RCC Structural Design',
    title: 'Development Length (Ld) & Lap Length (IS 456:2000 Clause 26.2)',
    isCode: 'IS 456:2000 Clause 26.2.1',
    summary: 'Minimum embedded length required to transfer bar stress to surrounding concrete via bond without slip.',
    hindiSummary: 'डेवलपमेंट लेंथ (Ld) और ओवरलैपिंग लेंथ (Lap Length) ताकि सरिया कंक्रीट से फिसले बिना पूरा तनाव झेल सके।',
    keyPoints: [
      'Development length depends on design bond stress (τbd) in concrete.',
      'Deformed HYSD bars (Fe 415 / Fe 500) have 60% higher bond stress than plain mild steel bars.',
      'In compression, bond stress value is increased by 25%.',
      'Lap length in flexural tension = Ld or 30 × bar diameter, whichever is greater.',
      'Lap length in direct compression = 24 × bar diameter.'
    ],
    keyFormulas: [
      'Ld = (ϕ × σs) / (4 × τbd)',
      'For design strength: Ld = (ϕ × 0.87 × fy) / (4 × τbd)',
      '(For M20 & Fe 415: τbd = 1.2 × 1.6 = 1.92 MPa -> Ld ≈ 47ϕ; commonly taken as 50ϕ in practical site drawings)'
    ],
    examTips: [
      'Standard 90° bend anchorage value = 4ϕ for each 45° bend (i.e., 8ϕ for 90° bend, 16ϕ for standard 180° hook, max 16ϕ).',
      'No lap splicing allowed in bars with diameter > 36 mm; mechanical couplers or thermite welding required.'
    ],
    siteChecklist: [
      'Stagger laps along the span; never lap more than 50% of tension bars at any single cross-section.',
      'Never locate lap splices at points of maximum bending moment (e.g., center of beam bottom or support top).'
    ]
  },
  {
    keywords: ['bearing capacity', 'terzaghi', 'soil bearing', 'spt', 'shear strength', 'c-phi', 'settlement'],
    subject: 'Geotechnical Engineering',
    title: 'Soil Bearing Capacity & Terzaghi Theory (IS 6403)',
    isCode: 'IS 6403:1981 (Shallow Foundations Bearing Capacity)',
    summary: 'Ultimate, net, and safe bearing capacity of soils under shallow strip, square, and circular footings.',
    hindiSummary: 'मृदा धारण क्षमता (Soil Bearing Capacity) और तेरजागी का सिद्धांत: नींव डिजाइन का आधार।',
    keyPoints: [
      'Ultimate Bearing Capacity (qu): Minimum gross pressure that causes shear failure of supporting ground.',
      'Net Ultimate Bearing Capacity (qnu) = qu - γ × Df.',
      'Safe Bearing Capacity (qs) = (qnu / FOS) + γ × Df (Standard Factor of Safety = 2.5 to 3.0).',
      'General Shear Failure occurs in dense sands and stiff clays (clear failure surface to ground level).',
      'Local Shear Failure occurs in medium loose sands; Punching Shear occurs in loose sands.'
    ],
    keyFormulas: [
      'Terzaghi General Equation (Strip Footing): qu = c × Nc + γ × Df × Nq + 0.5 × γ × B × Nγ',
      'For Square Footing: qu = 1.3 × c × Nc + γ × Df × Nq + 0.4 × γ × B × Nγ',
      'For Circular Footing: qu = 1.3 × c × Nc + γ × Df × Nq + 0.3 × γ × B × Nγ',
      'For Pure Cohesion Clays (ϕ = 0): Nc = 5.7 (strip), Nq = 1, Nγ = 0'
    ],
    examTips: [
      'Effect of Water Table: When water table rises to foundation level, the second term (γ × Df) is reduced by 50% (buoyant unit weight γ\' ≈ γ/2).',
      'When water table rises to natural ground level, both second and third terms are halved.'
    ],
    siteChecklist: [
      'Check Standard Penetration Test (SPT) N-value; correlate N to SBC (Approx SBC in t/m² ≈ 10 × N for sand).',
      'Ensure foundation base is resting on undisturbed native soil, free of organic muck or uncontrolled fill.'
    ]
  },
  {
    keywords: ['bernoulli', 'fluid mechanics', 'continuity equation', 'reynolds number', 'laminar', 'turbulent', 'discharge'],
    subject: 'Fluid Mechanics & Hydraulics',
    title: 'Bernoulli Equation, Continuity Equation & Pipe Flow',
    isCode: 'Standard Fluid Dynamics & IS 2951',
    summary: 'Conservation of mass and mechanical energy in steady, incompressible, frictionless flow.',
    hindiSummary: 'बर्नौली का प्रमेय और सांतत्य समीकरण: पाइप और चैनल में द्रव प्रवाह के मूल नियम।',
    keyPoints: [
      'Continuity Equation represents Conservation of Mass: Q = A1 × V1 = A2 × V2.',
      'Bernoulli Equation represents Conservation of Mechanical Energy along a streamline for ideal fluid.',
      'Total Head = Pressure Head (P/ρg) + Velocity Head (v²/2g) + Datum Head (z) = Constant.',
      'Reynolds Number (Re): Laminar flow in pipes for Re < 2000; Transitional flow for 2000 < Re < 4000; Turbulent flow for Re > 4000.'
    ],
    keyFormulas: [
      'Bernoulli: (P1 / γ) + (V1² / 2g) + z1 = (P2 / γ) + (V2² / 2g) + z2 + hf',
      'Darcy-Weisbach Major Head Loss: hf = (4 × f\' × L × V²) / (2 × g × D) or (f × L × V²) / (2 × g × D)',
      'Reynolds Number: Re = (ρ × V × D) / μ = (V × D) / ν',
      'Venturimeter Theoretical Discharge: Q = [a1 × a2 / √(a1² - a2²)] × √(2 × g × h)'
    ],
    examTips: [
      'In practical fluids, friction head loss hf is always positive in the downstream direction (Total Energy Line TEL always slopes downward).',
      'Hydraulic Gradient Line (HGL) = Pressure Head + Datum Head (lies below TEL by velocity head V²/2g).'
    ],
    siteChecklist: [
      'Ensure minimum flow velocity (self-cleansing velocity ≥ 0.75 m/s) in gravity sanitary sewer lines to avoid silt deposition.'
    ]
  },
  {
    keywords: ['surveying', 'theodolite', 'bearing', 'wcb', 'reduced bearing', 'contour', 'leveling', 'rl', 'rise and fall'],
    subject: 'Surveying & Geomatics',
    title: 'Surveying: Bearings, Leveling (HI & Rise/Fall) & Contouring',
    isCode: 'Survey of India Standards & IS 1493',
    summary: 'Principles of Whole Circle Bearing, Reduced Bearing, Differential Leveling, and Contour Intervals.',
    hindiSummary: 'सर्वेक्षण: बेयरिंग (WCB vs RB), लेवलिंग (HI व Rise-Fall विधि) तथा कंटूरिंग के सिद्धांत।',
    keyPoints: [
      'Whole Circle Bearing (WCB): Measured clockwise from True/Magnetic North from 0° to 360° (Prismatic Compass).',
      'Quadrantal / Reduced Bearing (RB): Measured from North or South towards East or West from 0° to 90° (Surveyor Compass).',
      'Conversion: 1st Quadrant (0°-90°) -> N θ E; 2nd Quadrant (90°-180°) -> S (180°-θ) E; 3rd Quadrant (180°-270°) -> S (θ-180°) W; 4th Quadrant (270°-360°) -> N (360°-θ) W.',
      'Fore Bearing (FB) and Back Bearing (BB) relationship: BB = FB ± 180° (+ if FB < 180°, - if FB > 180°).'
    ],
    keyFormulas: [
      'Height of Instrument (HI) = Benchmark RL + Back Sight (BS)',
      'Reduced Level (RL) = HI - Intermediate Sight (IS) or HI - Fore Sight (FS)',
      'Arithmetic Check (Rise and Fall): ΣBS - ΣFS = ΣRise - ΣFall = Last RL - First RL',
      'Arithmetic Check (Collimation/HI): ΣBS - ΣFS = Last RL - First RL'
    ],
    examTips: [
      'Rise and Fall method provides check on intermediate sight (IS) stations; Height of Instrument method does not check IS.',
      'Local attraction exists when difference between FB and BB is not exactly 180°.'
    ],
    siteChecklist: [
      'Double check temporary adjustments of Auto Level/Total Station: centering, leveling with plate level, elimination of parallax.'
    ]
  },
  {
    keywords: ['super elevation', 'sight distance', 'ssd', 'osd', 'irc', 'highway', 'cbr', 'pavement'],
    subject: 'Transportation Engineering',
    title: 'Highway Geometric Design: Super-Elevation & Sight Distance (IRC)',
    isCode: 'IRC 73 (Rural Highways) & IRC 86 (Urban Roads)',
    summary: 'Design of banking on horizontal curves to counteract centrifugal force, and stopping sight distance.',
    hindiSummary: 'राजमार्ग ज्यामितीय डिजाइन: सुपर-एलिवेशन (ढाल) और स्टॉपिंग साइट डिस्टेंस (SSD) के नियम।',
    keyPoints: [
      'Super-elevation (e) tilts the pavement inward on horizontal curves.',
      'Maximum Super-elevation: 7% (0.07) for plain & rolling terrain; 10% (0.10) for hilly terrain not bound by snow; 4% for urban areas with dense intersections.',
      'Stopping Sight Distance (SSD) = Lag Distance (vt) + Braking Distance [v² / (2g(f ± 0.01n))].',
      'Perception-reaction time: IRC recommends t = 2.5 seconds for SSD and 2.0 seconds for OSD.'
    ],
    keyFormulas: [
      'General Super-Elevation Formula: e + f = V² / (127 × R)  (where V is in km/h, R in meters)',
      'Practical IRC Design Super-Elevation (at 75% design speed, neglecting friction f=0):',
      '  e_design = (0.75 × V)² / (127 × R) = V² / (225 × R)',
      'Stopping Sight Distance (SSD): SSD = 0.278 × V × t + [V² / (254 × f)]  (f ≈ 0.35 to 0.40)'
    ],
    examTips: [
      'Ruling Minimum Radius: R_ruling = V² / [127 × (e_max + f)].',
      'CBR (California Bearing Ratio) test measures load resistance at 2.5 mm and 5.0 mm plunger penetration (Standard loads: 1370 kg at 2.5mm, 2055 kg at 5.0mm).'
    ],
    siteChecklist: [
      'Provide transition curve (clothoid / Euler spiral) between straight tangent and circular curve to gradually introduce super-elevation.'
    ]
  },
  {
    keywords: ['bod', 'cod', 'water treatment', 'sedimentation', 'chlorine', 'filtration', 'environmental'],
    subject: 'Environmental Engineering',
    title: 'Water Treatment & Waste Water: BOD, COD & Clarification',
    isCode: 'IS 10500:2012 (Drinking Water Specification)',
    summary: 'Biological Oxygen Demand, Chemical Oxygen Demand, and municipal water purification units.',
    hindiSummary: 'जल व अपशिष्ट जल अभियांत्रिकी: BOD, COD, अवसादन (Sedimentation) तथा शुद्धिकरण प्रक्रिया।',
    keyPoints: [
      'BOD (Biochemical Oxygen Demand): Measures oxygen consumed by aerobic microorganisms to biologically oxidize organic matter (standard test: 5 days at 20°C, BOD5).',
      'COD (Chemical Oxygen Demand): Measures oxygen required for chemical oxidation of both biodegradable and non-biodegradable organics using strong chemical oxidant (K2Cr2O7).',
      'Always COD > BOD. Ratio of BOD5/COD indicates biodegradability (≥ 0.6 indicates easily biologically treatable).',
      'Drinking water permissible limits (IS 10500): pH = 6.5 - 8.5; Turbidity < 1 NTU (max 5 NTU); Total Dissolved Solids (TDS) < 500 mg/L (max 2000 mg/L).'
    ],
    keyFormulas: [
      'BOD5 = (DO_initial - DO_final) × (Bottle Volume / Sample Volume) [Dilution Factor]',
      'Surface Overflow Rate (SOR) = Discharge (Q) / Surface Area (B × L)',
      'Weir Loading Rate = Q / Length of effluent weir'
    ],
    examTips: [
      'Break-point chlorination represents the point where chlorine demand has been fully satisfied and free residual chlorine begins to appear.',
      'Alum (Aluminum Sulphate, Al2(SO4)3·18H2O) is the most common coagulant, works best in pH range 6.5 - 8.5.'
    ],
    siteChecklist: [
      'Maintain free residual chlorine of at least 0.2 mg/L at consumer taps to prevent biological recontamination in the distribution network.'
    ]
  },
  {
    keywords: ['slenderness ratio', 'steel', 'is 800', 'buckling', 'lacing', 'batten', 'compression member', 'tension member'],
    subject: 'Design of Steel Structures (IS 800:2007)',
    title: 'Design of Steel Compression & Tension Members (IS 800:2007)',
    isCode: 'IS 800:2007 Section 7 & Table 3',
    summary: 'Slenderness ratio limits, buckling curves (a, b, c, d), lacing, and battening rules.',
    hindiSummary: 'स्टील स्ट्रक्चर डिजाइन: स्लेंडरनेस रेश्यो (तनुता अनुपात), बकलिंग और लेसिंग-बैटन के नियम।',
    keyPoints: [
      'Slenderness Ratio (λ) = Effective Length (kL) / Minimum Radius of Gyration (rmin).',
      'Maximum Permissible Slenderness Ratio (Table 3):',
      '  - Compression member carrying dead load + imposed load = 180',
      '  - Member carrying wind/earthquake loads (reversal of stress) = 250 or 350',
      '  - Tension member (other than pre-tensioned) = 400',
      'Lacing System: Angle of inclination with column axis = 40° to 70°. Slenderness ratio of lacing flat ≤ 145.'
    ],
    keyFormulas: [
      'Euler Buckling Load: Pe = (π² × E × I) / (kL)²',
      'Radius of Gyration: r = √(I / A)',
      'Design Compressive Strength: Pd = Ae × fcd',
      'Design Tension Capacity: Td = Min(Tdg, Tdn, Tdb) where Tdg = (Ag × fy) / γm0'
    ],
    examTips: [
      'IS 800:2007 classifies buckling into 4 curves: a (hot rolled hollow), b (welded I-sections thin flanges), c (rolled I-sections), d (very thick plates).',
      'Lacing bars must be designed to resist a transverse shear force of 2.5% of total axial load on column.'
    ],
    siteChecklist: [
      'Verify bolt grade (Grade 4.6 vs High Strength Friction Grip HSFG 8.8 / 10.9) before site erection.',
      'Ensure lacing plates are painted before assembly in inaccessible zones.'
    ]
  }
];

/**
 * Searches and synthesizes an authoritative Civil Engineering solution
 * based on Indian Standards (IS), standard textbook references, and site practice.
 */
export function generateOfflineCivilDoubtAnswer(
  question: string,
  subject?: string,
  language: string = 'both'
): string {
  const query = (question + ' ' + (subject || '')).toLowerCase();

  // Find best matching topic
  let bestTopic: CivilTopicKnowledge | null = null;
  let maxScore = 0;

  for (const topic of TOPIC_KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (query.includes(kw.toLowerCase())) {
        score += 3;
      }
    }
    if (subject && topic.subject.toLowerCase().includes(subject.toLowerCase())) {
      score += 2;
    }
    if (score > maxScore) {
      maxScore = score;
      bestTopic = topic;
    }
  }

  const isHindi = language === 'hi' || language === 'Hindi / Hinglish';
  const isEnglishOnly = language === 'en';

  if (!bestTopic || maxScore === 0) {
    return generateGeneralCivilSolution(question, subject, language);
  }

  // Format detailed response
  let result = `### 🏗️ ${bestTopic.title}\n\n`;

  if (bestTopic.isCode) {
    result += `> **Standard Reference:** ${bestTopic.isCode} | **Subject:** ${bestTopic.subject}\n\n`;
  }

  if (isHindi) {
    result += `**अवलोकन (Overview):**\n${bestTopic.hindiSummary}\n\n`;
  } else if (isEnglishOnly) {
    result += `**Overview:**\n${bestTopic.summary}\n\n`;
  } else {
    result += `**Overview & Concept:**\n${bestTopic.summary}\n*${bestTopic.hindiSummary}*\n\n`;
  }

  result += `#### 📋 1. Core Technical Principles & Standards:\n`;
  for (const pt of bestTopic.keyPoints) {
    result += `- ${pt}\n`;
  }
  result += `\n`;

  if (bestTopic.keyFormulas && bestTopic.keyFormulas.length > 0) {
    result += `#### 📐 2. Essential Formulas & Design Equations:\n`;
    for (const formula of bestTopic.keyFormulas) {
      result += `- \`${formula}\`\n`;
    }
    result += `\n`;
  }

  result += `#### 🎯 3. Competitive Exam Points (GATE / SSC JE / State AE):\n`;
  for (const tip of bestTopic.examTips) {
    result += `- 💡 ${tip}\n`;
  }
  result += `\n`;

  result += `#### 👷 4. Site Engineer Execution & Quality Checklist:\n`;
  for (const chk of bestTopic.siteChecklist) {
    result += `- ✅ ${chk}\n`;
  }
  result += `\n`;

  result += `---\n*💡 Deep Help Civil Engineering Expert Note:* Always cross-verify dimensions and design coefficients with the latest revisions of Indian Standard (IS) Codes before finalizing structural site drawings.`;

  return result;
}

function generateGeneralCivilSolution(
  question: string,
  subject?: string,
  language: string = 'both'
): string {
  const isHindi = language === 'hi' || language === 'Hindi / Hinglish';

  return `### 🏛️ Civil Engineering Technical Clarification

**Domain:** ${subject || 'General Structural & Construction Engineering'}
**Question Analyzed:** "${question}"

---

#### 📌 1. Engineering Concept & Indian Standard (IS) Basis:
- Civil engineering structures must satisfy both **Ultimate Limit State (Strength)** and **Serviceability Limit State (Deflection, Cracking, Durability)** as per **IS 456:2000**.
- Material properties must satisfy characteristic strengths: Concrete compressive strength ($f_{ck}$) at 28 days and Steel yield strength ($f_y$).
- Loads must be calculated adhering to **IS 875 (Parts 1 to 5)** for Dead Load, Imposed Live Load, Wind Load, and Snow Load, and **IS 1893:2016** for Seismic Zone factors.

#### 🧮 2. Step-by-Step Analytical Methodology:
1. **Load Estimation & Combinations:** Calculate factored design loads ($1.5 \\times [DL + LL]$ or $1.2 \\times [DL + LL + WL/EQ]$).
2. **Structural Idealization:** Determine support conditions (pinned, fixed, roller) and effective spans ($l_{eff}$).
3. **Design Stress Distribution:** Ensure maximum applied stress $\\sigma_{applied} \\leq \\sigma_{permissible} = \\frac{f_y}{\\gamma_m}$.
4. **Detailing Compliance:** Confirm clear cover, bar spacing, lap length ($L_d \\approx 45\\phi$ to $50\\phi$), and shear stirrup spacing.

#### 👷 3. On-Site Practical Guidelines:
- **Quality Control:** Check batching accuracy, water-cement ratio ($w/c \\approx 0.40 - 0.50$), and proper vibration to eliminate honeycombing.
- **Curing Protocol:** Minimum 7 to 10 days for ordinary Portland cement, 14 days under dry hot conditions.
- **Formwork Striking Times (IS 456 Cl. 11.3):**
  - Vertical formwork to columns, walls, beams: 16 - 24 hours.
  - Soffit to slabs (props left under): 3 days.
  - Soffit to beams (props left under): 7 days.
  - Props to slabs: Spanning up to 4.5m = 7 days; spanning over 4.5m = 14 days.

${
  isHindi
    ? `\n#### 🇮🇳 हिंदी में संक्षिप्त विवरण:\nइस प्रश्न में दिए गए सिविल इंजीनियरिंग कार्य के लिए IS 456 / IS 875 के सुरक्षा मानकों का पालन करना अनिवार्य है। निर्माण स्थल पर कवर ब्लॉक, वाइब्रेटर का सही प्रयोग तथा कम से कम 7 से 10 दिनों की क्योरिंग सुनिश्चित करें।`
    : ''
}

---
*Deep Help AI Assistant — Civil Engineering Knowledge Repository*`;
}
