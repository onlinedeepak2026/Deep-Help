import { CommunityComment, FeedbackItem, VisitorStats } from '../types';

export const INITIAL_VISITOR_STATS: VisitorStats = {
  totalVisits: 18450,
  todayVisits: 642,
  activeOnline: 28,
  totalLikes: 4892,
  userHasLiked: false,
  totalCalculations: 86420,
};

export const INITIAL_COMMUNITY_COMMENTS: CommunityComment[] = [
  {
    id: 'comm-1',
    name: 'Er. Rajesh Sharma',
    role: 'Senior Site Engineer (L&T Infra)',
    avatarColor: 'bg-emerald-500',
    category: 'Site Experience',
    content:
      'M25 concrete mix calculation matched our batching plant laboratory trial sheet within 1.5%! Extremely practical and reliable for quick verification directly on the casting site. Great job Er. Deepak Kumar!',
    timestamp: Date.now() - 1000 * 60 * 60 * 4, // 4 hours ago
    likes: 47,
    userLiked: false,
    replies: [
      {
        id: 'rep-1',
        name: 'Er. Deepak Kumar',
        role: 'Founder (Deep Help)',
        content: 'Thank you Er. Rajesh sir! The concrete module strictly adheres to IS 10262:2019 mix guidelines. Glad it helps on active casting sites.',
        timestamp: Date.now() - 1000 * 60 * 60 * 2,
      },
    ],
  },
  {
    id: 'comm-2',
    name: 'Pooja Verma',
    role: 'M.Tech Structural Engineering (NIT)',
    avatarColor: 'bg-sky-500',
    category: 'Appreciation',
    content:
      'The standard textbook representation for the 21 civil engineering subjects and formula codes (IS 456, IS 800, IRC 73) is genuinely clean. No messy raw code, very readable on mobile screens.',
    timestamp: Date.now() - 1000 * 60 * 60 * 18, // 18 hours ago
    likes: 38,
    userLiked: false,
  },
  {
    id: 'comm-3',
    name: 'Er. Amit Kumar Patel',
    role: 'Junior Engineer (State PWD)',
    avatarColor: 'bg-amber-500',
    category: 'Site Experience',
    content:
      'The Surveying Leveling Book calculator (Rise & Fall and HI methods) with arithmetic check (ΣBS - ΣFS = Last RL - First RL) saved me a lot of time while checking road formation levels today.',
    timestamp: Date.now() - 1000 * 60 * 60 * 28, // 1 day ago
    likes: 29,
    userLiked: false,
  },
  {
    id: 'comm-4',
    name: 'Sandeep Yadav',
    role: 'Civil Engineering Aspirant (SSC-JE & GATE)',
    avatarColor: 'bg-indigo-500',
    category: 'Exam Prep',
    content:
      'The Quiz & Question Management system with instant IS Code clause explanations is top-tier for exam revisions. Practicing 20 questions daily here has significantly boosted my confidence.',
    timestamp: Date.now() - 1000 * 60 * 60 * 44, // ~2 days ago
    likes: 54,
    userLiked: false,
  },
  {
    id: 'comm-5',
    name: 'Er. Harish Chandra',
    role: 'Quantity Surveyor & Estimator',
    avatarColor: 'bg-rose-500',
    category: 'Doubt & Question',
    content:
      'In the Brick Masonry estimator, the dry mortar bulking factor of 1.33 and 10% wastage allowance matches standard CPWD DSR rate analysis norms accurately. Will recommend this to all junior site engineers in our firm.',
    timestamp: Date.now() - 1000 * 60 * 60 * 72, // 3 days ago
    likes: 22,
    userLiked: false,
  },
];

export const INITIAL_FEEDBACK_ITEMS: FeedbackItem[] = [
  {
    id: 'fb-1',
    name: 'Er. Arvind Mukhopadhyay',
    email: 'arvind.mukho@gmail.com',
    role: 'Structural Consultant (Kolkata)',
    rating: 5,
    category: 'Appreciation',
    message:
      'Outstanding platform! Standardized calculations with IS 456 / IS 10262 references and clean PDF reports have streamlined our preliminary design checks. Er. Deepak Kumar has created a truly useful digital tool for our civil fraternity.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
    helpfulCount: 36,
  },
  {
    id: 'fb-2',
    name: 'Er. Neha Gupta',
    email: 'neha.civil09@gmail.com',
    role: 'Site Supervisor (Delhi NCR)',
    rating: 5,
    category: 'Feature Request',
    message:
      'The speed and responsiveness on mobile are flawless. Could you also consider adding a Bar Bending Schedule (BBS) cutting length module for slabs and footings in a future release? Keep up the brilliant work!',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5,
    helpfulCount: 28,
  },
  {
    id: 'fb-3',
    name: 'Sunil Kumar Rathore',
    email: 'sunil.rathore98@outlook.com',
    role: 'Civil Diploma Student (Govt. Polytechnic)',
    rating: 5,
    category: 'Accuracy',
    message:
      'Best website for civil diploma and B.Tech students. All unit conversions (Square Feet to Gaj/Biswa/Hectare) and Beam reaction formulas are straightforward to understand.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 7,
    helpfulCount: 19,
  },
  {
    id: 'fb-4',
    name: 'Er. Vikrant Joshi',
    email: 'vikrant.joshi.ce@gmail.com',
    role: 'Project Manager (Highway EPC)',
    rating: 5,
    category: 'Suggestion',
    message:
      'Love the transparent founder profile of Er. Deepak Kumar and the offline-capable instant calculation speeds. Very honest, practical engineering utility without annoying marketing popups.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 10,
    helpfulCount: 15,
  },
];
