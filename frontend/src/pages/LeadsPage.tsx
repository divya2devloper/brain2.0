import { Button, Table, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import api from '../api/client'

interface Lead {
  id: string
  name: string
  status: string
  source: string
}

export function LeadsPage() {
  const { data, refetch } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => (await api.get<Lead[]>('/api/v1/leads')).data
  })

  return (
    <>
      <Title order={3} mb="md">Leads</Title>
      <Button mb="md" onClick={() => void refetch()}>Refresh</Button>
      <Table withTableBorder>
        <Table.Thead>
          <Table.Tr><Table.Th>Name</Table.Th><Table.Th>Status</Table.Th><Table.Th>Source</Table.Th></Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {(data ?? []).map((lead) => (
            <Table.Tr key={lead.id}><Table.Td>{lead.name}</Table.Td><Table.Td>{lead.status}</Table.Td><Table.Td>{lead.source}</Table.Td></Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  )
}
