# Quick Start: Testing Chat System

## 🚀 5-Minute Quick Test

### Step 1: Start Server
```bash
npm run start:dev
```

### Step 2: Import Postman Collection
- Open Postman
- Import `zawajin.json`
- Set `baseUrl` to `http://localhost:3000`

### Step 3: Create Two Matched Users

**Register User 1:**
```bash
POST http://localhost:3000/auth/register
{
    "fullName": "Ahmed Khan",
    "gender": "male",
    "email": "ahmed@test.com",
    "phone": "1234567890",
    "password": "password123",
    "confirmPassword": "password123"
}
```

**Register User 2:**
```bash
POST http://localhost:3000/auth/register
{
    "fullName": "Sara Ali",
    "gender": "female",
    "email": "sara@test.com",
    "phone": "0987654321",
    "password": "password123",
    "confirmPassword": "password123"
}
```

**Verify OTPs** (check logs or email)
**Login both** and save their tokens

**Create Match:**
- Ahmed likes Sara → `POST /users/{sara-id}/like`
- Sara likes Ahmed → `POST /users/{ahmed-id}/like`
- ✅ Match created!

### Step 4: Test REST API

**Create Conversation (Ahmed):**
```bash
POST http://localhost:3000/chat/conversations
Authorization: Bearer {ahmed-token}
{
    "recipientId": "{sara-id}"
}
```
Save the conversation ID!

**Send Message:**
```bash
POST http://localhost:3000/chat/conversations/{conversation-id}/messages
Authorization: Bearer {ahmed-token}
{
    "content": "Hello Sara!",
    "messageType": "text"
}
```

**Get Messages:**
```bash
GET http://localhost:3000/chat/conversations/{conversation-id}/messages
```

### Step 5: Test WebSocket (Browser)

**Open Browser Console and paste:**
```javascript
const script = document.createElement('script');
script.src = 'https://cdn.socket.io/4.5.4/socket.io.min.js';
document.head.appendChild(script);

script.onload = () => {
    const socket = io('http://localhost:3000', {
        auth: { token: 'YOUR_TOKEN_HERE' }
    });

    socket.on('connect', () => console.log('✅ Connected!'));

    // Join conversation
    socket.emit('join_conversation', {
        conversationId: 'YOUR_CONVERSATION_ID'
    });

    // Listen for messages
    socket.on('message_received', (data) => {
        console.log('📩 New message:', data);
    });

    // Send message
    socket.emit('send_message', {
        conversationId: 'YOUR_CONVERSATION_ID',
        message: { content: 'Hello via WebSocket!', messageType: 'text' }
    });
};
```

## 🎯 What You Can Test

### REST Endpoints (Postman)
- ✅ Create conversation
- ✅ Get all conversations
- ✅ Get conversation details
- ✅ Send messages
- ✅ Get message history
- ✅ Mark as read
- ✅ Delete messages
- ✅ Get unread count

### WebSocket Events
- ✅ Real-time messages
- ✅ Typing indicators
- ✅ Online/offline status
- ✅ Read receipts
- ✅ Message delivery confirmation

## 📝 Quick Notes

- **Match Required:** Users must have mutual like to chat
- **Blocked Users:** Cannot message blocked users
- **Rate Limits:** 10 conversations/min, 20 messages/min
- **Message Limit:** Max 2000 characters
- **Typing Timeout:** Auto-stops after 5 seconds

## 🔧 Environment Variables

Add to `.env`:
```env
SOCKET_IO_CORS_ORIGIN=http://localhost:3000
SOCKET_IO_PATH=/socket.io
MESSAGE_MAX_LENGTH=2000
TYPING_TIMEOUT=5000
```

## 🎉 Success Criteria

You should see:
1. ✅ Conversations created successfully
2. ✅ Messages sent via REST API
3. ✅ Real-time messages via WebSocket
4. ✅ Typing indicators working
5. ✅ Online/offline status updates
6. ✅ Read receipts working

## 📚 Full Documentation

For detailed testing instructions, see:
- `WEBSOCKET_TESTING_GUIDE.md` - Complete testing guide
- `CHAT_IMPLEMENTATION.md` - Implementation details
- `plan.md` - Project roadmap

## 🆘 Quick Troubleshooting

**WebSocket won't connect?**
→ Check JWT token is valid and not expired

**Messages not real-time?**
→ Both users must join conversation with `join_conversation`

**Can't create conversation?**
→ Users must have mutual like (match)

**CORS error?**
→ Set `SOCKET_IO_CORS_ORIGIN=*` in .env

---

Happy Testing! 🚀
