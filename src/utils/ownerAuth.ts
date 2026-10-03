/**
 * Deep Help Founder & Owner Authentication Service
 * Governs permissions for uploading official academic notes,
 * lab manuals, practicals, and assignments.
 */

import { safeStorage } from './safeStorage';

const OWNER_STORAGE_KEY = 'deephelp_owner_verified';
const OWNER_EMAIL = 'deepak20061122@gmail.com';
const OWNER_NAME = 'Er. Deepak Kumar';

// Authorized Founder Passcodes
const VALID_PASSCODES = ['deepak123', 'deepak2006', 'deepak', 'owner786', 'deepakadmin'];

export class OwnerAuthService {
  private isVerified: boolean;

  constructor() {
    this.isVerified = safeStorage.getItem(OWNER_STORAGE_KEY) === 'true';
  }

  public isOwner(): boolean {
    return this.isVerified;
  }

  public getOwnerInfo() {
    return {
      name: OWNER_NAME,
      email: OWNER_EMAIL,
      role: 'Founder & Academic Director (Diploma From GP Bhagalpur & B.Tech From Saharsa College of Engineering in Civil)',
    };
  }

  public verify(passcode: string): { success: boolean; message: string } {
    const clean = passcode.trim().toLowerCase();
    if (VALID_PASSCODES.includes(clean)) {
      this.isVerified = true;
      safeStorage.setItem(OWNER_STORAGE_KEY, 'true');
      this.notifyChange();
      return {
        success: true,
        message: 'सफलतापूर्वक सत्यापित! आप Deep Help के अधिकृत फाउंडर (Er. Deepak Kumar) हैं।',
      };
    }
    return {
      success: false,
      message: 'गलत फाउंडर पासकोड! कृपया सही कोड (उदा. deepak123) दर्ज करें।',
    };
  }

  public logout(): void {
    this.isVerified = false;
    safeStorage.setItem(OWNER_STORAGE_KEY, 'false');
    this.notifyChange();
  }

  /**
   * Checks if user has permission to upload a specific resource type:
   * - PYQ: Open to all students & engineers!
   * - Practical, Assignment, Notes: Strictly restricted to Owner!
   */
  public canUpload(resourceType: 'pyq' | 'practical' | 'assignment' | 'notes'): {
    allowed: boolean;
    reason?: string;
  } {
    if (resourceType === 'pyq') {
      return { allowed: true };
    }

    if (this.isVerified) {
      return { allowed: true };
    }

    return {
      allowed: false,
      reason: `केवल वेबसाइट के ओनर (Er. Deepak Kumar) ही आधिकारिक ${
        resourceType === 'practical'
          ? 'प्रैक्टिकल लैब फाइल्स'
          : resourceType === 'assignment'
          ? 'असाइनमेंट शीट्स'
          : 'स्टडी नोट्स'
      } अपलोड कर सकते हैं ताकि गलत सामग्री पोस्ट न हो।`,
    };
  }

  private notifyChange() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('deephelp_owner_changed', { detail: { isOwner: this.isVerified } }));
    }
  }
}

export const ownerAuth = new OwnerAuthService();
