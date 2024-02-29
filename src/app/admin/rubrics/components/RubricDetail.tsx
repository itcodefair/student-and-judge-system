import {
  Drawer,
  Box,
  LoadingOverlay,
  Stack,
  Button,
  Text,
} from "@mantine/core";
import { IconEdit, IconDeviceFloppy } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { useDisclosure } from "@mantine/hooks";
import RubricForm, { RubricFormActions } from "./RubricForm";
import editRow from "@/lib/editRow";
import { Rubric } from "../page";

interface RubricCreateProps {
  opened: boolean;
  onClose: () => void;
  id: string;
}

export default function RubricDetail(props: RubricCreateProps) {
  const url = "/api/db/rubric";
  const { opened, onClose, id } = props;
  const { data, error, isLoading, mutate } = useSWR<Rubric>(`${url}?id=${id}`);
  const [disable, { toggle: toggleEdit, open: disableOnLoad }] =
    useDisclosure(true);
  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    disableOnLoad();
    if (!isLoading && data) {
      const { _id, createdDate, updatedDate, ...values } = data;
      const formattedData = {
        ...values,
        criteria: JSON.stringify(values.criteria, null, 2),
      };
      setInitialValues(formattedData);
      RubricFormActions.setInitialValues(formattedData);
      RubricFormActions.setValues(formattedData);
    }
  }, [data]);

  const handleSubmit = async (values) => {
    values._id = id;
    const res = await editRow(values, url);
    if (res) {
      mutate(values);
      toggleEdit();
      return true;
    } else {
      return false;
    }
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="lg"
      closeOnClickOutside
      title="Rubric Detail"
    >
      <Box pos="relative">
        <LoadingOverlay visible={isLoading} loaderProps={{ type: "oval" }} />
        {error ? (
          <Text>Error loading rubric details</Text>
        ) : (
          <Stack>
            <Button
              onClick={() => toggleEdit()}
              leftSection={<IconEdit />}
              variant={disable ? "filled" : "light"}
            >
              {disable ? "Edit" : "Editing..."}
            </Button>
            <RubricForm
              initialValues={initialValues}
              handleSubmit={handleSubmit}
              icon={<IconDeviceFloppy />}
              buttonText="Save"
              disabled={disable}
            />
          </Stack>
        )}
      </Box>
    </Drawer>
  );
}
