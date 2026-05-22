'use client'

import * as React from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Percent, ArrowRight, AlertCircle } from 'lucide-react'
import { mockProducts, mockCombos } from '@/lib/mock-data'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function PreciosPage() {
  const [percentage, setPercentage] = React.useState(10)
  const [rounding, setRounding] = React.useState<'50' | '100'>('100')
  const [applyTo, setApplyTo] = React.useState<'all' | 'mostrador' | 'pedidosya'>('all')
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false)

  const roundToNearest = (value: number, nearest: number) => {
    return Math.round(value / nearest) * nearest
  }

  const calculateNewPrice = (price: number) => {
    const increased = price * (1 + percentage / 100)
    return roundToNearest(increased, Number(rounding))
  }

  const allItems = [
    ...mockProducts.map((p) => ({
      id: p.id,
      name: p.name,
      type: 'Producto',
      priceMostrador: p.priceMostrador,
      pricePedidosYa: p.pricePedidosYa,
    })),
    ...mockCombos.map((c) => ({
      id: c.id,
      name: c.name,
      type: 'Combo',
      priceMostrador: c.priceMostrador,
      pricePedidosYa: c.pricePedidosYa,
    })),
  ]

  return (
    <AppShell
      title="Gestion de Precios"
      description="Ajuste masivo de precios"
    >
      <div className="space-y-6">
        {/* Price Adjustment Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="size-5" />
              Aumento Masivo de Precios
            </CardTitle>
            <CardDescription>
              Aplica un aumento porcentual a todos los productos y combos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-4">
                <Label>Porcentaje de Aumento</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[percentage]}
                    onValueChange={(v) => setPercentage(v[0])}
                    min={0}
                    max={50}
                    step={1}
                    className="flex-1"
                  />
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={percentage}
                      onChange={(e) => setPercentage(Number(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-muted-foreground">%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Redondeo</Label>
                <Select value={rounding} onValueChange={(v: '50' | '100') => setRounding(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">Redondear a $50</SelectItem>
                    <SelectItem value="100">Redondear a $100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Aplicar a</Label>
                <Select value={applyTo} onValueChange={(v: 'all' | 'mostrador' | 'pedidosya') => setApplyTo(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los precios</SelectItem>
                    <SelectItem value="mostrador">Solo Mostrador</SelectItem>
                    <SelectItem value="pedidosya">Solo PedidosYa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Alert>
              <AlertCircle className="size-4" />
              <AlertDescription>
                Esta accion aplicara un aumento del {percentage}% a {allItems.length} items.
                Los precios se redondearan a ${rounding}.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end">
              <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <SheetTrigger asChild>
                  <Button>
                    Previsualizar Cambios
                    <ArrowRight className="size-4 ml-2" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-2xl">
                  <SheetHeader>
                    <SheetTitle>Previsualizacion de Precios</SheetTitle>
                    <SheetDescription>
                      Revisa los cambios antes de aplicarlos
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 max-h-[calc(100vh-200px)] overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead className="text-right">Actual</TableHead>
                          <TableHead className="text-right">Nuevo</TableHead>
                          <TableHead className="text-right">Diferencia</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allItems.map((item) => {
                          const showMostrador = applyTo === 'all' || applyTo === 'mostrador'
                          const showPedidosYa = applyTo === 'all' || applyTo === 'pedidosya'
                          return (
                            <React.Fragment key={item.id}>
                              {showMostrador && (
                                <TableRow>
                                  <TableCell>
                                    <div>
                                      <p className="font-medium">{item.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {item.type} - Mostrador
                                      </p>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    ${item.priceMostrador.toLocaleString()}
                                  </TableCell>
                                  <TableCell className="text-right font-medium text-primary">
                                    ${calculateNewPrice(item.priceMostrador).toLocaleString()}
                                  </TableCell>
                                  <TableCell className="text-right text-success">
                                    +${(calculateNewPrice(item.priceMostrador) - item.priceMostrador).toLocaleString()}
                                  </TableCell>
                                </TableRow>
                              )}
                              {showPedidosYa && (
                                <TableRow>
                                  <TableCell>
                                    <div>
                                      <p className="font-medium">{item.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {item.type} - PedidosYa
                                      </p>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    ${item.pricePedidosYa.toLocaleString()}
                                  </TableCell>
                                  <TableCell className="text-right font-medium text-primary">
                                    ${calculateNewPrice(item.pricePedidosYa).toLocaleString()}
                                  </TableCell>
                                  <TableCell className="text-right text-success">
                                    +${(calculateNewPrice(item.pricePedidosYa) - item.pricePedidosYa).toLocaleString()}
                                  </TableCell>
                                </TableRow>
                              )}
                            </React.Fragment>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  <SheetFooter className="mt-6">
                    <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={() => setIsPreviewOpen(false)}>
                      Aplicar Cambios
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </CardContent>
        </Card>

        {/* Current Prices Table */}
        <Card>
          <CardHeader>
            <CardTitle>Precios Actuales</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Mostrador</TableHead>
                  <TableHead className="text-right">PedidosYa</TableHead>
                  <TableHead className="text-right">Diferencia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">{item.type}</TableCell>
                    <TableCell className="text-right">
                      ${item.priceMostrador.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      ${item.pricePedidosYa.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      +${(item.pricePedidosYa - item.priceMostrador).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
