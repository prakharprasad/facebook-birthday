import { Select, Stack, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { fetchPUT, successToast } from 'components/Utils';
import React from 'react';
import { handleErrors } from 'components/Utils';

const BlacklistFlags = { true: "True", false: "False" };

const handleBlacklistChange = (user, selected) => {
    selected = selected === "true";
    fetch(`/api/update_blacklist`, {
        ...fetchPUT,
        body: JSON.stringify(
            {
                uid: user.uid,
                is_blacklisted: selected,
            })
    })
        .then(handleErrors)
        .then(() => successToast("Saved"))
        .catch((e) => console.error(e));
}
const Trow = ({ children }) => {
    if (children.length > 0) {
        return (children.map((user) => {
            return (
                <Tr key={user.uid}>
                    <Td isNumeric>{user.uid}</Td>
                    <Td>{user.name}</Td>
                    <Td>{user.birthday}</Td>
                    <Td>
                        <Stack spacing={3}>
                            <Select onChange={(e) => handleBlacklistChange(user, e.target.value)} defaultValue={String(user.is_blacklisted)}>
                                <option value={String(user.is_blacklisted)}>{BlacklistFlags[user.is_blacklisted]}</option>
                                <option value={String(!user.is_blacklisted)}>{BlacklistFlags[!user.is_blacklisted]}</option>
                            </Select>
                        </Stack>
                    </Td>
                </Tr >
            )
        }))
    }
    return null;
}
export default function FacebookUsersTable({ children }) {
    let table = null
    if (children.length > 0)
        table = (
            <Table>
                <Thead>
                    <Tr>
                        <Th>UID</Th>
                        <Th>Name</Th>
                        <Th>Birthday</Th>
                        <Th>Blacklisted</Th>
                    </Tr>
                    <Trow>{children}</Trow>
                </Thead>
                <Tbody>

                </Tbody>
            </Table>
        )
    return table;
}
