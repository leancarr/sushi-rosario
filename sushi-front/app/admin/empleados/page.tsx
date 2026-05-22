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
import { Plus, Pencil, Search, Clock, UserCheck, Users, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { mockEmployees, mockAttendance } from '@/lib/mock-data'
import type { Attendance } from '@/types'

// Extended attendance for calendar
interface CalendarDay {
  date: Date
  attendances: Attendance[]
}

export default function EmpleadosPage() {
  const [employees, setEmployees] = React.useState(mockEmployees)
  const [attendance, setAttendance] = React.useState(mockAttendance)
  const [search, setSearch] = React.useState('')
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = React.useState(false)
  const [selectedMonth, setSelectedMonth] = React.useState(new Date())
  const [selectedEmployee, setSelectedEmployee] = React.useState<string>('all')

  const filteredEmployees = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  )

  // Generate calendar days for the month
  const getCalendarDays = (): CalendarDay[] => {
    const year = selectedMonth.getFullYear()
    const month = selectedMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: CalendarDay[] = []

    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      const currentDate = new Date(d)
      const dayAttendances = attendance.filter(
        (a) =>
          a.date.toDateString() === currentDate.toDateString() &&
          (selectedEmployee === 'all' || a.employeeId === selectedEmployee)
      )
      days.push({
        date: currentDate,
        attendances: dayAttendances,
      })
    }

    return days
  }

  const calendarDays = getCalendarDays()

  const previousMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1))
  }

  // Filter attendance by selected employee
  const filteredAttendance = attendance.filter(
    (a) => selectedEmployee === 'all' || a.employeeId === selectedEmployee
  )

  return (
    <AppShell
      title="Empleados"
      description="Gestion de personal y asistencias"
    >
      <div className="space-y-6">
        <Tabs defaultValue="employees">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="employees" className="gap-2">
              <Users className="size-4" />
              Empleados
            </TabsTrigger>
            <TabsTrigger value="attendance" className="gap-2">
              <Clock className="size-4" />
              Asistencias
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <Calendar className="size-4" />
              Calendario
            </TabsTrigger>
          </TabsList>

          {/* Employees Tab */}
          <TabsContent value="employees" className="mt-6 space-y-6">
            {/* Search & Add */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar empleado..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="size-4 mr-2" />
                        Agregar Empleado
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Agregar Empleado</DialogTitle>
                        <DialogDescription>
                          Registra un nuevo empleado en el sistema
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label>Nombre Completo</Label>
                          <Input placeholder="Nombre y apellido" />
                        </div>
                        <div className="grid gap-2">
                          <Label>Email</Label>
                          <Input type="email" placeholder="email@rosariosushi.com" />
                        </div>
                        <div className="grid gap-2">
                          <Label>Telefono</Label>
                          <Input placeholder="341-5551234" />
                        </div>
                        <div className="grid gap-2">
                          <Label>Rol</Label>
                          <Select defaultValue="empleado">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Administrador</SelectItem>
                              <SelectItem value="empleado">Empleado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddEmployeeOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={() => setIsAddEmployeeOpen(false)}>
                          Guardar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Employees Table */}
            <Card className="overflow-hidden w-full">
              <CardHeader>
                <CardTitle>Lista de Empleados</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefono</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {employee.email}
                        </TableCell>
                        <TableCell>{employee.phone}</TableCell>
                        <TableCell>
                          <Badge variant={employee.role === 'admin' ? 'default' : 'secondary'}>
                            {employee.role === 'admin' ? 'Admin' : 'Empleado'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {employee.active ? (
                            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                              Activo
                            </Badge>
                          ) : (
                            <Badge variant="outline">Inactivo</Badge>
                          )}
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

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="mt-6 space-y-6">
            {/* Filter */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Label>Filtrar por empleado:</Label>
                  <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los empleados</SelectItem>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Table */}
            <Card className="overflow-hidden w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="size-4" />
                  Registro de Asistencias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empleado</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Entrada</TableHead>
                      <TableHead>Salida</TableHead>
                      <TableHead className="text-right">Horas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {record.employeeName}
                        </TableCell>
                        <TableCell>
                          {record.date.toLocaleDateString('es-AR')}
                        </TableCell>
                        <TableCell className="font-mono">
                          {record.checkIn.toLocaleTimeString('es-AR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </TableCell>
                        <TableCell className="font-mono">
                          {record.checkOut
                            ? record.checkOut.toLocaleTimeString('es-AR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : (
                              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                                En turno
                              </Badge>
                            )}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {record.hoursWorked
                            ? `${record.hoursWorked.toFixed(1)}h`
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="mt-6 space-y-6">
            {/* Filter & Navigation */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Label>Filtrar por empleado:</Label>
                    <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los empleados</SelectItem>
                        {employees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={previousMonth}>
                      <ChevronLeft className="size-4" />
                    </Button>
                    <span className="min-w-32 text-center font-medium capitalize">
                      {selectedMonth.toLocaleDateString('es-AR', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <Button variant="outline" size="icon" onClick={nextMonth}>
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calendar Grid */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="size-5" />
                  Calendario de Asistencias
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-muted-foreground py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells for days before the first of the month */}
                  {Array.from({ length: calendarDays[0]?.date.getDay() || 0 }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}

                  {/* Calendar days */}
                  {calendarDays.map((day) => {
                    const isToday = day.date.toDateString() === new Date().toDateString()
                    const hasAttendance = day.attendances.length > 0
                    const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6

                    return (
                      <div
                        key={day.date.toISOString()}
                        className={`aspect-square p-1 rounded-lg border transition-colors ${
                          isToday ? 'border-primary bg-primary/5' : 'border-border'
                        } ${isWeekend ? 'bg-muted/50' : ''}`}
                      >
                        <div className="h-full flex flex-col">
                          <span
                            className={`text-xs font-medium ${
                              isToday ? 'text-primary' : 'text-muted-foreground'
                            }`}
                          >
                            {day.date.getDate()}
                          </span>
                          <div className="flex-1 flex flex-col gap-0.5 mt-1 overflow-hidden">
                            {day.attendances.slice(0, 2).map((att) => (
                              <div
                                key={att.id}
                                className={`text-[10px] px-1 py-0.5 rounded truncate ${
                                  att.checkOut
                                    ? 'bg-success/10 text-success'
                                    : 'bg-warning/10 text-warning'
                                }`}
                                title={`${att.employeeName}: ${att.checkIn.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} - ${att.checkOut ? att.checkOut.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : 'En turno'}`}
                              >
                                {att.employeeName.split(' ')[0]}
                              </div>
                            ))}
                            {day.attendances.length > 2 && (
                              <span className="text-[10px] text-muted-foreground">
                                +{day.attendances.length - 2} mas
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded bg-success/20" />
                    <span className="text-xs text-muted-foreground">Turno completo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded bg-warning/20" />
                    <span className="text-xs text-muted-foreground">En turno</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded border-2 border-primary" />
                    <span className="text-xs text-muted-foreground">Hoy</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
