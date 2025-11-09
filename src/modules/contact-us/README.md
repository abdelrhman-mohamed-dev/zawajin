# Contact Us Module

## Overview

The Contact Us module provides a comprehensive feedback and contact management system for the Zawajin matrimonial platform. It allows users (both authenticated and guest users) to submit messages, feedback, and inquiries, while providing admins with tools to manage and respond to these messages.

## Features

### User Features
- Submit contact messages with optional satisfaction ratings
- Service quality ratings (1-10 scale)
- Satisfaction ratings (1-5 emoji scale)
- View personal message history
- Works for both authenticated and guest users

### Admin Features
- View all contact messages with filtering
- Assign messages to specific admins
- Set priority levels (low, medium, high, urgent)
- Update message status (pending, in_progress, resolved, closed)
- Add admin responses to messages
- View statistics and analytics
- Track average response time

## API Endpoints

### Public Endpoints

#### Submit Contact Message
```
POST /contact-us
```

**Request Body:**
```json
{
  "email": "user@example.com",           // Required for guests
  "name": "Ahmed Mohamed",               // Required for guests
  "message": "I have a question...",     // Required (10-2000 chars)
  "satisfactionRating": 4,               // Optional (1-5)
  "serviceRating": 8                     // Optional (1-10)
}
```

**Response:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "email": "user@example.com",
  "name": "Ahmed Mohamed",
  "message": "I have a question...",
  "satisfactionRating": 4,
  "serviceRating": 8,
  "status": "pending",
  "priority": "medium",
  "createdAt": "2025-01-15T10:00:00Z"
}
```

### Authenticated User Endpoints

#### Get My Messages
```
GET /contact-us/my-messages?page=1&limit=10
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "data": [...],
  "total": 25,
  "page": 1,
  "limit": 10
}
```

### Admin Endpoints

#### Get All Messages (Admin)
```
GET /contact-us?status=pending&priority=high&page=1&limit=10
```

**Query Parameters:**
- `status`: Filter by status (pending, in_progress, resolved, closed)
- `priority`: Filter by priority (low, medium, high, urgent)
- `assignedToAdminId`: Filter by assigned admin
- `userId`: Filter by user ID
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

#### Get Message by ID (Admin)
```
GET /contact-us/:id
```

#### Update Message (Admin)
```
PATCH /contact-us/:id
```

**Request Body:**
```json
{
  "status": "in_progress",
  "priority": "high",
  "assignedToAdminId": "admin-uuid",
  "adminResponse": "We are working on your request..."
}
```

#### Delete Message (Admin)
```
DELETE /contact-us/:id
```

#### Get Statistics (Admin)
```
GET /contact-us/statistics
```

**Response:**
```json
{
  "total": 150,
  "pending": 25,
  "inProgress": 40,
  "resolved": 70,
  "closed": 15,
  "averageResponseTime": 12  // in hours
}
```

## Database Schema

### ContactMessage Entity

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | User who submitted (nullable for guests) |
| email | String | Contact email |
| name | String | Contact name |
| message | Text | Message content (10-2000 chars) |
| satisfactionRating | Enum | Satisfaction rating (1-5) |
| serviceRating | Integer | Service rating (1-10) |
| status | Enum | Message status |
| priority | Enum | Message priority |
| assignedToAdminId | UUID | Assigned admin |
| adminResponse | Text | Admin's response |
| respondedAt | Timestamp | When admin responded |
| metadata | JSONB | Additional data |
| createdAt | Timestamp | Creation timestamp |
| updatedAt | Timestamp | Last update timestamp |

## Enums

### ContactMessageStatus
- `PENDING` - Newly submitted, awaiting review
- `IN_PROGRESS` - Admin is working on it
- `RESOLVED` - Issue has been resolved
- `CLOSED` - Message is closed (no further action)

### ContactMessagePriority
- `LOW` - Low priority
- `MEDIUM` - Medium priority (default)
- `HIGH` - High priority
- `URGENT` - Urgent, requires immediate attention

### SatisfactionRating
- `1` - VERY_DISSATISFIED (😡)
- `2` - DISSATISFIED (😟)
- `3` - NEUTRAL (😐)
- `4` - SATISFIED (😊)
- `5` - VERY_SATISFIED (😁)

## Permissions

### User Roles Required for Admin Endpoints
- `SUPER_ADMIN` - Full access to all operations
- `ADMIN` - Can view, update, and delete messages
- `MODERATOR` - Can view and update messages
- `SUPPORT` - Can view and update messages

## I18n Support

The module supports both English and Arabic translations:
- English: `src/i18n/en/contact-us.json`
- Arabic: `src/i18n/ar/contact-us.json`

## Usage Examples

### Authenticated User Submitting Feedback
```typescript
// User is logged in, email/name auto-filled
const response = await fetch('/contact-us', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: 'Great service! I found my match quickly.',
    satisfactionRating: 5,
    serviceRating: 9
  })
});
```

### Guest User Submitting Contact Message
```typescript
// Guest user must provide email and name
const response = await fetch('/contact-us', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'guest@example.com',
    name: 'Guest User',
    message: 'I have a question about subscription pricing.',
    serviceRating: 7
  })
});
```

### Admin Responding to Message
```typescript
const response = await fetch('/contact-us/message-id', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer <admin_token>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    status: 'resolved',
    priority: 'high',
    adminResponse: 'Thank you for your feedback! We have addressed your concern.'
  })
});
```

## Statistics and Analytics

The statistics endpoint provides insights into:
- Total messages received
- Message distribution by status
- Average response time (in hours)
- Pending vs resolved ratio

This helps admins track their performance and identify bottlenecks in customer support.

## Future Enhancements

Potential improvements:
- Email notifications to users when admin responds
- Attachment support for messages
- Categorization/tagging system for messages
- Integration with notification system for real-time alerts
- Auto-close messages after certain period
- Canned responses for common queries
- SLA tracking and alerts
