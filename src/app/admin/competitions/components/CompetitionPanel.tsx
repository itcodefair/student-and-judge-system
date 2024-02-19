import React from "react";
import { Drawer } from "@mantine/core";
import CompetitionDetail from "./CompetitionDetail";
import { CompetitionFormActions } from "./CompetitionForm";

// import EventsDetail from 'src/app/eventdetails/page';

interface CompetitionPanelProps {
  open: boolean;
  onClose?: () => void;
}

export default function CompetitionPanel(props: CompetitionPanelProps) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose?.();
  };

  return (
    <Drawer
      opened={open}
      onClose={handleClose}
      position="right"
      size="lg"
      closeOnClickOutside
      title="Competition Detail"
    >
      <CompetitionDetail />
    </Drawer>
  );
}
