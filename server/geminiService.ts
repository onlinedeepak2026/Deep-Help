import { GoogleGenAI } from '@google/genai';
import { generateOfflineCivilDoubtAnswer } from './civilKnowledge';

// Lazy init Gemini SDK
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Candidates in order of priority per gemini-api skill
// Flash-lite is ultra-low latency and highly available during demand spikes
const CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
  'gemini-flash-latest'
];

interface CallGeminiOptions {
  contents: any;
  systemInstruction?: string;
  responseMimeType?: string;
}

/**
 * Executes a Gemini prompt with automatic fallback across models
 * Handles 503 ("model experiencing high demand") and 429 transient spikes seamlessly
 */
async function callGeminiWithFallback(
  ai: GoogleGenAI,
  options: CallGeminiOptions
): Promise<{ text: string; model: string }> {
  let lastError: any = null;

  for (let i = 0; i < CANDIDATE_MODELS.length; i++) {
    const model = CANDIDATE_MODELS[i];
    try {
      const response = await ai.models.generateContent({
        model,
        contents: options.contents,
        config: {
          ...(options.systemInstruction ? { systemInstruction: options.systemInstruction } : {}),
          ...(options.responseMimeType ? { responseMimeType: options.responseMimeType } : {}),
          maxOutputTokens: 4000,
        },
      });

      const responseText = response.text || '';
      if (responseText.trim()) {
        return { text: responseText, model };
      }
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || String(err);

      const isHighDemandOrUnavailable =
        errMsg.includes('503') ||
        errMsg.includes('high demand') ||
        errMsg.includes('UNAVAILABLE') ||
        errMsg.includes('429') ||
        errMsg.includes('RESOURCE_EXHAUSTED') ||
        err?.status === 503 ||
        err?.status === 429;

      if (i < CANDIDATE_MODELS.length - 1 && isHighDemandOrUnavailable) {
        // Switch to candidate model with slight backoff
        await new Promise((resolve) => setTimeout(resolve, 300));
        continue;
      }
    }
  }

  throw lastError;
}

export async function solveDoubt(question: string, subject?: string, language: string = 'both') {
  const ai = getGeminiClient();

  if (!ai) {
    const fallbackAnswer = generateOfflineCivilDoubtAnswer(question, subject, language);
    return {
      success: true,
      source: 'offline_knowledge_engine',
      answer: fallbackAnswer,
      solution: fallbackAnswer,
    };
  }

  const prompt = `You are "Deep Help AI", an authoritative Civil Engineering senior professor and field consultant for Er. Deepak Kumar's Deep Help platform.
Subject Area: ${subject || 'General Civil Engineering'}
Language Requirement: ${language === 'hi' || language === 'Hindi / Hinglish' ? 'Hindi & Hinglish (clear technical terms in English)' : language === 'en' ? 'English' : 'Bilingual (Hindi + English with technical terms)'}

User Doubt:
"${question}"

Provide an accurate, step-by-step civil engineering technical solution structured as:
1. **Core Civil Engineering Concept & IS Codal Citation** (e.g. IS 456:2000 for RCC, IS 800:2007 for Steel, IS 1200 for Measurements, IRC, etc.)
2. **Step-by-Step Calculation or Technical Explanation** (include all formulas with standard units)
3. **Site Engineering & Competitive Exam Tip** (practical insights for SSC JE, RRB JE, GATE, or on-site supervision)
Format with clear Markdown headers, bold formulas, and clean bullet points.`;

  try {
    const result = await callGeminiWithFallback(ai, {
      contents: prompt,
      systemInstruction:
        'You are an authoritative Civil Engineering professor and structural consultant. Deliver accurate formulas, standard IS code clauses, and practical site execution advice.',
    });

    return {
      success: true,
      source: `gemini (${result.model})`,
      answer: result.text,
      solution: result.text,
    };
  } catch {
    // Seamless civil knowledge base fallback without crashing
    const fallbackAnswer = generateOfflineCivilDoubtAnswer(question, subject, language);
    return {
      success: true,
      source: 'Deep Help Civil Knowledge Engine',
      answer: fallbackAnswer,
      solution: fallbackAnswer,
    };
  }
}

export async function explainDrawingPlan(params: {
  planType?: string;
  description?: string;
  dimensions?: string;
  imageBase64?: string;
}) {
  const { planType, description, dimensions, imageBase64 } = params;
  const ai = getGeminiClient();

  const fallbackText = `### 📐 Structural & Architectural Drawing Review (IS / NBC Standards)

**Plan Classification:** ${planType || 'Residential / Commercial Building Plan'}
**Key Specifications:** ${dimensions || 'Standard Grid Layout'} - ${description || 'Layout Examination'}

---

#### 1. 🏢 Structural Grid & Column Placement:
- Align columns continuously along orthogonal grid axes to avoid eccentric beam-column joint transfers.
- Standard column spans: 3.0 m to 4.5 m for residential RCC framing; for spans > 5.0 m, verify deflection criteria (Span/d ratio per IS 456 Clause 23.2).
- Plinth beam height must be minimum 300-450 mm above finished natural ground level.

#### 2. 🚪 Architectural Spatial Flow & NBC Compliance:
- **Ventilation:** Window opening area must be at least 10% to 15% of habitable floor area.
- **Staircase Detailing:** Maximum riser = 150-175 mm, minimum tread = 250-300 mm. Minimum headroom = 2.2 m.
- **Door Widths:** Main entrance ≥ 1000 mm, internal rooms ≥ 900 mm, bathrooms/W.C. ≥ 750 mm.

#### 3. 🚰 Sanitary, Plumbing & Service Ducts:
- Vertically align bathrooms and kitchen waste lines on all floors to avoid horizontal pipe runs across living room ceilings.
- Provide accessible plumbing shaft (minimum 600 mm × 900 mm) with trap door for inspection and maintenance.

#### 4. 👷 Site Supervision & Execution Checklist:
- Ensure concrete cover blocks (Beam = 25mm, Column = 40mm, Slab = 20mm, Footing = 50mm) are tied to outer stirrups before pouring.
- Check plumbness of shuttering using plumb-bob on two perpendicular faces before casting.`;

  if (!ai) {
    return {
      success: true,
      source: 'knowledge_base',
      explanation: fallbackText,
    };
  }

  const contents: any[] = [];
  if (imageBase64) {
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    contents.push({
      inlineData: {
        data: base64Data,
        mimeType: 'image/jpeg',
      },
    });
  }

  const promptText = `Analyze this Civil Engineering architectural / structural drawing or layout:
Plan Category: ${planType || 'Civil Engineering Building Plan'}
Description / Notes: ${description || 'Standard Layout Details'}
Dimensions: ${dimensions || 'Standard'}

Provide a rigorous technical engineering assessment:
1. **Architectural & Spatial Flow**: Circulation efficiency, NBC light & ventilation compliance, room dimensions.
2. **Structural Feasibility**: Column placement, beam load pathways, slab spans, Cantilever deflection precautions.
3. **Plumbing & Services Coordination**: Vertical pipe duct alignment, staircase riser & tread proportions.
4. **Site Execution Notes**: Rebar placement reminders, formwork inspection points, and cost-effective construction tips.`;

  contents.push(promptText);

  try {
    const result = await callGeminiWithFallback(ai, {
      contents,
      systemInstruction:
        'You are an expert Structural Consultant and Chief Civil Engineer reviewing construction drawings and architectural floor plans.',
    });

    return {
      success: true,
      source: `gemini (${result.model})`,
      explanation: result.text,
    };
  } catch {
    return {
      success: true,
      source: 'offline_knowledge_fallback',
      explanation: fallbackText,
    };
  }
}

export async function generateViva(topic: string, difficulty: string = 'medium', count: number = 5) {
  const ai = getGeminiClient();

  const defaultQuestions = [
    {
      q: `What is the significance of the water-cement ratio in ${topic || 'Concrete Technology'}?`,
      a: "Per Abram's Law, concrete compressive strength is inversely proportional to the water-cement ratio. Standard range is 0.40 to 0.55. Lower w/c increases strength and durability, but requires plasticizers for workability.",
      code: "IS 456:2000 Table 5"
    },
    {
      q: "What is the initial and final setting time of Ordinary Portland Cement (OPC)?",
      a: "Initial setting time is minimum 30 minutes (measured by Vicat needle with 1mm square needle). Final setting time is maximum 600 minutes (10 hours) using the annular attachment.",
      code: "IS 4031 & IS 269"
    },
    {
      q: "Why is nominal cover provided in reinforced concrete members?",
      a: "To protect reinforcement steel against carbonation and corrosion, provide thermal fire protection, and ensure adequate stress transfer bond. Minimum nominal cover: Slab 20mm, Beam 25mm, Column 40mm, Footing 50mm.",
      code: "IS 456:2000 Clause 26.4"
    },
    {
      q: "What is the difference between One-Way Slab and Two-Way Slab?",
      a: "If the ratio of longer span to shorter span (Ly / Lx) is ≥ 2, it is designed as a One-Way Slab (bends predominantly along the short span). If Ly / Lx < 2 and supported on all four edges, it is designed as a Two-Way Slab.",
      code: "IS 456:2000 Annex D"
    },
    {
      q: "How many concrete cubes must be sampled for a 25 m³ concrete pour on site?",
      a: "Per IS 456:2000 Table 11: 1-5 m³ = 1 sample; 6-15 m³ = 2 samples; 16-30 m³ = 3 samples. Hence, 3 samples (consisting of 3 test specimens each) must be cast for 7-day and 28-day testing.",
      code: "IS 456:2000 Clause 15.2.2"
    }
  ];

  const formatQuestionsMarkdown = (qs: typeof defaultQuestions) => {
    return qs.map((item, idx) => 
      `### Q${idx + 1}: ${item.q}\n**Answer:** ${item.a}\n*Reference:* \`${item.code}\`\n`
    ).join('\n---\n\n');
  };

  if (!ai) {
    return {
      success: true,
      source: 'knowledge_base',
      questions: defaultQuestions,
      vivaQuestions: formatQuestionsMarkdown(defaultQuestions),
    };
  }

  const prompt = `Generate ${count} high-yield Viva Voce / Oral Examination questions for Civil Engineering students on the topic "${topic || 'General Civil Engineering'}".
Difficulty level: ${difficulty}.
Format the response strictly as valid JSON array of objects with keys: "q" (question string), "a" (model answer in 2-3 concise sentences), and "code" (Indian Standard or reference code). Do NOT wrap in markdown backticks.`;

  try {
    const result = await callGeminiWithFallback(ai, {
      contents: prompt,
      responseMimeType: 'application/json',
    });

    let questions = defaultQuestions;
    try {
      const parsed = JSON.parse(result.text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        questions = parsed;
      }
    } catch {
      // JSON parse failed, keep default
    }

    return {
      success: true,
      source: `gemini (${result.model})`,
      questions,
      vivaQuestions: formatQuestionsMarkdown(questions),
    };
  } catch {
    return {
      success: true,
      source: 'offline_knowledge_fallback',
      questions: defaultQuestions,
      vivaQuestions: formatQuestionsMarkdown(defaultQuestions),
    };
  }
}

export async function generateInterviewGuide(role: string, userExperience: string) {
  const ai = getGeminiClient();

  const defaultGuide = {
    role,
    keySkillsToHighlight: [
      'Reading GFC (Good for Construction) architectural and structural drawings',
      'Bar Bending Schedule (BBS) preparation and steel cutting scrap minimization',
      'Slump testing, cube casting (150×150×150 mm), and 7/28 day curing quality checks',
      'Daily Progress Report (DPR) and Measurement Book (MB) billing documentation'
    ],
    mockQuestions: [
      {
        round: 'Technical / Site Execution',
        question: 'How do you check the verticality of a column during shuttering?',
        answer: 'Using a plumb bob (साहुल) from the top corners on two adjacent perpendicular faces, or using a total station/theodolite for high-rise frames. Tolerance must be within ±3 mm.'
      },
      {
        round: 'Technical / Quality Control',
        question: 'What is the minimum curing period for concrete with mineral admixtures like fly ash?',
        answer: 'As per IS 456:2000 Clause 13.5, concrete made with mineral admixtures (fly ash, GGBS) must be cured for at least 14 days under hot/dry weather conditions to ensure pozzolanic secondary reaction.'
      },
      {
        round: 'Site Safety & Material Management',
        question: 'How will you handle a contractor using sand with excessive silt content on site?',
        answer: 'Conduct an immediate field jar test (shake with 1% saline solution in a 250ml measuring cylinder; allowed silt layer after 3 hours is ≤ 6-8%). If higher, reject the load or mandate washing before batching.'
      },
      {
        round: 'Behavioral & Leadership',
        question: 'What immediate remedial action do you take if honeycombing is seen after stripping column forms?',
        answer: 'Inspect the extent of cavity. Hack away loose aggregate until sound concrete is reached, wash clean, apply epoxy bonding agent, and pack with non-shrink polymer-modified high strength repair mortar. Document in QC register.'
      }
    ]
  };

  const formatGuideMarkdown = (guide: typeof defaultGuide) => {
    return `### 🎯 Civil Engineering Interview Guide: ${guide.role}\n\n#### 🔑 Key Competencies to Highlight:\n${guide.keySkillsToHighlight.map(s => `- ${s}`).join('\n')}\n\n---\n\n#### 📋 High-Frequency Interview Questions & Answers:\n\n` +
      guide.mockQuestions.map((q, idx) => 
        `**[${q.round}] Q${idx + 1}: ${q.question}**\n*Model Answer:* ${q.answer}\n`
      ).join('\n');
  };

  if (!ai) {
    return {
      success: true,
      source: 'knowledge_base',
      interviewGuide: defaultGuide,
      interviewPrep: formatGuideMarkdown(defaultGuide),
    };
  }

  const prompt = `Create an interview preparation guide for a Civil Engineering job interview.
Target Role: ${role}
Candidate Background: ${userExperience}

Return strictly a JSON object with:
- "role": string
- "keySkillsToHighlight": string array (4 items)
- "mockQuestions": array of 4 objects with keys "round", "question", "answer" (practical field or exam-grade answer).
Do NOT wrap in markdown backticks.`;

  try {
    const result = await callGeminiWithFallback(ai, {
      contents: prompt,
      responseMimeType: 'application/json',
    });

    let guide = defaultGuide;
    try {
      const parsed = JSON.parse(result.text);
      if (parsed.mockQuestions && Array.isArray(parsed.mockQuestions)) {
        guide = parsed;
      }
    } catch {
      // JSON parse failed, keep default
    }

    return {
      success: true,
      source: `gemini (${result.model})`,
      interviewGuide: guide,
      interviewPrep: formatGuideMarkdown(guide),
    };
  } catch {
    return {
      success: true,
      source: 'offline_knowledge_fallback',
      interviewGuide: defaultGuide,
      interviewPrep: formatGuideMarkdown(defaultGuide),
    };
  }
}
