# WebSocket Testing Guide for Zawajin Chat System

This guide will walk you through testing the real-time chat system using both REST APIs (Postman) and WebSocket connections.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Testing REST API Endpoints in Postman](#testing-rest-api-endpoints-in-postman)
3. [Testing WebSocket with Postman](#testing-websocket-with-postman)
4. [Testing WebSocket with Browser/JavaScript](#testing-websocket-with-browserjavascript)
5. [Complete Testing Workflow](#complete-testing-workflow)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### 1. Start the Server
```bash
npm run start:dev
```

The server should be running on `http://localhost:3000` (or your configured PORT).

### 2. Import Postman Collection
1. Open Postman
2. Click **Import** button
3. Select the `zawajin.json` file from the project root
4. The collection will be imported with all endpoints

### 3. Set Environment Variables
In Postman, set these collection variables:
- `baseUrl`: `http://localhost:3000` (adjust port if different)
- `authToken`: Will be filled after login
- `conversationId`: Will be filled after creating conversation
- `messageId`: Will be filled after sending message

---

## Testing REST API Endpoints in Postman

### Step 1: Register Two Users

**User 1 (Ahmed):**
1. Go to **Authentication** → **Register New User**
2. Use this body:
```json
{
    "fullName": "Ahmed Khan",
    "gender": "male",
    "email": "ahmed@example.com",
    "phone": "1234567890",
    "password": "password123",
    "confirmPassword": "password123"
}
```
3. Click **Send**
4. Note: You'll need to verify email with OTP (check your email or logs)

**User 2 (Sara):**
1. Repeat registration with:
```json
{
    "fullName": "Sara Ali",
    "gender": "female",
    "email": "sara@example.com",
    "phone": "0987654321",
    "password": "password123",
    "confirmPassword": "password123"
}
```

### Step 2: Verify Email OTP

For each user:
1. Go to **Authentication** → **Verify Email OTP**
2. Check your email or server logs for the OTP code
3. Use body:
```json
{
    "email": "ahmed@example.com",
    "code": "123456"
}
```
4. Copy the `access_token` from response
5. Set it in the collection variable `authToken`

### Step 3: Login Users

1. Go to **Authentication** → **Login User**
2. Login as Ahmed:
```json
{
    "email": "ahmed@example.com",
    "password": "password123"
}
```
3. **IMPORTANT:** Copy the `access_token` and save it as `authToken` variable
4. Repeat for Sara and save her token separately

### Step 4: Like Each Other (Create Match)

**Ahmed likes Sara:**
1. Make sure `authToken` has Ahmed's token
2. Go to **Users & Profiles** → **Get All Users**
3. Copy Sara's user ID from the response
4. Go to **Users & Profiles** → **Like a User**
5. Replace the user ID in URL with Sara's ID
6. Send request

**Sara likes Ahmed back:**
1. Change `authToken` to Sara's token
2. Copy Ahmed's user ID
3. Go to **Users & Profiles** → **Like a User**
4. Replace the user ID in URL with Ahmed's ID
5. Send request
6. **Result:** Now they are matched! ✓

### Step 5: Create Conversation

1. Use Ahmed's token in `authToken`
2. Go to **Chat & Messaging** → **Create Conversation**
3. Body:
```json
{
    "recipientId": "sara-user-id-here"
}
```
4. Send request
5. Copy the `id` from response and set it in `conversationId` variable

### Step 6: Send Messages via REST

1. Go to **Chat & Messaging** → **Send Message (REST)**
2. Make sure `conversationId` variable is set
3. Body:
```json
{
    "content": "Hello Sara! How are you?",
    "messageType": "text"
}
```
4. Send request
5. Message will be created successfully

### Step 7: Get Conversation Messages

1. Go to **Chat & Messaging** → **Get Conversation Messages**
2. Send request
3. You'll see all messages in the conversation

### Step 8: Mark Messages as Read

1. Switch to Sara's token in `authToken`
2. Go to **Chat & Messaging** → **Mark Messages as Read**
3. Send request
4. Messages will be marked as read

### Step 9: Get Unread Count

1. Go to **Chat & Messaging** → **Get Unread Message Count**
2. Send request
3. Returns count of unread messages

### Step 10: Delete Message

1. Switch back to Ahmed's token
2. Copy a message ID from the conversation
3. Set it in `messageId` variable
4. Go to **Chat & Messaging** → **Delete Message**
5. Send request
6. Message will be soft-deleted

---

## Testing WebSocket with Postman

Postman supports WebSocket connections in newer versions (v10+).

### Step 1: Create New WebSocket Request

1. Click **New** → **WebSocket Request**
2. Enter URL: `ws://localhost:3000/socket.io/?EIO=4&transport=websocket`
3. **Note:** Socket.IO uses a specific protocol, so we need special URL format

### Step 2: Authenticate WebSocket

Unfortunately, Postman's WebSocket support is limited for Socket.IO. Socket.IO uses its own protocol which is not fully compatible with standard WebSocket testing in Postman.

**Recommended Alternative:** Use a Socket.IO client tool or browser-based testing (see next section).

---

## Testing WebSocket with Browser/JavaScript

This is the **BEST** way to test WebSocket functionality.

### Option 1: Using Browser Console

1. Open your browser (Chrome/Firefox)
2. Go to `http://localhost:3000`
3. Open Developer Tools (F12)
4. Go to **Console** tab
5. Paste this code:

```javascript
// Load Socket.IO client library
const script = document.createElement('script');
script.src = 'https://cdn.socket.io/4.5.4/socket.io.min.js';
document.head.appendChild(script);

// Wait for library to load, then connect
script.onload = () => {
    // Replace with your actual JWT token
    const token = 'YOUR_JWT_TOKEN_HERE';

    // Connect to WebSocket
    const socket = io('http://localhost:3000', {
        path: '/socket.io',
        auth: {
            token: token
        }
    });

    // Connection events
    socket.on('connect', () => {
        console.log('✅ Connected to WebSocket!', socket.id);
    });

    socket.on('disconnect', () => {
        console.log('❌ Disconnected from WebSocket');
    });

    socket.on('connect_error', (error) => {
        console.error('❌ Connection Error:', error.message);
    });

    // User presence events
    socket.on('user_online', (data) => {
        console.log('👤 User came online:', data);
    });

    socket.on('user_offline', (data) => {
        console.log('👤 User went offline:', data);
    });

    // Join a conversation
    window.joinConversation = (conversationId) => {
        socket.emit('join_conversation', { conversationId }, (response) => {
            console.log('Join response:', response);
        });
    };

    // Leave a conversation
    window.leaveConversation = (conversationId) => {
        socket.emit('leave_conversation', { conversationId }, (response) => {
            console.log('Leave response:', response);
        });
    };

    // Send message via WebSocket
    window.sendMessage = (conversationId, content) => {
        socket.emit('send_message', {
            conversationId: conversationId,
            message: {
                content: content,
                messageType: 'text'
            }
        }, (response) => {
            console.log('Send message response:', response);
        });
    };

    // Typing indicators
    window.startTyping = (conversationId) => {
        socket.emit('typing_start', { conversationId });
    };

    window.stopTyping = (conversationId) => {
        socket.emit('typing_stop', { conversationId });
    };

    // Mark as read
    window.markAsRead = (conversationId) => {
        socket.emit('message_read', { conversationId });
    };

    // Listen for incoming messages
    socket.on('message_received', (data) => {
        console.log('📩 New message received:', data);
    });

    socket.on('message_delivered', (data) => {
        console.log('✓ Message delivered:', data);
    });

    socket.on('message_read', (data) => {
        console.log('✓✓ Message read:', data);
    });

    socket.on('user_typing', (data) => {
        if (data.isTyping) {
            console.log('✍️ User is typing:', data);
        } else {
            console.log('✍️ User stopped typing:', data);
        }
    });

    console.log('🚀 WebSocket client ready! Use these functions:');
    console.log('- joinConversation(conversationId)');
    console.log('- leaveConversation(conversationId)');
    console.log('- sendMessage(conversationId, content)');
    console.log('- startTyping(conversationId)');
    console.log('- stopTyping(conversationId)');
    console.log('- markAsRead(conversationId)');
};
```

### Option 2: Create HTML Test File

Create a file `websocket-test.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebSocket Chat Test</title>
    <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        input, button { padding: 10px; margin: 5px; }
        #messages { border: 1px solid #ccc; height: 300px; overflow-y: auto; padding: 10px; margin: 10px 0; }
        .message { padding: 5px; margin: 3px 0; background: #f0f0f0; border-radius: 5px; }
        .status { color: green; font-weight: bold; }
        .error { color: red; }
    </style>
</head>
<body>
    <div class="container">
        <h1>WebSocket Chat Tester</h1>

        <div>
            <h3>1. Connect</h3>
            <input type="text" id="token" placeholder="Enter JWT Token" style="width: 500px;">
            <button onclick="connect()">Connect</button>
            <button onclick="disconnect()">Disconnect</button>
            <div id="status"></div>
        </div>

        <div>
            <h3>2. Join Conversation</h3>
            <input type="text" id="conversationId" placeholder="Enter Conversation ID" style="width: 400px;">
            <button onclick="join()">Join</button>
        </div>

        <div>
            <h3>3. Send Message</h3>
            <input type="text" id="messageContent" placeholder="Type your message" style="width: 400px;">
            <button onclick="send()">Send</button>
            <button onclick="typing(true)">Start Typing</button>
            <button onclick="typing(false)">Stop Typing</button>
        </div>

        <div>
            <h3>4. Messages</h3>
            <div id="messages"></div>
            <button onclick="clearMessages()">Clear</button>
            <button onclick="markRead()">Mark as Read</button>
        </div>
    </div>

    <script>
        let socket = null;
        let currentConversation = null;

        function connect() {
            const token = document.getElementById('token').value;
            if (!token) {
                alert('Please enter JWT token');
                return;
            }

            socket = io('http://localhost:3000', {
                path: '/socket.io',
                auth: { token: token }
            });

            socket.on('connect', () => {
                showStatus('Connected! Socket ID: ' + socket.id, 'status');
            });

            socket.on('disconnect', () => {
                showStatus('Disconnected', 'error');
            });

            socket.on('connect_error', (error) => {
                showStatus('Connection Error: ' + error.message, 'error');
            });

            socket.on('message_received', (data) => {
                addMessage('📩 Message received: ' + JSON.stringify(data, null, 2));
            });

            socket.on('message_delivered', (data) => {
                addMessage('✓ Delivered: ' + JSON.stringify(data, null, 2));
            });

            socket.on('message_read', (data) => {
                addMessage('✓✓ Read: ' + JSON.stringify(data, null, 2));
            });

            socket.on('user_typing', (data) => {
                if (data.isTyping) {
                    addMessage('✍️ User is typing...');
                } else {
                    addMessage('✍️ User stopped typing');
                }
            });

            socket.on('user_online', (data) => {
                addMessage('👤 User online: ' + data.userId);
            });

            socket.on('user_offline', (data) => {
                addMessage('👤 User offline: ' + data.userId);
            });
        }

        function disconnect() {
            if (socket) {
                socket.disconnect();
                socket = null;
            }
        }

        function join() {
            const conversationId = document.getElementById('conversationId').value;
            if (!conversationId || !socket) return;

            currentConversation = conversationId;
            socket.emit('join_conversation', { conversationId }, (response) => {
                addMessage('Join response: ' + JSON.stringify(response, null, 2));
            });
        }

        function send() {
            const content = document.getElementById('messageContent').value;
            if (!content || !currentConversation || !socket) return;

            socket.emit('send_message', {
                conversationId: currentConversation,
                message: { content: content, messageType: 'text' }
            }, (response) => {
                addMessage('Send response: ' + JSON.stringify(response, null, 2));
                document.getElementById('messageContent').value = '';
            });
        }

        function typing(isTyping) {
            if (!currentConversation || !socket) return;

            const event = isTyping ? 'typing_start' : 'typing_stop';
            socket.emit(event, { conversationId: currentConversation });
        }

        function markRead() {
            if (!currentConversation || !socket) return;

            socket.emit('message_read', { conversationId: currentConversation });
        }

        function addMessage(msg) {
            const div = document.createElement('div');
            div.className = 'message';
            div.textContent = msg;
            document.getElementById('messages').appendChild(div);
            document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
        }

        function showStatus(msg, className) {
            const statusDiv = document.getElementById('status');
            statusDiv.textContent = msg;
            statusDiv.className = className;
        }

        function clearMessages() {
            document.getElementById('messages').innerHTML = '';
        }
    </script>
</body>
</html>
```

Save this file and open it in your browser. This provides a complete UI for testing WebSocket!

---

## Complete Testing Workflow

### Scenario: Two Users Chatting in Real-Time

1. **Open two browser tabs** (or browsers)
2. **In Tab 1 (Ahmed):**
   - Open `websocket-test.html`
   - Enter Ahmed's JWT token
   - Click "Connect"
   - Enter conversation ID
   - Click "Join"

3. **In Tab 2 (Sara):**
   - Open another `websocket-test.html`
   - Enter Sara's JWT token
   - Click "Connect"
   - Enter the same conversation ID
   - Click "Join"

4. **Test Real-time Messaging:**
   - **Tab 1:** Type message "Hello Sara!" and click "Send"
   - **Tab 2:** Should immediately see "📩 Message received"
   - **Tab 2:** Type "Hi Ahmed!" and send
   - **Tab 1:** Should receive the message

5. **Test Typing Indicators:**
   - **Tab 1:** Click "Start Typing"
   - **Tab 2:** Should see "✍️ User is typing..."
   - **Tab 1:** Click "Stop Typing"
   - **Tab 2:** Should see "User stopped typing"

6. **Test Read Receipts:**
   - **Tab 2:** Click "Mark as Read"
   - **Tab 1:** Should see "✓✓ Message read"

7. **Test Online/Offline:**
   - **Tab 1:** Click "Disconnect"
   - **Tab 2:** Should see "👤 User offline"
   - **Tab 1:** Click "Connect" again
   - **Tab 2:** Should see "👤 User online"

---

## Troubleshooting

### Issue 1: WebSocket Connection Fails
**Error:** `Connection Error: Unauthorized`

**Solution:**
- Make sure you're using a valid JWT token
- Token should not be expired
- Check if token is correctly passed in auth object

### Issue 2: Cannot Join Conversation
**Error:** `Conversation not found`

**Solution:**
- Verify conversation ID is correct
- Make sure the user is a participant in the conversation
- Check if conversation exists using REST API first

### Issue 3: Messages Not Received in Real-time
**Solution:**
- Both users must join the conversation first using `join_conversation`
- Check browser console for any errors
- Verify WebSocket connection is established (check status)

### Issue 4: CORS Error
**Solution:**
- Update `.env` file: `SOCKET_IO_CORS_ORIGIN=http://localhost:3000`
- Or set to `*` for testing: `SOCKET_IO_CORS_ORIGIN=*`
- Restart server after changing env

### Issue 5: Cannot Send Messages
**Solution:**
- Verify users have mutual like (are matched)
- Check if users are not blocked
- Verify conversation exists and user is participant

---

## Quick Testing Checklist

- [ ] Register two users
- [ ] Verify both emails with OTP
- [ ] Login both users and save tokens
- [ ] Users like each other (create match)
- [ ] Create conversation via REST API
- [ ] Send message via REST API
- [ ] Get messages via REST API
- [ ] Connect both users to WebSocket
- [ ] Both users join conversation
- [ ] Send real-time messages
- [ ] Test typing indicators
- [ ] Test read receipts
- [ ] Test online/offline status
- [ ] Test message deletion
- [ ] Test unread count

---

## Additional Tools

### Socket.IO Client Libraries

**Node.js:**
```bash
npm install socket.io-client
```

**Python:**
```bash
pip install python-socketio
```

**Mobile (React Native):**
```bash
npm install socket.io-client
```

### Online Tools

1. **Socket.IO Client Tool:** https://amritb.github.io/socketio-client-tool/
2. **WebSocket King:** Chrome extension for WebSocket testing
3. **SocketIO Tester:** https://socket-io-tester.web.app/

---

## Summary

✅ Postman collection updated with all chat endpoints
✅ REST API testing workflow documented
✅ WebSocket testing via browser explained
✅ HTML test tool provided
✅ Complete testing scenarios included
✅ Troubleshooting guide added

Your chat system is now fully testable! 🎉
