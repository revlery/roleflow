export type JobStatus = "Wishlist" | "Applied" | "Interview";

export interface Job {
  id: string;
  company: string;
  role: string;
  link?: string;
  notes?: string;
  status: JobStatus;
  dateAdded: string; // ISO date string
}

export const STATUSES: JobStatus[] = ["Wishlist", "Applied", "Interview"];
