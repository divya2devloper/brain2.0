import { List, TextInput, Title } from '@mantine/core'
import { useState } from 'react'
import { useSocket } from '../hooks/useSocket'

export function WhatsAppPage() {
  const [events, setEvents] = useState<string[]>([])

  useSocket('whatsapp:new_message', (payload) => {
    setEvents((prev) => [JSON.stringify(payload), ...prev].slice(0, 10))
  })

  return (
    <>
      <Title order={3}>WhatsApp Live Feed</Title>
      <TextInput readOnly value="Listening on socket event whatsapp:new_message" />
      <List mt="md">
        {events.map((e, i) => <List.Item key={i}>{e}</List.Item>)}
      </List>
    </>
  )
}
