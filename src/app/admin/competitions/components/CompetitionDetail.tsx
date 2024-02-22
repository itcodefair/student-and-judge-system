import { useEffect, useState } from "react";
import CompetitionForm, { CompetitionFormActions } from "./CompetitionForm";
import useSWR from "swr";
import { IconDeviceFloppy, IconEdit } from "@tabler/icons-react";
import {
  Box,
  Button,
  Drawer,
  LoadingOverlay,
  Stack,
  Text,
} from "@mantine/core";
import { Competition } from "../page";
import { useDisclosure } from "@mantine/hooks";
import editRow from "@/lib/editRow";

interface CompetitionDetailProps {
  open: boolean;
  onClose: () => void;
  id: string;
}

export default function CompetitionDetail(props: CompetitionDetailProps) {
  const url = "/api/db/competition";
  const { open, onClose, id } = props;
  const { data, error, isLoading, mutate } = useSWR<Competition>(
    `${url}?id=${id}`
  );
  const [disable, { toggle, open: disableOnLoad }] = useDisclosure(true);
  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    disableOnLoad();
    if (!isLoading && data) {
      const { _id, createdDate, updatedDate, ...values } = data;
      const formattedData = {
        ...values,
        registrationStartDate: new Date(values.registrationStartDate),
        registrationEndDate: new Date(values.registrationEndDate),
        judgeDate: new Date(values.judgeDate),
      };
      setInitialValues(formattedData);
      CompetitionFormActions.setInitialValues(formattedData);
      CompetitionFormActions.setValues(formattedData);
    }
  }, [data]);

  const handleSubmit = async (values) => {
    values._id = id;
    const res = await editRow(values, url);
    if (res) {
      mutate(values);
      toggle();
      return true;
    } else {
      return false;
    }
  };

  return (
    <Drawer
      opened={open}
      onClose={onClose}
      position="right"
      size="lg"
      closeOnClickOutside
      title="Competition Detail"
    >
      <Box pos="relative">
        <LoadingOverlay visible={isLoading} loaderProps={{ type: "oval" }} />
        {error ? (
          <Text>Error loading competition details</Text>
        ) : (
          <Stack>
            <Button
              onClick={() => toggle()}
              leftSection={<IconEdit />}
              variant={disable ? "filled" : "light"}
            >
              {disable ? "Edit" : "Editing..."}
            </Button>
            <CompetitionForm
              initialValues={initialValues}
              handleSubmit={handleSubmit}
              icon={<IconDeviceFloppy />}
              buttonText={"Save"}
              disabled={disable}
            />
          </Stack>
        )}
      </Box>
    </Drawer>
  );
}
