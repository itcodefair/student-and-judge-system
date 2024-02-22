import exportFile from "@/lib/exportFile";
import { ActionIcon, Tooltip } from "@mantine/core";
import { IconFileExport } from "@tabler/icons-react";

export default function ExportButton({ data, fileName }) {
  return (
    <Tooltip label="Export">
      <ActionIcon
        disabled={!data || data.length === 0}
        size={"lg"}
        onClick={() => {
          exportFile(data, fileName);
        }}
      >
        <IconFileExport />
      </ActionIcon>
    </Tooltip>
  );
}
