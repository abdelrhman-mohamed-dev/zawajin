# Real-time Chat Implementation Guide

This document provides an overview of the real-time chat system implementation (Phase 5 Part A).

## Overview

The chat system enables matched users to communicate in real-time using WebSocket (Socket.IO) technology with REST API endpoints for conversation management.

## Architecture

### Entities

#### 1. Conversation Entity
- Stores chat conversation metadata between two users
- Requires mutual match (like) between participants
- Tracks last message preview and timestamp
- Location: `src/modules/chat/entities/conversation.entity.ts`

#### 2. Message Entity
- Stores individual messages with status tracking
- Supports text messages (image support ready for future)
- Tracks delivery and read status
- Soft delete functionality
- Location: `src/modules/chat/entities/message.entity.ts`

#### 3. UserPresence Entity
- Tracks online/offline status of users
- Stores socket connection details
- Tracks last seen timestamp
- Location: `src/modules/chat/entities/user-presence.entity.ts`

### REST API Endpoints

All endpoints require JWT authentication and are under `/chat` prefix:

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| POST | `/chat/conversations` | Create new conversation with matched user | 10/min |
| GET | `/chat/conversations` | Get all user conversations (paginated) | Default |
| GET | `/chat/conversations/:id` | Get conversation details | Default |
| GET | `/chat/conversations/:id/messages` | Get message history (paginated) | Default |
| POST | `/chat/conversations/:id/messages` | Send message | 20/min |
| PUT | `/chat/conversations/:id/read` | Mark messages as read | Default |
| DELETE | `/chat/messages/:id` | Delete own message (soft delete) | Default |
| GET | `/chat/conversations/:id/unread-count` | Get unread message count | Default |

### WebSocket Events

#### Client → Server Events

1. **`join_conversation`**
   - Joins a conversation room
   - Payload: `{ conversationId: string }`

2. **`leave_conversation`**
   - Leaves a conversation room
   - Payload: `{ conversationId: string }`

3. **`send_message`**
   - Sends a message to conversation
   - Payload: `{ conversationId: string, message: SendMessageDto }`

4. **`typing_start`**
   - Notifies other user that typing started
   - Payload: `{ conversationId: string }`

5. **`typing_stop`**
   - Notifies other user that typing stopped
   - Payload: `{ conversationId: string }`

6. **`message_read`**
   - Marks messages as read
   - Payload: `{ conversationId: string }`

#### Server → Client Events

1. **`message_received`**
   - New message in conversation
   - Payload: `{ message: Message, conversationId: string }`

2. **`message_delivered`**
   - Delivery confirmation
   - Payload: `{ messageId: string, conversationId: string }`

3. **`message_read`**
   - Read confirmation
   - Payload: `{ conversationId: string, readBy: string }`

4. **`user_typing`**
   - Typing indicator
   - Payload: `{ userId: string, conversationId: string, isTyping: boolean }`

5. **`user_online`**
   - User came online
   - Payload: `{ userId: string }`

6. **`user_offline`**
   - User went offline
   - Payload: `{ userId: string }`

## Authentication

### REST API
- Uses standard JWT authentication via `@UseGuards(JwtAuthGuard)`
- Token passed in `Authorization: Bearer <token>` header

### WebSocket
- Uses custom `WsJwtGuard` for socket authentication
- Token can be passed via:
  - `Authorization: Bearer <token>` header in handshake
  - `auth.token` in socket handshake
  - `token` query parameter

## Key Features

### 1. Mutual Match Validation
- Users can only create conversations with matched users (mutual like)
- Validated on conversation creation

### 2. Block User Protection
- Blocked users cannot message each other
- Existing conversations are inaccessible when blocked
- Checked on every message send

### 3. Real-time Delivery
- Messages delivered instantly via Socket.IO rooms
- Room-based architecture: `conversation:{conversationId}`
- User-specific rooms: `user:{userId}` for notifications

### 4. Message Status Tracking
- **SENT**: Message created
- **DELIVERED**: Message received by recipient's client
- **READ**: Message read by recipient

### 5. Typing Indicators
- Auto-timeout after 5 seconds (configurable via `TYPING_TIMEOUT`)
- Cleaned up on disconnect

### 6. Online Status
- Tracked in `UserPresence` entity
- Broadcast to all users on connect/disconnect
- `lastSeenAt` updated on disconnect

### 7. Pagination Support
- Conversations: Default 20 per page
- Messages: Default 50 per page (newest first, reversed for display)

### 8. Soft Delete
- Messages marked as deleted, not physically removed
- Hidden from queries but preserved in database

## Environment Variables

Add to `.env` file:

```env
# WebSocket/Socket.IO Configuration
SOCKET_IO_CORS_ORIGIN=http://localhost:3000
SOCKET_IO_PATH=/socket.io
MESSAGE_MAX_LENGTH=2000
TYPING_TIMEOUT=5000
```

## Client Integration Example

### Connecting to Socket.IO

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  path: '/socket.io',
  auth: {
    token: 'your-jwt-token'
  }
});

// Or via header (some clients)
const socket = io('http://localhost:3000', {
  path: '/socket.io',
  extraHeaders: {
    Authorization: 'Bearer your-jwt-token'
  }
});
```

### Joining a Conversation

```javascript
socket.emit('join_conversation', { conversationId: 'uuid' }, (response) => {
  if (response.success) {
    console.log('Joined conversation:', response.conversationId);
  }
});
```

### Sending a Message

```javascript
socket.emit('send_message', {
  conversationId: 'uuid',
  message: {
    content: 'Hello!',
    messageType: 'text'
  }
}, (response) => {
  if (response.success) {
    console.log('Message sent:', response.message);
  }
});
```

### Receiving Messages

```javascript
socket.on('message_received', (data) => {
  console.log('New message:', data.message);
  // Update UI with new message
});

socket.on('user_typing', (data) => {
  if (data.isTyping) {
    console.log(`User ${data.userId} is typing...`);
  } else {
    console.log(`User ${data.userId} stopped typing`);
  }
});

socket.on('user_online', (data) => {
  console.log(`User ${data.userId} is now online`);
});

socket.on('user_offline', (data) => {
  console.log(`User ${data.userId} is now offline`);
});
```

### Typing Indicator

```javascript
// Start typing
socket.emit('typing_start', { conversationId: 'uuid' });

// Stop typing
socket.emit('typing_stop', { conversationId: 'uuid' });
```

### Mark as Read

```javascript
socket.emit('message_read', { conversationId: 'uuid' });

socket.on('message_read', (data) => {
  console.log(`Messages read by user ${data.readBy} in conversation ${data.conversationId}`);
  // Update UI to show read status
});
```

## Testing

### Starting the Server

```bash
npm run start:dev
```

The WebSocket server will be available at:
- URL: `http://localhost:3000`
- Path: `/socket.io`

### Testing with Postman/Insomnia

1. **Create Conversation**
   ```
   POST http://localhost:3000/chat/conversations
   Headers: Authorization: Bearer <token>
   Body: { "recipientId": "user-uuid" }
   ```

2. **Get Conversations**
   ```
   GET http://localhost:3000/chat/conversations?page=1&limit=20
   Headers: Authorization: Bearer <token>
   ```

3. **Send Message (REST)**
   ```
   POST http://localhost:3000/chat/conversations/:id/messages
   Headers: Authorization: Bearer <token>
   Body: { "content": "Hello!", "messageType": "text" }
   ```

### Testing WebSocket

Use a Socket.IO client tool or library:

1. Connect with JWT token
2. Join conversation
3. Send/receive messages
4. Test typing indicators
5. Test online/offline status

## Database Schema

The chat module creates three new tables:

1. **conversations**
   - Primary key: `id` (UUID)
   - Foreign keys: `participant1Id`, `participant2Id` → `users.id`
   - Unique constraint: `(participant1Id, participant2Id)`

2. **messages**
   - Primary key: `id` (UUID)
   - Foreign keys: `conversationId` → `conversations.id`, `senderId` → `users.id`
   - Indexes: `conversationId`, `senderId`, `(conversationId, createdAt)`

3. **user_presence**
   - Primary key: `userId` (UUID)
   - Foreign key: `userId` → `users.id`

## Security Features

1. **Authentication**: JWT-based for both REST and WebSocket
2. **Authorization**: Users can only access their own conversations
3. **Rate Limiting**: Prevents spam (10 conversations/min, 20 messages/min)
4. **Validation**: Message content max 2000 characters
5. **Block Protection**: Cannot message blocked users
6. **Match Validation**: Only matched users can chat

## Future Enhancements

- [ ] Redis adapter for horizontal scaling
- [ ] Message queue for offline message handling
- [ ] Image/file sharing support
- [ ] Voice message support
- [ ] Message reactions/emojis
- [ ] Message forwarding
- [ ] Conversation muting/archiving
- [ ] Group chat support
- [ ] End-to-end encryption

## Troubleshooting

### Connection Issues

1. **Check CORS settings**: Ensure `SOCKET_IO_CORS_ORIGIN` matches client origin
2. **Verify JWT token**: Token must be valid and not expired
3. **Check path**: Default is `/socket.io`, verify client uses same path

### Message Not Delivering

1. **Verify users joined conversation room**: Must emit `join_conversation` first
2. **Check block status**: Blocked users cannot message
3. **Verify mutual match**: Users must have mutual like

### Typing Indicator Not Working

1. **Check timeout**: Auto-stops after 5 seconds (configurable)
2. **Verify in same conversation room**: Both users must be in room
3. **Check event listeners**: Client must listen to `user_typing` event

## Support

For issues or questions:
- Check logs for error messages
- Verify environment variables are set correctly
- Ensure database migrations are up to date
- Review the Swagger documentation at `/api/docs`
