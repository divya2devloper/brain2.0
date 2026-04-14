import { Button, Text, Title } from '@mantine/core'
import { useState } from 'react'
import api from '../api/client'

export function TrainingPage() {
  const [status, setStatus] = useState('idle')

  const run = async () => {
    const { data } = await api.get('/api/v1/training/status')
    setStatus(data.status)
  }

  return (
    <>
      <Title order={3}>AI Training</Title>
      <Button onClick={() => void run()}>Check Training Status</Button>
      <Text mt="sm">{status}</Text>
    </>
  )
}
