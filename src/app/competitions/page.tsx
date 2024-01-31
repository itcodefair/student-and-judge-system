'use client'
import { Table } from '@mantine/core';
import React, { useEffect, useState } from 'react'

export default function Competitions() {
    const [compItems, setCompItems] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/db/competition'); // Adjust the API route path
                const data = await response.json();

                if (response.ok) {
                    setCompItems(data);
                } else {
                    console.error('Error fetching data:', data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    console.log(compItems)

    const rows = compItems.map((item) => {

    })
    return (
        <Table>

        </Table>
    )
}
