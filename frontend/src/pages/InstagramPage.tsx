import { Button, Text, Title } from '@mantine/core'
import { useState } from 'react'
import api from '../api/client'

export function InstagramPage() {
  const [status, setStatus] = useState('Unknown')
  const check = async () => {
    const { data } = await api.get('/api/v1/instagram/status')
    setStatus(data.connected ? 'Connected' : 'Disconnected')
  }

  return (
    <>
      <Title order={3}>Instagram</Title>
      <Button onClick={() => void check()}>Check Status</Button>
      <Text mt="sm">{status}</Text>
    </>
  )
}
