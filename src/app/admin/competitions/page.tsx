"use client";
import { Container, Table } from "@mantine/core";
import React, { useEffect, useState } from "react";

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
  const [compItems, setCompItems] = useState<Competitions[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/db/competition"); // Adjust the API route path
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
  console.log(compItems);
  const rows = compItems.map((item) => (
    <Table.Tr key={item._id}>
      <Table.Td>{item.title}</Table.Td>
      <Table.Td>{item.type}</Table.Td>
      <Table.Td>{item.registrationStartDate}</Table.Td>
      <Table.Td>{item.registrationEndDate}</Table.Td>
      <Table.Td>{item.judgeDate}</Table.Td>
      <Table.Td>{item.status}</Table.Td>
    </Table.Tr>
  ));
  console.log(rows);

  return (
    <Container p="lg">
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Title</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Registration Start Date</Table.Th>
            <Table.Th>Registration End Date</Table.Th>
            <Table.Th>Judge Date</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Container>
  );
}
