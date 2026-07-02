const { z } = require('zod');

const createHabitSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }).min(1, 'Title cannot be empty').max(100, 'Title cannot exceed 100 characters'),
    period: z.enum(['Morning', 'Afternoon', 'Evening', 'Night'], {
      required_error: 'Period is required',
      invalid_type_error: 'Period must be one of: Morning, Afternoon, Evening, Night',
    }),
  }),
});

const updateHabitSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid habit ID format'),
  }),
  body: z.object({
    title: z.string().min(1, 'Title cannot be empty').max(100, 'Title cannot exceed 100 characters').optional(),
    period: z.enum(['Morning', 'Afternoon', 'Evening', 'Night']).optional(),
    archived: z.boolean().optional(),
  }),
});

const deleteHabitSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid habit ID format'),
  }),
});

const toggleHabitCompletionSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid habit ID format'),
  }),
  body: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in format YYYY-MM-DD').optional(),
  }),
});

module.exports = {
  createHabitSchema,
  updateHabitSchema,
  deleteHabitSchema,
  toggleHabitCompletionSchema,
};
