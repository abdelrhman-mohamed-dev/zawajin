# Real-Time Features Implementation Guide

This document describes the real-time features implementation including online status tracking and socket-based notifications across the entire application.

## Table of Contents

1. [Overview](#overview)
2. [Real-Time Online Status](#real-time-online-status)
3. [Socket-Based Notifications](#socket-based-notifications)
4. [Client Integration Guide](#client-integration-guide)
5. [API Reference](#api-reference)
6. [Event Reference](#event-reference)
7. [Testing](#testing)

---

## Overview

The application now supports comprehensive real-time features powered by Socket.IO:

### Key Features
- **Global Online Status Broadcasting**: Online/offline status changes are broadcasted to ALL connected clients in real-time
- **Hybrid Notification System**: Notifications are sent via Socket.IO (if online) and/or Firebase Cloud Messaging (if offline)
- **Manual Status Control**: Users can manually set their online/offline status via REST API, which broadcasts to all clients
- **Automatic Status Updates**: Connection and disconnection automatically update and broadcast status
- **Backward Compatibility**: Legacy events (`user_online`, `user_offline`) are still emitted for existing clients

---

## Real-Time Online Status

### How It Works

The online status system operates through multiple channels:

#### 1. **Automatic Status Updates (Socket Connection/Disconnection)**

When a user connects to the WebSocket:
```typescript
// User connects → JWT verified → Set online → Broadcast to ALL clients
handleConnection(client: Socket)
  ↓
  userPresenceRepository.setUserOnline(userId, socketId)
  ↓
  broadcastUserStatusChange(userId, true)
  ↓
  ALL clients receive: 'user_status_changed' event
```

When a user disconnects:
```typescript
// User disconnects → Set offline → Broadcast to ALL clients
handleDisconnect(client: Socket)
  ↓
  userPresenceRepository.setUserOffline(userId)
  ↓
  broadcastUserStatusChange(userId, false)
  ↓
  ALL clients receive: 'user_status_changed' event
```

#### 2. **Manual Status Updates (REST API)**

Users can manually control their online status:

**Endpoint**: `POST /users/status`

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body**:
```json
{
  "isOnline": true
}
```

**Response**:
```json
{
  "success": true,
  "message": "User status updated successfully",
  "data": {
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "isOnline": true,
    "lastSeenAt": "2024-01-15T10:30:00.000Z",
    "socketId": null
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**What Happens**:
1. User status is updated in the database
2. Status change is **broadcasted to ALL connected clients via Socket.IO**
3. All clients receive the `user_status_changed` event

**Use Cases**:
- User goes "invisible" mode
- User manually sets themselves as "away"
- User wants to appear online even when app is in background

### Database Schema

**Table**: `user_presence`

```sql
CREATE TABLE user_presence (
  userId UUID PRIMARY KEY,
  socketId VARCHAR(255),
  isOnline BOOLEAN DEFAULT true,
  lastSeenAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Events Emitted

#### New Event (Recommended)
**Event**: `user_status_changed`

**Payload**:
```typescript
{
  userId: string;
  isOnline: boolean;
  timestamp: string; // ISO 8601 format
}
```

**Scope**: Broadcasted to ALL connected clients

#### Legacy Events (Backward Compatibility)
**Events**: `user_online` | `user_offline`

**Payload**:
```typescript
{
  userId: string;
  timestamp: string;
}
```

**Scope**: Broadcasted to ALL connected clients

---

## Socket-Based Notifications

### Architecture

The new notification system uses a **hybrid approach**:

```
User Action
    ↓
NotificationsService.sendNotification()
    ↓
    ├─→ Check user online status
    │   ├─→ If ONLINE: Send via Socket.IO ✓
    │   └─→ If OFFLINE: Send via FCM Push ✓
    └─→ Return delivery status
```

### NotificationsService API

#### 1. **Send Hybrid Notification** (Socket + FCM Fallback)

```typescript
await notificationsService.sendNotification(
  userId: string,
  fcmToken: string | null,
  notification: {
    type: NotificationType,
    title: string,
    body: string,
    data?: Record<string, any>
  },
  forcePush?: boolean // Default: false
)

// Returns: { socketSent: boolean, pushSent: boolean }
```

**Behavior**:
- If user is **online**: Sends via Socket.IO
- If user is **offline**: Sends via FCM
- If `forcePush = true`: Sends both Socket.IO (if online) AND FCM

**Example**:
```typescript
import { NotificationsService, NotificationType } from './notifications/services/notifications.service';

// In your service
await this.notificationsService.sendNotification(
  recipientUserId,
  recipientFcmToken,
  {
    type: NotificationType.NEW_MESSAGE,
    title: 'New Message',
    body: 'You have a new message from Ahmed',
    data: {
      conversationId: 'abc-123',
      senderId: 'user-456',
    }
  }
);
```

#### 2. **Send Bulk Notifications**

```typescript
await notificationsService.sendBulkNotifications(
  recipients: Array<{ userId: string; fcmToken: string | null }>,
  notification: NotificationPayload
)

// Returns: { socketSentCount: number, pushSentCount: number }
```

**Example**:
```typescript
// Send to multiple users (e.g., all matched users)
await this.notificationsService.sendBulkNotifications(
  matchedUsers.map(user => ({
    userId: user.id,
    fcmToken: user.fcmToken
  })),
  {
    type: NotificationType.SYSTEM,
    title: 'System Maintenance',
    body: 'The app will undergo maintenance at 2 AM',
  }
);
```

#### 3. **Send Socket-Only Notification**

```typescript
await notificationsService.sendSocketNotification(
  userId: string,
  notification: NotificationPayload
)
```

**Use Case**: Real-time ephemeral events (typing indicators, live updates)

#### 4. **Send Push-Only Notification**

```typescript
await notificationsService.sendPushNotification(
  fcmToken: string,
  notification: NotificationPayload
)

// Returns: boolean (success)
```

**Use Case**: Force push notification even if user is online

### Notification Types

```typescript
enum NotificationType {
  NEW_MESSAGE = 'new_message',
  NEW_MATCH = 'new_match',
  NEW_LIKE = 'new_like',
  ENGAGEMENT_REQUEST = 'engagement_request',
  ENGAGEMENT_RESPONSE = 'engagement_response',
  PROFILE_VIEW = 'profile_view',
  SYSTEM = 'system',
}
```

### Socket Event for Notifications

**Event**: `notification_received`

**Payload**:
```typescript
{
  id?: string;
  type: string; // NotificationType
  title: string;
  body: string;
  data?: Record<string, any>;
  timestamp: string; // ISO 8601
}
```

**Scope**: Sent to specific user room (`user:${userId}`)

---

## Client Integration Guide

### 1. Connecting to Socket.IO

#### iOS/Android (Swift/Kotlin)
```swift
// Swift
import SocketIO

let manager = SocketManager(
    socketURL: URL(string: "https://your-api.com")!,
    config: [
        .log(true),
        .compress,
        .extraHeaders(["Authorization": "Bearer \(jwtToken)"])
    ]
)

let socket = manager.defaultSocket

socket.connect()
```

#### JavaScript/React
```javascript
import io from 'socket.io-client';

const socket = io('https://your-api.com', {
  path: '/socket.io',
  auth: {
    token: 'YOUR_JWT_TOKEN'
  },
  transports: ['websocket']
});

socket.connect();
```

### 2. Listening to Online Status Changes

#### Listen to ALL status changes (Recommended)
```javascript
socket.on('user_status_changed', (data) => {
  console.log(`User ${data.userId} is now ${data.isOnline ? 'online' : 'offline'}`);

  // Update your UI
  updateUserStatus(data.userId, data.isOnline);

  // Update cached user list
  if (data.isOnline) {
    addToOnlineUsers(data.userId);
  } else {
    removeFromOnlineUsers(data.userId);
  }
});
```

#### Legacy event listeners (Backward compatibility)
```javascript
socket.on('user_online', (data) => {
  console.log(`User ${data.userId} came online`);
  updateUserStatus(data.userId, true);
});

socket.on('user_offline', (data) => {
  console.log(`User ${data.userId} went offline`);
  updateUserStatus(data.userId, false);
});
```

### 3. Listening to Notifications

```javascript
socket.on('notification_received', (notification) => {
  console.log('New notification:', notification);

  // Display in-app notification
  showInAppNotification({
    id: notification.id,
    type: notification.type,
    title: notification.title,
    body: notification.body,
    timestamp: notification.timestamp
  });

  // Handle specific notification types
  switch (notification.type) {
    case 'new_message':
      // Navigate to chat
      navigateToChat(notification.data.conversationId);
      break;
    case 'new_match':
      // Show match animation
      showMatchAnimation(notification.data.matchedUserId);
      break;
    case 'new_like':
      // Update likes count
      incrementLikesCount();
      break;
    // ... handle other types
  }
});
```

### 4. Manual Status Update

```javascript
// Update status via REST API
async function setUserStatus(isOnline) {
  const response = await fetch('https://your-api.com/users/status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    },
    body: JSON.stringify({ isOnline })
  });

  const result = await response.json();
  console.log('Status updated:', result);

  // ALL OTHER CLIENTS will automatically receive 'user_status_changed' event
}

// Usage
setUserStatus(false); // Set to invisible/offline
setUserStatus(true);  // Set to online
```

### 5. Complete Example (React)

```javascript
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Initialize socket
    const newSocket = io('https://your-api.com', {
      auth: { token: localStorage.getItem('jwt') },
      transports: ['websocket']
    });

    // Listen to status changes
    newSocket.on('user_status_changed', (data) => {
      setOnlineUsers(prev => {
        const updated = new Set(prev);
        if (data.isOnline) {
          updated.add(data.userId);
        } else {
          updated.delete(data.userId);
        }
        return updated;
      });
    });

    // Listen to notifications
    newSocket.on('notification_received', (notification) => {
      setNotifications(prev => [notification, ...prev]);

      // Show browser notification if supported
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.body,
          icon: '/logo.png'
        });
      }
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    setSocket(newSocket);

    // Cleanup
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const toggleOnlineStatus = async (isOnline) => {
    await fetch('https://your-api.com/users/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({ isOnline })
    });
  };

  return (
    <div>
      <h1>Online Users: {onlineUsers.size}</h1>
      <button onClick={() => toggleOnlineStatus(true)}>Go Online</button>
      <button onClick={() => toggleOnlineStatus(false)}>Go Offline</button>

      <h2>Notifications ({notifications.length})</h2>
      {notifications.map((notif, i) => (
        <div key={i}>
          <strong>{notif.title}</strong>: {notif.body}
        </div>
      ))}
    </div>
  );
}
```

---

## API Reference

### REST Endpoints

#### Set User Status
```
POST /users/status
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Body:
{
  "isOnline": boolean
}

Response:
{
  "success": true,
  "message": "User status updated successfully",
  "data": {
    "userId": string,
    "isOnline": boolean,
    "lastSeenAt": string,
    "socketId": string | null
  },
  "timestamp": string
}
```

---

## Event Reference

### Socket.IO Events

#### Server → Client Events

| Event | Scope | Description | Payload |
|-------|-------|-------------|---------|
| `user_status_changed` | Global (All clients) | User online/offline status changed | `{ userId: string, isOnline: boolean, timestamp: string }` |
| `user_online` | Global (All clients) | **[Legacy]** User came online | `{ userId: string, timestamp: string }` |
| `user_offline` | Global (All clients) | **[Legacy]** User went offline | `{ userId: string, timestamp: string }` |
| `notification_received` | User-specific | In-app notification received | `{ id?: string, type: string, title: string, body: string, data?: object, timestamp: string }` |
| `message_received` | Conversation-specific | New chat message | See CHAT_IMPLEMENTATION.md |
| `user_typing` | Conversation-specific | User typing indicator | See CHAT_IMPLEMENTATION.md |

---

## Testing

### 1. Test Online Status Broadcasting

**Test Case**: Connect two clients and verify status propagation

```bash
# Terminal 1: Start the server
npm run start:dev

# Terminal 2: Connect Client A
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user1@example.com", "password": "password"}'

# Terminal 3: Connect Client B with a different user
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user2@example.com", "password": "password"}'

# Connect both to Socket.IO with their tokens
# Client A and B should both receive 'user_status_changed' events
```

**Expected Result**:
- Client A connects → Client B receives `user_status_changed` for Client A
- Client B connects → Client A receives `user_status_changed` for Client B
- Client A disconnects → Client B receives `user_status_changed` for Client A (offline)

### 2. Test Manual Status Update

```bash
# Set user offline manually
curl -X POST http://localhost:3000/users/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"isOnline": false}'

# Expected: ALL connected clients receive 'user_status_changed' event
```

### 3. Test Hybrid Notifications

**Scenario 1: User is ONLINE**
```typescript
// In your test service
await notificationsService.sendNotification(
  onlineUserId,
  userFcmToken,
  {
    type: NotificationType.NEW_LIKE,
    title: 'New Like!',
    body: 'Someone liked your profile',
  }
);

// Expected:
// - User receives 'notification_received' via Socket.IO
// - NO FCM push sent (user is online)
```

**Scenario 2: User is OFFLINE**
```typescript
await notificationsService.sendNotification(
  offlineUserId,
  userFcmToken,
  {
    type: NotificationType.NEW_MESSAGE,
    title: 'New Message',
    body: 'You have a new message',
  }
);

// Expected:
// - NO socket event (user is offline)
// - FCM push notification sent
```

### 4. Integration Test Example

```typescript
describe('Real-time Status Broadcasting', () => {
  let app: INestApplication;
  let socketClient1: Socket;
  let socketClient2: Socket;

  beforeAll(async () => {
    // Setup test app
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.listen(3001);
  });

  it('should broadcast status change to all clients', (done) => {
    // Connect client 1
    socketClient1 = io('http://localhost:3001', {
      auth: { token: user1Token }
    });

    // Connect client 2
    socketClient2 = io('http://localhost:3001', {
      auth: { token: user2Token }
    });

    // Client 2 listens for client 1's status
    socketClient2.on('user_status_changed', (data) => {
      expect(data.userId).toBe(user1Id);
      expect(data.isOnline).toBe(true);
      done();
    });

    // Client 1 connects (triggers broadcast)
    socketClient1.on('connect', () => {
      // Status broadcasted automatically
    });
  });
});
```

---

## Troubleshooting

### Issue: Status changes not broadcasting
**Solution**:
1. Verify ChatModule exports ChatGateway: `exports: [ChatService, ChatGateway, UserPresenceRepository]`
2. Ensure UsersModule imports ChatModule with `forwardRef`
3. Check logs for JWT authentication errors

### Issue: Notifications not received via socket
**Solution**:
1. Verify user is connected to socket
2. Check user's presence status: `GET /user-presence/{userId}`
3. Ensure user joined their personal room: `user:${userId}`

### Issue: FCM not working
**Solution**:
1. Verify Firebase configuration in `.env`
2. Check user's FCM token is valid
3. See `FIREBASE_SETUP.md` for FCM setup

---

## Migration from Old System

If you have existing code using the old events:

```javascript
// OLD (still works, but deprecated)
socket.on('user_online', (data) => { ... });
socket.on('user_offline', (data) => { ... });

// NEW (recommended)
socket.on('user_status_changed', (data) => {
  if (data.isOnline) {
    // User is online
  } else {
    // User is offline
  }
});
```

Both events are emitted for backward compatibility, but new implementations should use `user_status_changed`.

---

## Summary

✅ **Online Status**: Broadcasted globally via Socket.IO to ALL clients
✅ **Manual Status Control**: REST API that triggers socket broadcasts
✅ **Hybrid Notifications**: Socket.IO (online) + FCM (offline)
✅ **Backward Compatibility**: Legacy events still supported
✅ **Comprehensive API**: NotificationsService for all notification needs

For chat-specific events, see `CHAT_IMPLEMENTATION.md`.
