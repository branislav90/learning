export interface Shipment { id: string; reference: string; customer: string; status: string; price: number; assignee?: string }
export interface ShipmentPage { items: Shipment[]; nextCursor: string | null; total: number }
