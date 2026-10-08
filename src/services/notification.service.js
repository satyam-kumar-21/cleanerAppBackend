export const notificationService = {
  findAll: async () => [],
  findById: async (id) => ({ id }),
  create: async (data) => ({ ...data, id: Date.now().toString() }),
  update: async (id, data) => ({ id, ...data }),
  remove: async (id) => ({ id, deleted: true })
};

export default notificationService;
