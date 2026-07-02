const { z } = require('zod');

const profileUpdateSchema = z.object({
  body: z.object({
    username: z.string({
      required_error: 'Username is required',
    }).min(2, 'Username must be at least 2 characters long').max(30, 'Username cannot exceed 30 characters'),
  }),
});

module.exports = {
  profileUpdateSchema,
};
