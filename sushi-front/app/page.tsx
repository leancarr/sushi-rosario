'use client'

import * as React from 'react'
import Link from 'next/link'
import { ChefHat, MapPin, Phone, Clock, ExternalLink, Star, ArrowRight, Menu, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockCombos, mockProducts } from '@/lib/mock-data'

function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ChefHat className="size-6" />
            </div>
            <span className="text-xl font-bold">Rosario Sushi</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#menu" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Menu
            </a>
            <a href="#nosotros" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Nosotros
            </a>
            <a href="#ubicacion" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Ubicacion
            </a>
            <a href="#galeria" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Galeria
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </Button>
            )}
            <Button asChild>
              <a
                href="https://www.pedidosya.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Pedir Ahora
                <ExternalLink className="size-4" />
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/pedidos">Ingresar</Link>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <a href="#menu" className="text-sm font-medium" onClick={() => setIsOpen(false)}>
                Menu
              </a>
              <a href="#nosotros" className="text-sm font-medium" onClick={() => setIsOpen(false)}>
                Nosotros
              </a>
              <a href="#ubicacion" className="text-sm font-medium" onClick={() => setIsOpen(false)}>
                Ubicacion
              </a>
              <a href="#galeria" className="text-sm font-medium" onClick={() => setIsOpen(false)}>
                Galeria
              </a>
              <Button asChild className="w-full">
                <a href="https://www.pedidosya.com" target="_blank" rel="noopener noreferrer">
                  Pedir Ahora
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
      <div className="absolute top-20 right-10 size-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 left-10 size-96 rounded-full bg-primary/5 blur-3xl" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="px-4 py-1">
                Takeaway y PedidosYa
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
                El mejor <span className="text-primary">sushi</span> de Rosario
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg text-pretty">
                Sabores autenticos de Japon preparados con ingredientes frescos y de la mejor calidad. 
                Retira en nuestro local o pedilo por PedidosYa.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="text-lg px-8">
                <a
                  href="https://www.pedidosya.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Pedir por PedidosYa
                  <ArrowRight className="size-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <a href="#menu">Ver Menu</a>
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-5 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">4.9 en PedidosYa</span>
              </div>
              <div className="text-sm text-muted-foreground">
                +2000 pedidos este mes
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 p-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-9xl">🍣</div>
              </div>
              <div className="absolute -top-4 -right-4 rounded-2xl bg-card p-4 shadow-lg border">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full bg-success/10 flex items-center justify-center">
                    <Clock className="size-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Tiempo promedio</p>
                    <p className="text-2xl font-bold">25 min</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-2xl bg-card p-4 shadow-lg border">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <ChefHat className="size-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Preparado por</p>
                    <p className="text-lg font-bold">Chefs expertos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CombosSection() {
  return (
    <section id="menu" className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Combos Destacados</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Nuestros combos mas pedidos</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descubri nuestras combinaciones perfectas, ideales para compartir o disfrutar solo.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCombos.map((combo) => (
            <Card key={combo.id} className="group overflow-hidden hover:shadow-lg transition-all">
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-6xl">
                🍱
              </div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {combo.name}
                  </h3>
                  <Badge variant="outline" className="text-success border-success">
                    -20%
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{combo.description}</p>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-primary">
                      ${combo.priceMostrador.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PedidosYa: ${combo.pricePedidosYa.toLocaleString()}
                    </p>
                  </div>
                  <Button size="sm">Agregar</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-6 text-center">Menu Completo</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockProducts.slice(0, 8).map((product) => (
              <Card key={product.id} className="group hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="size-16 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-2xl flex-shrink-0">
                      🍣
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium truncate group-hover:text-primary transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate">{product.description}</p>
                      <p className="text-lg font-bold text-primary mt-1">
                        ${product.priceMostrador.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section id="nosotros" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="secondary">Sobre Nosotros</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Pasion por el sushi desde 2018
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Rosario Sushi nacio de la pasion por la gastronomia japonesa y el deseo de llevar 
                sabores autenticos a nuestra ciudad. Cada pieza es preparada con dedicacion 
                utilizando ingredientes frescos y de primera calidad.
              </p>
              <p>
                Nuestro equipo de chefs especializados combina tecnicas tradicionales japonesas 
                con toques creativos que hacen de cada roll una experiencia unica.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div>
                <p className="text-3xl font-bold text-primary">6+</p>
                <p className="text-sm text-muted-foreground">Anos de experiencia</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">50K+</p>
                <p className="text-sm text-muted-foreground">Pedidos entregados</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">4.9</p>
                <p className="text-sm text-muted-foreground">Calificacion promedio</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <div className="text-9xl">👨‍🍳</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function LocationSection() {
  return (
    <section id="ubicacion" className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Ubicacion</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Visitanos o retira tu pedido</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Estamos ubicados en el corazon de Rosario, listos para preparar tu pedido.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="aspect-video rounded-2xl bg-muted flex items-center justify-center border">
            <div className="text-center text-muted-foreground">
              <MapPin className="size-12 mx-auto mb-4" />
              <p>Mapa de Google Maps</p>
              <p className="text-sm">Av. Pellegrini 1500, Rosario</p>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Direccion</h3>
                    <p className="text-muted-foreground">Av. Pellegrini 1500</p>
                    <p className="text-muted-foreground">Rosario, Santa Fe</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Horarios</h3>
                    <p className="text-muted-foreground">Martes a Domingo</p>
                    <p className="text-muted-foreground">12:00 - 15:00 | 19:00 - 23:30</p>
                    <p className="text-sm text-muted-foreground/70 mt-1">Lunes cerrado</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Contacto</h3>
                    <p className="text-muted-foreground">Tel: (341) 555-1234</p>
                    <p className="text-muted-foreground">WhatsApp: +54 9 341 555-1234</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

function GallerySection() {
  return (
    <section id="galeria" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Galeria</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Nuestras creaciones</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cada pieza es una obra de arte culinaria preparada con dedicacion.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-4xl hover:scale-105 transition-transform cursor-pointer"
            >
              {['🍣', '🍱', '🥢', '🍙', '🍤', '🥡', '🍜', '🍥'][i]}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Listo para probar el mejor sushi?
        </h2>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
          Pedilo ahora por PedidosYa y recibilo en la puerta de tu casa, 
          o retiralo en nuestro local con un 10% de descuento.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild className="text-lg px-8">
            <a
              href="https://www.pedidosya.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              Pedir por PedidosYa
              <ExternalLink className="size-5" />
            </a>
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
            <Phone className="size-5 mr-2" />
            Llamar al local
          </Button>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-12 border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ChefHat className="size-6" />
            </div>
            <span className="text-xl font-bold">Rosario Sushi</span>
          </div>
          <p className="text-sm text-muted-foreground">
            2024 Rosario Sushi. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/pedidos">Sistema OS</Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <CombosSection />
      <AboutSection />
      <LocationSection />
      <GallerySection />
      <CTASection />
      <Footer />
    </div>
  )
}
