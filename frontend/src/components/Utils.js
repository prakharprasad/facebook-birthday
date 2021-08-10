import { createStandaloneToast } from '@chakra-ui/react';
const toast = createStandaloneToast();
export const fetchPUT = {
    method: "PUT",
    headers: { "Content-Type": "application/json" }
}
export async function handleErrors(response) {
    if (!response.ok) {
        const json = await response.json()
        let error = json.detail || response.statusText;
        if (typeof error === "object") {
            error = JSON.stringify(error);
        }
        errorToast(`HTTP ${response.status}: ${error}`);
        throw new Error();
    }
    return response;
}
export const errorToast = (message) => {
    toast({
        title: "Something went wrong. Please try again later.",
        description: message,
        status: "error",
        isClosable: true,
    })
}
export const successToast = (title, description = "") => {
    toast({
        title: title,
        description: description,
        status: "success",
        isClosable: true,
    })
}

export const infoToast = (title, description = "") => {
    toast({
        title: title,
        description: description,
        status: "info",
        isClosable: true,
    })
}
