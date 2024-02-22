import { IconSquareRoundedPlus } from "@tabler/icons-react";
import addRow from "@/lib/addRow";
import { useSWRConfig } from "swr";
import CompetitionForm from "./CompetitionForm";
import { Modal } from "@mantine/core";

interface CompetitionCreaateProps {
  opened: boolean;
  onClose: () => void;
  url: string;
}

export default function CreateCompetition(props: CompetitionCreaateProps) {
  const { opened, onClose, url } = props;
  const { mutate } = useSWRConfig();

  const initialValues = {
    title: "",
    type: "",
    rubicId: "",
    judgeDate: null,
    registrationStartDate: null,
    registrationEndDate: null,
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
      title="Create competition"
    >
      <CompetitionForm
        initialValues={initialValues}
        handleSubmit={handleSubmit}
        icon={<IconSquareRoundedPlus />}
        buttonText={"Create"}
        disabled={false}
      />
    </Modal>
  );
}
