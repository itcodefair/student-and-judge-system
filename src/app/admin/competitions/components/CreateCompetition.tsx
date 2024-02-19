import { IconSquareRoundedPlus } from "@tabler/icons-react";
import addRow from "@/lib/addRow";
import { useSWRConfig } from "swr";
import CompetitionForm from "./CompetitionForm";

export default function CreateCompetition({ close }) {
  const url = "/api/db/competition";
  const { mutate } = useSWRConfig();

  const handleSubmit = async (values) => {
    const res = await addRow(values, url);
    if (res) {
      mutate(url);
      close();
      return true;
    } else {
      return false;
    }
  };

  return (
    <CompetitionForm
      handleSubmit={handleSubmit}
      icon={<IconSquareRoundedPlus />}
      buttonText={"Create"}
      disabled={false}
    />
  );
}
