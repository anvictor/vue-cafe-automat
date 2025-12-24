import { ref, onMounted, onUnmounted } from 'vue'
import { io, Socket } from 'socket.io-client'
import type {
    ServerToClientEvents,
    ClientToServerEvents,
    ResourceUpdateEvent,
    RefillEvent
} from '@/types/WebSocket'

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001'

let socket: TypedSocket | null = null
const isConnected = ref(false)
const isConnecting = ref(false)

export function useWebSocket() {
    const connect = () => {
        if (socket?.connected) {
            console.log('[WebSocket] Already connected')
            return socket
        }

        if (isConnecting.value) {
            console.log('[WebSocket] Connection in progress')
            return socket
        }

        isConnecting.value = true
        console.log(`[WebSocket] Connecting to ${WS_URL}...`)

        socket = io(WS_URL, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: Infinity,
            transports: ['websocket', 'polling']
        })

        socket.on('connect', () => {
            console.log('[WebSocket] Connected successfully')
            isConnected.value = true
            isConnecting.value = false
        })

        socket.on('disconnect', (reason) => {
            console.log(`[WebSocket] Disconnected: ${reason}`)
            isConnected.value = false
            isConnecting.value = false
        })

        socket.on('connect_error', (error) => {
            console.error('[WebSocket] Connection error:', error.message)
            isConnecting.value = false
        })

        socket.on('connection:established', () => {
            console.log('[WebSocket] Connection established by server')
        })

        return socket
    }

    const disconnect = () => {
        if (socket) {
            console.log('[WebSocket] Disconnecting...')
            socket.disconnect()
            socket = null
            isConnected.value = false
            isConnecting.value = false
        }
    }

    const emitResourceUpdate = (inventory: ResourceUpdateEvent['inventory']) => {
        if (!socket?.connected) {
            console.warn('[WebSocket] Cannot emit resource update - not connected')
            return
        }

        const event: ResourceUpdateEvent = {
            inventory,
            timestamp: Date.now()
        }

        socket.emit('client:resource-update', event)
        console.log('[WebSocket] Emitted resource update:', event)
    }

    const emitRefill = (amounts: RefillEvent['amounts']) => {
        if (!socket?.connected) {
            console.warn('[WebSocket] Cannot emit refill - not connected')
            return
        }

        const event: RefillEvent = {
            amounts,
            timestamp: Date.now()
        }

        socket.emit('admin:refill', event)
        console.log('[WebSocket] Emitted refill:', event)
    }

    const onResourceUpdate = (callback: (data: ResourceUpdateEvent) => void) => {
        if (!socket) {
            console.warn('[WebSocket] Cannot listen for resource updates - socket not initialized')
            return
        }

        socket.on('admin:resource-update', callback)
        console.log('[WebSocket] Listening for admin:resource-update events')
    }

    const onRefillUpdate = (callback: (data: RefillEvent) => void) => {
        if (!socket) {
            console.warn('[WebSocket] Cannot listen for refill updates - socket not initialized')
            return
        }

        socket.on('client:refill-update', callback)
        console.log('[WebSocket] Listening for client:refill-update events')
    }

    const offResourceUpdate = (callback: (data: ResourceUpdateEvent) => void) => {
        socket?.off('admin:resource-update', callback)
    }

    const offRefillUpdate = (callback: (data: RefillEvent) => void) => {
        socket?.off('client:refill-update', callback)
    }

    return {
        socket,
        isConnected,
        isConnecting,
        connect,
        disconnect,
        emitResourceUpdate,
        emitRefill,
        onResourceUpdate,
        onRefillUpdate,
        offResourceUpdate,
        offRefillUpdate
    }
}

// Auto-cleanup composable for Vue components
export function useWebSocketAutoConnect() {
    const ws = useWebSocket()

    onMounted(() => {
        ws.connect()
    })

    onUnmounted(() => {
        // Don't disconnect on unmount - keep connection alive for other components
        // Only disconnect when explicitly needed
    })

    return ws
}
