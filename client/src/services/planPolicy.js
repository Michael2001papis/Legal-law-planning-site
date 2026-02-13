export const PLANS = {
  basic: { maxDevices: 1 },
  platinum: { maxDevices: 3 },
  diamond: { maxDevices: Infinity },
};

export function getPlanPolicy(plan) {
  return PLANS[plan] || PLANS.basic;
}
