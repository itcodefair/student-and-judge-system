"use client";
import {
  Container,
  TextInput,
  Select,
  Flex,
  Group,
  Modal,
  Button,
  Text,
  UnstyledButton,
  Box,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import useSWR from "swr";
import ArchiveButton from "@/components/actionButton/ArchiveButton";
import CloneButton from "@/components/actionButton/CloneButton";
import CreateButton from "@/components/actionButton/CreateButton";
import { useDisclosure } from "@mantine/hooks";
import CreateCompetition from "./components/CreateCompetition";
import ExportButton from "@/components/actionButton/ExportButton";
import moment from "moment";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CompetitionDetail from "./components/CompetitionDetail";
import filterRow from "@/lib/filterRow";
import sortRow from "@/lib/sortRow";
import { theme } from "@/styles/theme";
import RubricDetail from "../rubrics/components/RubricDetail";

export interface Competition {
  _id: string;
  title: string;
  type: string;
  registrationStartDate: string;
  registrationEndDate: string;
  rubricId: string;
  createdDate: string;
  updatedDate: string;
  judgeDate: string;
  status: string;
}

export default function Competitions() {
  const router = useRouter();
  const pathname = usePathname();
  const id = useSearchParams().get("CompId");
  const rubricId = useSearchParams().get("RubricId");
  const url = "/api/db/competition";
  const { data, error, isLoading, mutate } = useSWR(url);
  const [selectedRows, setSelectedRows] = useState<Competition[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [opened, { open, close }] = useDisclosure(false);
  const [panelOpened, { open: openPanel, close: closePanel }] =
    useDisclosure(false);
  const [filteredData, setFilteredData] = useState<Competition[]>([]);
  const [sortStatus, setSortStatus] = useState<
    DataTableSortStatus<Competition>
  >({ columnAccessor: "createdDate", direction: "desc" });
  const [query, setQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const props = {
    resizable: true,
    sortable: true,
    filterable: true,
  };
  const columns = [
    { accessor: "title", title: "Title", ...props },
    { accessor: "type", title: "Type", ...props },
    {
      accessor: "registrationStartDate",
      title: "Registration start date",
      render: ({ registrationStartDate }) =>
        moment(registrationStartDate).local().format("YYYY-MM-DD"),
      ...props,
    },
    {
      accessor: "registrationEndDate",
      title: "Registration end date",
      render: ({ registrationEndDate }) =>
        moment(registrationEndDate).local().format("YYYY-MM-DD"),
      ...props,
    },
    {
      accessor: "judgeDate",
      title: "Judge date",
      render: ({ judgeDate }) => moment(judgeDate).local().format("YYYY-MM-DD"),
      ...props,
    },
    {
      accessor: "rubricId",
      title: "Rubric",
      render: ({ rubricId }) => {
        return (
          rubricId && (
            <UnstyledButton
              c={theme.primaryColor}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                router.push(pathname + "?RubricId=" + rubricId, {
                  scroll: false,
                });
              }}
            >
              view
            </UnstyledButton>
          )
        );
      },
      ...props,
      filterable: false,
    },
    {
      accessor: "createdDate",
      title: "Created date",
      render: ({ createdDate }) =>
        moment(createdDate).local().format("YYYY-MM-DD HH:mm:ss"),
      ...props,
    },
    {
      accessor: "updatedDate",
      title: "Updated date",
      render: ({ updatedDate }) =>
        moment(updatedDate).local().format("YYYY-MM-DD HH:mm:ss"),
      ...props,
    },
    { accessor: "status", title: "Status", ...props },
  ];

  useEffect(() => {
    if (!isLoading && data.length > 0) {
      const years = [
        ...new Set(
          data.map((item) =>
            new Date(item.createdDate).getFullYear().toString()
          )
        ),
      ] as string[];
      setSelectedYear(years[0]);
      setYears(years);
    }
  }, [data, isLoading]);

  function onClose() {
    router.replace(pathname);
    closePanel;
  }

  useEffect(() => {
    openPanel();
  }, [id, rubricId]);

  useEffect(() => {
    const filteredData = filterRow(data, selectedYear, query, selectedFilter);
    setFilteredData(filteredData);
  }, [data, selectedFilter, selectedYear, query]);

  useEffect(() => {
    const sorted = sortRow(filteredData, sortStatus);
    setFilteredData(
      sortStatus.direction === "desc" ? sorted.reverse() : sorted
    );
  }, [sortStatus]);

  return (
    <Container fluid p="lg">
      <CreateCompetition opened={opened} onClose={close} url={url} />
      {id && (
        <CompetitionDetail opened={panelOpened} onClose={onClose} id={id} />
      )}
      {rubricId && (
        <RubricDetail opened={panelOpened} onClose={onClose} id={rubricId} />
      )}
      <Flex mb={"lg"} justify="space-between">
        <Group>
          <Select
            clearable
            checkIconPosition="right"
            placeholder={selectedYear}
            value={selectedYear}
            data={years}
            onChange={(year) => setSelectedYear(year || "")}
          />
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
        <Group>
          <Select
            clearable
            checkIconPosition="right"
            placeholder="Search all..."
            data={columns
              .filter((column) => column.filterable !== false)
              .map((column) => ({
                value: column.accessor,
                label: column.title,
              }))}
            value={selectedFilter}
            onChange={(value) => {
              if (!value) {
                setQuery("");
              }
              setSelectedFilter(value || "");
            }}
          ></Select>
          <TextInput
            radius={"xl"}
            placeholder="search"
            leftSection={<IconSearch />}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ExportButton
            data={filteredData}
            fileName="competition"
            fileType={"xlsx"}
          />
        </Group>
      </Flex>
      <DataTable
        minHeight={150}
        withTableBorder
        highlightOnHover
        fetching={isLoading}
        columns={columns}
        records={filteredData}
        selectedRecords={selectedRows}
        onSelectedRecordsChange={setSelectedRows}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        idAccessor="_id"
        onRowClick={({ record }) => {
          router.push(pathname + "?CompId=" + record._id, {
            scroll: false,
          });
          openPanel();
        }}
      />
    </Container>
  );
}
