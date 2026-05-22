'use client'

import * as React from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Line, LineChart } from 'recharts'
import { DollarSign, TrendingUp, Send, Bot, User } from 'lucide-react'
import { mockIncome, mockFinanceStats, mockChartData } from '@/lib/mock-data'

export default function FinanzasPage() {
  const [timeFilter, setTimeFilter] = React.useState<'today' | 'week' | 'month'>('today')
  const [chatMessages, setChatMessages] = React.useState<
    { role: 'user' | 'assistant'; content: string }[]
  >([
    {
      role: 'assistant',
      content:
        'Hola! Soy tu asistente financiero. Puedo ayudarte a analizar las ventas, comparar periodos, o responder preguntas sobre los ingresos del local. Que te gustaria saber?',
    },
  ])
  const [chatInput, setChatInput] = React.useState('')

  const stats = mockFinanceStats[timeFilter]
  const blancoIncome = mockIncome.filter((i) => i.type === 'blanco')
  const negroIncome = mockIncome.filter((i) => i.type === 'negro')

  const handleSendMessage = () => {
    if (!chatInput.trim()) return

    const userMessage = chatInput.trim()
    setChatMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setChatInput('')

    // Simulate AI response
    setTimeout(() => {
      let response = ''
      if (userMessage.toLowerCase().includes('ventas') || userMessage.toLowerCase().includes('ingresos')) {
        response = `Segun los datos de ${timeFilter === 'today' ? 'hoy' : timeFilter === 'week' ? 'esta semana' : 'este mes'}, los ingresos totales son $${(stats.totalBlanco + stats.totalNegro).toLocaleString()}. Los ingresos en blanco representan el ${Math.round((stats.totalBlanco / (stats.totalBlanco + stats.totalNegro)) * 100)}% del total.`
      } else if (userMessage.toLowerCase().includes('ticket') || userMessage.toLowerCase().includes('promedio')) {
        response = `El ticket promedio ${timeFilter === 'today' ? 'de hoy' : timeFilter === 'week' ? 'de esta semana' : 'de este mes'} es de $${stats.averageTicket.toLocaleString()}. Esto representa un buen indicador de ventas por pedido.`
      } else if (userMessage.toLowerCase().includes('efectivo')) {
        response = `Las ventas en efectivo ${timeFilter === 'today' ? 'de hoy' : timeFilter === 'week' ? 'de esta semana' : 'de este mes'} suman $${stats.byPaymentMethod.efectivo.toLocaleString()}, representando el ${Math.round((stats.byPaymentMethod.efectivo / (stats.totalBlanco + stats.totalNegro)) * 100)}% del total.`
      } else {
        response = `Entiendo tu consulta. Los datos muestran que ${timeFilter === 'today' ? 'hoy' : timeFilter === 'week' ? 'esta semana' : 'este mes'} se realizaron ${stats.totalOrders} pedidos con un ingreso total de $${(stats.totalBlanco + stats.totalNegro).toLocaleString()}. Puedes preguntarme sobre ventas, ticket promedio, o metodos de pago.`
      }
      setChatMessages((prev) => [...prev, { role: 'assistant', content: response }])
    }, 1000)
  }

  const chartConfig = {
    blanco: {
      label: 'En Blanco',
      color: 'var(--chart-2)',
    },
    negro: {
      label: 'En Negro',
      color: 'var(--chart-1)',
    },
  }

  return (
    <AppShell
      title="Finanzas"
      description="Dashboard financiero y estadisticas"
    >
      <div className="space-y-6">
        {/* Time Filter */}
        <div className="flex justify-end">
          <Select value={timeFilter} onValueChange={(v: 'today' | 'week' | 'month') => setTimeFilter(v)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-success/20 bg-success/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos en Blanco</CardTitle>
              <DollarSign className="size-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                ${stats.totalBlanco.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Facturado y registrado
              </p>
            </CardContent>
          </Card>

          <Card className="border-muted">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos en Negro</CardTitle>
              <DollarSign className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.totalNegro.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Sin factura
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
              <TrendingUp className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                Pedidos completados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
              <DollarSign className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.averageTicket.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Por pedido
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Ingresos por Dia</CardTitle>
              <CardDescription>Comparacion Blanco vs Negro</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockChartData.weekly}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="blanco" fill="var(--color-blanco)" radius={4} />
                    <Bar dataKey="negro" fill="var(--color-negro)" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* AI Chatbot */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="size-5" />
                Asistente Financiero IA
              </CardTitle>
              <CardDescription>
                Pregunta sobre estadisticas y analisis
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 h-[200px] pr-4 mb-4">
                <div className="space-y-4">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="size-4 text-primary" />
                        </div>
                      )}
                      <div
                        className={`rounded-lg px-3 py-2 max-w-[80%] ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      {msg.role === 'user' && (
                        <div className="size-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <User className="size-4" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="flex gap-2">
                <Input
                  placeholder="Pregunta sobre las finanzas..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button size="icon" onClick={handleSendMessage}>
                  <Send className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Income Tables */}
        <Tabs defaultValue="blanco">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="blanco">
              Ingresos en Blanco ({blancoIncome.length})
            </TabsTrigger>
            <TabsTrigger value="negro">
              Ingresos en Negro ({negroIncome.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="blanco" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-success">Ingresos Facturados</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Descripcion</TableHead>
                      <TableHead>Medio de Pago</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blancoIncome.map((income) => (
                      <TableRow key={income.id}>
                        <TableCell className="font-medium">{income.orderId}</TableCell>
                        <TableCell className="text-muted-foreground max-w-xs truncate">
                          {income.description}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{income.paymentMethod}</Badge>
                        </TableCell>
                        <TableCell>{income.date.toLocaleDateString('es-AR')}</TableCell>
                        <TableCell className="text-right font-medium text-success">
                          ${income.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="negro" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Ingresos Sin Factura</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Descripcion</TableHead>
                      <TableHead>Medio de Pago</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {negroIncome.map((income) => (
                      <TableRow key={income.id}>
                        <TableCell className="font-medium">{income.orderId}</TableCell>
                        <TableCell className="text-muted-foreground max-w-xs truncate">
                          {income.description}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{income.paymentMethod}</Badge>
                        </TableCell>
                        <TableCell>{income.date.toLocaleDateString('es-AR')}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${income.amount.toLocaleString()}
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
    </AppShell>
  )
}
