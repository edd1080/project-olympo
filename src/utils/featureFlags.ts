export interface FeatureFlags {
  enableManagerRole: boolean;
  enableINVCFeature: boolean;
  enableAuthorizationFlow: boolean;
  enableDevelopmentAccess: boolean;
  enableRoleBasedNavigation: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  enableManagerRole: true,
  enableINVCFeature: true,
  enableAuthorizationFlow: true,
  enableDevelopmentAccess: true,
  enableRoleBasedNavigation: true,
};

class FeatureFlagManager {
  private flags: FeatureFlags;

  constructor() {
    // Load flags from localStorage or use defaults
    const storedFlags = localStorage.getItem('featureFlags');
    this.flags = storedFlags ? { ...DEFAULT_FLAGS, ...JSON.parse(storedFlags) } : DEFAULT_FLAGS;
  }

  isEnabled(flag: keyof FeatureFlags): boolean {
    return this.flags[flag];
  }

  enable(flag: keyof FeatureFlags): void {
    this.flags[flag] = true;
    this.saveFlags();
  }

  disable(flag: keyof FeatureFlags): void {
    this.flags[flag] = false;
    this.saveFlags();
  }

  toggle(flag: keyof FeatureFlags): boolean {
    this.flags[flag] = !this.flags[flag];
    this.saveFlags();
    return this.flags[flag];
  }

  getAllFlags(): FeatureFlags {
    return { ...this.flags };
  }

  setFlags(newFlags: Partial<FeatureFlags>): void {
    this.flags = { ...this.flags, ...newFlags };
    this.saveFlags();
  }

  resetToDefaults(): void {
    this.flags = { ...DEFAULT_FLAGS };
    this.saveFlags();
  }

  private saveFlags(): void {
    localStorage.setItem('featureFlags', JSON.stringify(this.flags));
  }
}

export const featureFlags = new FeatureFlagManager();

// Utility functions for common checks
export const isManagerRoleEnabled = () => featureFlags.isEnabled('enableManagerRole');
export const isINVCFeatureEnabled = () => featureFlags.isEnabled('enableINVCFeature');
export const isAuthorizationFlowEnabled = () => featureFlags.isEnabled('enableAuthorizationFlow');
export const isDevelopmentAccessEnabled = () => featureFlags.isEnabled('enableDevelopmentAccess');
export const isRoleBasedNavigationEnabled = () => featureFlags.isEnabled('enableRoleBasedNavigation');