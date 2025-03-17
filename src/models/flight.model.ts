export interface FlightModel {
    id: number
    type: {
        id: number
        name: string
    }
    flightKey: string
    flightNumber: string
    destination: string
    scheduledAt: string
    estimatedAt: null | string
    connectedType: string
    connectedFlight: string,
    plane: string
    gate: null | string
    terminal: string
    temperature: null | number
}