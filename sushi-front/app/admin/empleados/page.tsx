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
import { Plus, Pencil, Search, Clock, UserCheck } from 'lucide-react'
import { mockEmployees, mockAttendance } from '@/lib/mock-data'

export default function EmpleadosPage() {
  const [employees, setEmployees] = React.useState(mockEmployees)
  const [attendance, setAttendance] = React.useState(mockAttendance)
  const [search, setSearch] = React.useState('')
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = React.useState(false)
  const [isCheckInOpen, setIsCheckInOpen] = React.useState(false)

  const filteredEmployees = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleCheckIn = (employeeId: string) => {
    const employee = employees.find((e) => e.id === employeeId)
    if (!employee) return

    const newAttendance = {
      id: `att${Date.now()}`,
      employeeId,
      employeeName: employee.name,
      date: new Date(),
      checkIn: new Date(),
    }
    setAttendance((prev) => [newAttendance, ...prev])
    setIsCheckInOpen(false)
  }

  const handleCheckOut = (attendanceId: string) => {
    setAttendance((prev) =>
      prev.map((a) =>
        a.id === attendanceId
          ? {
              ...a,
              checkOut: new Date(),
              hoursWorked: (new Date().getTime() - a.checkIn.getTime()) / (1000 * 60 * 60),
            }
          : a
      )
    )
  }

  return (
    <AppShell
      title="Empleados"
      description="Gestion de personal y asistencias"
    >
      <div className="space-y-6">
        <Tabs defaultValue="employees">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="employees">Empleados</TabsTrigger>
            <TabsTrigger value="attendance">Asistencias</TabsTrigger>
          </TabsList>

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
            <Card>
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

          <TabsContent value="attendance" className="mt-6 space-y-6">
            {/* Check In */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Dialog open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <UserCheck className="size-4 mr-2" />
                        Registrar Entrada
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Registrar Entrada</DialogTitle>
                        <DialogDescription>
                          Selecciona el empleado para registrar su entrada
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        {employees
                          .filter((e) => e.active)
                          .map((employee) => {
                            const hasCheckedIn = attendance.some(
                              (a) =>
                                a.employeeId === employee.id &&
                                a.date.toDateString() === new Date().toDateString() &&
                                !a.checkOut
                            )
                            return (
                              <Button
                                key={employee.id}
                                variant={hasCheckedIn ? 'secondary' : 'outline'}
                                className="justify-start h-auto py-3"
                                disabled={hasCheckedIn}
                                onClick={() => handleCheckIn(employee.id)}
                              >
                                <div className="text-left">
                                  <p className="font-medium">{employee.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {hasCheckedIn ? 'Ya registro entrada hoy' : 'Sin entrada registrada'}
                                  </p>
                                </div>
                              </Button>
                            )
                          })}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="size-5" />
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
                      <TableHead>Horas</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {record.employeeName}
                        </TableCell>
                        <TableCell>
                          {record.date.toLocaleDateString('es-AR')}
                        </TableCell>
                        <TableCell>
                          {record.checkIn.toLocaleTimeString('es-AR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </TableCell>
                        <TableCell>
                          {record.checkOut
                            ? record.checkOut.toLocaleTimeString('es-AR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {record.hoursWorked
                            ? `${record.hoursWorked.toFixed(1)}h`
                            : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {!record.checkOut && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCheckOut(record.id)}
                            >
                              Registrar Salida
                            </Button>
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
    </AppShell>
  )
}
