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

const sendOtpSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }).email('Invalid email address'),
  }),
});

const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }).email('Invalid email address'),
    otp: z.string({
      required_error: 'OTP is required',
    }).length(6, 'OTP must be exactly 6 digits'),
  }),
});

const resendOtpSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }).email('Invalid email address'),
  }),
});

const googleLoginSchema = z.object({
  body: z.object({
    token: z.string().optional(),
    idToken: z.string().optional(),
  }).refine(data => data.token || data.idToken, {
    message: 'Either token or idToken must be provided',
    path: ['token'],
  }),
});

module.exports = {
  signupSchema,
  loginSchema,
  sendOtpSchema,
  verifyOtpSchema,
  resendOtpSchema,
  googleLoginSchema,
};
