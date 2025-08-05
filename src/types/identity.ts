export type VerificationStep = 'welcome' | 'dpi-front' | 'dpi-back' | 'selfie' | 'processing' | 'success' | 'error';

export interface IdentityData {
  cui: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  address: string;
}

export interface CaptureData {
  dpiFrontURL?: string;
  dpiBackURL?: string;
  selfieURL?: string;
}

export interface VerificationState {
  currentStep: VerificationStep;
  captures: CaptureData;
  identityData?: IdentityData;
  error?: string;
}