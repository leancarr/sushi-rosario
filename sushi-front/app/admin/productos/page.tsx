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
import { Plus, Pencil, Search, History, Eye } from 'lucide-react'
import { mockProducts, mockCombos } from '@/lib/mock-data'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'

// Product history type
interface ProductHistoryItem {
  id: string
  fecha: Date
  campo: string
  valorAnterior: string
  valorNuevo: string
  usuario: string
}

// Mock product history
const mockProductHistory: Record<string, ProductHistoryItem[]> = {
  p1: [
    {
      id: 'h1',
      fecha: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      campo: 'Precio Mostrador',
      valorAnterior: '$4,200',
      valorNuevo: '$4,500',
      usuario: 'Roberto Sushi',
    },
    {
      id: 'h2',
      fecha: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      campo: 'Descripcion',
      valorAnterior: '8 piezas de roll con salmon',
      valorNuevo: '8 piezas de roll con salmon fresco, palta y queso crema',
      usuario: 'Roberto Sushi',
    },
    {
      id: 'h3',
      fecha: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      campo: 'Precio PedidosYa',
      valorAnterior: '$5,000',
      valorNuevo: '$5,400',
      usuario: 'Roberto Sushi',
    },
  ],
  p2: [
    {
      id: 'h4',
      fecha: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      campo: 'Disponible',
      valorAnterior: 'No',
      valorNuevo: 'Si',
      usuario: 'Laura Cocina',
    },
  ],
  p3: [
    {
      id: 'h5',
      fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      campo: 'Precio Mostrador',
      valorAnterior: '$4,500',
      valorNuevo: '$4,800',
      usuario: 'Roberto Sushi',
    },
  ],
}

export default function ProductosPage() {
  const [products, setProducts] = React.useState(mockProducts)
  const [combos, setCombos] = React.useState(mockCombos)
  const [search, setSearch] = React.useState('')
  const [isAddProductOpen, setIsAddProductOpen] = React.useState(false)
  const [isAddComboOpen, setIsAddComboOpen] = React.useState(false)
  const [selectedProductHistory, setSelectedProductHistory] = React.useState<string | null>(null)

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const filteredCombos = combos.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const toggleProductAvailability = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, available: !p.available } : p))
    )
  }

  const toggleComboAvailability = (id: string) => {
    setCombos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, available: !c.available } : c))
    )
  }

  const getProductHistory = (productId: string): ProductHistoryItem[] => {
    return mockProductHistory[productId] || []
  }

  return (
    <AppShell
      title="Productos y Combos"
      description="Gestion del catalogo de productos"
    >
      <div className="space-y-6">
        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar producto o combo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="products">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Productos ({products.length})</TabsTrigger>
            <TabsTrigger value="combos">Combos ({combos.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Lista de Productos</CardTitle>
                <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="size-4 mr-2" />
                      Agregar Producto
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agregar Producto</DialogTitle>
                      <DialogDescription>
                        Crea un nuevo producto para el menu
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label>Nombre</Label>
                        <Input placeholder="Ej: Salmon Roll" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Descripcion</Label>
                        <Input placeholder="Descripcion del producto" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Precio Mostrador</Label>
                          <Input type="number" placeholder="0" />
                        </div>
                        <div className="grid gap-2">
                          <Label>Precio PedidosYa</Label>
                          <Input type="number" placeholder="0" />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label>Categoria</Label>
                        <Input placeholder="Ej: Rolls, Nigiris, Entradas" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={() => setIsAddProductOpen(false)}>
                        Guardar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="text-right">Mostrador</TableHead>
                      <TableHead className="text-right">PedidosYa</TableHead>
                      <TableHead>Disponible</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => {
                      const history = getProductHistory(product.id)
                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-xs">
                                {product.description}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.category}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${product.priceMostrador.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            ${product.pricePedidosYa.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={product.available}
                              onCheckedChange={() => toggleProductAvailability(product.id)}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {history.length > 0 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedProductHistory(product.id)}
                                  className="relative"
                                >
                                  <History className="size-4" />
                                  <span className="absolute -top-1 -right-1 size-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                                    {history.length}
                                  </span>
                                </Button>
                              )}
                              <Button variant="ghost" size="icon">
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

          <TabsContent value="combos" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Lista de Combos</CardTitle>
                <Dialog open={isAddComboOpen} onOpenChange={setIsAddComboOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="size-4 mr-2" />
                      Crear Combo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Crear Combo</DialogTitle>
                      <DialogDescription>
                        Combina productos para crear un combo
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label>Nombre del Combo</Label>
                        <Input placeholder="Ej: Combo Pareja" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Descripcion</Label>
                        <Input placeholder="Descripcion del combo" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Precio Mostrador</Label>
                          <Input type="number" placeholder="0" />
                        </div>
                        <div className="grid gap-2">
                          <Label>Precio PedidosYa</Label>
                          <Input type="number" placeholder="0" />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddComboOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={() => setIsAddComboOpen(false)}>
                        Guardar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Combo</TableHead>
                      <TableHead className="text-right">Mostrador</TableHead>
                      <TableHead className="text-right">PedidosYa</TableHead>
                      <TableHead>Disponible</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCombos.map((combo) => (
                      <TableRow key={combo.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{combo.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {combo.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${combo.priceMostrador.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          ${combo.pricePedidosYa.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={combo.available}
                            onCheckedChange={() => toggleComboAvailability(combo.id)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Pencil className="size-4" />
                          </Button>
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

      {/* Product History Dialog */}
      <Dialog open={!!selectedProductHistory} onOpenChange={() => setSelectedProductHistory(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="size-5" />
              Historial de Cambios
            </DialogTitle>
            <DialogDescription>
              {selectedProductHistory && products.find((p) => p.id === selectedProductHistory)?.name}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-4 pr-4">
              {selectedProductHistory &&
                getProductHistory(selectedProductHistory).map((item) => (
                  <div key={item.id} className="p-4 rounded-lg bg-muted space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{item.campo}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {item.fecha.toLocaleDateString('es-AR')} - {item.usuario}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Anterior</p>
                        <p className="line-through text-muted-foreground">{item.valorAnterior}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Nuevo</p>
                        <p className="font-medium text-success">{item.valorNuevo}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedProductHistory(null)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
