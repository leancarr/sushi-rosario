// Order Types
export type OrderStatus = 'nuevo' | 'preparando' | 'listo' | 'entregado' | 'cancelado'
export type OrderSource = 'mostrador' | 'pedidosya'
export type PaymentMethod = 'efectivo' | 'debito' | 'credito' | 'transferencia'

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  notes?: string
}

export interface Order {
  id: string
  items: OrderItem[]
  status: OrderStatus
  source: OrderSource
  customerName: string
  customerPhone?: string
  customerAddress?: string
  totalMostrador: number
  totalPedidosYa?: number
  paymentMethod: PaymentMethod
  createdAt: Date
  estimatedTime?: number
}

// Product Types
export interface Product {
  id: string
  name: string
  description: string
  priceMostrador: number
  pricePedidosYa: number
  category: string
  image?: string
  ingredients?: string[]
  available: boolean
}

export interface Combo {
  id: string
  name: string
  description: string
  products: { productId: string; quantity: number }[]
  priceMostrador: number
  pricePedidosYa: number
  image?: string
  available: boolean
}

// Inventory Types
export interface InventoryItem {
  id: string
  name: string
  quantity: number
  unit: string
  minStock: number
  category: string
  lastUpdated: Date
}

// Employee Types
export type EmployeeRole = 'admin' | 'empleado'

export interface Employee {
  id: string
  name: string
  email: string
  phone: string
  role: EmployeeRole
  active: boolean
  createdAt: Date
}

export interface Attendance {
  id: string
  employeeId: string
  employeeName: string
  date: Date
  checkIn: Date
  checkOut?: Date
  hoursWorked?: number
}

// Finance Types
export type IncomeType = 'blanco' | 'negro'

export interface Income {
  id: string
  orderId: string
  amount: number
  type: IncomeType
  paymentMethod: PaymentMethod
  date: Date
  description: string
}

export interface FinanceStats {
  totalBlanco: number
  totalNegro: number
  totalOrders: number
  averageTicket: number
  byPaymentMethod: Record<PaymentMethod, number>
}

// Cart for POS
export interface CartItem extends OrderItem {
  productId: string
}

export interface Cart {
  items: CartItem[]
  total: number
}
