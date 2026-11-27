module.exports = function validate(schema) {
  return function (req, res, next) {
    const result = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (result.error) {
      return res.status(400).json({
        message: result.error.details.map(item => item.message).join(', ')
      });
    }

    req.body = result.value;
    next();
  };
};
