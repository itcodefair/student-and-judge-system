"use client";
import {
  Container,
  TextInput,
  Select,
  Flex,
  Group,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconCopy,
  IconFileExport,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import sortBy from "lodash/sortBy";
import moment from "moment";

export interface Competitions {
  _id: string;
  title: string;
  type: string;
  registrationStartDate: string;
  registrationEndDate: string;
  judgeDate: string;
  status: string;
}

export default function Competitions() {
  // const dataGridKey = "competition-table";
  const [selectedRows, setSelectedRows] = useState<Competitions[]>([]);
  const [compItems, setCompItems] = useState<Competitions[]>([]);
  const [filteredData, setFilteredData] = useState<Competitions[]>([]);
  const [sortStatus, setSortStatus] = useState<
    DataTableSortStatus<Competitions>
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
      ...props,
    },
    {
      accessor: "registrationEndDate",
      label: "Registration end date",
      ...props,
    },
    {
      accessor: "createdDate",
      label: "Created date",
      ...props,
    },
    { accessor: "judgeDate", label: "Judge date", ...props },
    { accessor: "status", label: "Status", ...props },
  ];

  useEffect(() => {
    const filterData = () => {
      if (query.trim() === "") {
        return compItems;
      }
      // Filter data based on selectFilter and query
      return compItems.filter((item) => {
        if (!selectFilter) {
          // Convert each column value to lowercase for case-insensitive matching
          for (const key in item) {
            if (item.hasOwnProperty(key)) {
              const columnValue = item[key].toLowerCase();
              const queryValue = query.toLowerCase();
              if (columnValue.includes(queryValue)) {
                return true;
              }
            }
          }
          return false;
        } else {
          const columnValue = item[selectFilter].toLowerCase();
          const queryValue = query.toLowerCase();
          return columnValue.includes(queryValue);
        }
      });
    };
    const filteredData = filterData();
    setFilteredData(filteredData);
  }, [compItems, selectFilter, query]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/db/competition");
        const data = await response.json();

        if (response.ok) {
          setCompItems(data);
        } else {
          console.error("Error fetching data:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const sorted = sortBy(compItems, [
      (item) => {
        const value = item[sortStatus.columnAccessor];
        return typeof value === "string" ? value.toLowerCase() : value;
      },
    ]);
    setCompItems(sortStatus.direction === "desc" ? sorted.reverse() : sorted);
  }, [sortStatus]);

  async function copy(rows: any[]) {
    if (rows.length === 0) {
      console.error("Please select at least one row to clone.");
      return;
    }

    try {
      const body = rows.map(({ _id, ...row }) => ({
        ...row,
        createdDate: moment().format(),
      }));

      const response = await fetch("/api/db/competition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to clone rows.");
      }
    } catch (error) {
      console.error("Error cloning rows:", error);
    }
  }

  async function archived(rows: any[]) {
    if (rows.length === 0) {
      console.error("Please select at least one row to clone.");
      return;
    }

    try {
      // Extract the IDs of the selected rows
      const ids = rows.map((row) => row._id);

      // Send a POST request to the API endpoint
      const response = await fetch("/api/db/competition", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids, status: "archived" }),
      });

      if (!response.ok) {
        throw new Error("Failed to archive rows.");
      }

      console.log("Rows archived successfully.");
    } catch (error) {
      console.error("Error archiving rows:", error);
    }
  }

  return (
    <Container fluid p="lg">
      <Flex mb={"lg"} justify="space-between">
        <Group>
          <Select></Select>
          <Tooltip label="Create">
            <ActionIcon size={"lg"}>
              <IconPlus />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Copy">
            <ActionIcon
              disabled={selectedRows.length > 0 ? false : true}
              size={"lg"}
              onClick={() => copy(selectedRows)}
            >
              <IconCopy />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon
              disabled={selectedRows.length > 0 ? false : true}
              size={"lg"}
              color="red.7"
              onClick={() => archived(selectedRows)}
            >
              <IconTrash />
            </ActionIcon>
          </Tooltip>
        </Group>
        <Group>
          <Select
            clearable
            placeholder="Search all..."
            data={columns.map((column) => ({
              value: column.accessor,
              label: column.label,
            }))}
            value={selectFilter}
            onChange={(value) => setSelectFilter(value || "")}
          ></Select>
          <TextInput
            radius={"xl"}
            placeholder="search"
            leftSection={<IconSearch />}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Tooltip label="Export">
            <ActionIcon
              disabled={compItems.length > 0 ? false : true}
              size={"lg"}
            >
              <IconFileExport />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Flex>
      <DataTable
        minHeight={150}
        withTableBorder
        highlightOnHover
        // storeColumnsKey={dataGridKey}
        columns={columns}
        records={filteredData}
        selectedRecords={selectedRows}
        onSelectedRecordsChange={setSelectedRows}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        idAccessor="_id"
      />
    </Container>
  );
}
