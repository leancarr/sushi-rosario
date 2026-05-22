'use client'

import { AppShell } from '@/components/layout/app-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Package,
  DollarSign,
  Users,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { mockFinanceStats, mockInventory, mockOrders } from '@/lib/mock-data'

export default function AdminDashboard() {
  const lowStockItems = mockInventory.filter((item) => item.quantity < item.minStock)
  const pendingOrders = mockOrders.filter((o) => o.status === 'nuevo' || o.status === 'preparando')
  const todayStats = mockFinanceStats.today

  return (
    <AppShell
      title="Dashboard"
      description="Resumen general del negocio"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Hoy</CardTitle>
              <DollarSign className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(todayStats.totalBlanco + todayStats.totalNegro).toLocaleString()}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center text-success">
                  <ArrowUpRight className="size-3" />
                  12%
                </span>
                vs. ayer
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Hoy</CardTitle>
              <ShoppingCart className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayStats.totalOrders}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center text-destructive">
                  <ArrowDownRight className="size-3" />
                  3%
                </span>
                vs. ayer
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
              <TrendingUp className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${todayStats.averageTicket.toLocaleString()}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center text-success">
                  <ArrowUpRight className="size-3" />
                  8%
                </span>
                vs. ayer
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas Stock</CardTitle>
              <AlertTriangle className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowStockItems.length}</div>
              <p className="text-xs text-muted-foreground">
                productos bajo mínimo
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Low Stock Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="size-5" />
                Alertas de Inventario
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No hay alertas de stock bajo
                </p>
              ) : (
                <div className="space-y-3">
                  {lowStockItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Stock: {item.quantity} {item.unit} / Min: {item.minStock} {item.unit}
                        </p>
                      </div>
                      <Badge variant="destructive">Bajo Stock</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="size-5" />
                Pedidos Pendientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingOrders.slice(0, 4).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{order.id}</p>
                        {order.source === 'pedidosya' && (
                          <Badge variant="secondary" className="text-xs">
                            PedidosYa
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.customerName} - ${order.totalMostrador.toLocaleString()}
                      </p>
                    </div>
                    <Badge
                      variant={order.status === 'nuevo' ? 'default' : 'secondary'}
                    >
                      {order.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Finance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="size-5" />
              Resumen Financiero de Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <p className="text-sm text-muted-foreground mb-1">En Blanco</p>
                <p className="text-2xl font-bold text-success">
                  ${todayStats.totalBlanco.toLocaleString()}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted border">
                <p className="text-sm text-muted-foreground mb-1">En Negro</p>
                <p className="text-2xl font-bold">
                  ${todayStats.totalNegro.toLocaleString()}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">Efectivo</p>
                <p className="text-2xl font-bold text-primary">
                  ${todayStats.byPaymentMethod.efectivo.toLocaleString()}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-accent border">
                <p className="text-sm text-muted-foreground mb-1">Digital</p>
                <p className="text-2xl font-bold">
                  ${(
                    todayStats.byPaymentMethod.debito +
                    todayStats.byPaymentMethod.credito +
                    todayStats.byPaymentMethod.transferencia
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
