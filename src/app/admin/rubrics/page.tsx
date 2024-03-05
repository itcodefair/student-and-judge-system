"use client";
import React, { useEffect, useState } from "react";
import { ActionIcon, Code, Container, Group } from "@mantine/core";
import CreateButton from "@/components/actionButton/CreateButton";
import CloneButton from "@/components/actionButton/CloneButton";
import ArchiveButton from "@/components/actionButton/ArchiveButton";
import ExportButton from "@/components/actionButton/ExportButton";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import sortRow from "@/lib/sortRow";
import { useDisclosure } from "@mantine/hooks";
import moment from "moment";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import useSWR from "swr";
import RubricDetail from "./components/RubricDetail";
import CreateRubric from "./components/CreateRubric";

export interface Rubric {
  _id: string;
  name: string;
  criteria: Criteria[];
  createdDate: string;
  updatedDate: string;
  status: string;
}

export interface Criteria {
  criteriaName: string;
  criteriaDescription: string;
  criteriaScore: number;
  gradingSchema: GradingSchema[];
}

export interface GradingSchema {
  gradeName: string;
  gradeDescription: string;
}

export default function Rubrics() {
  const router = useRouter();
  const pathname = usePathname();
  const id = useSearchParams().get("RubricId");
  const url = "/api/db/rubric";
  const { data, error, isLoading, mutate } = useSWR(url);
  const [selectedRows, setSelectedRows] = useState<Rubric[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [panelOpened, { open: openPanel, close: closePanel }] =
    useDisclosure(false);
  const [expandedRecordIds, setExpandedRecordIds] = useState<string[]>([]);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Rubric>>({
    columnAccessor: "createdDate",
    direction: "desc",
  });
  const props = {
    resizable: true,
    sortable: true,
  };
  const columns = [
    { accessor: "name", label: "Rubric Name", ...props },
    {
      accessor: "criteria",
      label: "Criterias",
      ...props,
      render: ({ _id }) => (
        <ActionIcon
          size={"lg"}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            if (expandedRecordIds === _id) {
              setExpandedRecordIds([]);
            } else {
              setExpandedRecordIds(_id);
            }
          }}
        >
          {expandedRecordIds === _id ? <IconEyeOff /> : <IconEye />}
        </ActionIcon>
      ),
    },
    {
      accessor: "createdDate",
      label: "Created date",
      render: ({ createdDate }) =>
        moment(createdDate).local().format("YYYY-MM-DD HH:mm:ss"),
      ...props,
    },
    {
      accessor: "updatedDate",
      label: "Updated date",
      render: ({ updatedDate }) =>
        moment(updatedDate).local().format("YYYY-MM-DD HH:mm:ss"),
      ...props,
    },
    { accessor: "status", label: "Status", ...props },
  ];

  useEffect(() => {
    if (id) {
      openPanel();
    }
  }, [id]);

  // useEffect(() => {
  //   const filteredData = filterRow(data, selectedYear, query, selectedFilter);
  //   setFilteredData(filteredData);
  // }, [data, selectedFilter, selectedYear, query]);

  // useEffect(() => {
  //   const sorted = sortRow(filteredData, sortStatus);
  //   setFilteredData(
  //     sortStatus.direction === "desc" ? sorted.reverse() : sorted
  //   );
  // }, [sortStatus]);

  return (
    <Container fluid p="lg">
      <CreateRubric opened={opened} onClose={close} url={url} />
      {id && <RubricDetail opened={panelOpened} onClose={closePanel} id={id} />}
      <Group mb={"lg"} justify="space-between">
        <Group>
          <CreateButton onClick={open} />
          <CloneButton
            selectedRows={selectedRows}
            url={url}
            setSelectedRows={setSelectedRows}
          />
          <ArchiveButton
            selectedRows={selectedRows}
            url={url}
            setSelectedRows={setSelectedRows}
          />
        </Group>
        <ExportButton data={data} fileName="bruv" fileType={"json"} />
      </Group>
      <DataTable
        minHeight={150}
        withTableBorder
        highlightOnHover
        fetching={isLoading}
        columns={columns}
        records={data}
        selectedRecords={selectedRows}
        onSelectedRecordsChange={setSelectedRows}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        idAccessor="_id"
        onRowClick={({ record }) => {
          router.push(pathname + "?RubricId=" + record._id, {
            scroll: false,
          });
          openPanel();
        }}
        rowExpansion={{
          expanded: {
            recordIds: expandedRecordIds,
            // onRecordIdsChange: setExpandedRecordIds,
          },
          content: ({ record }) => (
            <pre>
              <Code>{JSON.stringify(record.criteria, null, 2)}</Code>
            </pre>
          ),
        }}
      />
    </Container>
  );
}
