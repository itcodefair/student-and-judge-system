"use client";
import { useDisclosure } from "@mantine/hooks";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import moment from "moment";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { Container, Group, SegmentedControl, Select, TextInput } from "@mantine/core";
import { IconCheck, IconSearch, IconX } from "@tabler/icons-react";
import ArchiveButton from "@/components/actionButton/ArchiveButton";
import CreateButton from "@/components/actionButton/CreateButton";
import { theme } from "@/styles/theme";
import ExportButton from "@/components/actionButton/ExportButton";
import filterRow from "@/lib/filterRow";
import sortRow from "@/lib/sortRow";
import CreateUser from "./components/CreateUser";

export interface User {
  _id: string;
  email: string;
  name: string;
  gender: string;
  course: string;
  credits: string;
  isVerified: boolean;
  createdDate: Date;
  updatedDate: Date;
  status: string;
}

export default function Users() {
  const router = useRouter();
  const pathname = usePathname();
  const id = useSearchParams().get("UserId");
  const url = "/api/db/user";
  const { data, error, isLoading, mutate } = useSWR(url);
  const [selectedRows, setSelectedRows] = useState<User[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [panelOpened, { open: openPanel, close: closePanel }] =
    useDisclosure(false);
  const [userType, setUserType] = useState("student")
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<User>>({
    columnAccessor: "createdDate",
    direction: "desc",
  });
  const props = {
    resizable: true,
    sortable: true,
  };

  const columns = [
    { accessor: "email", title: "Email", ...props },
    { accessor: "name", title: "Name", ...props },
    { accessor: "gender", title: "Gender", ...props },
    { accessor: "course", title: "Course", ...props },
    { accessor: "credits", title: "Credit", ...props },
    { accessor: "school", title: "School", ...props },
    {
      accessor: "isVerified",
      title: "Verified",
      render: ({ isVerified }) => {
        return isVerified ? <IconCheck color="green" /> : <IconX color="red" />;
      },
      ...props,
    },
    {
      accessor: "createdDate",
      title: "Created date",
      render: ({ createdDate }) => {
        return createdDate
          ? moment(createdDate).local().format("YYYY-MM-DD HH:mm:ss")
          : "";
      },
      ...props,
    },
    {
      accessor: "updatedDate",
      title: "Updated date",
      render: ({ updatedDate }) => {
        return updatedDate
          ? moment(updatedDate).local().format("YYYY-MM-DD HH:mm:ss")
          : "";
      },
      ...props,
    },
    { accessor: "status", title: "Status", ...props },
  ];

  useEffect(() => {
    if (data) {
      const filteredUserType = data.filter((item) => {
        return item["userType"].includes(userType);
      })
      const queryFilteredData = filterRow(filteredUserType, null, query, selectedFilter);
      setFilteredData(queryFilteredData);
    }
  }, [data, selectedFilter, query, userType]);

  useEffect(() => {
    if (filteredData.length > 0) {
      const sorted = sortRow(filteredData, sortStatus);
      setFilteredData(
        sortStatus.direction === "desc" ? sorted.reverse() : sorted
      );
    }
  }, [sortStatus]);

  useEffect(() => {
    setSortStatus({
      columnAccessor: "createdDate",
      direction: "desc",
    })
  }, [userType])

  useEffect(() => {
    if (id) {
      openPanel();
    }
  }, [id]);

  return (
    <Container fluid p="lg">
      <CreateUser opened={opened} onClose={close} url={url} />
      {/* {id && <RubricDetail opened={panelOpened} onClose={closePanel} id={id} />} */}
      <Group mb={"lg"} justify="space-between">
        <Group>
          <SegmentedControl color={theme.primaryColor} value={userType} onChange={setUserType} data={["student", "judge", "admin"]} />
          <CreateButton onClick={open} />
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
            fileName="user"
            fileType={"xlsx"}
          />
        </Group>
      </Group>
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
          router.push(pathname + "?UserId=" + record._id, {
            scroll: false,
          });
          openPanel();
        }}
      />
    </Container>
  );
}
