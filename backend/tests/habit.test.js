const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Habit = require('../src/models/Habit');
const { generateToken } = require('../src/utils/jwt');

process.env.NODE_ENV = 'test';

describe('Habits API Integration Tests', () => {
  let user1, user2;
  let token1, token2;

  beforeAll(async () => {
    const testUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/daytree_test';
    await mongoose.connect(testUri);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Habit.deleteMany({});

    user1 = await User.create({
      email: 'user1@example.com',
      passwordHash: 'hashed1',
      username: 'user1',
    });

    user2 = await User.create({
      email: 'user2@example.com',
      passwordHash: 'hashed2',
      username: 'user2',
    });

    token1 = generateToken({ id: user1._id });
    token2 = generateToken({ id: user2._id });
  });

  describe('POST /api/v1/habits', () => {
    it('creates a habit for authenticated user with valid details', async () => {
      const res = await request(app)
        .post('/api/v1/habits')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          title: 'Drink water',
          period: 'Morning',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.habit.name).toBe('Drink water');
      expect(res.body.data.habit.time).toBe('morning');
    });

    it('fails if title is missing', async () => {
      const res = await request(app)
        .post('/api/v1/habits')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          period: 'Morning',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('fails if period is invalid', async () => {
      const res = await request(app)
        .post('/api/v1/habits')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          title: 'Drink water',
          period: 'Midnight', // Invalid
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/habits', () => {
    it('lists only active (non-archived) habits for the authenticated user', async () => {
      // Habit for user1
      await Habit.create({
        userId: user1._id,
        title: 'Active Habit 1',
        period: 'Morning',
      });

      // Archived habit for user1
      await Habit.create({
        userId: user1._id,
        title: 'Archived Habit',
        period: 'Afternoon',
        archived: true,
      });

      // Habit for user2
      await Habit.create({
        userId: user2._id,
        title: 'User 2 Habit',
        period: 'Evening',
      });

      const res = await request(app)
        .get('/api/v1/habits')
        .set('Authorization', `Bearer ${token1}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.habits.length).toBe(1);
      expect(res.body.data.habits[0].name).toBe('Active Habit 1');
    });
  });

  describe('PATCH /api/v1/habits/:id', () => {
    let habit;

    beforeEach(async () => {
      habit = await Habit.create({
        userId: user1._id,
        title: 'Gym',
        period: 'Evening',
      });
    });

    it('updates own habit', async () => {
      const res = await request(app)
        .patch(`/api/v1/habits/${habit._id}`)
        .set('Authorization', `Bearer ${token1}`)
        .send({
          title: 'Weight lifting',
          period: 'Night',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.habit.name).toBe('Weight lifting');
      expect(res.body.data.habit.time).toBe('night');
    });

    it('prevents user from updating another user\'s habit (ownership validation)', async () => {
      const res = await request(app)
        .patch(`/api/v1/habits/${habit._id}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({
          title: 'Hack account',
        });

      // Wait, how does ownership validation behave?
      // In updateHabit in habit.service:
      // const habit = await Habit.findOneAndUpdate({ _id: habitId, userId }, ...)
      // If habit is not found or does not belong to the user, findOneAndUpdate returns null, and it throws Error('Habit not found') with status 500 or 404 (caught by error handler).
      // Let's check standard behavior of error handler (should return failure code like 404 or 500). Let's assert res.status !== 200 and success is false.
      expect(res.status).not.toBe(200);
      expect(res.body.success).toBe(false);
    });

    it('fails if ID format is invalid', async () => {
      const res = await request(app)
        .patch('/api/v1/habits/invalid-id')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          title: 'Weight lifting',
        });

      expect(res.status).toBe(400); // validated by delete/update Zod schema regex
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/habits/:id', () => {
    let habit;

    beforeEach(async () => {
      habit = await Habit.create({
        userId: user1._id,
        title: 'Snack',
        period: 'Afternoon',
      });
    });

    it('soft deletes own habit by archiving it', async () => {
      const res = await request(app)
        .delete(`/api/v1/habits/${habit._id}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify in DB that archived is set to true
      const dbHabit = await Habit.findById(habit._id);
      expect(dbHabit.archived).toBe(true);
    });

    it('prevents user from deleting another user\'s habit', async () => {
      const res = await request(app)
        .delete(`/api/v1/habits/${habit._id}`)
        .set('Authorization', `Bearer ${token2}`);

      expect(res.status).not.toBe(200);
      expect(res.body.success).toBe(false);

      const dbHabit = await Habit.findById(habit._id);
      expect(dbHabit.archived).toBe(false);
    });
  });
});
