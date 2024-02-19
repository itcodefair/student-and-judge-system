import { ActionIcon, Button, Tooltip, Modal, Text, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";

export default function ArchiveButton({ disabled, onClick, count }) {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Modal opened={opened} onClose={close} title="Delete Confirmation">
        <Text>
          Are you sure you want to{" "}
          <Text span c="red" size="md" fw="700">
            delete {count} row/s?
          </Text>
        </Text>
        <Group justify="space-between" mt="md">
          <Button onClick={close} variant="default">
            Cancel
          </Button>
          <Button color="red" onClick={onClick} leftSection={<IconTrash />}>
            Delete
          </Button>
        </Group>
      </Modal>
      <Tooltip label="Delete">
        <ActionIcon
          disabled={disabled}
          size={"lg"}
          color="red.7"
          onClick={open}
        >
          <IconTrash />
        </ActionIcon>
      </Tooltip>
    </>
  );
}
