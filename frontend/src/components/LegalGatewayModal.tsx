import { Modal, Text } from '@mantine/core'

export function LegalGatewayModal({ opened, onClose }: { opened: boolean; onClose: () => void }) {
  return (
    <Modal opened={opened} onClose={onClose} title="Legal acknowledgement required">
      <Text size="sm">Please accept legal terms to continue using Brain 2.0.</Text>
    </Modal>
  )
}
