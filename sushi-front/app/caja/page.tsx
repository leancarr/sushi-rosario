'use client'

import * as React from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Building,
  ArrowLeftRight,
  ShoppingCart,
  Search,
  Check,
  User,
  Phone,
} from 'lucide-react'
import { mockProducts, mockCombos } from '@/lib/mock-data'
import type { CartItem, PaymentMethod } from '@/types'

const paymentMethods: { value: PaymentMethod; label: string; icon: React.ElementType }[] = [
  { value: 'efectivo', label: 'Efectivo', icon: Banknote },
  { value: 'debito', label: 'Debito', icon: CreditCard },
  { value: 'credito', label: 'Credito', icon: CreditCard },
  { value: 'transferencia', label: 'Transferencia', icon: ArrowLeftRight },
]

export default function CajaPage() {
  const [cart, setCart] = React.useState<CartItem[]>([])
  const [search, setSearch] = React.useState('')
  const [selectedPayment, setSelectedPayment] = React.useState<PaymentMethod>('efectivo')
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
  const [customerName, setCustomerName] = React.useState('')
  const [customerPhone, setCustomerPhone] = React.useState('')

  const allItems = [
    ...mockProducts.filter((p) => p.available).map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.priceMostrador,
      category: p.category,
      type: 'product' as const,
    })),
    ...mockCombos.filter((c) => c.available).map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      price: c.priceMostrador,
      category: 'Combos',
      type: 'combo' as const,
    })),
  ]

  const categories = ['Todos', ...new Set(allItems.map((i) => i.category))]

  const [selectedCategory, setSelectedCategory] = React.useState('Todos')

  const filteredItems = allItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const addToCart = (item: (typeof allItems)[0]) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === item.id)
      if (existing) {
        return prev.map((i) =>
          i.productId === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}`,
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ]
    })
  }

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.id === cartItemId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
        )
        .filter((i) => i.quantity > 0)
    )
  }

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== cartItemId))
  }

  const clearCart = () => {
    setCart([])
    setCustomerName('')
    setCustomerPhone('')
  }

  const handleCheckout = () => {
    if (cart.length === 0) return
    setIsCheckoutOpen(true)
  }

  const handleConfirmOrder = () => {
    setIsCheckoutOpen(false)
    setIsConfirmOpen(true)
    // Reset after confirmation
    setTimeout(() => {
      setIsConfirmOpen(false)
      clearCart()
    }, 2000)
  }

  return (
    <AppShell title="Caja / POS" description="Punto de venta">
      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Product Grid */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full justify-start overflow-auto">
              {categories.map((cat) => (
                <TabsTrigger key={cat} value={cat} className="text-sm">
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Products Grid */}
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pb-4">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => addToCart(item)}
                >
                  <CardContent className="p-3">
                    <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-3xl mb-2">
                      {item.type === 'combo' ? '🍱' : '🍣'}
                    </div>
                    <h3 className="font-medium text-sm truncate">{item.name}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-lg font-bold text-primary">
                        ${item.price.toLocaleString()}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Cart / Ticket */}
        <div className="flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="size-5" />
                Ticket
                {cart.length > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {cart.reduce((sum, i) => sum + i.quantity, 0)} items
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {cart.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                  El carrito esta vacio
                </div>
              ) : (
                <ScrollArea className="flex-1 -mx-2 px-2">
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ${item.price.toLocaleString()} c/u
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-7"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="size-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-7"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="size-3" />
                          </Button>
                        </div>
                        <div className="text-right min-w-16">
                          <p className="font-medium">
                            ${(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}

              {/* Cart Actions */}
              <div className="pt-4 mt-auto space-y-4">
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">${cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-primary text-2xl">
                    ${cartTotal.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    disabled={cart.length === 0}
                  >
                    <Trash2 className="size-4 mr-2" />
                    Limpiar
                  </Button>
                  <Button
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                    className="bg-success hover:bg-success/90"
                  >
                    <Check className="size-4 mr-2" />
                    Cobrar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Finalizar Pedido</DialogTitle>
            <DialogDescription>
              Completa los datos para generar el pedido
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Customer Info */}
            <div className="space-y-3">
              <div className="grid gap-2">
                <Label htmlFor="customerName" className="flex items-center gap-2">
                  <User className="size-4" />
                  Nombre del Cliente
                </Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nombre (opcional)"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="customerPhone" className="flex items-center gap-2">
                  <Phone className="size-4" />
                  Telefono
                </Label>
                <Input
                  id="customerPhone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="341-5551234 (opcional)"
                />
              </div>
            </div>

            <Separator />

            {/* Payment Method */}
            <div className="space-y-3">
              <Label>Medio de Pago</Label>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <Button
                      key={method.value}
                      variant={selectedPayment === method.value ? 'default' : 'outline'}
                      className="h-auto py-3 flex-col gap-1"
                      onClick={() => setSelectedPayment(method.value)}
                    >
                      <Icon className="size-5" />
                      <span className="text-sm">{method.label}</span>
                    </Button>
                  )
                })}
              </div>
            </div>

            <Separator />

            {/* Order Summary */}
            <div className="p-4 rounded-lg bg-muted space-y-2">
              <div className="flex justify-between text-sm">
                <span>Items:</span>
                <span>{cart.reduce((sum, i) => sum + i.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Medio de Pago:</span>
                <Badge variant="outline" className="capitalize">
                  {selectedPayment}
                </Badge>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total a Cobrar:</span>
                <span className="text-primary">${cartTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmOrder} className="bg-success hover:bg-success/90">
              <Check className="size-4 mr-2" />
              Confirmar Pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="max-w-sm text-center">
          <div className="py-8">
            <div className="size-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <Check className="size-8 text-success" />
            </div>
            <DialogTitle className="text-2xl mb-2">Pedido Confirmado</DialogTitle>
            <DialogDescription>
              El pedido ha sido registrado correctamente y enviado a cocina.
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
