'use client'

import * as React from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Clock,
  Phone,
  MapPin,
  ChefHat,
  CheckCircle2,
  Truck,
  XCircle,
  RefreshCw,
} from 'lucide-react'
import { mockOrders } from '@/lib/mock-data'
import type { Order, OrderStatus } from '@/types'

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  nuevo: { label: 'Nuevo', color: 'bg-blue-500', icon: RefreshCw },
  preparando: { label: 'Preparando', color: 'bg-yellow-500', icon: ChefHat },
  listo: { label: 'Listo', color: 'bg-green-500', icon: CheckCircle2 },
  entregado: { label: 'Entregado', color: 'bg-gray-500', icon: Truck },
  cancelado: { label: 'Cancelado', color: 'bg-red-500', icon: XCircle },
}

function getTimeElapsed(createdAt: Date): number {
  return Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60))
}

function getUrgencyColor(minutes: number): string {
  if (minutes < 10) return 'bg-card'
  if (minutes < 20) return 'bg-warning/10 border-warning/30'
  if (minutes < 30) return 'bg-warning/20 border-warning/50'
  return 'bg-destructive/20 border-destructive/50'
}

function getUrgencyTextColor(minutes: number): string {
  if (minutes < 10) return 'text-muted-foreground'
  if (minutes < 20) return 'text-warning'
  if (minutes < 30) return 'text-warning'
  return 'text-destructive'
}

function OrderCard({
  order,
  onStatusChange,
  onViewDetails,
}: {
  order: Order
  onStatusChange: (orderId: string, status: OrderStatus) => void
  onViewDetails: (order: Order) => void
}) {
  const minutes = getTimeElapsed(order.createdAt)
  const urgencyColor = getUrgencyColor(minutes)
  const urgencyTextColor = getUrgencyTextColor(minutes)
  const StatusIcon = statusConfig[order.status].icon

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg ${urgencyColor}`}
      onClick={() => onViewDetails(order)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{order.id}</CardTitle>
            {order.source === 'pedidosya' && (
              <Badge className="bg-[#fa0050] hover:bg-[#fa0050]/90 text-white text-xs">
                PedidosYa
              </Badge>
            )}
          </div>
          <Badge
            variant="outline"
            className={`${statusConfig[order.status].color} text-white border-none`}
          >
            <StatusIcon className="size-3 mr-1" />
            {statusConfig[order.status].label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Timer */}
        <div className={`flex items-center gap-2 ${urgencyTextColor}`}>
          <Clock className="size-4" />
          <span className="text-sm font-medium">
            {minutes} min
          </span>
          {minutes >= 20 && (
            <span className="text-xs">- URGENTE</span>
          )}
        </div>

        {/* Items */}
        <div className="space-y-1">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.quantity}x {item.name}
              </span>
            </div>
          ))}
        </div>

        {/* Customer */}
        <div className="pt-2 border-t space-y-1">
          <p className="font-medium text-sm">{order.customerName}</p>
          {order.customerPhone && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="size-3" />
              {order.customerPhone}
            </div>
          )}
          {order.customerAddress && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              <span className="truncate">{order.customerAddress}</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="pt-2 border-t">
          {order.source === 'pedidosya' && order.totalPedidosYa ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">
                ${order.totalPedidosYa.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                ${order.totalMostrador.toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold">
              ${order.totalMostrador.toLocaleString()}
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
          {order.status === 'nuevo' && (
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onStatusChange(order.id, 'preparando')}
            >
              <ChefHat className="size-4 mr-1" />
              Preparar
            </Button>
          )}
          {order.status === 'preparando' && (
            <Button
              size="sm"
              className="flex-1 bg-success hover:bg-success/90"
              onClick={() => onStatusChange(order.id, 'listo')}
            >
              <CheckCircle2 className="size-4 mr-1" />
              Listo
            </Button>
          )}
          {order.status === 'listo' && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onStatusChange(order.id, 'entregado')}
            >
              <Truck className="size-4 mr-1" />
              Entregar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
  onStatusChange,
}: {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (orderId: string, status: OrderStatus) => void
}) {
  if (!order) return null

  const minutes = getTimeElapsed(order.createdAt)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>{order.id}</DialogTitle>
            {order.source === 'pedidosya' && (
              <Badge className="bg-[#fa0050] hover:bg-[#fa0050]/90 text-white">
                PedidosYa
              </Badge>
            )}
          </div>
          <DialogDescription>
            Creado hace {minutes} minutos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Estado:</span>
            <Select
              value={order.status}
              onValueChange={(value: OrderStatus) => onStatusChange(order.id, value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nuevo">Nuevo</SelectItem>
                <SelectItem value="preparando">Preparando</SelectItem>
                <SelectItem value="listo">Listo</SelectItem>
                <SelectItem value="entregado">Entregado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Customer Info */}
          <div className="p-4 rounded-lg bg-muted space-y-2">
            <p className="font-semibold">{order.customerName}</p>
            {order.customerPhone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="size-4 text-muted-foreground" />
                {order.customerPhone}
              </div>
            )}
            {order.customerAddress && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="size-4 text-muted-foreground" />
                {order.customerAddress}
              </div>
            )}
          </div>

          {/* Items */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Items del Pedido:</p>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between p-2 rounded bg-muted/50"
                >
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-medium">
                    ${item.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="font-semibold">Total:</span>
            <div className="text-right">
              {order.source === 'pedidosya' && order.totalPedidosYa ? (
                <div>
                  <span className="text-2xl font-bold text-primary">
                    ${order.totalPedidosYa.toLocaleString()}
                  </span>
                  <p className="text-sm text-muted-foreground">
                    Mostrador: ${order.totalMostrador.toLocaleString()}
                  </p>
                </div>
              ) : (
                <span className="text-2xl font-bold">
                  ${order.totalMostrador.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Medio de pago:</span>
            <Badge variant="outline" className="capitalize">
              {order.paymentMethod}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function PedidosPage() {
  const [orders, setOrders] = React.useState<Order[]>(mockOrders)
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null)
  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const [statusFilter, setStatusFilter] = React.useState<'all' | OrderStatus>('all')
  const [, setTick] = React.useState(0)

  // Update timer every minute
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1)
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    )
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setDetailsOpen(true)
  }

  const filteredOrders = orders.filter(
    (o) => statusFilter === 'all' || o.status === statusFilter
  )

  // Group orders by status
  const ordersByStatus = {
    nuevo: filteredOrders.filter((o) => o.status === 'nuevo'),
    preparando: filteredOrders.filter((o) => o.status === 'preparando'),
    listo: filteredOrders.filter((o) => o.status === 'listo'),
    entregado: filteredOrders.filter((o) => o.status === 'entregado'),
  }

  // Sort by time (oldest first for urgency)
  const sortByTime = (a: Order, b: Order) =>
    a.createdAt.getTime() - b.createdAt.getTime()

  return (
    <AppShell
      title="Pedidos"
      description="Cola de pedidos en tiempo real"
      actions={
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={(v: 'all' | OrderStatus) => setStatusFilter(v)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filtrar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="nuevo">Nuevos</SelectItem>
              <SelectItem value="preparando">Preparando</SelectItem>
              <SelectItem value="listo">Listos</SelectItem>
              <SelectItem value="entregado">Entregados</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <RefreshCw className="size-4" />
          </Button>
        </div>
      }
    >
      {/* Kanban-style layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
        {/* Nuevos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <div className="size-3 rounded-full bg-blue-500" />
              Nuevos
            </h2>
            <Badge variant="secondary">{ordersByStatus.nuevo.length}</Badge>
          </div>
          <div className="space-y-4">
            {ordersByStatus.nuevo.sort(sortByTime).map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
                onViewDetails={handleViewDetails}
              />
            ))}
            {ordersByStatus.nuevo.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No hay pedidos nuevos
              </div>
            )}
          </div>
        </div>

        {/* Preparando */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <div className="size-3 rounded-full bg-yellow-500" />
              Preparando
            </h2>
            <Badge variant="secondary">{ordersByStatus.preparando.length}</Badge>
          </div>
          <div className="space-y-4">
            {ordersByStatus.preparando.sort(sortByTime).map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
                onViewDetails={handleViewDetails}
              />
            ))}
            {ordersByStatus.preparando.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No hay pedidos en preparacion
              </div>
            )}
          </div>
        </div>

        {/* Listos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <div className="size-3 rounded-full bg-green-500" />
              Listos
            </h2>
            <Badge variant="secondary">{ordersByStatus.listo.length}</Badge>
          </div>
          <div className="space-y-4">
            {ordersByStatus.listo.sort(sortByTime).map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
                onViewDetails={handleViewDetails}
              />
            ))}
            {ordersByStatus.listo.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No hay pedidos listos
              </div>
            )}
          </div>
        </div>

        {/* Entregados */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <div className="size-3 rounded-full bg-gray-500" />
              Entregados
            </h2>
            <Badge variant="secondary">{ordersByStatus.entregado.length}</Badge>
          </div>
          <div className="space-y-4 opacity-60">
            {ordersByStatus.entregado.sort(sortByTime).map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
                onViewDetails={handleViewDetails}
              />
            ))}
            {ordersByStatus.entregado.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No hay pedidos entregados
              </div>
            )}
          </div>
        </div>
      </div>

      <OrderDetailsDialog
        order={selectedOrder}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onStatusChange={handleStatusChange}
      />
    </AppShell>
  )
}
