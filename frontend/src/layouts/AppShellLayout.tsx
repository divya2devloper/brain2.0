import { AppShell, Group, NavLink, Text } from '@mantine/core'
import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const items = [
  ['Dashboard', '/app/dashboard'],
  ['Leads', '/app/leads'],
  ['WhatsApp', '/app/whatsapp'],
  ['Instagram', '/app/instagram'],
  ['Finance', '/app/finance'],
  ['Training', '/app/training'],
  ['Billing', '/app/billing'],
  ['Settings', '/app/settings']
] as const

export function AppShellLayout() {
  const { user } = useAuth()

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 240, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Header>
        <Group px="md" h="100%" justify="space-between">
          <Text fw={700}>Brain 2.0</Text>
          <Text size="sm">Role: {user?.role ?? 'GUEST'}</Text>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="sm">
        {items.map(([label, to]) => (
          <NavLink key={to} component={Link} to={to} label={label} />
        ))}
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
