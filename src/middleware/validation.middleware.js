export const validate = (schema) => (req, res, next) => {
  // Request validation middleware logic
  next();
};

export default validate;
