import { Box, Button, Divider, Flex, Input, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast, VStack } from "@chakra-ui/react";
import { fetchPUT, handleErrors, infoToast, successToast } from "components/Utils";
import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaCog, FaDatabase, FaEdit, FaRunning, FaSearch, FaSyncAlt, FaTrash, FaUserShield } from "react-icons/fa";
import DarkModeToggle from "./components/DarkModeToggle";
import FacebookUsersTable from "./components/FacebookUsersTable";


function App() {

  const [facebookUsers, setFacebookUsers] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const toast = useToast()
  const { isOpen: isOpenTokenModal, onOpen: onOpenTokenModal, onClose: onCloseTokenModal } = useDisclosure()
  const { isOpen: isOpenResetDBModal, onOpen: onOpenResetDBModal, onClose: onCloseResetDBModal } = useDisclosure()


  const defaultMargin = 1;

  const getAccessToken = () => {
    fetch("/api/get_access_token")
      .then(handleErrors)
      .then(response => response.json())
      .then((access_token) => toast({
        title: "Access Token",
        description: access_token,
        status: "success",
        isClosable: true,
      }))
      .catch(error => console.log(error));
  }
  const getFacebookUsers = () => {
    fetch("/api/get_facebook_users")
      .then(handleErrors)
      .then(response => response.json())
      .then((users) => {
        setFacebookUsers(users)
      })
      .catch(error => console.log(error))
      .finally(() => !isLoaded ? setIsLoaded(true) : null);
  }
  const handleResetDBButton = () => {
    onCloseResetDBModal();
    fetch("/api/reset_database", fetchPUT)
      .then(handleErrors)
      .then(response => response.json())
      .then(() => {
        setFacebookUsers([]);
        successToast("Database Reset");
      })
      .catch(error => console.log(error));
  }

  const handleGenerateDBButton = () => {
    infoToast("Queued")
    fetch("/api/generate_database", fetchPUT)
      .then(handleErrors)
      .then(response => response.json())
      .then(() => {
        getFacebookUsers()
        successToast("Done")
      })
      .catch(error => console.log(error));
  }

  const handleAccessTokenSubmit = (e) => {
    e.preventDefault();
    fetch("/api/set_access_token", {
      ...fetchPUT,
      body: JSON.stringify(
        {
          access_token: accessToken,
        })
    })
      .then(handleErrors)
      .then(response => response.json())
      .then((data) => {
        successToast(`Access Token of ${data.name} has been saved.`);
      })
      .catch(error => console.log(error));
  }

  const handleRunnerExecute = ({ dryRun }) => {
    fetch("/api/runner/execute", {
      ...fetchPUT,
      body: JSON.stringify(
        {
          dry_run: dryRun,
        })
    })
      .then(handleErrors)
      .then(response => response.json())
      .then((data) => {
        successToast(data);
      })
      .catch(error => console.log(error));
  }
  useEffect(() => {
    getFacebookUsers();
  }, []) // eslint-disable-line react-hooks/exhaustive-deps


  if (isLoaded === true) {
    return (
      <Flex flexWrap="wrap" justifyContent="space-around">
        <Box borderWidth={5} borderRadius={10} boxShadow="dark-lg" m={8}>
          <Flex flexWrap="wrap" flexDirection="row" justifyContent="space-between" minWidth="40vw">
            {/* Run Menu */}
            <Menu>
              <MenuButton as={Button} rightIcon={<FaChevronDown />} margin={defaultMargin} leftIcon={<FaRunning />}>
                Runner
              </MenuButton>
              <MenuList>
                {/* <MenuItem icon={<FaClock />}>Fetch Last Run</MenuItem> */}
                <MenuItem icon={<FaCog />} onClick={() => handleRunnerExecute({ dryRun: true })}>Execute Dry Run</MenuItem>
                <MenuItem icon={<FaCog />} onClick={() => handleRunnerExecute({ dryRun: false })}>Execute Normal Run</MenuItem>
              </MenuList>
            </Menu>
            {/* Access Token Menu */}
            <Menu>
              <MenuButton as={Button} rightIcon={<FaChevronDown />} margin={defaultMargin} leftIcon={<FaUserShield />}>
                Access Token
              </MenuButton>
              <MenuList>
                <MenuItem icon={<FaSearch />} onClick={getAccessToken}>View</MenuItem>
                <MenuItem icon={<FaEdit />} onClick={onOpenTokenModal}>Change</MenuItem>
                <Modal isOpen={isOpenTokenModal} onClose={onCloseTokenModal} size="lg">
                  <ModalOverlay />
                  <ModalContent>
                    <ModalBody>
                      <ModalCloseButton size="sm" />
                      <form onSubmit={(e) => handleAccessTokenSubmit(e)}>
                        <VStack spacing={4} marginY="8">
                          <Input type="text" placeholder="Enter Access Token" width="md" isRequired onChange={(e) => setAccessToken(e.currentTarget.value)} />
                          <Button type="submit">Save</Button>
                        </VStack>
                      </form>
                    </ModalBody>
                  </ModalContent>
                </Modal>
              </MenuList>
            </Menu>
            {/* Database Menu */}
            <Menu>
              <MenuButton as={Button} rightIcon={<FaChevronDown />} margin={defaultMargin} leftIcon={<FaDatabase />}>
                Database
              </MenuButton>
              <MenuList>
                <MenuItem icon={<FaSyncAlt />} onClick={handleGenerateDBButton}>{facebookUsers.length > 0 ? "Sync DB" : "Generate DB"}</MenuItem>
                <MenuItem icon={<FaTrash />} onClick={onOpenResetDBModal} hidden={!(facebookUsers.length > 0)} >Reset</MenuItem>
                <Modal isOpen={isOpenResetDBModal} onClose={onCloseResetDBModal}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Confirm</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      Are you sure you want to reset the database?
                    </ModalBody>
                    <ModalFooter>
                      <Button colorScheme="outline" mr={3} onClick={onCloseResetDBModal}>
                        Close
                      </Button>
                      <Button variant="solid" colorScheme="red" onClick={handleResetDBButton}>Confirm</Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </MenuList>
            </Menu>
            <DarkModeToggle margin={defaultMargin} />
            <Divider />
          </Flex>
          <FacebookUsersTable>{facebookUsers}</FacebookUsersTable>
        </Box >
      </Flex >
    )
  }
  else {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh" color="green.500">
        <Spinner size="xl" thickness="5px"
        />
      </Flex>
    )
  }
}
export default App;