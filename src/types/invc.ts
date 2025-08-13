export interface EvidencePhoto {
  id: string;
  url: string;
  geoTag?: GeoLocation;
  timestamp: Date;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface InvestigationCardState {
  id: string;
  title: string;
  subtitle?: string;
  status: 'pending' | 'confirmed' | 'mismatch' | 'blocked';
  requiresPhoto?: boolean;
  evidence?: EvidencePhoto[];
  comments?: string;
  timestamp?: Date;
}

export interface Investigation {
  applicationId: string;
  cards: InvestigationCardState[];
  presence: {
    found: boolean;
    rescheduleDate?: Date;
  };
  geoValidation: {
    expectedLocation?: GeoLocation;
    currentLocation?: GeoLocation;
    isValid: boolean;
  };
  progress: {
    completed: number;
    total: number;
    percentage: number;
  };
  discrepancies: {
    count: number;
    critical: number;
  };
  metadata: {
    startedAt: Date;
    completedAt?: Date;
    investigatorId: string;
  };
}

export interface AmountAdjustment {
  originalAmount: number;
  adjustedAmount: number;
  term: number;
  installment: number;
  reason?: string;
}

export interface InvestigationState {
  [applicationId: string]: Investigation;
}