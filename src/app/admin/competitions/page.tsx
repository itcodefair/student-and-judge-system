"use client";
import {
  Container,
  TextInput,
  Select,
  Flex,
  Group,
  Modal,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import sortBy from "lodash/sortBy";
import addRow from "@/lib/addRow";
import cloneRow from "@/lib/cloneRow";
import archiveRow from "@/lib/archiveRow";
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

export interface Competition {
  _id: string;
  title: string;
  type: string;
  registrationStartDate: string;
  registrationEndDate: string;
  rubicId: string;
  createdDate: string;
  updatedDate: string;
  judgeDate: string;
  status: string;
}

export default function Competitions() {
  // const dataGridKey = "competition-table";
  const router = useRouter();
  const pathname = usePathname();
  const id = useSearchParams().get("ItemId");
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
  const [selectFilter, setSelectFilter] = useState("");
  const props = {
    resizable: true,
    sortable: true,
  };
  const columns = [
    { accessor: "title", label: "Title", ...props },
    { accessor: "type", label: "Type", ...props },
    {
      accessor: "registrationStartDate",
      label: "Registration start date",
      render: ({ registrationStartDate }) =>
        moment(registrationStartDate).format("YYYY-MM-DD"),
      ...props,
    },
    {
      accessor: "registrationEndDate",
      label: "Registration end date",
      render: ({ registrationEndDate }) =>
        moment(registrationEndDate).format("YYYY-MM-DD"),
      ...props,
    },
    {
      accessor: "judgeDate",
      label: "Judge date",
      render: ({ judgeDate }) => moment(judgeDate).format("YYYY-MM-DD"),
      ...props,
    },
    { accessor: "rubicId", label: "Rubic Id", ...props },
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
      render: ({ createdDate }) =>
        moment(createdDate).local().format("YYYY-MM-DD HH:mm:ss"),
      ...props,
    },
    { accessor: "status", label: "Status", ...props },
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

  useEffect(() => {
    if (id) {
      openPanel();
    }
  }, [id]);

  useEffect(() => {
    const filterData = (data: Competition[]) => {
      if (selectedYear) {
        const year = parseInt(selectedYear, 10);
        data = data.filter((item) => {
          return new Date(item.createdDate).getFullYear() === year;
        });
      }
      if (query.trim() === "") {
        return data;
      }
      return data.filter((item) => {
        if (!selectFilter) {
          for (const key in item) {
            if (key !== "_id" && item.hasOwnProperty(key)) {
              const columnValue = item[key];
              if (
                typeof columnValue === "string" &&
                columnValue.includes(query)
              ) {
                return true;
              }
            }
          }
          return false;
        } else {
          const columnValue = item[selectFilter];
          return typeof columnValue === "string" && columnValue.includes(query);
        }
      });
    };
    const filteredData = filterData(data);
    setFilteredData(filteredData);
  }, [data, selectFilter, selectedYear, query]);

  useEffect(() => {
    const sorted = sortBy(filteredData, [
      (item) => {
        const value = item[sortStatus.columnAccessor];
        return typeof value === "string" ? value.toLowerCase() : value;
      },
    ]);
    setFilteredData(
      sortStatus.direction === "desc" ? sorted.reverse() : sorted
    );
  }, [sortStatus]);

  return (
    <Container fluid p="lg">
      <CreateCompetition opened={opened} onClose={close} url={url} />
      {id && (
        <CompetitionDetail open={panelOpened} onClose={closePanel} id={id} />
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
            data={columns.map((column) => ({
              value: column.accessor,
              label: column.label,
            }))}
            value={selectFilter}
            onChange={(value) => {
              if (!value) {
                setQuery("");
              }
              setSelectFilter(value || "");
            }}
          ></Select>
          <TextInput
            radius={"xl"}
            placeholder="search"
            leftSection={<IconSearch />}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ExportButton data={filteredData} fileName="competition" />
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
          router.push(pathname + "?ItemId=" + record._id, {
            scroll: false,
          });
          openPanel();
        }}
      />
    </Container>
  );
}
