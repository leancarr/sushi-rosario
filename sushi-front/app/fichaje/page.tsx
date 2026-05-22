'use client'

import * as React from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { LogIn, LogOut, Clock, CheckCircle2 } from 'lucide-react'

interface FichajeRecord {
  id: string
  tipo: 'entrada' | 'salida'
  hora: Date
}

export default function FichajePage() {
  const [currentTime, setCurrentTime] = React.useState(new Date())
  const [fichajes, setFichajes] = React.useState<FichajeRecord[]>([
    {
      id: 'f1',
      tipo: 'entrada',
      hora: new Date(new Date().setHours(10, 0, 0)),
    },
  ])
  const [lastAction, setLastAction] = React.useState<'entrada' | 'salida' | null>('entrada')
  const [showConfirmation, setShowConfirmation] = React.useState(false)
  const [confirmationType, setConfirmationType] = React.useState<'entrada' | 'salida'>('entrada')

  // Update clock every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleFichar = (tipo: 'entrada' | 'salida') => {
    const newFichaje: FichajeRecord = {
      id: `f${Date.now()}`,
      tipo,
      hora: new Date(),
    }
    setFichajes((prev) => [newFichaje, ...prev])
    setLastAction(tipo)
    setConfirmationType(tipo)
    setShowConfirmation(true)
    setTimeout(() => setShowConfirmation(false), 3000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const todayFichajes = fichajes.filter(
    (f) => f.hora.toDateString() === new Date().toDateString()
  )

  // Calculate hours worked today
  const calculateHoursWorked = () => {
    const entradas = todayFichajes.filter((f) => f.tipo === 'entrada')
    const salidas = todayFichajes.filter((f) => f.tipo === 'salida')
    
    let totalMs = 0
    for (let i = 0; i < entradas.length; i++) {
      const entrada = entradas[i]
      const salida = salidas[i]
      if (salida) {
        totalMs += salida.hora.getTime() - entrada.hora.getTime()
      } else {
        // Still working
        totalMs += new Date().getTime() - entrada.hora.getTime()
      }
    }
    
    const hours = Math.floor(totalMs / (1000 * 60 * 60))
    const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  return (
    <AppShell title="Fichaje de Asistencia" description="Registra tu entrada y salida">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Confirmation Banner */}
        {showConfirmation && (
          <Card className="border-success bg-success/10">
            <CardContent className="flex items-center gap-3 py-4">
              <CheckCircle2 className="size-6 text-success" />
              <span className="font-medium text-success">
                {confirmationType === 'entrada' ? 'Entrada' : 'Salida'} registrada correctamente a las {formatTime(new Date())}
              </span>
            </CardContent>
          </Card>
        )}

        {/* Clock Card */}
        <Card>
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-4">
              {/* Digital Clock */}
              <div className="relative">
                <div className="text-5xl font-mono font-bold tracking-wider text-foreground">
                  {formatTime(currentTime)}
                </div>
                <p className="text-muted-foreground mt-2 capitalize">
                  {formatDate(currentTime)}
                </p>
              </div>

              {/* Status */}
              <div className="flex justify-center">
                <Badge 
                  variant="outline" 
                  className={`px-4 py-1 text-sm ${
                    lastAction === 'entrada' 
                      ? 'border-success text-success bg-success/10' 
                      : 'border-muted-foreground'
                  }`}
                >
                  <Clock className="size-4 mr-2" />
                  {lastAction === 'entrada' ? 'Trabajando' : 'Fuera de turno'}
                </Badge>
              </div>

              {/* Hours worked today */}
              {lastAction === 'entrada' && (
                <p className="text-sm text-muted-foreground">
                  Tiempo trabajado hoy: <span className="font-medium text-foreground">{calculateHoursWorked()}</span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => handleFichar('entrada')}
            disabled={lastAction === 'entrada'}
            className="h-24 text-xl font-semibold bg-success hover:bg-success/90 disabled:opacity-50"
          >
            <LogIn className="size-8 mr-3" />
            Fichar Entrada
          </Button>
          <Button
            onClick={() => handleFichar('salida')}
            disabled={lastAction !== 'entrada'}
            variant="destructive"
            className="h-24 text-xl font-semibold disabled:opacity-50"
          >
            <LogOut className="size-8 mr-3" />
            Fichar Salida
          </Button>
        </div>

        {/* Today's Records */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="size-4" />
              Mis fichajes de hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayFichajes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay fichajes registrados hoy
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Hora</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayFichajes.map((fichaje) => (
                    <TableRow key={fichaje.id}>
                      <TableCell>
                        <Badge
                          variant={fichaje.tipo === 'entrada' ? 'default' : 'secondary'}
                          className={
                            fichaje.tipo === 'entrada'
                              ? 'bg-success/10 text-success border-success/20'
                              : 'bg-destructive/10 text-destructive border-destructive/20'
                          }
                        >
                          {fichaje.tipo === 'entrada' ? (
                            <LogIn className="size-3 mr-1" />
                          ) : (
                            <LogOut className="size-3 mr-1" />
                          )}
                          {fichaje.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">
                        {formatTime(fichaje.hora)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
