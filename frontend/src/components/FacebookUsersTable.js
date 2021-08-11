import { Avatar, Center, Link, Select, Stack, Table, Tbody, Td, Th, Thead, Tr, Wrap, WrapItem } from '@chakra-ui/react';
import { fetchPUT, handleErrors, successToast } from 'components/Utils';
import React from 'react';

//This is a client-side token and safe to share with others
const facebookClientToken = "243995607358295|9640135797ff857097dd91a504a142f2";
const blacklistFlags = { true: "True", false: "False" };
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
                    <Td><Wrap>
                        <Center>
                            <WrapItem>
                                <Avatar name={user.name} src={`https://graph.facebook.com/v11.0/${user.uid}/picture?access_token=${facebookClientToken}`} mr={2} />
                            </WrapItem>
                            <WrapItem>
                                <Link href={`https://facebook.com/${user.uid}`} isExternal>{user.name}
                                </Link>
                            </WrapItem>
                        </Center>
                    </Wrap>
                    </Td>
                    <Td>{user.birthday}</Td>
                    <Td>
                        <Stack spacing={3}>
                            <Select onChange={(e) => handleBlacklistChange(user, e.target.value)} defaultValue={String(user.is_blacklisted)}>
                                <option value={String(user.is_blacklisted)}>{blacklistFlags[user.is_blacklisted]}</option>
                                <option value={String(!user.is_blacklisted)}>{blacklistFlags[!user.is_blacklisted]}</option>
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
