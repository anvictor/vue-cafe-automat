import type { ResourceInventory } from './Coffee'

export interface ResourceUpdateEvent {
    inventory: ResourceInventory
    timestamp: number
}

export interface RefillEvent {
    amounts: Partial<ResourceInventory>
    timestamp: number
}

export interface ServerToClientEvents {
    'admin:resource-update': (data: ResourceUpdateEvent) => void
    'client:refill-update': (data: RefillEvent) => void
    'connection:established': () => void
}

export interface ClientToServerEvents {
    'client:resource-update': (data: ResourceUpdateEvent) => void
    'admin:refill': (data: RefillEvent) => void
}

export interface InterServerEvents {
    ping: () => void
}

export interface SocketData {
    userId: string
    role: 'client' | 'admin'
}
