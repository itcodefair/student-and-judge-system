import { ActionIcon, Tooltip } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

export default function CreateButton({ onClick }) {
  return (
    <Tooltip label="Create">
      <ActionIcon size={"lg"} onClick={onClick}>
        <IconPlus />
      </ActionIcon>
    </Tooltip>
  );
}
