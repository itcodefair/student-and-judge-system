import { Modal } from '@mantine/core';
import React from 'react'
import { useSWRConfig } from 'swr';

interface UserCreateProps {
    opened: boolean;
    onClose: () => void;
    url: string;
}

export default function CreateUser(props: UserCreateProps) {
    const { opened, onClose, url } = props;
    const { mutate } = useSWRConfig();
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            centered
            size="lg"
            title="Create user"
        >

        </Modal>
    )
}
