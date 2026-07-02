const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Habit = require('../src/models/Habit');
const HabitCompletion = require('../src/models/HabitCompletion');
const { generateToken } = require('../src/utils/jwt');

process.env.NODE_ENV = 'test';

describe('Habit Completions API Integration Tests', () => {
  let user1, user2;
  let token1, token2;
  let habit;

  beforeAll(async () => {
    const testUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/daytree_test';
    await mongoose.connect(testUri);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Habit.deleteMany({});
    await HabitCompletion.deleteMany({});

    user1 = await User.create({
      email: 'user1@example.com',
      passwordHash: 'hashed1',
      username: 'user1',
      isVerified: true,
    });

    user2 = await User.create({
      email: 'user2@example.com',
      passwordHash: 'hashed2',
      username: 'user2',
      isVerified: true,
    });

    token1 = generateToken({ id: user1._id });
    token2 = generateToken({ id: user2._id });

    habit = await Habit.create({
      userId: user1._id,
      title: 'Workout',
      period: 'Morning',
    });
  });

  describe('POST /api/v1/habits/:id/toggle', () => {
    it('creates a new completed completion record if none existed', async () => {
      const res = await request(app)
        .post(`/api/v1/habits/${habit._id}/toggle`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ date: '2026-07-02' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.completed).toBe(true);
      expect(res.body.data.date).toBe('2026-07-02');

      // Verify in DB
      const completion = await HabitCompletion.findOne({
        userId: user1._id,
        habitId: habit._id,
        date: '2026-07-02',
      });
      expect(completion).toBeDefined();
      expect(completion.completed).toBe(true);
    });

    it('toggles an existing completed completion to false', async () => {
      // Setup existing completion
      await HabitCompletion.create({
        userId: user1._id,
        habitId: habit._id,
        date: '2026-07-02',
        completed: true,
      });

      const res = await request(app)
        .post(`/api/v1/habits/${habit._id}/toggle`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ date: '2026-07-02' });

      expect(res.status).toBe(200);
      expect(res.body.data.completed).toBe(false);

      const completion = await HabitCompletion.findOne({
        userId: user1._id,
        habitId: habit._id,
        date: '2026-07-02',
      });
      expect(completion.completed).toBe(false);
    });

    it('prevents user from toggling another user\'s habit completion', async () => {
      const res = await request(app)
        .post(`/api/v1/habits/${habit._id}/toggle`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ date: '2026-07-02' });

      expect(res.status).not.toBe(200);
      expect(res.body.success).toBe(false);
    });

    it('fails if date format is invalid', async () => {
      const res = await request(app)
        .post(`/api/v1/habits/${habit._id}/toggle`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ date: 'invalid-date' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('handles race conditions gracefully via Mongoose unique compound index', async () => {
      // The compound unique index on userId_habitId_date is set in HabitCompletion.js.
      // If two concurrent requests try to create a completion for the same user, habit, and date:
      // one will win, and the other will get a duplicate key error (code 11000).
      // The toggleHabitCompletion service catches this and falls back to finding the winner's document and toggling it.
      // Let's call the service directly with mock clashing requests, or verify that the unique index is indeed in place.
      const indexObj = HabitCompletion.schema.indexes().find(idx => {
        return idx[0].userId === 1 && idx[0].habitId === 1 && idx[0].date === 1 && idx[1].unique === true;
      });
      expect(indexObj).toBeDefined();

      // Let's trigger a manual toggle double-call to simulate clash / toggle flow
      const service = require('../src/services/habit.service');
      
      // Parallel execution simulation:
      const p1 = service.toggleHabitCompletion(user1._id, habit._id, '2026-07-02');
      const p2 = service.toggleHabitCompletion(user1._id, habit._id, '2026-07-02');
      
      const [res1, res2] = await Promise.all([p1, p2]);
      
      // One of them creates the completion (completed: true), the other catches duplicate error and toggles it back to false
      // So the final state in the database should be either completed or not, depending on execution order, but BOTH should succeed without crashing!
      expect(res1).toBeDefined();
      expect(res2).toBeDefined();
      
      // Verify that a document was created and no error was thrown
      const count = await HabitCompletion.countDocuments({
        userId: user1._id,
        habitId: habit._id,
        date: '2026-07-02',
      });
      expect(count).toBe(1);
    });
  });
});
