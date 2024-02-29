import exportFile from "@/lib/exportFile";
import exportJsonFile from "@/lib/exportJsonFile";
import { ActionIcon, Tooltip } from "@mantine/core";
import { IconFileExport } from "@tabler/icons-react";

export default function ExportButton({ data, fileName, fileType }) {
  return (
    <Tooltip label="Export">
      <ActionIcon
        disabled={!data || data.length === 0}
        size={"lg"}
        onClick={() => {
          if (fileType === "xlsx") {
            exportFile(data, fileName);
          } else if (fileType === "json") {
            exportJsonFile(data);
          }
        }}
      >
        <IconFileExport />
      </ActionIcon>
    </Tooltip>
  );
}
