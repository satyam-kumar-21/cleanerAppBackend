import { getSubscriptionPlans } from "../services/subscription.service.js";

export const getPlan = (req, res) => {
  return res.status(200).json({
    success: true,
    data: { plans: getSubscriptionPlans() },
  });
};

export default { getPlan };
