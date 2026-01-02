
export enum EntryType {
  PASSWORD = 'Password',
  SEED_PHRASE = 'Seed Phrase',
  PIN = 'PIN',
  PATTERN = 'Pattern'
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface VaultEntry {
  id: string;
  title: string;
  type: EntryType;
  categoryId: string;
  username?: string;
  value: string;
  notes?: string;
  createdAt: number;
  lastModified: number;
}

export type NewEntry = Omit<VaultEntry, 'id' | 'createdAt' | 'lastModified'>;

// Added PortalLink interface to support the portal/website links feature
export interface PortalLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  createdAt: number;
}
