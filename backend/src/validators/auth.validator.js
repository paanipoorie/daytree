const { z } = require('zod');

const signupSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }).email('Invalid email address'),
    password: z.string({
      required_error: 'Password is required',
    }).min(6, 'Password must be at least 6 characters long'),
    username: z.string().min(2, 'Username must be at least 2 characters long').max(30, 'Username cannot exceed 30 characters').optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }).email('Invalid email address'),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

module.exports = {
  signupSchema,
  loginSchema,
};
