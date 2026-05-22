'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Bot, X, Send, Loader2, Sparkles, MessageCircle } from 'lucide-react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const quickActions = [
  { label: '¿Combo mas vendido?', query: '¿Cual es el combo mas vendido?' },
  { label: '¿Stock de salmon?', query: '¿Cuanto stock de salmon tenemos?' },
  { label: '¿Ventas de hoy?', query: '¿Cuanto vendimos hoy?' },
  { label: '¿Empleados activos?', query: '¿Cuantos empleados estan activos?' },
]

const mockResponses: Record<string, string> = {
  'combo mas vendido': 'El combo mas vendido esta semana es el "Combo Pareja" con 45 unidades vendidas, seguido por el "Combo Familiar" con 32 unidades.',
  'stock de salmon': 'Actualmente tenemos 3.5 kg de Salmon Fresco en stock. El stock minimo es de 5 kg, por lo que se recomienda realizar un pedido pronto.',
  'ventas de hoy': 'Las ventas de hoy suman un total de $59,820. Se procesaron 4 pedidos: 2 por PedidosYa y 2 por mostrador.',
  'empleados activos': 'Hay 3 empleados activos actualmente: Roberto Sushi (Admin), Laura Cocina (Empleado) y Miguel Caja (Empleado).',
}

function getAIResponse(query: string): string {
  const lowerQuery = query.toLowerCase()
  for (const [key, response] of Object.entries(mockResponses)) {
    if (lowerQuery.includes(key)) {
      return response
    }
  }
  return 'Lo siento, no tengo informacion especifica sobre esa consulta. Puedo ayudarte con informacion sobre combos, stock, ventas y empleados.'
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [input, setInput] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const handleSend = async (query: string) => {
    if (!query.trim()) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: getAIResponse(query),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsLoading(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSend(input)
  }

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <>
      {/* FAB Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 size-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 hover:scale-105 transition-all"
        size="icon"
      >
        <Bot className="size-6" />
        <span className="sr-only">Abrir asistente IA</span>
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[500px] flex flex-col shadow-2xl border-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between bg-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="size-5" />
              Asistente Rosario Sushi
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="size-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Quick Actions */}
            {messages.length === 0 && (
              <div className="p-4 border-b">
                <p className="text-sm text-muted-foreground mb-3">
                  Preguntas rapidas:
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <Badge
                      key={action.label}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors py-1.5 px-3"
                      onClick={() => handleSend(action.query)}
                    >
                      {action.label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <ScrollArea ref={scrollRef} className="flex-1 p-4 max-h-[280px]">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <MessageCircle className="size-12 text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Hola! Soy tu asistente de Rosario Sushi.
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Preguntame sobre ventas, stock o empleados.
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))
                )}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-3 flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        Procesando tu consulta...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="p-4 border-t flex items-center gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu pregunta..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
              >
                <Send className="size-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  )
}
