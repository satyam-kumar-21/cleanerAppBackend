export const stripeService = {
  createCustomer: async (data) => ({ customerId: 'mock_stripe_cust' }),
  createSubscription: async (data) => ({ subscriptionId: 'mock_sub' })
};

export default stripeService;
