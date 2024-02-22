import archiveRow from "@/lib/archiveRow";
import {
  ActionIcon,
  Button,
  Tooltip,
  Modal,
  Text,
  Group,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconExclamationCircle, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { useSWRConfig } from "swr";

interface archiveButtonProps {
  selectedRows: any[];
  url: string;
  setSelectedRows: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function ArchiveButton(props: archiveButtonProps) {
  const { selectedRows, url, setSelectedRows } = props;
  const [opened, { open, close }] = useDisclosure(false);
  const { mutate } = useSWRConfig();
  const [error, { toggle: toggleError }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);

  const handleOnClick = async () => {
    setLoading(true);
    try {
      const res = await archiveRow(selectedRows, url);
      if (res) {
        mutate(url);
        close();
        setSelectedRows([]);
      } else {
        throw Error;
      }
    } catch (error) {
      toggleError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Delete Confirmation">
        <Stack>
          <Text>
            Are you sure you want to{" "}
            <Text span c="red" size="md" fw="700">
              delete {selectedRows.length} row/s?
            </Text>
          </Text>
          {error && (
            <Group c="red.6">
              <IconExclamationCircle />
              <Text size="sm">{`Failed to archive`}</Text>
            </Group>
          )}
          <Group justify="space-between">
            <Button onClick={close} variant="default">
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleOnClick}
              leftSection={<IconTrash />}
              loading={loading}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Tooltip label="Delete">
        <ActionIcon
          disabled={selectedRows.length === 0}
          size={"lg"}
          color="red"
          onClick={open}
        >
          <IconTrash />
        </ActionIcon>
      </Tooltip>
    </>
  );
}
