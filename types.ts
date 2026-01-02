
export enum EntryType {
  PASSWORD = 'Password',
  SEED_PHRASE = 'Seed Phrase',
  PIN = 'PIN',
  PATTERN = 'Pattern',
  SECRET_KEY = 'Secret Key'
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
  issuer?: string;
  value: string;
  notes?: string;
  createdAt: number;
  lastModified: number;
}

export type NewEntry = Omit<VaultEntry, 'id' | 'createdAt' | 'lastModified'>;

export interface PortalLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  createdAt: number;
}

export interface ReleaseNote {
  version: string;
  date: string;
  title: string;
  changes: {
    type: 'feature' | 'improvement' | 'fix';
    text: string;
  }[];
}
