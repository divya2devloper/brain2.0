import { AppShell, Badge, Burger, Group, NavLink, Paper, ScrollArea, Stack, Text, ThemeIcon } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Link, Outlet, useLocation } from 'react-router-dom'
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
  const [opened, { toggle }] = useDisclosure()
  const location = useLocation()

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header withBorder>
        <Group px="md" h="100%" justify="space-between">
          <Group gap="sm">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <ThemeIcon radius="md" variant="gradient" gradient={{ from: 'cyan', to: 'blue' }}>
              B
            </ThemeIcon>
            <Text fw={700}>Brain 2.0 Control Center</Text>
          </Group>
          <Badge variant="light" size="lg">Role: {user?.role ?? 'GUEST'}</Badge>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="sm">
        <ScrollArea h="100%">
          <Stack gap={6}>
            {items.map(([label, to]) => (
              <NavLink
                key={to}
                component={Link}
                to={to}
                label={label}
                active={location.pathname === to}
                variant="filled"
              />
            ))}
          </Stack>
        </ScrollArea>
      </AppShell.Navbar>
      <AppShell.Main>
        <Paper radius="md" p="md" withBorder bg="var(--mantine-color-gray-0)">
          <Outlet />
        </Paper>
      </AppShell.Main>
    </AppShell>
  )
}
