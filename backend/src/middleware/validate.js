const { sendError } = require('../utils/apiResponse');

const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    // Replace req properties with validated, parsed data only if present in schema
    if (parsed.body !== undefined) req.body = parsed.body;
    if (parsed.query !== undefined) req.query = parsed.query;
    if (parsed.params !== undefined) req.params = parsed.params;
    
    next();
  } catch (error) {
    const errorsList = error.errors ? error.errors.map(err => ({
      field: err.path.join('.').replace('body.', '').replace('query.', '').replace('params.', ''),
      message: err.message
    })) : [{ message: error.message }];

    return sendError(res, 'Validation failed', errorsList, 400);
  }
};

module.exports = validate;
