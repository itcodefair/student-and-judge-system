import React, { useEffect, useState } from "react";
import CompetitionForm, { CompetitionFormActions } from "./CompetitionForm";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { IconDeviceFloppy, IconEdit, IconRefresh } from "@tabler/icons-react";
import { Box, Button, Group, LoadingOverlay, Stack } from "@mantine/core";
import { Competition } from "../page";
import { useDisclosure } from "@mantine/hooks";
import editRow from "@/lib/editRow";

export default function CompetitionDetail() {
  const id = useSearchParams().get("ItemId");
  const url = "/api/db/competition";
  const { data, error, isLoading, mutate } = useSWR<Competition>(
    `${url}?id=${id}`
  );
  const [disable, { toggle }] = useDisclosure(true);

  useEffect(() => {
    if (data) {
      const { _id, createdDate, updatedDate, ...values } = data;
      const formattedData = {
        ...values,
        registrationStartDate: new Date(values.registrationStartDate),
        registrationEndDate: new Date(values.registrationEndDate),
        judgeDate: new Date(values.judgeDate),
      };
      CompetitionFormActions.setInitialValues(formattedData);
      CompetitionFormActions.setValues(formattedData);
    }
  }, [data]);

  const handleSubmit = async (values) => {
    const res = await editRow(values, url);
    if (res) {
      mutate();
      toggle();
      return true;
    } else {
      return false;
    }
  };

  return (
    <Box pos="relative">
      <LoadingOverlay visible={isLoading} loaderProps={{ type: "oval" }} />
      <Stack>
        <Button
          onClick={() => toggle()}
          leftSection={<IconEdit />}
          variant={disable ? "filled" : "light"}
        >
          {disable ? "Edit" : "Editing..."}
        </Button>
        <CompetitionForm
          handleSubmit={handleSubmit}
          icon={<IconDeviceFloppy />}
          buttonText={"Save"}
          disabled={disable}
        />
      </Stack>
    </Box>
  );
}
