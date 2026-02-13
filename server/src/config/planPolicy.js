/**
 * Plan Policy – מדיניות מנויים מרכזית
 * Role = הרשאות מערכת (מה מותר לעשות)
 * Plan = איזה תוכן ופיצ'רים זמינים
 */

export const PLANS = {
  basic: {
    maxDevices: 1,
    catalogAccess: 'limited',
    features: ['basicCatalog', 'singleDevice'],
  },
  platinum: {
    maxDevices: 3,
    catalogAccess: 'extended',
    features: ['extendedCatalog', 'multiDevice', 'continueWatching', 'myList'],
  },
  diamond: {
    maxDevices: Infinity,
    catalogAccess: 'full',
    features: ['fullCatalog', 'unlimitedDevices', 'continueWatching', 'myList', 'premium'],
  },
};

export const ROLES = ['user', 'admin', 'content_admin'];

export const TERMS_VERSION = '1.0';

export function getPlanPolicy(plan) {
  return PLANS[plan] || PLANS.basic;
}

export function canAccessMovie(availabilityPlans, userPlan) {
  if (!availabilityPlans || availabilityPlans.length === 0) return true;
  return availabilityPlans.includes(userPlan) || availabilityPlans.includes('basic');
}
