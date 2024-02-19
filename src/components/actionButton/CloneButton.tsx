import { ActionIcon, Tooltip } from "@mantine/core";
import { IconCopy } from "@tabler/icons-react";

export default function CloneButton({ disabled, onClick }) {
  return (
    <Tooltip label="Copy">
      <ActionIcon disabled={disabled} size={"lg"} onClick={onClick}>
        <IconCopy />
      </ActionIcon>
    </Tooltip>
  );
}
