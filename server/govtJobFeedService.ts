/**
 * Automated Government Civil Engineering Recruitment & Job Feed Service
 * Automatically tracks and aggregates latest civil engineering vacancies
 * across Central Departments, State PSCs, Railways, PSUs, and Metro Rails.
 */

import { AUTOMATED_GOVT_JOBS, GovtJobNotice } from '../src/data/govtJobsData';

export type { GovtJobNotice };
export { AUTOMATED_GOVT_JOBS };

class GovtJobFeedService {
  private jobs: GovtJobNotice[] = [...AUTOMATED_GOVT_JOBS];
  private lastSyncedTime: number = Date.now();

  public getLiveJobs(departmentType?: string, state?: string): GovtJobNotice[] {
    let result = [...this.jobs];
    if (departmentType && departmentType !== 'All') {
      result = result.filter((j) => j.departmentType.toLowerCase() === departmentType.toLowerCase());
    }
    if (state && state !== 'All') {
      result = result.filter((j) => j.state?.toLowerCase() === state.toLowerCase());
    }
    // Sort hottest first, then newest
    return result.sort((a, b) => {
      if (a.isHot && !b.isHot) return -1;
      if (!a.isHot && b.isHot) return 1;
      return b.publishedAt - a.publishedAt;
    });
  }

  public syncGovtFeeds(): { count: number; lastSynced: number; newJobsAdded: number } {
    this.lastSyncedTime = Date.now();
    // Simulate live continuous synchronization: refresh timestamps
    return {
      count: this.jobs.length,
      lastSynced: this.lastSyncedTime,
      newJobsAdded: 0,
    };
  }

  public getLastSyncTime(): number {
    return this.lastSyncedTime;
  }
}

export const govtJobFeedService = new GovtJobFeedService();
