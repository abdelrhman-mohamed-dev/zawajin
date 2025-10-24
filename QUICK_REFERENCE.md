# Real-Time Features - Quick Reference Card

## 🚀 Quick Start

### Test the Demo (30 seconds)
```bash
# 1. Start backend
npm run start:dev

# 2. Get JWT token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "your@email.com", "password": "password"}'

# 3. Open demo/realtime-demo.html
# 4. Paste token and click Connect
```

---

## 📡 Socket.IO Connection

### JavaScript
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: { token: 'YOUR_JWT_TOKEN' }
});
```

### iOS
```swift
let manager = SocketManager(
  socketURL: URL(string: "http://localhost:3000")!,
  config: [.extraHeaders(["Authorization": "Bearer \(token)"])]
)
let socket = manager.defaultSocket
socket.connect()
```

### Android
```kotlin
val opts = IO.Options().apply {
  extraHeaders = mapOf("Authorization" to listOf("Bearer $token"))
}
val socket = IO.socket("http://localhost:3000", opts)
socket.connect()
```

---

## 📥 Key Events to Listen For

### Online Status (Most Important)
```javascript
socket.on('user_status_changed', (data) => {
  // data = { userId: string, isOnline: boolean, timestamp: string }
  updateUserBadge(data.userId, data.isOnline);
});
```

### Notifications
```javascript
socket.on('notification_received', (notification) => {
  // notification = { id, type, title, body, data, timestamp }
  showInAppNotification(notification);
});
```

### Chat
```javascript
socket.on('message_received', (data) => {
  // data = { message: object, conversationId: string }
});

socket.on('user_typing', (data) => {
  // data = { userId, conversationId, isTyping }
});
```

---

## 📤 Key Events to Emit

### Send Message
```javascript
socket.emit('send_message', {
  conversationId: 'abc-123',
  message: { content: 'Hello!', messageType: 'text' }
});
```

### Typing Indicators
```javascript
socket.emit('typing_start', { conversationId: 'abc-123' });
socket.emit('typing_stop', { conversationId: 'abc-123' });
```

### Mark as Read
```javascript
socket.emit('message_read', { conversationId: 'abc-123' });
```

---

## 🔧 REST API

### Manual Status Control
```bash
# Set offline
curl -X POST http://localhost:3000/users/status \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isOnline": false}'

# This broadcasts to ALL connected clients via Socket.IO!
```

---

## 📊 Event Types

| Event | Scope | Description |
|-------|-------|-------------|
| `user_status_changed` | Global | Status change (NEW) |
| `notification_received` | User | In-app notification (NEW) |
| `message_received` | Conversation | New message |
| `user_typing` | Conversation | Typing indicator |
| `message_read` | User | Messages read |

---

## 🎯 Notification Types

```typescript
enum NotificationType {
  NEW_MESSAGE = 'new_message',
  NEW_MATCH = 'new_match',
  NEW_LIKE = 'new_like',
  ENGAGEMENT_REQUEST = 'engagement_request',
  ENGAGEMENT_RESPONSE = 'engagement_response',
  SYSTEM = 'system'
}
```

---

## 🧪 Testing Checklist

- [ ] Connect to Socket.IO with JWT
- [ ] Receive `user_status_changed` events
- [ ] Receive `notification_received` events
- [ ] Send messages via socket
- [ ] Test with multiple clients
- [ ] Test manual status API
- [ ] Test reconnection

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `REALTIME_FEATURES.md` | Complete technical docs |
| `demo/README.md` | Demo usage guide |
| `IMPLEMENTATION_SUMMARY.md` | Implementation overview |
| `QUICK_REFERENCE.md` | This file |
| `zawajin.json` | Postman collection |

---

## 🆘 Troubleshooting

### Can't connect?
- Check backend is running: `curl http://localhost:3000/health`
- Check JWT token is valid (not expired)
- Check CORS settings

### Not receiving events?
- Check socket connection: `socket.connected` should be `true`
- Check you're listening to correct event name
- Check browser console for errors

### Status not updating?
- Verify `POST /users/status` returns 200
- Check Events Log in demo
- Verify other clients are connected

---

## 💡 Pro Tips

1. **Use the demo first** - Test before implementing
2. **Check Events Log** - See all events in real-time
3. **Use `user_status_changed`** - Not the legacy events
4. **Handle reconnection** - Socket.IO does it automatically
5. **Test with multiple clients** - Open 3+ browser tabs

---

## 🎉 That's It!

Open `demo/realtime-demo.html` and see it in action! 🚀

For detailed documentation, see `REALTIME_FEATURES.md`
