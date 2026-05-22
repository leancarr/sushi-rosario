'use client'

import * as React from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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
import { Textarea } from '@/components/ui/textarea'
import { Plus, Pencil, Trash2, Tag, Percent, Calendar, Gift } from 'lucide-react'

interface Promocion {
  id: string
  nombre: string
  descripcion: string
  tipo: 'porcentaje' | 'monto' | '2x1' | 'combo'
  valor?: number
  codigoDescuento?: string
  fechaInicio: Date
  fechaFin: Date
  activa: boolean
  aplicaA: 'todos' | 'categoria' | 'producto'
  categoria?: string
  productoId?: string
}

const mockPromociones: Promocion[] = [
  {
    id: 'promo1',
    nombre: 'Descuento Lunes',
    descripcion: '15% de descuento en todos los rolls los dias lunes',
    tipo: 'porcentaje',
    valor: 15,
    fechaInicio: new Date('2024-01-01'),
    fechaFin: new Date('2024-12-31'),
    activa: true,
    aplicaA: 'categoria',
    categoria: 'Rolls',
  },
  {
    id: 'promo2',
    nombre: '2x1 Gyozas',
    descripcion: 'Lleva 2 porciones de gyozas por el precio de 1',
    tipo: '2x1',
    fechaInicio: new Date('2024-06-01'),
    fechaFin: new Date('2024-06-30'),
    activa: true,
    aplicaA: 'producto',
    productoId: 'p7',
  },
  {
    id: 'promo3',
    nombre: 'Combo Familiar -$2000',
    descripcion: '$2000 de descuento en el Combo Familiar',
    tipo: 'monto',
    valor: 2000,
    codigoDescuento: 'FAMILIA2024',
    fechaInicio: new Date('2024-01-15'),
    fechaFin: new Date('2024-12-15'),
    activa: true,
    aplicaA: 'producto',
    productoId: 'c2',
  },
  {
    id: 'promo4',
    nombre: 'Happy Hour',
    descripcion: '20% de descuento de 18hs a 20hs',
    tipo: 'porcentaje',
    valor: 20,
    fechaInicio: new Date('2024-03-01'),
    fechaFin: new Date('2024-03-31'),
    activa: false,
    aplicaA: 'todos',
  },
]

export default function PromocionesPage() {
  const [promociones, setPromociones] = React.useState<Promocion[]>(mockPromociones)
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [editingPromo, setEditingPromo] = React.useState<Promocion | null>(null)

  const handleSave = (promo: Partial<Promocion>) => {
    if (editingPromo) {
      setPromociones((prev) =>
        prev.map((p) => (p.id === editingPromo.id ? { ...p, ...promo } : p))
      )
    } else {
      setPromociones((prev) => [
        ...prev,
        {
          ...promo,
          id: `promo${Date.now()}`,
        } as Promocion,
      ])
    }
    setIsAddDialogOpen(false)
    setEditingPromo(null)
  }

  const handleDelete = (id: string) => {
    setPromociones((prev) => prev.filter((p) => p.id !== id))
  }

  const toggleActive = (id: string) => {
    setPromociones((prev) =>
      prev.map((p) => (p.id === id ? { ...p, activa: !p.activa } : p))
    )
  }

  const getPromoIcon = (tipo: Promocion['tipo']) => {
    switch (tipo) {
      case 'porcentaje':
        return <Percent className="size-5" />
      case 'monto':
        return <Tag className="size-5" />
      case '2x1':
        return <Gift className="size-5" />
      case 'combo':
        return <Gift className="size-5" />
      default:
        return <Tag className="size-5" />
    }
  }

  const getPromoLabel = (promo: Promocion) => {
    switch (promo.tipo) {
      case 'porcentaje':
        return `${promo.valor}% OFF`
      case 'monto':
        return `-$${promo.valor?.toLocaleString()}`
      case '2x1':
        return '2x1'
      case 'combo':
        return 'Combo'
      default:
        return 'Promo'
    }
  }

  const activePromos = promociones.filter((p) => p.activa)
  const inactivePromos = promociones.filter((p) => !p.activa)

  return (
    <AppShell
      title="Promociones y Descuentos"
      description="Gestiona las promociones activas"
      actions={
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Crear Promocion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <PromocionForm
              promo={editingPromo}
              onSave={handleSave}
              onCancel={() => {
                setIsAddDialogOpen(false)
                setEditingPromo(null)
              }}
            />
          </DialogContent>
        </Dialog>
      }
    >
      <div className="space-y-8">
        {/* Active Promotions */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <div className="size-2 rounded-full bg-success" />
            Promociones Activas ({activePromos.length})
          </h2>
          {activePromos.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No hay promociones activas. Crea una nueva promocion para comenzar.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activePromos.map((promo) => (
                <Card key={promo.id} className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2">
                    <Badge className="bg-success text-success-foreground">Activa</Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-3">
                      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        {getPromoIcon(promo.tipo)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base">{promo.nombre}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {getPromoLabel(promo)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <CardDescription className="line-clamp-2">
                      {promo.descripcion}
                    </CardDescription>
                    {promo.codigoDescuento && (
                      <div className="mt-2 p-2 rounded bg-muted">
                        <span className="text-xs text-muted-foreground">Codigo: </span>
                        <span className="font-mono font-medium">{promo.codigoDescuento}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                      <Calendar className="size-3" />
                      {promo.fechaInicio.toLocaleDateString('es-AR')} -{' '}
                      {promo.fechaFin.toLocaleDateString('es-AR')}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setEditingPromo(promo)
                        setIsAddDialogOpen(true)
                      }}
                    >
                      <Pencil className="size-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(promo.id)}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                    <Switch
                      checked={promo.activa}
                      onCheckedChange={() => toggleActive(promo.id)}
                    />
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Inactive Promotions */}
        {inactivePromos.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="size-2 rounded-full bg-muted-foreground" />
              Promociones Inactivas ({inactivePromos.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inactivePromos.map((promo) => (
                <Card key={promo.id} className="opacity-70">
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-3">
                      <div className="size-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                        {getPromoIcon(promo.tipo)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base">{promo.nombre}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {getPromoLabel(promo)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <CardDescription className="line-clamp-2">
                      {promo.descripcion}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="pt-2 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setEditingPromo(promo)
                        setIsAddDialogOpen(true)
                      }}
                    >
                      <Pencil className="size-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(promo.id)}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                    <Switch
                      checked={promo.activa}
                      onCheckedChange={() => toggleActive(promo.id)}
                    />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  )
}

function PromocionForm({
  promo,
  onSave,
  onCancel,
}: {
  promo: Promocion | null
  onSave: (promo: Partial<Promocion>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = React.useState({
    nombre: promo?.nombre || '',
    descripcion: promo?.descripcion || '',
    tipo: promo?.tipo || 'porcentaje',
    valor: promo?.valor || 0,
    codigoDescuento: promo?.codigoDescuento || '',
    fechaInicio: promo?.fechaInicio || new Date(),
    fechaFin: promo?.fechaFin || new Date(),
    activa: promo?.activa ?? true,
    aplicaA: promo?.aplicaA || 'todos',
  })

  return (
    <>
      <DialogHeader>
        <DialogTitle>{promo ? 'Editar Promocion' : 'Crear Promocion'}</DialogTitle>
        <DialogDescription>
          {promo ? 'Modifica los datos de la promocion' : 'Configura una nueva promocion o descuento'}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
        <div className="grid gap-2">
          <Label htmlFor="nombre">Nombre de la Promocion</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ej: Descuento de Verano"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="descripcion">Descripcion</Label>
          <Textarea
            id="descripcion"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            placeholder="Describe la promocion..."
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Tipo de Descuento</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value) => setFormData({ ...formData, tipo: value as Promocion['tipo'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="porcentaje">Porcentaje (%)</SelectItem>
                <SelectItem value="monto">Monto Fijo ($)</SelectItem>
                <SelectItem value="2x1">2x1</SelectItem>
                <SelectItem value="combo">Combo Especial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(formData.tipo === 'porcentaje' || formData.tipo === 'monto') && (
            <div className="grid gap-2">
              <Label htmlFor="valor">
                {formData.tipo === 'porcentaje' ? 'Porcentaje (%)' : 'Monto ($)'}
              </Label>
              <Input
                id="valor"
                type="number"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: Number(e.target.value) })}
              />
            </div>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="codigoDescuento">Codigo de Descuento (opcional)</Label>
          <Input
            id="codigoDescuento"
            value={formData.codigoDescuento}
            onChange={(e) => setFormData({ ...formData, codigoDescuento: e.target.value.toUpperCase() })}
            placeholder="Ej: VERANO2024"
            className="font-mono"
          />
        </div>

        <div className="grid gap-2">
          <Label>Aplica a</Label>
          <Select
            value={formData.aplicaA}
            onValueChange={(value) => setFormData({ ...formData, aplicaA: value as Promocion['aplicaA'] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los productos</SelectItem>
              <SelectItem value="categoria">Categoria especifica</SelectItem>
              <SelectItem value="producto">Producto especifico</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="fechaInicio">Fecha Inicio</Label>
            <Input
              id="fechaInicio"
              type="date"
              value={formData.fechaInicio.toISOString().split('T')[0]}
              onChange={(e) => setFormData({ ...formData, fechaInicio: new Date(e.target.value) })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fechaFin">Fecha Fin</Label>
            <Input
              id="fechaFin"
              type="date"
              value={formData.fechaFin.toISOString().split('T')[0]}
              onChange={(e) => setFormData({ ...formData, fechaFin: new Date(e.target.value) })}
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
          <Label htmlFor="activa" className="cursor-pointer">Promocion Activa</Label>
          <Switch
            id="activa"
            checked={formData.activa}
            onCheckedChange={(checked) => setFormData({ ...formData, activa: checked })}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={() => onSave(formData)}>
          {promo ? 'Guardar Cambios' : 'Crear Promocion'}
        </Button>
      </DialogFooter>
    </>
  )
}
