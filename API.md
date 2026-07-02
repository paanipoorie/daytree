# DayTree API Reference

All requests and responses use JSON formatting (except file uploads) and are prefixed with `/api/v1`.

Every response includes a unique `requestId` in the header `X-Request-Id` and inside error response bodies.

---

## 🔒 Authentication (`/api/v1/auth`)

### 1. Register User
* **Endpoint**: `POST /api/v1/auth/signup`
* **Auth Required**: No
* **Request Body**:
  ```json
  {
    "username": "janesmith",
    "email": "jane@example.com",
    "password": "Password123!"
  }
  ```
* **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "6a45ee399253cd1d7298e546",
        "email": "jane@example.com",
        "username": "janesmith",
        "profilePicture": null,
        "isOnboarded": false,
        "createdAt": "2026-07-02T04:51:05.820Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```
* **Error Response (409 Conflict)**:
  ```json
  {
    "success": false,
    "message": "Email is already registered",
    "errors": [],
    "requestId": "fc3c1dfd-6cca-4698-93a3-9bed785f2e63"
  }
  ```

### 2. Login User
* **Endpoint**: `POST /api/v1/auth/login`
* **Auth Required**: No
* **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "Password123!"
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Logged in successfully",
    "data": {
      "user": {
        "id": "6a45ee399253cd1d7298e546",
        "email": "jane@example.com",
        "username": "janesmith",
        "profilePicture": null,
        "isOnboarded": false,
        "createdAt": "2026-07-02T04:51:05.820Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```
* **Error Response (401 Unauthorized)**:
  ```json
  {
    "success": false,
    "message": "Invalid email or password",
    "errors": [],
    "requestId": "7cd80475-8767-4ad2-ae92-da1e57b09020"
  }
  ```

### 3. Get Current User Session
* **Endpoint**: `GET /api/v1/auth/me`
* **Auth Required**: Yes (Bearer Token)
* **Headers**: `Authorization: Bearer <token>`
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "User details retrieved successfully",
    "data": {
      "user": {
        "id": "6a45ee399253cd1d7298e546",
        "email": "jane@example.com",
        "username": "janesmith",
        "profilePicture": {
          "url": "https://res.cloudinary.com/demo/image/upload/v1234/profile.jpg",
          "publicId": "daytree_profiles/abc123xyz"
        },
        "isOnboarded": true,
        "createdAt": "2026-07-02T04:51:05.820Z"
      }
    }
  }
  ```

### 4. Logout User
* **Endpoint**: `POST /api/v1/auth/logout`
* **Auth Required**: Yes (Bearer Token)
* **Headers**: `Authorization: Bearer <token>`
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Logged out successfully",
    "data": {}
  }
  ```

---

## 👤 Users (`/api/v1/users`)

### 1. Setup / Update Profile
* **Endpoint**: `POST /api/v1/users/setup-profile`
* **Auth Required**: Yes (Bearer Token)
* **Content-Type**: `multipart/form-data`
* **Form Parameters**:
  * `username` (string, required): New username.
  * `profilePicture` (file, optional): Profile picture image.
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Profile setup completed successfully",
    "data": {
      "user": {
        "id": "6a45ee399253cd1d7298e546",
        "email": "jane@example.com",
        "username": "janesmith_updated",
        "profilePicture": {
          "url": "https://res.cloudinary.com/demo/image/upload/v1234/profile.jpg",
          "publicId": "daytree_profiles/abc123xyz"
        },
        "isOnboarded": true,
        "createdAt": "2026-07-02T04:51:05.820Z"
      }
    }
  }
  ```

---

## 🌿 Habits (`/api/v1/habits`)

### 1. Get All Active Habits
* **Endpoint**: `GET /api/v1/habits`
* **Auth Required**: Yes (Bearer Token)
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Habits retrieved successfully",
    "data": {
      "habits": [
        {
          "id": "6a45ee385561cc3233af5922",
          "name": "Drink water",
          "time": "morning",
          "createdAt": "2026-07-02",
          "completedDates": ["2026-07-02"]
        }
      ]
    }
  }
  ```

### 2. Create Habit
* **Endpoint**: `POST /api/v1/habits`
* **Auth Required**: Yes (Bearer Token)
* **Request Body**:
  ```json
  {
    "title": "Drink water",
    "period": "Morning"
  }
  ```
* **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Habit created successfully",
    "data": {
      "habit": {
        "id": "6a45ee385561cc3233af5922",
        "name": "Drink water",
        "time": "morning",
        "createdAt": "2026-07-02",
        "completedDates": []
      }
    }
  }
  ```

### 3. Update Habit
* **Endpoint**: `PATCH /api/v1/habits/:id`
* **Auth Required**: Yes (Bearer Token)
* **Request Body** (optional fields):
  ```json
  {
    "title": "Read a book",
    "period": "Night"
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Habit updated successfully",
    "data": {
      "habit": {
        "id": "6a45ee385561cc3233af5922",
        "name": "Read a book",
        "time": "night",
        "createdAt": "2026-07-02",
        "completedDates": []
      }
    }
  }
  ```

### 4. Delete / Archive Habit
* **Endpoint**: `DELETE /api/v1/habits/:id`
* **Auth Required**: Yes (Bearer Token)
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Habit deleted successfully",
    "data": {
      "id": "6a45ee385561cc3233af5922"
    }
  }
  ```

### 5. Toggle Completion
* **Endpoint**: `POST /api/v1/habits/:id/toggle`
* **Auth Required**: Yes (Bearer Token)
* **Request Body**:
  ```json
  {
    "date": "2026-07-02"
  }
  ```
  *(If date is omitted, it defaults to server's current date in `YYYY-MM-DD`)*
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Habit completion toggled successfully",
    "data": {
      "habitId": "6a45ee385561cc3233af5922",
      "date": "2026-07-02",
      "completed": true
    }
  }
  ```

---

## 📊 Tally Analytics (`/api/v1/tally`)

### 1. Get Consistency Metrics
* **Endpoint**: `GET /api/v1/tally`
* **Auth Required**: Yes (Bearer Token)
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Tally analytics retrieved successfully",
    "data": {
      "dailyAverage": 78,
      "totalHabits": 4,
      "completedToday": 3,
      "backlogCount": 1,
      "currentStreak": 5,
      "longestStreak": 14,
      "heatmapData": [
        {
          "date": "2026-07-01",
          "count": 3,
          "total": 4,
          "completionRate": 75
        },
        {
          "date": "2026-07-02",
          "count": 3,
          "total": 4,
          "completionRate": 75
        }
      ]
    }
  }
  ```

---

## 🩺 System (`/api/v1/health`)

### 1. Health Status
* **Endpoint**: `GET /api/v1/health`
* **Auth Required**: No
* **Success Response (200 OK)**:
  ```json
  {
    "status": "ok",
    "uptime": 2304.54,
    "environment": "production",
    "timestamp": "2026-07-02T04:52:00.123Z"
  }
  ```
