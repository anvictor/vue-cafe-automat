// Transaction and state types

export enum PreparationStatus {
    IDLE = 'idle',
    PREPARING = 'preparing',
    READY = 'ready',
    TAKEN = 'taken'
}

export interface DepositState {
    currentBalance: number // in cents
    requiredAmount: number // in cents
}

export interface PreparationState {
    status: PreparationStatus
    progress: number // 0-100
    coffeeType: string | null
}

export interface ResourceAlert {
    resourceType: string
    currentAmount: number
    threshold: number
    timestamp: number
}

export enum WebSocketMessageType {
    RESOURCE_ALERT = 'resource_alert',
    RESOURCE_UPDATE = 'resource_update',
    WAREHOUSE_UPDATE = 'warehouse_update',
    REFILL_REQUEST = 'refill_request',
    PURCHASE_REQUEST = 'purchase_request'
}

export interface WebSocketMessage {
    type: WebSocketMessageType
    payload: any
    timestamp: number
}
