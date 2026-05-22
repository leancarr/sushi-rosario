'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  Package,
  DollarSign,
  Users,
  TrendingUp,
  Settings,
  Moon,
  Sun,
  ChefHat,
  Clock,
  Tag,
  ShieldCheck,
  User,
} from 'lucide-react'
import { useTheme } from 'next-themes'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AIChatbot } from '@/components/layout/ai-chatbot'

export type UserRole = 'empleado' | 'admin'

const adminNavItems = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Inventario',
    url: '/admin/inventario',
    icon: Package,
  },
  {
    title: 'Productos',
    url: '/admin/productos',
    icon: ShoppingCart,
  },
  {
    title: 'Promociones',
    url: '/admin/promociones',
    icon: Tag,
  },
  {
    title: 'Precios',
    url: '/admin/precios',
    icon: DollarSign,
  },
  {
    title: 'Empleados',
    url: '/admin/empleados',
    icon: Users,
  },
  {
    title: 'Finanzas',
    url: '/admin/finanzas',
    icon: TrendingUp,
  },
]

const employeeNavItems = [
  {
    title: 'Caja / POS',
    url: '/caja',
    icon: ShoppingCart,
  },
  {
    title: 'Fichaje',
    url: '/fichaje',
    icon: Clock,
  },
]

const operationsNavItems = [
  {
    title: 'Pedidos',
    url: '/pedidos',
    icon: ClipboardList,
  },
]

interface RoleSwitcherProps {
  role: UserRole
  onRoleChange: (role: UserRole) => void
}

function RoleSwitcher({ role, onRoleChange }: RoleSwitcherProps) {
  return (
    <div className="p-2">
      <Select value={role} onValueChange={(value) => onRoleChange(value as UserRole)}>
        <SelectTrigger className="w-full bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground">
          <div className="flex items-center gap-2">
            {role === 'admin' ? (
              <ShieldCheck className="size-4 text-primary" />
            ) : (
              <User className="size-4" />
            )}
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="empleado">
            <div className="flex items-center gap-2">
              <User className="size-4" />
              <span>Empleado</span>
            </div>
          </SelectItem>
          <SelectItem value="admin">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4" />
              <span>Administrador</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

interface AppSidebarProps {
  role: UserRole
  onRoleChange: (role: UserRole) => void
}

function AppSidebar({ role, onRoleChange }: AppSidebarProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ChefHat className="size-6" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-lg font-bold text-sidebar-foreground">Rosario Sushi</span>
            <span className="text-xs text-sidebar-foreground/60">Sistema OS</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Role Switcher */}
      <div className="group-data-[collapsible=icon]:hidden">
        <RoleSwitcher role={role} onRoleChange={onRoleChange} />
      </div>

      <SidebarSeparator className="group-data-[collapsible=icon]:hidden" />

      <SidebarContent>
        {/* Common Operations */}
        <SidebarGroup>
          <SidebarGroupLabel>Operaciones</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {operationsNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Employee Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>Empleado</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {employeeNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url || pathname.startsWith(item.url + '/')}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Menu - Only visible when admin role */}
        {role === 'admin' && (
          <SidebarGroup>
            <SidebarGroupLabel>Administracion</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url || pathname.startsWith(item.url + '/')}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="size-8"
            >
              {theme === 'dark' ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
              <span className="sr-only">Cambiar tema</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="size-8 group-data-[collapsible=icon]:hidden"
          >
            <Settings className="size-4" />
            <span className="sr-only">Configuracion</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

interface AppHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
}

function AppHeader({ title, description, actions }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="-ml-2" />
      <div className="flex flex-1 items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  )
}

interface AppShellProps {
  children: React.ReactNode
  title: string
  description?: string
  actions?: React.ReactNode
}

export function AppShell({ children, title, description, actions }: AppShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [role, setRole] = React.useState<UserRole>('admin')

  // Redirect to appropriate page when role changes
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole)
    // If switching to employee and on admin page, redirect to caja
    if (newRole === 'empleado' && pathname.startsWith('/admin')) {
      router.push('/caja')
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} onRoleChange={handleRoleChange} />
      <SidebarInset>
        <AppHeader title={title} description={description} actions={actions} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
      {/* Global AI Chatbot */}
      <AIChatbot />
    </SidebarProvider>
  )
}
