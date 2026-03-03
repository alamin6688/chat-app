# 💬 IO CHAT(Socket.IO Real-Time Chat App)

A real-time chat application built with **Node.js**, **Express**, **Socket.IO**, and **Tailwind CSS**. Messages sent by any user are instantly broadcast to all connected clients — no page refresh needed.

---

## 🗂️ Project Structure

```
Socketioexam/
├── public/
│   ├── index.html       # Frontend UI (Chat interface)
│   ├── scripts.js       # Client-side Socket.IO logic
│   └── output.css       # Compiled Tailwind CSS (auto-generated)
├── src/
│   └── input.css        # Tailwind CSS input file
├── server.js            # Express + Socket.IO server
├── package.json
└── README.md
```

---

## ⚙️ How It Works

### Architecture Overview

```
Browser (Tab 1)          Node.js Server          Browser (Tab 2)
     |                        |                        |
     |-- io() connect ------->|                        |
     |                        |<------- io() connect --|
     |                        |                        |
     |-- emit('message') ---->|                        |
     |                        |-- io.emit('message') ->|  ← Broadcast to ALL
     |<-----------------------|-- io.emit('message') --|  ← Including sender
```

### Key Concepts

| Term | What it does |
|------|-------------|
| `socket.emit('event', data)` | **Server → 1 Client**: Sends data only to the connected client |
| `io.emit('event', data)` | **Server → All Clients**: Broadcasts data to everyone connected |
| `socket.on('event', callback)` | Listens for an incoming event (works on both client and server) |

### Event Flow

1. **User opens the browser** → `io()` connects to the server
2. **Server detects connection** → fires `io.on('connection', ...)`
3. **Server sends a welcome** → `socket.emit('welcome', data)` to the new user only
4. **Server notifies everyone** → `io.emit('newClient', socket.id)` to all clients
5. **User sends a message** → `socket.emit('message', text)` goes to server
6. **Server broadcasts** → `io.emit('message', { text, senderId })` to everyone
7. **All browsers receive** → The message appears instantly in the chat box

### Message Alignment Logic (Like WhatsApp/Messenger)

- **Your messages** → appear on the **right** (Indigo/Blue bubble)
- **Others' messages** → appear on the **left** (White bubble)

This works because the server sends back the `senderId` with each message. The client compares it with its own `socket.id` to decide which side to render on.

---

## 🚀 Setup & Installation

### Prerequisites

Make sure you have **Node.js** installed. You can download it from [nodejs.org](https://nodejs.org/).

```bash
node --version   # Should be v16 or higher
npm --version
```

### Steps

**1. Clone or open the project folder:**

```bash
cd Socketioexam
```

**2. Install dependencies:**

```bash
npm install
```

**3. Build the Tailwind CSS** (required for the UI to look correct):

```bash
npm run build:css
```

**4. Start the server:**

```bash
npm run start
```

You should see the server running with output like:
```
> node server.js
```

**5. Open the app in your browser:**

Go to → [http://localhost:4000](http://localhost:4000)

---

## 🧪 Testing the Real-Time Chat

This is the best way to test Socket.IO broadcasting:

### Step 1 — Open Two Browser Tabs
- Open your browser and navigate to `http://localhost:4000`
- Open a **second tab** (or a new Incognito/Private window) and also navigate to `http://localhost:4000`
- You now have **two separate "users"** connected to the same server

### Step 2 — Send a Message
- In **Tab 1**, type any message in the input box (e.g., `"Hello from Tab 1"`)
- Click the **Send button** (blue arrow icon) or press `Enter`

### Step 3 — Check the Result
- Switch to **Tab 2** — you should see the message appear **instantly** without reloading
- The message will appear on the **left side** (as it came from another user)
- In **Tab 1**, the same message appears on the **right side** (because you sent it)

### Expected Console Output (Browser DevTools → Console):
```
Connected to server with ID: abc123XYZ
```

### Expected Console Output (Terminal/Server):
```
abc123XYZ has joined our server!
def456ABC has joined our server!
message from client Hello from Tab 1
```

---

## 📜 Available npm Scripts

| Command | Description |
|---------|-------------|
| `npm run start` | Starts the Node.js server on port 4000 |
| `npm run dev` | Starts the server with `nodemon` (auto-restart on file change) |
| `npm run build:css` | Compiles `src/input.css` → `public/output.css` using Tailwind |
| `npm run watch:css` | Watches for CSS changes and recompiles automatically |

> **Tip for development:** Run `npm run dev` and `npm run watch:css` together in two separate terminals so both your server and CSS update automatically as you code.

---

## 🛠️ Tech Stack

| Technology | Role |
|------------|------|
| [Node.js](https://nodejs.org/) | JavaScript runtime for the server |
| [Express.js](https://expressjs.com/) | HTTP server and static file serving |
| [Socket.IO](https://socket.io/) | Real-time, bidirectional event-based communication |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first CSS framework for styling |

---

## 🔌 Socket.IO Events Reference

### Server-Side (`server.js`)

| Event | Direction | Description |
|-------|-----------|-------------|
| `connection` | Client → Server | Fires when a new client connects |
| `welcome` | Server → Client (1) | Sent to the newly connected client only |
| `newClient` | Server → All Clients | Notifies everyone when someone joins |
| `message` (receive) | Client → Server | Server receives a chat message |
| `message` (broadcast) | Server → All Clients | Server broadcasts the message to everyone |

### Client-Side (`scripts.js`)

| Event | Direction | Description |
|-------|-----------|-------------|
| `connect` | Server → Client | Fires when connection is successfully established |
| `welcome` | Server → Client | Receives the welcome data from server |
| `newClient` | Server → Client | Notified when another user joins |
| `message` (emit) | Client → Server | Sends the typed message to the server |
| `message` (on) | Server → Client | Receives a broadcasted message to display in UI |

---

## 🙋 FAQ

**Q: Why do I see `[4,5,6]` in the chat on first load?**
> That's the `welcome` event test data from the server. The server sends `[1,2,3]` to the new client via `socket.emit('welcome', [1,2,3])`. The client then emits it back as a `message`. You can remove this test behavior from `scripts.js` when done learning.

**Q: Why did I get "socket has already been declared" error?**
> This happens if `scripts.js` is included twice in `index.html`. Make sure it only appears once, at the bottom of the `<body>` tag.

**Q: Messages appear on the wrong side?**
> Make sure you've restarted the server after changing `server.js`. The server needs to broadcast `{ text, senderId }` as an object — if it sends a plain string, the `isMe` check won't work.
