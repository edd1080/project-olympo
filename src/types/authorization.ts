export interface AuthorizationRequest {
  id: string;
  applicationId: string;
  applicantName: string;
  dpi: string;
  amount: number;
  product: string;
  term: number;
  status: 'pending' | 'approved' | 'rejected' | 'returned' | 'recommended' | 'not_recommended';
  sections: AuthorizationSection[];
  dictamen: Dictamen;
  completionPercentage: number;
  createdDate: string;
  assignedManager?: string;
  businessType: string;
  creditScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  invcResult: string;
  managerRecommendation?: ManagerRecommendation;
}

export interface AuthorizationSection {
  id: string;
  name: string;
  status: 'pending' | 'completed' | 'blocked';
  completionPercentage: number;
  required: boolean;
  order: number;
}

export interface Dictamen {
  creditAmount: number;
  product: string;
  term: number;
  rate: number;
  guarantee: string;
  paymentMethod: string;
  evaluations: {
    sib: EvaluationResult;
    internal: EvaluationResult;
    prequalifier: EvaluationResult;
  };
  paymentCapacity: PaymentCapacityAnalysis;
  signatures: {
    agent: SignatureInfo;
    manager?: SignatureInfo;
  };
}

export interface EvaluationResult {
  score: number;
  status: 'approved' | 'conditional' | 'rejected';
  details: string;
  date: string;
}

export interface PaymentCapacityAnalysis {
  monthlyIncome: number;
  monthlyExpenses: number;
  availableCapacity: number;
  recommendedPayment: number;
  debtToIncomeRatio: number;
  liquidity: number;
  profitability: number;
  currentRatio: number;
  acidRatio: number;
}

export interface SignatureInfo {
  name: string;
  role: string;
  date: string;
  digitallySigned: boolean;
}

export interface AuthorizationAction {
  type: 'approve' | 'return' | 'recommend' | 'not_recommend' | 'authorize' | 'reject';
  comment: string;
  attachments?: File[];
  timestamp: string;
  userId: string;
  userRole: string;
}

export interface ActionFormData {
  decision?: 'yes' | 'no';
  reason: string;
  additionalComments?: string;
}

export interface ManagerRecommendation {
  type: 'recommend' | 'not_recommend';
  reason: string;
  additionalComments?: string;
  date: string;
  managerId: string;
  managerName: string;
}

export interface ValidationResult {
  isValid: boolean;
  blockedReasons: string[];
  warnings: string[];
}

export interface FinancialSummary {
  applicantName: string;
  dpi: string;
  product: string;
  requestedAmount: number;
  term: number;
  monthlyPayment: number;
  interestRate: number;
  guarantee: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  paymentCapacity: number;
  debtToIncomeRatio: number;
}