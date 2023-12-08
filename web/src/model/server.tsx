
export interface Servers {
    servers: Server[]
}

export interface Server {
    id: string
    rpcAddr: string
    isLeader: boolean
    gatewayPort: number
    latitude: number
    longitude: number
    distance: number
}
