'use client'

import * as React from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Minus, Pencil, Search, AlertTriangle, History, Package, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import { mockInventory } from '@/lib/mock-data'
import type { InventoryItem } from '@/types'

// Stock movement type
interface StockMovement {
  id: string
  fecha: Date
  tipo: 'ingreso' | 'egreso'
  producto: string
  cantidad: number
  unidad: string
  marca?: string
  motivo: string
}

// Mock stock movements
const mockMovements: StockMovement[] = [
  {
    id: 'mov1',
    fecha: new Date(),
    tipo: 'ingreso',
    producto: 'Salmon Fresco',
    cantidad: 5,
    unidad: 'kg',
    marca: 'Pescaderia Mar',
    motivo: 'Compra proveedor',
  },
  {
    id: 'mov2',
    fecha: new Date(),
    tipo: 'egreso',
    producto: 'Salmon Fresco',
    cantidad: 1.5,
    unidad: 'kg',
    motivo: 'Uso en pedidos',
  },
  {
    id: 'mov3',
    fecha: new Date(Date.now() - 1 * 60 * 60 * 1000),
    tipo: 'ingreso',
    producto: 'Arroz para Sushi',
    cantidad: 10,
    unidad: 'kg',
    marca: 'Arroz Premium',
    motivo: 'Reposicion stock',
  },
  {
    id: 'mov4',
    fecha: new Date(Date.now() - 2 * 60 * 60 * 1000),
    tipo: 'egreso',
    producto: 'Nori (Alga)',
    cantidad: 20,
    unidad: 'hojas',
    motivo: 'Uso en produccion',
  },
  {
    id: 'mov5',
    fecha: new Date(Date.now() - 24 * 60 * 60 * 1000),
    tipo: 'egreso',
    producto: 'Wasabi',
    cantidad: 0.2,
    unidad: 'kg',
    motivo: 'Merma - vencimiento',
  },
  {
    id: 'mov6',
    fecha: new Date(Date.now() - 24 * 60 * 60 * 1000),
    tipo: 'ingreso',
    producto: 'Queso Crema',
    cantidad: 4,
    unidad: 'kg',
    marca: 'Philadelphia',
    motivo: 'Compra proveedor',
  },
]

export default function InventarioPage() {
  const [inventory, setInventory] = React.useState<InventoryItem[]>(mockInventory)
  const [movements, setMovements] = React.useState<StockMovement[]>(mockMovements)
  const [search, setSearch] = React.useState('')
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<InventoryItem | null>(null)
  const [adjustQuantity, setAdjustQuantity] = React.useState<Record<string, number>>({})
  const [adjustMotivo, setAdjustMotivo] = React.useState<Record<string, string>>({})

  const categories = [...new Set(inventory.map((item) => item.category))]

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleSave = (item: Partial<InventoryItem>) => {
    if (editingItem) {
      setInventory((prev) =>
        prev.map((i) => (i.id === editingItem.id ? { ...i, ...item } : i))
      )
    } else {
      setInventory((prev) => [
        ...prev,
        {
          ...item,
          id: `inv${Date.now()}`,
          lastUpdated: new Date(),
        } as InventoryItem,
      ])
    }
    setIsAddDialogOpen(false)
    setEditingItem(null)
  }

  // Handle quantity adjustment with +/- buttons
  const handleAdjust = (item: InventoryItem, delta: number) => {
    const currentAdjust = adjustQuantity[item.id] || 0
    const newAdjust = currentAdjust + delta
    setAdjustQuantity((prev) => ({ ...prev, [item.id]: newAdjust }))
  }

  // Handle direct input change
  const handleInputChange = (item: InventoryItem, value: string) => {
    const numValue = parseFloat(value) || 0
    setAdjustQuantity((prev) => ({ ...prev, [item.id]: numValue }))
  }

  // Apply adjustment
  const applyAdjustment = (item: InventoryItem) => {
    const adjustment = adjustQuantity[item.id] || 0
    if (adjustment === 0) return

    const motivo = adjustMotivo[item.id] || (adjustment > 0 ? 'Ingreso manual' : 'Egreso manual')
    
    // Create movement record
    const newMovement: StockMovement = {
      id: `mov${Date.now()}`,
      fecha: new Date(),
      tipo: adjustment > 0 ? 'ingreso' : 'egreso',
      producto: item.name,
      cantidad: Math.abs(adjustment),
      unidad: item.unit,
      motivo,
    }
    setMovements((prev) => [newMovement, ...prev])

    // Update inventory
    setInventory((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? { ...i, quantity: Math.max(0, i.quantity + adjustment), lastUpdated: new Date() }
          : i
      )
    )

    // Reset adjustment
    setAdjustQuantity((prev) => ({ ...prev, [item.id]: 0 }))
    setAdjustMotivo((prev) => ({ ...prev, [item.id]: '' }))
  }

  return (
    <AppShell
      title="Inventario"
      description="Gestion de insumos y stock"
      actions={
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Agregar Insumo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <InventoryForm
              item={editingItem}
              onSave={handleSave}
              onCancel={() => {
                setIsAddDialogOpen(false)
                setEditingItem(null)
              }}
            />
          </DialogContent>
        </Dialog>
      }
    >
      <Tabs defaultValue="control" className="space-y-6">
        <TabsList>
          <TabsTrigger value="control" className="gap-2">
            <Package className="size-4" />
            Control de Stock
          </TabsTrigger>
          <TabsTrigger value="historial" className="gap-2">
            <History className="size-4" />
            Registro Historico
          </TabsTrigger>
        </TabsList>

        {/* Control de Stock Tab */}
        <TabsContent value="control" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar insumo..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorias</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Table with Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Insumos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Insumo</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-center">Stock Actual</TableHead>
                    <TableHead className="text-center">Ajustar</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => {
                    const isLowStock = item.quantity < item.minStock
                    const adjustment = adjustQuantity[item.id] || 0
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-mono font-medium ${isLowStock ? 'text-destructive' : ''}`}>
                            {item.quantity} {item.unit}
                          </span>
                          <span className="text-xs text-muted-foreground block">
                            min: {item.minStock}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-8"
                              onClick={() => handleAdjust(item, -1)}
                            >
                              <Minus className="size-4" />
                            </Button>
                            <Input
                              type="number"
                              value={adjustment}
                              onChange={(e) => handleInputChange(item, e.target.value)}
                              className="w-20 text-center font-mono"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-8"
                              onClick={() => handleAdjust(item, 1)}
                            >
                              <Plus className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="Motivo..."
                            value={adjustMotivo[item.id] || ''}
                            onChange={(e) =>
                              setAdjustMotivo((prev) => ({ ...prev, [item.id]: e.target.value }))
                            }
                            className="w-32 text-sm"
                          />
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
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant={adjustment !== 0 ? 'default' : 'outline'}
                              size="sm"
                              disabled={adjustment === 0}
                              onClick={() => applyAdjustment(item)}
                            >
                              Aplicar
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingItem(item)
                                setIsAddDialogOpen(true)
                              }}
                            >
                              <Pencil className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Registro Historico Tab */}
        <TabsContent value="historial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="size-5" />
                Historial de Movimientos de Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Motivo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map((mov) => (
                    <TableRow key={mov.id}>
                      <TableCell className="text-muted-foreground">
                        {mov.fecha.toLocaleDateString('es-AR')}
                      </TableCell>
                      <TableCell className="font-mono text-muted-foreground">
                        {mov.fecha.toLocaleTimeString('es-AR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            mov.tipo === 'ingreso'
                              ? 'bg-success/10 text-success border-success/20'
                              : 'bg-destructive/10 text-destructive border-destructive/20'
                          }
                        >
                          {mov.tipo === 'ingreso' ? (
                            <ArrowUpCircle className="size-3 mr-1" />
                          ) : (
                            <ArrowDownCircle className="size-3 mr-1" />
                          )}
                          {mov.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{mov.producto}</TableCell>
                      <TableCell
                        className={`text-right font-mono ${
                          mov.tipo === 'ingreso' ? 'text-success' : 'text-destructive'
                        }`}
                      >
                        {mov.tipo === 'ingreso' ? '+' : '-'}
                        {mov.cantidad} {mov.unidad}
                      </TableCell>
                      <TableCell>
                        {mov.marca ? (
                          <Badge variant="secondary">{mov.marca}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{mov.motivo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  )
}

function InventoryForm({
  item,
  onSave,
  onCancel,
}: {
  item: InventoryItem | null
  onSave: (item: Partial<InventoryItem>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = React.useState({
    name: item?.name || '',
    quantity: item?.quantity || 0,
    unit: item?.unit || 'kg',
    minStock: item?.minStock || 0,
    category: item?.category || '',
  })

  return (
    <>
      <DialogHeader>
        <DialogTitle>{item ? 'Editar Insumo' : 'Agregar Insumo'}</DialogTitle>
        <DialogDescription>
          {item ? 'Modifica los datos del insumo' : 'Agrega un nuevo insumo al inventario'}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="quantity">Cantidad</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: Number(e.target.value) })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="unit">Unidad</Label>
            <Select
              value={formData.unit}
              onValueChange={(value) => setFormData({ ...formData, unit: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Kilogramos</SelectItem>
                <SelectItem value="litros">Litros</SelectItem>
                <SelectItem value="unidades">Unidades</SelectItem>
                <SelectItem value="hojas">Hojas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="minStock">Stock Minimo</Label>
            <Input
              id="minStock"
              type="number"
              value={formData.minStock}
              onChange={(e) =>
                setFormData({ ...formData, minStock: Number(e.target.value) })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Categoria</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={() => onSave(formData)}>Guardar</Button>
      </DialogFooter>
    </>
  )
}
