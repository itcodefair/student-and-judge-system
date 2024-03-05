"use client";
import { useDisclosure } from "@mantine/hooks";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import moment from "moment";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { Container } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";

export interface User {
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
  //   const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Rubric>>({
  //     columnAccessor: "createdDate",
  //     direction: "desc",
  //   });
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
    if (id) {
      openPanel();
    }
  }, [id]);

  return (
    <Container fluid p="lg">
      {/* <CreateRubric opened={opened} onClose={close} url={url} />
      {id && <RubricDetail opened={panelOpened} onClose={closePanel} id={id} />} */}
      {/* <Group mb={"lg"} justify="space-between">
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
      </Group> */}
      <DataTable
        minHeight={150}
        withTableBorder
        highlightOnHover
        fetching={isLoading}
        columns={columns}
        records={data}
        selectedRecords={selectedRows}
        onSelectedRecordsChange={setSelectedRows}
        // sortStatus={sortStatus}
        // onSortStatusChange={setSortStatus}
        idAccessor="_id"
        onRowClick={({ record }) => {
          router.push(pathname + "?UserId=" + record._id, {
            scroll: false,
          });
          openPanel();
        }}
        // rowExpansion={{
        //   expanded: {
        //     recordIds: expandedRecordIds,
        //     // onRecordIdsChange: setExpandedRecordIds,
        //   },
        //   content: ({ record }) => (
        //     <pre>
        //       <Code>{JSON.stringify(record.criteria, null, 2)}</Code>
        //     </pre>
        //   ),
        // }}
      />
    </Container>
  );
}
