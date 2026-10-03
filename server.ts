import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import {
  solveDoubt,
  explainDrawingPlan,
  generateViva,
  generateInterviewGuide,
} from './server/geminiService';
import {
  solveDoubtWithChatGPT,
  isOpenAIConfigured,
} from './server/chatgptService';
import { govtJobFeedService } from './server/govtJobFeedService';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Real-Time Active Users & Live Likes In-Memory State
interface ActiveSession {
  clientId: string;
  tab: string;
  lastPing: number;
  city: string;
}

const activeSessions = new Map<string, ActiveSession>();
const likedClients = new Set<string>();
let baseLikesCount = 4926;
let totalVisitsCount = 28540;

const CITIES = [
  'Patna, Bihar',
  'Delhi NCR',
  'Pune, Maharashtra',
  'Bengaluru, Karnataka',
  'Lucknow, UP',
  'Jaipur, Rajasthan',
  'Bhopal, MP',
  'Chandigarh',
  'Hyderabad, Telangana',
  'Ranchi, Jharkhand',
  'Kolkata, WB',
  'Ahmedabad, Gujarat',
  'Indore, MP',
];

const RECENT_LIVE_ACTIONS = [
  'Site Engineer calculated M25 concrete mix design',
  'GATE aspirant completed Highway Engineering live quiz',
  'Structural engineer reviewed IS 456 development length',
  'Diploma student used CASIO fx-991CW scientific calculator',
  'Surveyor verified Height of Instrument & Reduced Level',
  'Junior engineer solved RCC beam shear stirrup doubt',
  'Quantity surveyor estimated brickwork & mortar bags',
  'Learner bookmarked Foundation Bearing Capacity formula',
];

// Clean expired sessions periodically (> 40 seconds)
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of activeSessions.entries()) {
    if (now - session.lastPing > 40000) {
      activeSessions.delete(id);
    }
  }
}, 10000);

// Real-Time Ping Heartbeat Endpoint
app.post('/api/realtime/ping', (req, res) => {
  try {
    const { clientId, activeTab } = req.body;
    const cid = String(clientId || req.ip || 'anon_' + Math.random().toString(36).substring(2, 8));
    const tab = String(activeTab || 'home');
    const now = Date.now();

    const existing = activeSessions.get(cid);
    const city = existing?.city || CITIES[Math.floor(Math.random() * CITIES.length)];

    activeSessions.set(cid, {
      clientId: cid,
      tab,
      lastPing: now,
      city,
    });

    // Realistic active calculation: actual connections + dynamic pool based on time
    const realCount = activeSessions.size;
    const timeBasedPool = 28 + Math.floor(Math.sin(now / 60000) * 8);
    const totalActiveOnline = Math.max(realCount, timeBasedPool + realCount);

    // Distribution breakdown
    const breakdown = {
      calculators: Math.max(4, Math.round(totalActiveOnline * 0.32)),
      study: Math.max(3, Math.round(totalActiveOnline * 0.28)),
      design: Math.max(2, Math.round(totalActiveOnline * 0.16)),
      ai: Math.max(2, Math.round(totalActiveOnline * 0.14)),
      surveying: Math.max(1, Math.round(totalActiveOnline * 0.10)),
    };

    const hasLiked = likedClients.has(cid);

    return res.json({
      status: 'ok',
      activeOnline: totalActiveOnline,
      activeBreakdown: breakdown,
      totalVisits: totalVisitsCount,
      totalLikes: baseLikesCount + likedClients.size,
      userHasLiked: hasLiked,
      yourCity: city,
      timestamp: now,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to record heartbeat' });
  }
});

// Real-Time Stats Endpoint
app.get('/api/realtime/stats', (req, res) => {
  const cid = String(req.query.clientId || req.ip || '');
  const now = Date.now();
  const realCount = activeSessions.size;
  const timeBasedPool = 28 + Math.floor(Math.sin(now / 60000) * 8);
  const totalActiveOnline = Math.max(realCount, timeBasedPool + realCount);

  return res.json({
    activeOnline: totalActiveOnline,
    totalLikes: baseLikesCount + likedClients.size,
    totalVisits: totalVisitsCount,
    userHasLiked: likedClients.has(cid),
    recentActivities: RECENT_LIVE_ACTIONS,
    timestamp: now,
  });
});

// Real-Time Page Like Toggle Endpoint
app.post('/api/realtime/like', (req, res) => {
  try {
    const { clientId, liked } = req.body;
    const cid = String(clientId || req.ip || 'anon');

    if (liked) {
      likedClients.add(cid);
    } else {
      likedClients.delete(cid);
    }

    const currentLikes = baseLikesCount + likedClients.size;
    return res.json({
      success: true,
      totalLikes: currentLikes,
      userHasLiked: likedClients.has(cid),
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update like status' });
  }
});

// Automated Government Job Notifications Live Feed Endpoint
app.get('/api/jobs/live-feed', (req, res) => {
  try {
    const departmentType = req.query.departmentType as string | undefined;
    const state = req.query.state as string | undefined;
    const jobs = govtJobFeedService.getLiveJobs(departmentType, state);
    const lastSynced = govtJobFeedService.getLastSyncTime();

    return res.json({
      success: true,
      count: jobs.length,
      lastSynced,
      jobs,
      liveEngineStatus: '🟢 Automated Government Feeds Active',
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch automated job feeds' });
  }
});

// Trigger Live Sync for Govt Job Feeds
app.post('/api/jobs/sync', (req, res) => {
  try {
    const syncResult = govtJobFeedService.syncGovtFeeds();
    const jobs = govtJobFeedService.getLiveJobs();

    return res.json({
      success: true,
      ...syncResult,
      jobs,
      message: 'Government recruitment feeds auto-synchronized successfully.',
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to auto-sync job feeds' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    chatgptConfigured: isOpenAIConfigured(),
    timestamp: Date.now()
  });
});

// Civil AI Doubt Solver endpoint (Supports ChatGPT & Gemini)
app.post('/api/ai/doubt-solver', async (req, res) => {
  try {
    const { question, subject, language = 'both', provider = 'chatgpt' } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (provider === 'gemini') {
      const result = await solveDoubt(question, subject, language);
      return res.json(result);
    }

    if (provider === 'chatgpt') {
      const result = await solveDoubtWithChatGPT(question, subject, language);
      return res.json(result);
    }

    // Auto mode: Try ChatGPT if configured, else Gemini, then knowledge engine
    if (isOpenAIConfigured()) {
      const result = await solveDoubtWithChatGPT(question, subject, language);
      return res.json(result);
    } else {
      const result = await solveDoubt(question, subject, language);
      return res.json(result);
    }
  } catch (error: any) {
    console.error('Error in doubt solver route:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error while solving doubt'
    });
  }
});

// Drawing / Plan Explanation endpoint
app.post('/api/ai/drawing-explain', async (req, res) => {
  try {
    const {
      planType,
      drawingType,
      description,
      planDescription,
      dimensions,
      imageBase64
    } = req.body;

    const result = await explainDrawingPlan({
      planType: planType || drawingType || 'Civil Engineering Building Plan',
      description: description || planDescription || '',
      dimensions: dimensions || '',
      imageBase64
    });

    return res.json(result);
  } catch (error: any) {
    console.error('Error in drawing explain route:', error);
    return res.status(500).json({
      error: error.message || 'Error generating plan explanation'
    });
  }
});

// Viva Questions Generator endpoint
app.post('/api/ai/viva-generator', async (req, res) => {
  try {
    const {
      topic,
      subject,
      labExperiment,
      difficulty = 'medium',
      count = 5
    } = req.body;

    const queryTopic = topic || (subject && labExperiment ? `${subject} - ${labExperiment}` : subject || labExperiment || 'General Civil Engineering');
    const result = await generateViva(queryTopic, difficulty, Number(count) || 5);

    return res.json(result);
  } catch (error: any) {
    console.error('Error in viva generator route:', error);
    return res.status(500).json({
      error: error.message || 'Error generating viva questions'
    });
  }
});

// Interview Preparation endpoint
app.post('/api/ai/interview-prep', async (req, res) => {
  try {
    const {
      role,
      targetRole,
      userExperience,
      experienceLevel,
      subjectFocus
    } = req.body;

    const queryRole = targetRole || role || 'Site Execution Engineer';
    const queryExp = experienceLevel || userExperience || 'Fresher (Diploma / B.Tech)';

    const result = await generateInterviewGuide(queryRole, queryExp);
    return res.json(result);
  } catch (error: any) {
    console.error('Error in interview prep route:', error);
    return res.status(500).json({
      error: error.message || 'Error generating interview guide'
    });
  }
});

// Vite middleware for development or Static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Deep Help Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
