const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Habit = require('../src/models/Habit');
const HabitCompletion = require('../src/models/HabitCompletion');
const { generateToken } = require('../src/utils/jwt');

// Ensure NODE_ENV is set to test
process.env.NODE_ENV = 'test';

describe('Tally Analytics API Integration Tests', () => {
  let dbUser;
  let authToken;

  beforeAll(async () => {
    // Connect to test database
    const testUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/daytree_test';
    await mongoose.connect(testUri);
  });

  afterAll(async () => {
    // Close database connection
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear collections
    await User.deleteMany({});
    await Habit.deleteMany({});
    await HabitCompletion.deleteMany({});

    // Create a default test user
    dbUser = await User.create({
      email: 'test@example.com',
      passwordHash: 'hashed_password_123',
      username: 'testuser',
      isOnboarded: true,
      isVerified: true,
    });

    authToken = generateToken({ id: dbUser._id });
  });

  let RealDate = global.Date;

  afterEach(() => {
    global.Date = RealDate;
  });

  it('should return 401 if request is unauthenticated', async () => {
    const res = await request(app).get('/api/v1/tally');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('handles empty user / new user / no habits scenario', async () => {
    const res = await request(app)
      .get('/api/v1/tally')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();

    const data = res.body.data;
    expect(data.totalHabits).toBe(0);
    expect(data.completedToday).toBe(0);
    expect(data.backlogCount).toBe(0);
    expect(data.currentStreak).toBe(0);
    expect(data.longestStreak).toBe(0);
    expect(data.dailyAverage).toBe(0);

    // Heatmap data should be returned for 91 days
    expect(data.heatmapData).toBeDefined();
    expect(data.heatmapData.length).toBe(91);

    // Verify format of heatmap elements
    const randomDay = data.heatmapData[0];
    expect(randomDay.dateKey).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(randomDay.totalHabits).toBe(0);
    expect(randomDay.completedHabits).toBe(0);
    expect(randomDay.completionRate).toBeNull();
    expect(randomDay.level).toBe('none');
  });

  it('handles user with habits but no completions', async () => {
    // Create habits created 5 days ago (so they are active historically)
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const habit1 = await Habit.create({
      userId: dbUser._id,
      title: 'Drink Water',
      period: 'Morning',
      createdAt: fiveDaysAgo,
    });

    const habit2 = await Habit.create({
      userId: dbUser._id,
      title: 'Read Book',
      period: 'Evening',
      createdAt: fiveDaysAgo,
    });

    const res = await request(app)
      .get('/api/v1/tally')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    const data = res.body.data;
    expect(data.totalHabits).toBe(2);
    expect(data.completedToday).toBe(0);
    expect(data.currentStreak).toBe(0);
    expect(data.longestStreak).toBe(0);
    expect(data.dailyAverage).toBe(0); // 0% average

    // Heatmap should show totalHabits: 2 for recent days
    const todayStr = new Date().toISOString().split('T')[0];
    const todayData = data.heatmapData.find(d => d.dateKey === todayStr);
    expect(todayData).toBeDefined();
    expect(todayData.totalHabits).toBe(2);
    expect(todayData.completedHabits).toBe(0);
    expect(todayData.completionRate).toBe(0);
    expect(todayData.level).toBe('none');
  });

  it('calculates partial and full completion rates correctly', async () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const habit1 = await Habit.create({
      userId: dbUser._id,
      title: 'Run',
      period: 'Morning',
      createdAt: fiveDaysAgo,
    });

    const habit2 = await Habit.create({
      userId: dbUser._id,
      title: 'Meditate',
      period: 'Morning',
      createdAt: fiveDaysAgo,
    });

    // Complete 1 out of 2 habits today (50% completion)
    await HabitCompletion.create({
      userId: dbUser._id,
      habitId: habit1._id,
      date: todayStr,
      completed: true,
    });

    const res = await request(app)
      .get('/api/v1/tally')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    const data = res.body.data;
    expect(data.totalHabits).toBe(2);
    expect(data.completedToday).toBe(1);

    const todayData = data.heatmapData.find(d => d.dateKey === todayStr);
    expect(todayData.completionRate).toBe(50);
    expect(todayData.level).toBe('medium'); // 50-69% -> medium green
  });

  it('calculates streak continuation and resets', async () => {
    // We want to test streaks. We create 1 habit created 10 days ago.
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    const habit = await Habit.create({
      userId: dbUser._id,
      title: 'Pushups',
      period: 'Evening',
      createdAt: tenDaysAgo,
    });

    // Create completion dates
    // Streaks require 100% completion (since there is only 1 habit, completing it gives 100%).
    const getPastDateStr = (daysAgo) => {
      const d = new Date();
      d.setDate(d.getDate() - daysAgo);
      return d.toISOString().split('T')[0];
    };

    // Scenario: Completed on days: T-4, T-3, T-2, T-1, T-0 (current streak = 5)
    for (let i = 0; i < 5; i++) {
      await HabitCompletion.create({
        userId: dbUser._id,
        habitId: habit._id,
        date: getPastDateStr(i),
        completed: true,
      });
    }

    let res = await request(app)
      .get('/api/v1/tally')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.body.data.currentStreak).toBe(5);
    expect(res.body.data.longestStreak).toBe(5);

    // Clear completions
    await HabitCompletion.deleteMany({});

    // Scenario: Completed T-6, T-5, T-4 (streak of 3), missed T-3, completed T-2, T-1, T-0 (streak of 3)
    // Longest streak should be 3, current streak should be 3.
    const streakDays = [6, 5, 4, 2, 1, 0];
    for (const day of streakDays) {
      await HabitCompletion.create({
        userId: dbUser._id,
        habitId: habit._id,
        date: getPastDateStr(day),
        completed: true,
      });
    }

    res = await request(app)
      .get('/api/v1/tally')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.body.data.currentStreak).toBe(3); // T-2, T-1, T-0
    expect(res.body.data.longestStreak).toBe(3); // runningStreak is reset by T-3

    // Clear completions
    await HabitCompletion.deleteMany({});

    // Scenario: Completed T-4, T-3, T-2, missed T-1, missed T-0.
    // Current streak should reset to 0, longest streak should be 3.
    const streakDays2 = [4, 3, 2];
    for (const day of streakDays2) {
      await HabitCompletion.create({
        userId: dbUser._id,
        habitId: habit._id,
        date: getPastDateStr(day),
        completed: true,
      });
    }

    res = await request(app)
      .get('/api/v1/tally')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.body.data.currentStreak).toBe(0); // broken at T-1
    expect(res.body.data.longestStreak).toBe(3); // T-4 to T-2
  });

  it('correctly handles archived habits', async () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const habit1 = await Habit.create({
      userId: dbUser._id,
      title: 'Active Habit',
      period: 'Morning',
      createdAt: fiveDaysAgo,
    });

    const habit2 = await Habit.create({
      userId: dbUser._id,
      title: 'Archived Habit',
      period: 'Morning',
      archived: true,
      createdAt: fiveDaysAgo,
    });

    // Complete active habit today
    await HabitCompletion.create({
      userId: dbUser._id,
      habitId: habit1._id,
      date: todayStr,
      completed: true,
    });

    // Complete archived habit today
    await HabitCompletion.create({
      userId: dbUser._id,
      habitId: habit2._id,
      date: todayStr,
      completed: true,
    });

    const res = await request(app)
      .get('/api/v1/tally')
      .set('Authorization', `Bearer ${authToken}`);

    // Today's summary should ignore the archived habit
    expect(res.body.data.totalHabits).toBe(1); // only active habit
    expect(res.body.data.completedToday).toBe(1); // completed active habit

    // Historically, archived habit was completed today, so it counts as active & completed for today in heatmap
    const todayData = res.body.data.heatmapData.find(d => d.dateKey === todayStr);
    // Since archived habit was completed, it counts. Active habit is also completed.
    // Total habits in heatmap on this day is 2. Both completed. 100% completion rate.
    expect(todayData.totalHabits).toBe(2);
    expect(todayData.completedHabits).toBe(2);
    expect(todayData.completionRate).toBe(100);

    // If we look at yesterday (where archived habit was NOT completed)
    const yesterdayStr = (() => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return d.toISOString().split('T')[0];
    })();
    const yesterdayData = res.body.data.heatmapData.find(d => d.dateKey === yesterdayStr);
    // Archived habit was not completed, so it is ignored. Only active habit is active.
    expect(yesterdayData.totalHabits).toBe(1);
    expect(yesterdayData.completedHabits).toBe(0);
  });

  it('correctly calculates backlog count based on current time', async () => {
    // Mock the current time manually (morning habit ends at 12:00 PM / 720 minutes).
    // Let's set time to 10:00 AM (10 * 60 = 600 minutes).
    let mockTimeStr = '2026-07-02T10:00:00';
    
    global.Date = class extends RealDate {
      constructor(...args) {
        if (args.length > 0) return new RealDate(...args);
        return new RealDate(mockTimeStr);
      }
      static now() {
        return new RealDate(mockTimeStr).getTime();
      }
    };

    const habit1 = await Habit.create({
      userId: dbUser._id,
      title: 'Morning Pushups',
      period: 'Morning',
    });

    const habit2 = await Habit.create({
      userId: dbUser._id,
      title: 'Afternoon Reading',
      period: 'Afternoon', // ends 5:00 PM (1020 minutes)
    });

    let res = await request(app)
      .get('/api/v1/tally')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.body.data.backlogCount).toBe(0); // 10:00 AM is before 12:00 PM and 5:00 PM

    // Set time to 1:00 PM (13:00) -> 13 * 60 = 780 minutes
    // Morning habit (720 min) is now backlogged. Afternoon habit (1020 min) is not.
    mockTimeStr = '2026-07-02T13:00:00';

    res = await request(app)
      .get('/api/v1/tally')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.body.data.backlogCount).toBe(1); // morning habit is backlogged

    // Complete the morning habit. Backlog count should drop to 0.
    const todayStr = '2026-07-02';
    await HabitCompletion.create({
      userId: dbUser._id,
      habitId: habit1._id,
      date: todayStr,
      completed: true,
    });

    res = await request(app)
      .get('/api/v1/tally')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.body.data.backlogCount).toBe(0); // completed, so not in backlog
  });
});
