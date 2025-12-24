import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import type {
    ServerToClientEvents,
    ClientToServerEvents,
    InterServerEvents,
    SocketData,
    ResourceUpdateEvent,
    RefillEvent
} from '../src/types/WebSocket'

const app = express()
const httpServer = createServer(app)

// Configure Socket.IO with TypeScript types
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
    httpServer,
    {
        cors: {
            origin: ['http://localhost:5173', 'http://localhost:4173'],
            methods: ['GET', 'POST'],
            credentials: true
        }
    }
)

// Enable CORS for Express
app.use(
    cors({
        origin: ['http://localhost:5173', 'http://localhost:4173'],
        credentials: true
    })
)

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: Date.now(),
        connections: io.engine.clientsCount
    })
})

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`[WebSocket] Client connected: ${socket.id}`)

    // Send confirmation
    socket.emit('connection:established')

    // Handle resource updates from client
    socket.on('client:resource-update', (data: ResourceUpdateEvent) => {
        console.log(`[WebSocket] Resource update from client:`, data)

        // Broadcast to all admin clients
        io.emit('admin:resource-update', data)
    })

    // Handle refill requests from admin
    socket.on('admin:refill', (data: RefillEvent) => {
        console.log(`[WebSocket] Refill request from admin:`, data)

        // Broadcast to all client machines
        io.emit('client:refill-update', data)
    })

    // Handle disconnection
    socket.on('disconnect', (reason) => {
        console.log(`[WebSocket] Client disconnected: ${socket.id}, reason: ${reason}`)
    })
})

const PORT = process.env.PORT || 3001

httpServer.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║   Coffee Machine WebSocket Server     ║
╠════════════════════════════════════════╣
║  Status: Running                       ║
║  Port: ${PORT}                           ║
║  URL: http://localhost:${PORT}           ║
╚════════════════════════════════════════╝
  `)
})

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('[Server] SIGTERM received, closing server...')
    httpServer.close(() => {
        console.log('[Server] Server closed')
        process.exit(0)
    })
})
