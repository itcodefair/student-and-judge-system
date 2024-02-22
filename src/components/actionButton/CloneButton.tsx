import cloneRow from "@/lib/cloneRow";
import { ActionIcon, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCopy } from "@tabler/icons-react";
import { useState } from "react";
import { useSWRConfig } from "swr";

interface cloneButtonProps {
  selectedRows: any[];
  url: string;
  setSelectedRows: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function CloneButton(props: cloneButtonProps) {
  const { selectedRows, url, setSelectedRows } = props;
  const { mutate } = useSWRConfig();
  const [error, { toggle: toggleError }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);

  const handleOnClick = async () => {
    setLoading(true);
    try {
      const res = await cloneRow(selectedRows, url);
      if (res) {
        mutate(url);
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
    <Tooltip label="Copy">
      <ActionIcon
        disabled={selectedRows.length === 0}
        size={"lg"}
        onClick={handleOnClick}
        loading={loading}
      >
        <IconCopy />
      </ActionIcon>
    </Tooltip>
  );
}
