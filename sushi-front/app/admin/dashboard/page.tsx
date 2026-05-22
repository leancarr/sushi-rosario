'use client'

import * as React from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DollarSign,
  Package,
  Clock,
  Tag,
  UserCheck,
  Bot,
  Plus,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Send,
  Banknote,
  CreditCard,
  Smartphone,
  History,
} from 'lucide-react'

// Mock data for the dashboard
const mockDailyStats = {
  totalRecaudado: 89820,
  pedidosProcesados: 12,
  efectivo: 26400,
  transferencia: 32420,
  pedidosYa: 31000,
  peakHours: [
    { hour: '12:00', ventas: 8500 },
    { hour: '13:00', ventas: 15200 },
    { hour: '14:00', ventas: 12300 },
    { hour: '19:00', ventas: 9800 },
    { hour: '20:00', ventas: 18500 },
    { hour: '21:00', ventas: 22100 },
    { hour: '22:00', ventas: 3420 },
  ],
}

const mockInventoryItems = [
  { id: 'inv1', name: 'Salmon', quantity: 3.5, unit: 'kg', minStock: 5 },
  { id: 'inv2', name: 'Arroz', quantity: 25, unit: 'kg', minStock: 10 },
  { id: 'inv3', name: 'Algas Nori', quantity: 50, unit: 'hojas', minStock: 100 },
  { id: 'inv4', name: 'Queso Crema', quantity: 8, unit: 'kg', minStock: 5 },
  { id: 'inv5', name: 'Palta', quantity: 2, unit: 'kg', minStock: 4 },
]

const mockMovements = [
  { id: 'm1', date: '22/05', time: '10:30', product: 'Salmon', qty: '+5', reason: 'Ingreso proveedor' },
  { id: 'm2', date: '22/05', time: '14:15', product: 'Arroz', qty: '-3', reason: 'Venta' },
  { id: 'm3', date: '22/05', time: '16:00', product: 'Palta', qty: '+10', reason: 'Ingreso proveedor' },
  { id: 'm4', date: '21/05', time: '20:30', product: 'Algas Nori', qty: '-20', reason: 'Venta' },
  { id: 'm5', date: '21/05', time: '11:00', product: 'Queso Crema', qty: '+5', reason: 'Ingreso proveedor' },
  { id: 'm6', date: '21/05', time: '19:45', product: 'Salmon', qty: '-2', reason: 'Venta' },
]

const mockPromotions = [
  { id: 'p1', name: '20% Off Efectivo', description: 'Descuento en pedidos pagados con efectivo', active: true },
  { id: 'p2', name: 'Combo Sushi Libre', description: '40 piezas + bebida por $12.900', active: true },
  { id: 'p3', name: '2x1 Rolls', description: 'Martes y Miercoles', active: false },
]

const mockTodayAttendance = [
  { id: 'a1', name: 'Laura Cocina', checkIn: '10:00', checkOut: null },
  { id: 'a2', name: 'Miguel Caja', checkIn: '11:00', checkOut: null },
  { id: 'a3', name: 'Roberto Sushi', checkIn: '09:30', checkOut: '18:00' },
]

const faqQuestions = [
  'Cual es el combo mas vendido?',
  'Cuanto stock queda de salmon?',
  'Cuantos pedidos hay pendientes?',
  'Cual es el total de caja hoy?',
]

export default function DashboardPage() {
  const [inventory, setInventory] = React.useState(mockInventoryItems)
  const [chatOpen, setChatOpen] = React.useState(false)
  const [chatMessage, setChatMessage] = React.useState('')
  const [chatHistory, setChatHistory] = React.useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [currentTime, setCurrentTime] = React.useState(new Date())

  // Update current time every second
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleStockChange = (itemId: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
    )
  }

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return
    setChatHistory((prev) => [
      ...prev,
      { role: 'user', content: chatMessage },
      { role: 'assistant', content: getAIResponse(chatMessage) },
    ])
    setChatMessage('')
  }

  const handleFaqClick = (question: string) => {
    setChatHistory((prev) => [
      ...prev,
      { role: 'user', content: question },
      { role: 'assistant', content: getAIResponse(question) },
    ])
  }

  const getAIResponse = (question: string): string => {
    const q = question.toLowerCase()
    if (q.includes('combo') && q.includes('vendido')) {
      return 'El combo mas vendido es el "Combo Pareja" con 45 unidades esta semana.'
    }
    if (q.includes('salmon') || q.includes('stock')) {
      return 'Quedan 3.5 kg de salmon. El stock minimo es 5 kg. Te recomiendo hacer un pedido pronto.'
    }
    if (q.includes('pendientes') || q.includes('pedidos')) {
      return 'Hay 3 pedidos pendientes en este momento: 1 nuevo y 2 en preparacion.'
    }
    if (q.includes('caja') || q.includes('total')) {
      return 'El total de caja hoy es $89.820. Efectivo: $26.400, Transferencia: $32.420, PedidosYa: $31.000.'
    }
    return 'Entiendo tu consulta. Dejame verificar esa informacion en el sistema.'
  }

  const maxSales = Math.max(...mockDailyStats.peakHours.map((h) => h.ventas))

  return (
    <AppShell
      title="Panel de Control"
      description="Resumen operativo del dia"
    >
      <div className="space-y-6">
        <Tabs defaultValue="resumen">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="inventario">Inventario</TabsTrigger>
            <TabsTrigger value="historico">Historico</TabsTrigger>
            <TabsTrigger value="promociones">Promociones</TabsTrigger>
            <TabsTrigger value="asistencia">Asistencia</TabsTrigger>
          </TabsList>

          {/* Vista 1: Resumen del Dia */}
          <TabsContent value="resumen" className="mt-6 space-y-6">
            {/* Metric Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Recaudado</CardTitle>
                  <DollarSign className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${mockDailyStats.totalRecaudado.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center text-success">
                      <ArrowUpRight className="size-3" />
                      15%
                    </span>
                    vs. ayer
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pedidos Procesados</CardTitle>
                  <Package className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockDailyStats.pedidosProcesados}</div>
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
                  <CardTitle className="text-sm font-medium">Efectivo</CardTitle>
                  <Banknote className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${mockDailyStats.efectivo.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {((mockDailyStats.efectivo / mockDailyStats.totalRecaudado) * 100).toFixed(0)}% del total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Transferencia</CardTitle>
                  <CreditCard className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${mockDailyStats.transferencia.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {((mockDailyStats.transferencia / mockDailyStats.totalRecaudado) * 100).toFixed(0)}% del total
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Income Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="size-5" />
                  PedidosYa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      ${mockDailyStats.pedidosYa.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {((mockDailyStats.pedidosYa / mockDailyStats.totalRecaudado) * 100).toFixed(0)}% del total de hoy
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center text-destructive">
                      <ArrowDownRight className="size-3" />
                      5%
                    </span>
                    vs. ayer
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Peak Hours Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="size-5" />
                  Picos de Ventas por Hora
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2 h-40">
                  {mockDailyStats.peakHours.map((hourData) => (
                    <div key={hourData.hour} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-primary/80 rounded-t-sm transition-all hover:bg-primary"
                        style={{ height: `${(hourData.ventas / maxSales) * 100}%` }}
                      />
                      <span className="text-xs text-muted-foreground">{hourData.hour}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Hora pico: 21:00 - $22.100 en ventas
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vista 2: Control de Inventario */}
          <TabsContent value="inventario" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="size-5" />
                  Control de Stock
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Insumo</TableHead>
                      <TableHead className="text-center">Cantidad</TableHead>
                      <TableHead className="text-center">Unidad</TableHead>
                      <TableHead className="text-center">Ajustar</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.map((item) => {
                      const isLowStock = item.quantity < item.minStock
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-center font-mono">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">
                            {item.unit}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="size-8"
                                onClick={() => handleStockChange(item.id, -1)}
                              >
                                <Minus className="size-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="size-8"
                                onClick={() => handleStockChange(item.id, 1)}
                              >
                                <Plus className="size-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            {isLowStock ? (
                              <Badge variant="destructive" className="gap-1">
                                <AlertTriangle className="size-3" />
                                Bajo Stock
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                                OK
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vista 3: Historico de Movimientos */}
          <TabsContent value="historico" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="size-5" />
                  Historico de Movimientos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMovements.map((movement) => (
                    <div
                      key={movement.id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 border"
                    >
                      <div className="flex flex-col items-center min-w-[60px]">
                        <span className="text-sm font-medium">{movement.date}</span>
                        <span className="text-xs text-muted-foreground">{movement.time}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{movement.product}</p>
                        <p className="text-sm text-muted-foreground">{movement.reason}</p>
                      </div>
                      <Badge
                        variant={movement.qty.startsWith('+') ? 'secondary' : 'outline'}
                        className={
                          movement.qty.startsWith('+')
                            ? 'bg-success/10 text-success border-success/20'
                            : 'bg-destructive/10 text-destructive border-destructive/20'
                        }
                      >
                        {movement.qty}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vista 4: Promociones y Descuentos */}
          <TabsContent value="promociones" className="mt-6 space-y-6">
            <div className="flex justify-end">
              <Button>
                <Plus className="size-4 mr-2" />
                Crear nueva promocion
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockPromotions.map((promo) => (
                <Card key={promo.id} className={!promo.active ? 'opacity-60' : ''}>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <Tag className="size-4 text-primary" />
                      {promo.name}
                    </CardTitle>
                    <Badge variant={promo.active ? 'default' : 'outline'}>
                      {promo.active ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{promo.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Vista 5: Control de Asistencia */}
          <TabsContent value="asistencia" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="size-5" />
                  Reloj Control
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-6 py-4">
                  <div className="text-6xl font-mono font-bold">
                    {currentTime.toLocaleTimeString('es-AR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </div>
                  <p className="text-muted-foreground">
                    {currentTime.toLocaleDateString('es-AR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <div className="flex gap-4">
                    <Button size="lg" className="px-8">
                      <UserCheck className="size-5 mr-2" />
                      Fichar Entrada
                    </Button>
                    <Button size="lg" variant="outline" className="px-8">
                      <Clock className="size-5 mr-2" />
                      Fichar Salida
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Asistencias del Dia</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empleado</TableHead>
                      <TableHead className="text-center">Entrada</TableHead>
                      <TableHead className="text-center">Salida</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTodayAttendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.name}</TableCell>
                        <TableCell className="text-center">{record.checkIn}</TableCell>
                        <TableCell className="text-center">
                          {record.checkOut || '-'}
                        </TableCell>
                        <TableCell>
                          {record.checkOut ? (
                            <Badge variant="outline">Finalizado</Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                              Trabajando
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating AI Assistant Button */}
      <Popover open={chatOpen} onOpenChange={setChatOpen}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-6 right-6 size-14 rounded-full shadow-lg z-50"
          >
            <Bot className="size-6" />
            <span className="sr-only">Asistente IA</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          side="top"
          className="w-80 p-0"
          sideOffset={16}
        >
          <div className="flex flex-col h-96">
            <div className="p-4 border-b bg-muted/50">
              <h4 className="font-semibold flex items-center gap-2">
                <Bot className="size-4" />
                Asistente Rosario Sushi
              </h4>
              <p className="text-xs text-muted-foreground">
                Preguntame lo que necesites
              </p>
            </div>

            {/* FAQ Quick Actions */}
            {chatHistory.length === 0 && (
              <div className="p-3 border-b space-y-2">
                <p className="text-xs text-muted-foreground mb-2">Preguntas rapidas:</p>
                {faqQuestions.map((question, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs h-auto py-2 px-3"
                    onClick={() => handleFaqClick(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            )}

            {/* Chat History */}
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Chat Input */}
            <div className="p-3 border-t flex gap-2">
              <Input
                placeholder="Escribe tu pregunta..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button size="icon" onClick={handleSendMessage}>
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </AppShell>
  )
}
