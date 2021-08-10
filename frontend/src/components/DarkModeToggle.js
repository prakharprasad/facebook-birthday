import { IconButton, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

export default function DarkModeToggle(props) {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <IconButton
            margin={props.margin}
            aria-label="dark-mode-toggle"
            icon={colorMode === "light" ? <FaSun /> : <FaMoon />}
            isRound={true}
            size="md"
            onClick={toggleColorMode} />
    )
}
