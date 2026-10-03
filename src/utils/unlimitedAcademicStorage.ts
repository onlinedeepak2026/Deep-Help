/**
 * Deep Help Unlimited Academic Storage Engine
 * Uses IndexedDB for crash-proof, unlimited storage of civil engineering
 * Previous Year Questions (PYQs), Practical Files/Lab Manuals, and Assignments.
 * Does NOT hit localStorage 5MB quota limits.
 */

import { AcademicResource, AcademicStorageStats } from '../types/academic';

const DB_NAME = 'DeepHelpAcademicDB';
const DB_VERSION = 1;
const STORE_NAME = 'academic_resources';
const BLOB_STORE_NAME = 'academic_blobs';

// Sample pre-seeded high-quality civil engineering academic resources
export const PRELOADED_ACADEMIC_RESOURCES: AcademicResource[] = [
  {
    id: 'pre_pyq_ssc_je_2023_rcc',
    type: 'pyq',
    title: 'SSC JE 2023 (Tier-1) - RCC & SOM Question Paper with Solutions',
    subjectId: 'rcc-design',
    subjectName: 'RCC Design (IS 456)',
    semester: 'Competitive',
    academicYear: '2023',
    examName: 'SSC JE Civil',
    hasSolution: true,
    tags: ['SSC JE', 'IS 456:2000', 'Limit State', 'Shear Reinforcement'],
    description: 'Actual examination questions from SSC JE Civil 2023 covering neutral axis depth, limiting moment of resistance, and bond stress calculation.',
    solutionText: `Q1: Limiting depth of neutral axis (xu,max) for Fe 415 steel:
Formula: xu,max / d = 0.0035 / (0.0055 + 0.87*fy/Es) = 0.48 for Fe 415. (Answer: 0.48d)

Q2: Minimum percentage of tensile steel in RCC beam as per IS 456 Clause 26.5.1.1:
Formula: As / (b * d) >= 0.85 / fy
For Fe 415: As,min = 0.85 / 415 * 100 = 0.205% of cross-sectional area.

Q3: Maximum spacing of shear stirrups for vertical stirrups:
As per IS 456 Clause 26.5.1.5:
Spacing shall not exceed min(0.75*d, 300 mm).`,
    authorName: 'Er. Deepak Kumar',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
    isPreloaded: true,
  },
  {
    id: 'pre_pyq_gate_2024_geotech',
    type: 'pyq',
    title: 'GATE 2024 Civil - Geotechnical & Soil Mechanics PYQ',
    subjectId: 'geotechnical',
    subjectName: 'Geotechnical Engineering (Soil Mechanics)',
    semester: 'Competitive',
    academicYear: '2024',
    examName: 'GATE Civil',
    hasSolution: true,
    tags: ['GATE 2024', 'Terzaghi Bearing Capacity', 'Consolidation', 'Mohr-Coulomb'],
    description: 'Detailed numerical questions on ultimate bearing capacity of strip footing on sand and 1D consolidation settlement.',
    solutionText: `Q1: Ultimate Bearing Capacity for Strip Footing on Cohesionless Soil (c = 0):
Terzaghi Equation: qu = q*Nq + 0.5 * gamma * B * Ngamma
Given: gamma = 18 kN/m3, B = 2 m, Df = 1.5 m, Nq = 22, Ngamma = 20
qu = (18 * 1.5) * 22 + 0.5 * 18 * 2 * 20 = 594 + 360 = 954 kN/m2.
Net Ultimate Capacity: qnu = qu - gamma*Df = 954 - 27 = 927 kN/m2.
Safe Bearing Capacity with FOS = 3:
qs = qnu / 3 + gamma*Df = 927 / 3 + 27 = 309 + 27 = 336 kN/m2.`,
    authorName: 'Er. Deepak Kumar',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 25,
    isPreloaded: true,
  },
  {
    id: 'pre_prac_slump_test',
    type: 'practical',
    title: 'Practical #1: Workability of Fresh Concrete by Slump Cone Test (IS 1199)',
    subjectId: 'concrete-tech',
    subjectName: 'Concrete Technology',
    semester: 'Semester 4',
    academicYear: '2024',
    experimentNumber: 'EXP-01',
    aim: 'To determine the workability and consistency of fresh concrete mix (M20 grade) using standard slump cone apparatus in accordance with IS 1199.',
    apparatus: [
      'Standard Slump Cone (Top dia 10 cm, Bottom dia 20 cm, Height 30 cm)',
      'Tamping Rod (16 mm diameter, 60 cm length with bullet-shaped end)',
      'Graduated Steel Scale / Rule (0-300 mm)',
      'Mixing Tray, Trowels, and Scoop',
    ],
    tags: ['Concrete Lab', 'IS 1199', 'True Slump', 'Workability', 'Viva Questions'],
    description: 'Standard procedure, apparatus, observations, and viva questions for Civil Engineering Concrete Technology Laboratory.',
    solutionText: `Standard Procedure:
1. Clean the interior of the mold and apply a thin layer of mold oil.
2. Place the slump cone on a smooth, non-absorbent rigid horizontal base plate.
3. Fill the cone in 4 equal layers (each approx. 1/4th height).
4. Tamp each layer 25 times evenly over the cross-section using the bullet-ended rod.
5. Level the top with a trowel, remove excess concrete around the base.
6. Lift the cone vertically upwards steadily without any lateral jerk within 5 to 10 seconds.
7. Measure the height difference between the mold and the highest point of the subsided specimen.

Viva Voce Questions:
- Q: What are the types of slumps?
  A: True slump, Shear slump (indicates lack of cohesion), and Collapse slump (very wet mix).
- Q: Typical slump values for RCC work:
  A: Beams/Slabs = 50-100 mm; Columns/Pavements = 25-50 mm; Tremie underwater = 150-200 mm.`,
    authorName: 'Er. Deepak Kumar',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
    isPreloaded: true,
  },
  {
    id: 'pre_prac_compressive_cube',
    type: 'practical',
    title: 'Practical #2: Compressive Strength Test of Concrete Cubes (IS 516)',
    subjectId: 'concrete-tech',
    subjectName: 'Concrete Technology',
    semester: 'Semester 4',
    academicYear: '2024',
    experimentNumber: 'EXP-02',
    aim: 'To determine the 7-day and 28-day compressive strength of M25 grade concrete cubes (150 mm x 150 mm x 150 mm) under CTM.',
    apparatus: [
      'Standard Cube Moulds (150 mm size with base plate)',
      'Compression Testing Machine (CTM, 2000 kN capacity, rate 140 kg/cm2/min)',
      'Tamping Bar or Vibrating Table',
      'Curing Tank maintaining temperature at 27 ± 2 °C',
    ],
    tags: ['Concrete Lab', 'IS 516:1959', 'CTM Test', 'Characteristic Strength', 'M25 Mix'],
    description: 'Complete lab write-up including specimen preparation, water curing, rate of loading, and failure mode analysis.',
    solutionText: `Observation & Calculations:
Cross-sectional area of specimen = 150 mm x 150 mm = 22,500 mm2.
Target 28-day strength for M25 = 25 N/mm2.
7-day strength must be >= 67% of 28-day strength (~16.75 N/mm2).

Formula:
Compressive Strength (N/mm2) = Peak Failure Load (P in N) / Cross-sectional Area (A in mm2).

Viva Notes:
Rate of loading: 140 kg/cm2/min (approx 5.2 kN/s for 150 mm cube).
IS Code: IS 516 (Methods of tests for strength of concrete).`,
    authorName: 'Er. Deepak Kumar',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 18,
    isPreloaded: true,
  },
  {
    id: 'pre_prac_survey_hi_levelling',
    type: 'practical',
    title: 'Practical #3: Fly Levelling Survey using Auto Level & HI Method',
    subjectId: 'surveying',
    subjectName: 'Surveying & Geomatics',
    semester: 'Semester 3',
    academicYear: '2024',
    experimentNumber: 'EXP-03',
    aim: 'To find the reduced levels (RL) of given ground stations and carry out fly leveling from known benchmark (BM = 100.000 m) using Height of Instrument (HI) method.',
    apparatus: [
      'Auto Level with Tripod stand',
      'Telescopic Levelling Staff (4 m or 5 m)',
      'Plumb bob, measuring tape, and leveling field book',
    ],
    tags: ['Survey Lab', 'HI Method', 'Fly Levelling', 'Reduced Level', 'Arithmetical Check'],
    description: 'Field survey practical recording Back Sight, Intermediate Sight, Fore Sight with arithmetical balance checks.',
    solutionText: `Formulas:
Height of Instrument (HI) = Known RL + Back Sight (BS)
Reduced Level of Station (RL) = HI - Intermediate Sight (IS) or Fore Sight (FS)

Arithmetical Check:
Sum(BS) - Sum(FS) = Last RL - First RL.
Both must match exactly to verify calculation correctness without algebraic errors.`,
    authorName: 'Er. Deepak Kumar',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15,
    isPreloaded: true,
  },
  {
    id: 'pre_assign_rcc_beam_design',
    type: 'assignment',
    title: 'Assignment #1: Design of Singly Reinforced Rectangular Beam (IS 456)',
    subjectId: 'rcc-design',
    subjectName: 'RCC Design (IS 456)',
    semester: 'Semester 5',
    academicYear: '2024',
    dueDate: '2024-11-20',
    status: 'completed',
    tags: ['RCC Design', 'IS 456', 'Singly Reinforced Beam', 'Flexure Design', 'Assignment Sheet'],
    description: 'Design a simply supported rectangular beam carrying super-imposed dead load of 15 kN/m and live load of 25 kN/m over a clear span of 6 meters. Concrete grade M20, Steel Fe 415.',
    solutionText: `Step-by-Step Design:
1. Effective Span: leff = min(clear span + d, clear span + width of bearing).
2. Factored Moment:
   Total factored load wu = 1.5 * (Dead load + Live load + Self weight).
   Factored BM (Mu) = wu * leff^2 / 8.
3. Effective Depth Check:
   Mu,lim = 0.138 * fck * b * d^2 (for Fe 415).
   d_required = sqrt(Mu / (0.138 * fck * b)).
4. Steel Area (Ast):
   Ast = (0.5 * fck / fy) * [1 - sqrt(1 - (4.59 * Mu) / (fck * b * d^2))] * b * d.
5. Check for Shear & Development Length (Ld) as per Clause 26.2.1.`,
    authorName: 'Er. Deepak Kumar',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    isPreloaded: true,
  },
  {
    id: 'pre_assign_som_principal_stress',
    type: 'assignment',
    title: 'Assignment #2: Principal Stresses & Mohr’s Circle of Stress Analysis',
    subjectId: 'som',
    subjectName: 'Strength of Materials (SOM)',
    semester: 'Semester 3',
    academicYear: '2024',
    dueDate: '2024-10-30',
    status: 'completed',
    tags: ['SOM', 'Mohr Circle', 'Principal Planes', 'Maximum Shear Stress'],
    description: 'Analytical and graphical Mohr’s Circle solution for an element subjected to tensile stress sigma_x = 120 MPa, compressive stress sigma_y = -40 MPa, and shear tau_xy = 50 MPa.',
    solutionText: `Analytical Formulas:
Major Principal Stress: sigma1 = (sigma_x + sigma_y)/2 + sqrt(((sigma_x - sigma_y)/2)^2 + tau_xy^2)
sigma1 = (120 - 40)/2 + sqrt(((120 - (-40))/2)^2 + 50^2) = 40 + sqrt(80^2 + 50^2) = 40 + 94.34 = 134.34 MPa (Tensile).

Minor Principal Stress: sigma2 = 40 - 94.34 = -54.34 MPa (Compressive).

Maximum Shear Stress: tau_max = (sigma1 - sigma2)/2 = 94.34 MPa.
Orientation of Principal Planes: tan(2*theta_p) = (2 * tau_xy) / (sigma_x - sigma_y) = (2 * 50) / 160 = 0.625.`,
    authorName: 'Er. Deepak Kumar',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    isPreloaded: true,
  }
];

class UnlimitedAcademicStorage {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private memoryFallback: Map<string, AcademicResource> = new Map();
  private blobFallback: Map<string, Blob> = new Map();
  private hasIndexedDB: boolean;

  constructor() {
    this.hasIndexedDB = typeof window !== 'undefined' && 'indexedDB' in window;
    if (!this.hasIndexedDB) {
      console.warn('IndexedDB not supported in this environment, using memory storage.');
      // Pre-seed memory fallback
      PRELOADED_ACADEMIC_RESOURCES.forEach((r) => this.memoryFallback.set(r.id, r));
    }
  }

  private async getDB(): Promise<IDBDatabase> {
    if (!this.hasIndexedDB) {
      throw new Error('IndexedDB not available');
    }

    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        try {
          const request = window.indexedDB.open(DB_NAME, DB_VERSION);

          request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
              const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
              store.createIndex('type', 'type', { unique: false });
              store.createIndex('subjectId', 'subjectId', { unique: false });
              store.createIndex('semester', 'semester', { unique: false });
              store.createIndex('createdAt', 'createdAt', { unique: false });
            }
            if (!db.objectStoreNames.contains(BLOB_STORE_NAME)) {
              db.createObjectStore(BLOB_STORE_NAME);
            }
          };

          request.onsuccess = () => {
            resolve(request.result);
          };

          request.onerror = (e) => {
            console.error('IndexedDB open error:', e);
            reject(request.error || new Error('Failed to open IndexedDB'));
          };
        } catch (err) {
          reject(err);
        }
      });
    }

    return this.dbPromise;
  }

  /**
   * Retrieves all academic resources (merges preloaded items + user items)
   */
  public async getAllResources(): Promise<AcademicResource[]> {
    try {
      if (!this.hasIndexedDB) {
        return Array.from(this.memoryFallback.values()).sort((a, b) => b.createdAt - a.createdAt);
      }

      const db = await this.getDB();
      return new Promise<AcademicResource[]>((resolve) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readonly');
          const store = tx.objectStore(STORE_NAME);
          const request = store.getAll();

          request.onsuccess = () => {
            let storedItems: AcademicResource[] = request.result || [];
            
            // Check if preloaded items already exist in storedItems
            const storedIds = new Set(storedItems.map((item) => item.id));
            const missingPreloaded = PRELOADED_ACADEMIC_RESOURCES.filter(
              (p) => !storedIds.has(p.id)
            );

            // If some preloaded items are missing, seed them silently in background
            if (missingPreloaded.length > 0) {
              this.seedPreloadedResources(db, missingPreloaded).catch(console.error);
              storedItems = [...missingPreloaded, ...storedItems];
            }

            // Sort newest first
            storedItems.sort((a, b) => b.createdAt - a.createdAt);
            resolve(storedItems);
          };

          request.onerror = () => {
            // Graceful fallback to preloaded
            resolve(PRELOADED_ACADEMIC_RESOURCES);
          };
        } catch (err) {
          console.error('Failed reading from IndexedDB', err);
          resolve(PRELOADED_ACADEMIC_RESOURCES);
        }
      });
    } catch (err) {
      console.error('Error in getAllResources:', err);
      return PRELOADED_ACADEMIC_RESOURCES;
    }
  }

  /**
   * Seeds preloaded items into IndexedDB
   */
  private async seedPreloadedResources(db: IDBDatabase, items: AcademicResource[]) {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      for (const item of items) {
        store.put(item);
      }
    } catch (e) {
      // Ignore background seed errors
    }
  }

  /**
   * Saves or updates an academic resource (supports unlimited uploads)
   */
  public async saveResource(resource: AcademicResource): Promise<void> {
    try {
      if (!this.hasIndexedDB) {
        this.memoryFallback.set(resource.id, resource);
        return;
      }

      const db = await this.getDB();
      return new Promise<void>((resolve, reject) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          const request = store.put(resource);

          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error || new Error('Failed to save resource'));
        } catch (err) {
          reject(err);
        }
      });
    } catch (err) {
      console.error('Error saving academic resource:', err);
      // Fallback to memory
      this.memoryFallback.set(resource.id, resource);
    }
  }

  /**
   * Deletes a resource by ID
   */
  public async deleteResource(id: string): Promise<void> {
    try {
      if (!this.hasIndexedDB) {
        this.memoryFallback.delete(id);
        return;
      }

      const db = await this.getDB();
      return new Promise<void>((resolve, reject) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          const request = store.delete(id);

          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error || new Error('Failed to delete resource'));
        } catch (err) {
          reject(err);
        }
      });
    } catch (err) {
      console.error('Error deleting resource:', err);
      this.memoryFallback.delete(id);
    }
  }

  /**
   * Saves a large file as a native Blob into IndexedDB
   */
  public async saveBlob(blobKey: string, blob: Blob): Promise<void> {
    try {
      if (!this.hasIndexedDB) {
        this.blobFallback.set(blobKey, blob);
        return;
      }

      const db = await this.getDB();
      return new Promise<void>((resolve, reject) => {
        try {
          const tx = db.transaction(BLOB_STORE_NAME, 'readwrite');
          const store = tx.objectStore(BLOB_STORE_NAME);
          const request = store.put(blob, blobKey);

          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error || new Error('Failed to save file blob'));
        } catch (err) {
          reject(err);
        }
      });
    } catch (err) {
      console.error('Error saving blob:', err);
      this.blobFallback.set(blobKey, blob);
    }
  }

  /**
   * Retrieves a Blob by key
   */
  public async getBlob(blobKey: string): Promise<Blob | null> {
    try {
      if (!this.hasIndexedDB) {
        return this.blobFallback.get(blobKey) || null;
      }

      const db = await this.getDB();
      return new Promise<Blob | null>((resolve) => {
        try {
          const tx = db.transaction(BLOB_STORE_NAME, 'readonly');
          const store = tx.objectStore(BLOB_STORE_NAME);
          const request = store.get(blobKey);

          request.onsuccess = () => {
            resolve(request.result || null);
          };
          request.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      });
    } catch {
      return null;
    }
  }

  /**
   * Calculates overall storage statistics safely
   */
  public async getStats(): Promise<AcademicStorageStats> {
    const resources = await this.getAllResources();
    let totalBytes = 0;

    let pyqCount = 0;
    let practicalCount = 0;
    let assignmentCount = 0;
    let notesCount = 0;

    for (const r of resources) {
      if (r.type === 'pyq') pyqCount++;
      else if (r.type === 'practical') practicalCount++;
      else if (r.type === 'assignment') assignmentCount++;
      else if (r.type === 'notes') notesCount++;

      if (r.fileAttachment?.size) {
        totalBytes += r.fileAttachment.size;
      }
      totalBytes += (r.title.length + (r.solutionText?.length || 0) + (r.description?.length || 0)) * 2;
    }

    let storageQuotaMB = 50000; // Typically 50GB+ in modern IndexedDB
    try {
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        if (estimate.quota) {
          storageQuotaMB = Math.round(estimate.quota / (1024 * 1024));
        }
      }
    } catch {
      // ignore
    }

    return {
      totalCount: resources.length,
      pyqCount,
      practicalCount,
      assignmentCount,
      notesCount,
      totalBytes,
      storageQuotaMB,
    };
  }

  /**
   * Exports all user resources as a clean JSON backup file
   */
  public async exportBackup(): Promise<void> {
    try {
      const resources = await this.getAllResources();
      const exportData = {
        app: 'Deep Help - Civil Engineering Hub',
        exportDate: new Date().toISOString(),
        version: '1.0',
        totalItems: resources.length,
        resources,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DeepHelp_Academic_Resources_Backup_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error('Failed to export academic resources:', err);
    }
  }

  /**
   * Imports backup JSON file
   */
  public async importBackup(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const raw = e.target?.result as string;
          const parsed = JSON.parse(raw);
          const items: AcademicResource[] = Array.isArray(parsed)
            ? parsed
            : Array.isArray(parsed.resources)
            ? parsed.resources
            : [];

          let count = 0;
          for (const item of items) {
            if (item && item.id && item.title && item.type) {
              await this.saveResource(item);
              count++;
            }
          }
          resolve(count);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed reading backup file'));
      reader.readAsText(file);
    });
  }

  /**
   * Resets resources to initial default state
   */
  public async resetToDefaults(): Promise<void> {
    try {
      if (this.hasIndexedDB) {
        const db = await this.getDB();
        const tx = db.transaction([STORE_NAME, BLOB_STORE_NAME], 'readwrite');
        tx.objectStore(STORE_NAME).clear();
        tx.objectStore(BLOB_STORE_NAME).clear();
      }
      this.memoryFallback.clear();
      this.blobFallback.clear();
      // Re-seed preloaded
      for (const p of PRELOADED_ACADEMIC_RESOURCES) {
        await this.saveResource(p);
      }
    } catch (err) {
      console.error('Error resetting academic storage:', err);
    }
  }
}

export const unlimitedAcademicStorage = new UnlimitedAcademicStorage();
