# API Reference

Complete documentation of all available API endpoints.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All endpoints (except login/signup) require authentication via JWT token in headers:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Auth Endpoints

#### Sign Up
```
POST /auth/signup

Body:
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe"
}

Response (201):
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login
```
POST /auth/login

Body:
{
  "email": "user@example.com",
  "password": "securepassword"
}

Response (200):
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Get Current User
```
GET /auth/me

Headers:
Authorization: Bearer <token>

Response (200):
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "avatar_url": null,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Project Endpoints

#### Create Project
```
POST /projects

Headers:
Authorization: Bearer <token>

Body:
{
  "name": "Website Redesign",
  "description": "Redesign company website"
}

Response (201):
{
  "message": "Project created successfully",
  "project": {
    "id": "uuid",
    "name": "Website Redesign",
    "description": "Redesign company website",
    "owner_id": "uuid",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Get All Projects
```
GET /projects?limit=50&offset=0

Headers:
Authorization: Bearer <token>

Query Parameters:
- limit (optional): Number of projects to return (default: 50)
- offset (optional): Pagination offset (default: 0)

Response (200):
{
  "projects": [
    {
      "id": "uuid",
      "name": "Website Redesign",
      "description": "Redesign company website",
      "owner_id": "uuid",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Get Project Details
```
GET /projects/:projectId

Headers:
Authorization: Bearer <token>

Response (200):
{
  "project": {
    "id": "uuid",
    "name": "Website Redesign",
    "description": "Redesign company website",
    "owner_id": "uuid",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "stats": {
    "total_tasks": "15",
    "todo_tasks": "8",
    "in_progress_tasks": "4",
    "in_review_tasks": "2",
    "done_tasks": "1",
    "overdue_tasks": "2"
  }
}
```

#### Update Project
```
PUT /projects/:projectId

Headers:
Authorization: Bearer <token>

Body:
{
  "name": "Website Redesign v2",
  "description": "Complete website redesign with new features"
}

Response (200):
{
  "message": "Project updated successfully",
  "project": {
    "id": "uuid",
    "name": "Website Redesign v2",
    "description": "Complete website redesign with new features",
    "owner_id": "uuid",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-02T00:00:00Z"
  }
}
```

#### Delete Project
```
DELETE /projects/:projectId

Headers:
Authorization: Bearer <token>

Response (200):
{
  "message": "Project deleted successfully"
}
```

### Task Endpoints

#### Create Task
```
POST /projects/:projectId/tasks

Headers:
Authorization: Bearer <token>

Body:
{
  "title": "Design Homepage",
  "description": "Create mockups for homepage redesign",
  "priority": "HIGH",
  "dueDate": "2024-02-01",
  "assignedTo": "user-uuid"
}

Response (201):
{
  "message": "Task created successfully",
  "task": {
    "id": "uuid",
    "project_id": "uuid",
    "title": "Design Homepage",
    "description": "Create mockups for homepage redesign",
    "status": "TODO",
    "priority": "HIGH",
    "assigned_to": "user-uuid",
    "assigned_by": "current-user-uuid",
    "due_date": "2024-02-01",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Get Project Tasks
```
GET /projects/:projectId/tasks?status=TODO&priority=HIGH&limit=50&offset=0

Headers:
Authorization: Bearer <token>

Query Parameters:
- status (optional): Filter by status (TODO, IN_PROGRESS, IN_REVIEW, DONE)
- priority (optional): Filter by priority (LOW, MEDIUM, HIGH, URGENT)
- assignedTo (optional): Filter by assigned user ID
- overdue (optional): Filter for overdue tasks (true/false)
- limit (optional): Number of tasks to return (default: 50)
- offset (optional): Pagination offset (default: 0)

Response (200):
{
  "tasks": [
    {
      "id": "uuid",
      "project_id": "uuid",
      "title": "Design Homepage",
      "description": "Create mockups",
      "status": "TODO",
      "priority": "HIGH",
      "assigned_to": "user-uuid",
      "assigned_by": "current-user-uuid",
      "due_date": "2024-02-01",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Get My Tasks
```
GET /my-tasks?limit=50&offset=0

Headers:
Authorization: Bearer <token>

Query Parameters:
- limit (optional): Number of tasks to return (default: 50)
- offset (optional): Pagination offset (default: 0)

Response (200):
{
  "tasks": [
    {
      "id": "uuid",
      "project_id": "uuid",
      "title": "Design Homepage",
      "description": "Create mockups",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "assigned_to": "current-user-uuid",
      "due_date": "2024-02-01",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Update Task
```
PUT /tasks/:taskId

Headers:
Authorization: Bearer <token>

Body:
{
  "status": "IN_PROGRESS",
  "priority": "URGENT",
  "dueDate": "2024-01-31"
}

Response (200):
{
  "message": "Task updated successfully",
  "task": {
    "id": "uuid",
    "project_id": "uuid",
    "title": "Design Homepage",
    "description": "Create mockups",
    "status": "IN_PROGRESS",
    "priority": "URGENT",
    "assigned_to": "user-uuid",
    "due_date": "2024-01-31",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-02T00:00:00Z"
  }
}
```

#### Delete Task
```
DELETE /tasks/:taskId

Headers:
Authorization: Bearer <token>

Response (200):
{
  "message": "Task deleted successfully"
}
```

### Team Member Endpoints

#### Add Team Member
```
POST /projects/:projectId/members

Headers:
Authorization: Bearer <token>

Body:
{
  "userId": "user-uuid",
  "role": "MEMBER"
}

Response (201):
{
  "message": "Member added successfully",
  "member": {
    "id": "uuid",
    "project_id": "uuid",
    "user_id": "user-uuid",
    "role": "MEMBER",
    "joined_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Get Project Members
```
GET /projects/:projectId/members

Headers:
Authorization: Bearer <token>

Response (200):
{
  "members": [
    {
      "id": "uuid",
      "project_id": "uuid",
      "user_id": "user-uuid",
      "role": "ADMIN",
      "joined_at": "2024-01-01T00:00:00Z",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "avatar_url": null
    }
  ]
}
```

#### Update Member Role
```
PUT /projects/:projectId/members/:userId

Headers:
Authorization: Bearer <token>

Body:
{
  "role": "ADMIN"
}

Response (200):
{
  "message": "Role updated successfully",
  "member": {
    "id": "uuid",
    "project_id": "uuid",
    "user_id": "user-uuid",
    "role": "ADMIN",
    "joined_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Remove Team Member
```
DELETE /projects/:projectId/members/:userId

Headers:
Authorization: Bearer <token>

Response (200):
{
  "message": "Member removed successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": [
    {
      "msg": "Invalid email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied"
}
```

### 404 Not Found
```json
{
  "error": "Project not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input or validation error
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - User doesn't have permission
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Rate Limiting

Currently no rate limiting is implemented. In production, consider adding:
- Per-IP rate limiting
- Per-user request limits
- Endpoint-specific limits

---

For more information, see [README.md](./README.md)
