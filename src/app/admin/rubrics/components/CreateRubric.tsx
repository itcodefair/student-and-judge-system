import React from "react";
import { IconSquareRoundedPlus } from "@tabler/icons-react";
import addRow from "@/lib/addRow";
import { useSWRConfig } from "swr";
import { Modal } from "@mantine/core";
import RubricForm from "./RubricForm";

interface RubricCreateProps {
  opened: boolean;
  onClose: () => void;
  url: string;
}

export default function CreateRubric(props: RubricCreateProps) {
  const { opened, onClose, url } = props;
  const { mutate } = useSWRConfig();

  const initialValues = {
    name: "",
    criteria: "",
    status: "",
  };

  const handleSubmit = async (values) => {
    const res = await addRow(values, url);
    if (res) {
      mutate(url);
      onClose();
      return true;
    } else {
      return false;
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="lg"
      title="Create grading rubric"
    >
      <RubricForm
        initialValues={initialValues}
        handleSubmit={handleSubmit}
        icon={<IconSquareRoundedPlus />}
        buttonText={"Create"}
        disabled={false}
      />
    </Modal>
  );
}
